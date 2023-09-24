import { UserPropulateSelects } from '@app/common/constants';
import { Conversation } from '@app/common/entities';
import { mapSelects } from '@app/common/utils';
import { AbstractRepository } from '@app/infra/database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ConversationRepository extends AbstractRepository<Conversation> {
  protected readonly logger = new Logger(ConversationRepository.name);

  constructor(
    @InjectRepository(Conversation)
    entityRepository: Repository<Conversation>,
    entityManager: EntityManager,
  ) {
    super(entityRepository, entityManager);
  }

  findUserConversations(userId: string) {
    return this.entityRepository
      .createQueryBuilder('conversations')
      .leftJoin('conversations.creator', 'c')
      .addSelect(mapSelects('c', UserPropulateSelects))
      .leftJoin('conversations.recipient', 'r')
      .addSelect(mapSelects('r', UserPropulateSelects))
      .where(
        'conversations.creator = :creatorId OR conversations.recipient = :recipientId',
        { creatorId: userId, recipientId: userId },
      )
      .take(30)
      .getMany();
  }

  conversationExists(userId: string, friendId: string) {
    return this.entityRepository.exist({
      where: {
        creator: {
          id: userId,
        },
        recipient: {
          id: friendId,
        },
      },
    });
  }
}
