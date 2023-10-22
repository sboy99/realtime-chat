import { SocketEvents } from '@app/common/constants';
import {
  ConversationMessageDto,
  ConversationMessageSchema,
} from '@app/common/dtos';
import { pickKeys } from '@app/common/utils';
import { Logger, UseFilters } from '@nestjs/common';
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
import { ChatService } from './chat.service';
import { ChatSessionManager } from './chat.session';
import { SocketUser } from './decorators';
import { WsFilter } from './filters';
import { IAuthSocket } from './interfaces';
import { SocketZodValidationPipe } from './pipes';

@UseFilters(new WsFilter())
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatSessionManager: ChatSessionManager,
    private readonly chatService: ChatService,
  ) {}

  handleConnection(socket: IAuthSocket) {
    if (!!socket?.user?.id) {
      this.chatSessionManager.setUserSocket(socket?.user?.id, socket);

      socket.on('disconnect', () => {
        this.chatSessionManager.removeUserSocket(
          socket?.user?.id as string,
          socket,
        );
      });
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} disconnected`);
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
  @SubscribeMessage(SocketEvents.CONVERSATION_MESSAGE)
  async onConversationMessage(
    @SocketUser('id') userId: string,
    @MessageBody(new SocketZodValidationPipe(ConversationMessageSchema))
    conversationMessageDto: ConversationMessageDto,
  ) {
    // const
    const conversationId = conversationMessageDto.conversationId;

    // verify conversation
    await this.chatService.verifyConversation(userId, conversationId);

    // emit event
    const eventName = `${SocketEvents.CONVERSATION_MESSAGE}:${conversationId}`;
    const reciepientId = conversationMessageDto.toUser.id;
    const reciepientSocket =
      this.chatSessionManager.getUserSocket(reciepientId)[0];

    if (!!reciepientSocket)
      reciepientSocket.emit(eventName, conversationMessageDto);

    // call microservice to persist data
    await this.chatService.saveMessage(
      conversationId,
      conversationMessageDto.message,
    );
  }
}
