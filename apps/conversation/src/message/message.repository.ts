import { UserPropulateSelects } from '@app/common/constants';
import { Message } from '@app/common/entities';
import { mapSelects } from '@app/common/utils';
import { AbstractRepository } from '@app/infra/database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class MessageRepository extends AbstractRepository<Message> {
  protected readonly logger = new Logger(MessageRepository.name);

  constructor(
    @InjectRepository(Message)
    entityRepository: Repository<Message>,
    entityManager: EntityManager,
  ) {
    super(entityRepository, entityManager);
  }

  public async findConversationMessages(
    userId: string,
    conversationId: string,
  ) {
    return this.entityRepository
      .createQueryBuilder('messages')
      .leftJoin('messages.conversation', 'conversation')
      .leftJoin('conversation.creator', 'c')
      .leftJoin('conversation.recipient', 'r')
      .where(
        'conversation.id = :conversationId AND (c.id = :creatorId OR r.id = :recipientId)',
        { conversationId, creatorId: userId, recipientId: userId },
      )
      .leftJoin('messages.creator', 'creator')
      .addSelect(mapSelects('creator', UserPropulateSelects))
      .limit(10)
      .getMany();
  }
}
