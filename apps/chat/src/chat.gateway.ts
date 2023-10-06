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
import { Server, Socket } from 'socket.io';
import { IAuthSocket } from './interfaces';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  handleConnection(client: IAuthSocket) {
    this.logger.log(`New connection : ${client?.user?.email}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    this.server.emit('message', { uid: client.id, message: message });
  }
}
