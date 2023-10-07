import { Routes } from '@app/common/constants';
import { UseAuth, User } from '@app/common/decorators';
import { ZodValidationPipe } from '@app/common/pipes';
import { TApiResponse, TUser } from '@app/common/types';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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

  @HttpCode(HttpStatus.OK)
  @Post()
  @UseAuth()
  async create(
    @User() user: TUser,
    @Body(new ZodValidationPipe(CreateConversationSchema))
    createConversationDto: CreateConversationDto,
  ): TApiResponse {
    await this.conversationService.create({
      user: user,
      friendId: createConversationDto.friendId,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Conversation created successfully',
    };
  }

  @Get()
  @UseAuth()
  async findMyConversations(@User() user: TUser): TApiResponse {
    const conversations = await this.conversationService.findUserConversations(
      user.id,
    );
    return {
      statusCode: HttpStatus.OK,
      data: conversations,
    };
  }

  @Post('message')
  @UseAuth()
  sendMessage(
    @User() user: TUser,
    @Body(new ZodValidationPipe(CreateMessageSchema))
    createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.create(user, createMessageDto);
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
