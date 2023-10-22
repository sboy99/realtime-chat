import { MessagePatterns } from '@app/common/constants';
import {
  TConversationLookupPayload,
  TConversationMessagePayload,
} from '@app/common/types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConversationService } from '../conversation.service';
import { MessageService } from '../message/message.service';

@Controller()
export class ConversationMsController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  @MessagePattern(MessagePatterns.CONVERSATION_LOOKUP)
  async lookupConversation(@Payload() message: TConversationLookupPayload) {
    console.log(message);
    return true;
  }

  @MessagePattern(MessagePatterns.CONVERSATION_MESSAGE)
  async saveMessage(@Payload() message: TConversationMessagePayload) {
    console.log(message);
    return true;
  }
}
