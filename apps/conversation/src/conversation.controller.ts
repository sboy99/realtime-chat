import { Routes } from '@app/common/constants';
import { UseAuth, User } from '@app/common/decorators';
import { ZodValidationPipe } from '@app/common/pipes';
import { TUser } from '@app/common/types';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto, CreateConversationSchema } from './dtos';
import { CreateMessageDto, CreateMessageSchema } from './message/dtos';
import { MessageService } from './message/message.service';

@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @UseAuth()
  create(
    @User() user: TUser,
    @Body(new ZodValidationPipe(CreateConversationSchema))
    createConversationDto: CreateConversationDto,
  ) {
    return this.conversationService.create({
      user: user,
      friendId: createConversationDto.friendId,
    });
  }

  @Get()
  @UseAuth()
  findMyConversations(@User() user: TUser) {
    return this.conversationService.findUserConversations(user.id);
  }

  @Post('message')
  @UseAuth()
  sendMessage(
    @User() user: TUser,
    @Body(new ZodValidationPipe(CreateMessageSchema))
    createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.create(user.id, createMessageDto);
  }

  @Get(':conversationId/messages')
  @UseAuth()
  findMessages(
    @User() user: TUser,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.messageService.findConversationMessages(
      user.id,
      conversationId,
    );
  }
}
