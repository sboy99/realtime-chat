import { MessagePatterns, SocketEvents } from '@app/common/constants';
import {
  ConversationMessageDto,
  ConversationMessageSchema,
} from '@app/common/dtos';
import { ZodValidationPipe } from '@app/common/pipes';
import { pickKeys } from '@app/common/utils';
import { Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
      sockets
        .filter((s) => s.id !== client.id)
        .forEach((socket) => {
          if (socket.user.id !== client.user.id)
            socket.emit('message', {
              user: pickKeys(client.user, [
                'firstName',
                'lastName',
                'avatar',
                'id',
              ]),
              message,
            });
        });
    });
  }
  // todo: alter microservice call flow
  @MessagePattern(MessagePatterns.CONVERSATION_MESSAGE)
  onConversationMessage(
    @Payload(new ZodValidationPipe(ConversationMessageSchema))
    conversationMessageDto: ConversationMessageDto,
  ) {
    const eventName = `${SocketEvents.CONVERSATION_MESSAGE}:${conversationMessageDto.conversationId}`;
    console.log(eventName);

    this.server.emit(eventName, conversationMessageDto);
  }
}
