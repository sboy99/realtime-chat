import { Session } from '@app/common/entities';
import { AbstractRepository } from '@app/infra/database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SessionRepository extends AbstractRepository<Session> {
  protected readonly logger = new Logger(SessionRepository.name);

  constructor(
    @InjectRepository(Session)
    entityRepository: Repository<Session>,
    entityManager: EntityManager,
  ) {
    super(entityRepository, entityManager);
  }
}
