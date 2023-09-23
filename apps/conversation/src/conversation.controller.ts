import { Routes } from '@app/common/constants';
import { UseAuth, User } from '@app/common/decorators';
import { TUser } from '@app/common/types';
import { Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @UseAuth()
  create(@User() user: TUser) {
    console.log(user);
    return this.conversationService.create();
  }
}
