import { pickKeys } from '@app/common/utils';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { from, map } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ChatSessionManager } from './chat.session';
import { IAuthSocket } from './interfaces';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatSessionManager: ChatSessionManager) {}

  handleConnection(client: IAuthSocket) {
    this.logger.log(`New connection : ${client?.user?.email}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: IAuthSocket,
    @MessageBody() message: string,
  ) {
    this.chatSessionManager.getSockets().forEach((sockets) => {
      const socket = sockets[0];
      if (socket.user.id !== client.user.id)
        sockets
          .filter((s) => s.id !== client.id)
          .forEach((socket) =>
            socket.emit('message', {
              user: pickKeys(client.user, [
                'firstName',
                'lastName',
                'avatar',
                'id',
              ]),
              message,
            }),
          );
    });
  }

  @SubscribeMessage('count')
  handleCount() {
    return from([1, 2, 3, 4, 5]).pipe(
      map((count) => {
        this.server.emit('count', {
          event: 'count',
          data: count,
        });
      }),
    );
  }
}
