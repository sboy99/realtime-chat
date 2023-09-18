import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async upsert(
    partialEntity: QueryDeepPartialEntity<T>,
    conflictPathsOrOptions: UpsertOptions<T>,
  ) {
    return this.entityRepository.upsert(partialEntity, conflictPathsOrOptions);
  }

  async list(where: FindOptionsWhere<T>) {
    return this.entityRepository.findBy(where);
  }

  async checkUnique(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    entityfoundMessage = 'Entity already exists!',
  ): Promise<true> {
    const entity = await this.entityRepository.findOne({
      where,
      relations,
    });
    if (!!entity) {
      this.logger.warn('Document confict with where', where);
      throw new ConflictException(entityfoundMessage);
    }
    return true;
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    notfoundMessage = 'Entity not found.',
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, relations });

    if (!entity) {
      this.logger.warn('Document not found with where', where);
      throw new NotFoundException(notfoundMessage);
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.entityRepository.delete(where);
  }
}
