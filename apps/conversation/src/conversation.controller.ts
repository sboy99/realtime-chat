import { Routes } from '@app/common/constants';
import { UseAuth, User } from '@app/common/decorators';
import { ZodValidationPipe } from '@app/common/pipes';
import { TUser } from '@app/common/types';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto, CreateConversationSchema } from './dtos';

@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

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
  findUserConversations(@User() user: TUser) {
    return this.conversationService.findUserConversations(user.id);
  }
}
