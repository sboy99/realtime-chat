import { MessagePatterns, MicroServices } from '@app/common/constants';
import {
  ConversationLookupDto,
  CreateConversationMessageDto,
} from '@app/common/dtos';
import { TUser } from '@app/common/types';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { lastValueFrom } from 'rxjs';

export interface ISaveMessageParams {
  creator: TUser;
  conversationId: string;
  message: string;
}

export interface IChatService {
  verifyConversation(
    userId: string,
    conversationId: string,
  ): Promise<true | never>;
  saveMessage(params: ISaveMessageParams): void;
}

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(MicroServices.CONVERSATION_CLIENT)
    private readonly conversationClient: ClientProxy,
  ) {}
  /**
   * The function `verifyConversation` is an asynchronous function that takes in a `userId` and
   * `conversationId` as parameters and returns a promise that resolves to a boolean value indicating
   * whether the conversation is verified or not.
   * @param {string} userId - A string representing the ID of the user for whom the conversation needs
   * to be verified.
   * @param {string} conversationId - The `conversationId` parameter is a string that represents the
   * unique identifier of a conversation. It is used to identify a specific conversation in the system.
   * @returns The `verifyConversation` function returns a Promise that resolves to a boolean value.
   */
  async verifyConversation(
    userId: string,
    conversationId: string,
  ): Promise<true | never> {
    try {
      const isConversationExists = await lastValueFrom(
        this.conversationClient.send<boolean, ConversationLookupDto>(
          MessagePatterns.CONVERSATION_LOOKUP,
          {
            userId,
            conversationId,
          },
        ),
      );
      if (!isConversationExists) {
        throw new BadRequestException('Conversation does not exist');
      }
      return isConversationExists;
    } catch (error) {
      throw new WsException(error);
    }
  }
  /**
   * The function saves a message in a conversation by sending it to a conversation client.
   * @param {ISaveMessageParams}  - - conversationId: The ID of the conversation where the message will
   * be saved.
   */
  saveMessage({ conversationId, creator, message }: ISaveMessageParams): void {
    try {
      this.conversationClient.emit<unknown, CreateConversationMessageDto>(
        MessagePatterns.CREATE_CONVERSATION_MESSAGE,
        {
          creator,
          conversationId,
          message,
        },
      );
    } catch (error) {
      throw new WsException(error);
    }
  }
}
