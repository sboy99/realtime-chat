import { User } from '@app/common/entities';
import { Logger } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { UserSearch } from './user.search';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  private readonly logger = new Logger(UserSubscriber.name);

  constructor(dataSource: DataSource, private readonly userSearch: UserSearch) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    const salt = await bcryptjs.genSalt(10);
    event.entity.password = await bcryptjs.hash(event.entity.password, salt);
  }

  async afterInsert(event: InsertEvent<User>): Promise<void> {
    const insertIndex = await this.userSearch.insertIndex({
      id: event.entity.id,
      email: event.entity.email,
      avatar: event.entity.avatar,
      firstName: event.entity.firstName,
      lastName: event.entity.lastName,
      createdAt: event.entity.createdAt,
    });

    this.logger.log(`Search Index updated of ${insertIndex._id}`);
  }

  async beforeRemove(event: RemoveEvent<User>): Promise<void> {
    const searchIndex = await this.userSearch.removeIndex(
      event.entity?.id as string,
    );
    this.logger.log(`Search Index removed ${searchIndex._id}`);
  }
}
