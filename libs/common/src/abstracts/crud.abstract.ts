import { AbstractEntity } from '@app/infra/database';

export abstract class AbstractCRUD<T extends AbstractEntity<T>> {
  abstract create(): Promise<T>;
  abstract list(): Promise<T[]>;
  abstract findOne(id: string): Promise<T>;
  abstract update(id: string): Promise<T>;
  abstract delete(id: string): Promise<T>;
}
