import { User } from '@app/common/entities';
import { AbstractRepository } from '@app/infra/database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    entityRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(entityRepository, entityManager);
  }
}
