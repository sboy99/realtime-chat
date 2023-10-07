import { MessagePatterns, MicroServices } from '@app/common/constants';
import { ConversationMessageDto } from '@app/common/dtos';
import { Message } from '@app/common/entities';
import { TUser } from '@app/common/types';
import { pickKeys } from '@app/common/utils';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from './dtos';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    @Inject(MicroServices.CHAT_CLIENT) private readonly chatClient: ClientProxy,
  ) {}

  async create(creator: TUser, createMessageDto: CreateMessageDto) {
    const _message = new Message({
      message: createMessageDto.message,
      creator: {
        id: creator.id,
      },
      conversation: {
        id: createMessageDto.conversationId,
      },
    });

    const message = await this.messageRepository.create(_message);
    this.chatClient.emit<any, ConversationMessageDto>(
      MessagePatterns.CONVERSATION_MESSAGE,
      {
        ...createMessageDto,
        user: pickKeys(creator, ['id', 'firstName', 'lastName', 'avatar']),
      },
    );

    return message;
  }

  async findConversationMessages(userId: string, conversationId: string) {
    return this.messageRepository.findConversationMessages(
      userId,
      conversationId,
    );
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: any) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
