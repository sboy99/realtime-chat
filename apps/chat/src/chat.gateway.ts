import { SocketEvents } from '@app/common/constants';
import {
  ConversationMessageDto,
  ConversationMessageSchema,
} from '@app/common/dtos';
import { TUser } from '@app/common/types';
import { Logger, UseFilters } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
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

  /**
   * The function `handleConnection` sets the user socket in the chat session manager if the socket has
   * a user ID.
   * @param {IAuthSocket} socket - The `socket` parameter is an object of type `IAuthSocket`.
   */
  handleConnection(socket: IAuthSocket) {
    if (!!socket?.user?.id) {
      this.chatSessionManager.setUserSocket(socket?.user?.id, socket);
    }
  }

  /**
   * The handleDisconnect function removes a user's socket from the chat session manager.
   * @param {IAuthSocket} socket - The `socket` parameter is of type `IAuthSocket`. It represents a
   * socket connection with a user and contains information about the user, such as their ID.
   */
  handleDisconnect(socket: IAuthSocket) {
    this.chatSessionManager.removeUserSocket(
      socket?.user?.id as string,
      socket,
    );
  }

  /**
   * This function handles incoming conversation messages, verifies the conversation, emits an event to
   * the recipient, and saves the message in the database.
   * @param {string} userId - The `userId` parameter is the ID of the user who sent the conversation
   * message. It is extracted from the socket connection.
   * @param {ConversationMessageDto} conversationMessageDto - The `conversationMessageDto` parameter is
   * an object that represents the conversation message data. It contains properties such as
   * `conversationId`, which is the ID of the conversation the message belongs to, and `toUser`, which
   * is the user the message is being sent to. The `message` property contains
   */
  @SubscribeMessage(SocketEvents.CONVERSATION_MESSAGE)
  async onConversationMessage(
    @SocketUser() user: TUser,
    @MessageBody(new SocketZodValidationPipe(ConversationMessageSchema))
    conversationMessageDto: ConversationMessageDto,
  ) {
    // const
    const conversationId = conversationMessageDto.conversationId;

    // verify conversation
    await this.chatService.verifyConversation(user.id, conversationId);

    // emit event
    const eventName = `${SocketEvents.CONVERSATION_MESSAGE}:${conversationId}`;
    const reciepientId = conversationMessageDto.toUser.id;
    const reciepientSocket =
      this.chatSessionManager.getUserSocket(reciepientId)[0];

    if (!!reciepientSocket)
      reciepientSocket.emit(eventName, conversationMessageDto);

    // call microservice to persist data
    this.chatService.saveMessage({
      conversationId,
      creator: user,
      message: conversationMessageDto.message,
    });
  }
}
