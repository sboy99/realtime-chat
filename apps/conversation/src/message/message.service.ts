import { Message } from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dtos';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  create(creator: string, createMessageDto: CreateMessageDto) {
    const _message = new Message({
      message: createMessageDto.message,
      creator: {
        id: creator,
      },
      conversation: {
        id: createMessageDto.conversationId,
      },
    });
    return this.messageRepository.create(_message);
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
