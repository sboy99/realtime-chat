import { Conversation } from '@app/common/entities';
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
}
