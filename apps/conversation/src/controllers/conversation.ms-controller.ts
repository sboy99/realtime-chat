import { MessagePatterns } from '@app/common/constants';
import {
  ConversationLookupDto,
  ConversationLookupSchema,
  CreateConversationMessageDto,
  CreateConversationMessageSchema,
} from '@app/common/dtos';
import { ZodValidationPipe } from '@app/common/pipes';
import { TUser } from '@app/common/types';
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
  async lookupConversation(
    @Payload(new ZodValidationPipe(ConversationLookupSchema))
    conversationLookupDto: ConversationLookupDto,
  ) {
    const isConversationExists =
      await this.conversationService.lookupConversation(conversationLookupDto);

    return isConversationExists;
  }

  @MessagePattern(MessagePatterns.CREATE_CONVERSATION_MESSAGE)
  async saveMessage(
    @Payload(new ZodValidationPipe(CreateConversationMessageSchema))
    { creator, conversationId, message }: CreateConversationMessageDto,
  ) {
    await this.messageService.create(creator as TUser, {
      conversationId,
      message,
    });
  }
}
