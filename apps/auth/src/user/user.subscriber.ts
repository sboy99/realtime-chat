import { Logger } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from '../../../../libs/common/src/entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  private readonly logger = new Logger(UserSubscriber.name);

  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    const salt = await bcryptjs.genSalt(10);
    event.entity.password = await bcryptjs.hash(event.entity.password, salt);
  }
}
