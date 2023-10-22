import { MessagePatterns, MicroServices } from '@app/common/constants';
import {
  TConversationLookupPayload,
  TConversationMessagePayload,
} from '@app/common/types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { lastValueFrom } from 'rxjs';

export interface IChatService {
  verifyConversation(userId: string, conversationId: string): Promise<boolean>;
  saveMessage(conversationId: string, message: string): Promise<void>;
}

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(MicroServices.CONVERSATION_CLIENT)
    private readonly conversationClient: ClientProxy,
  ) {}

  async verifyConversation(
    userId: string,
    conversationId: string,
  ): Promise<boolean> {
    try {
      return lastValueFrom(
        this.conversationClient.send<boolean, TConversationLookupPayload>(
          MessagePatterns.CONVERSATION_LOOKUP,
          {
            userId,
            conversationId,
          },
        ),
      );
    } catch (error) {
      throw new WsException(error);
    }
  }

  async saveMessage(conversationId: string, message: string): Promise<void> {
    try {
      await lastValueFrom(
        this.conversationClient.send<unknown, TConversationMessagePayload>(
          MessagePatterns.CONVERSATION_MESSAGE,
          {
            conversationId,
            message,
          },
        ),
      );
    } catch (error) {
      throw new WsException(error);
    }
  }
}
