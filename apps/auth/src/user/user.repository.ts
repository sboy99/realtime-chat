import { AbstractRepository } from '@app/infra/database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    itemsRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(itemsRepository, entityManager);
  }
}
