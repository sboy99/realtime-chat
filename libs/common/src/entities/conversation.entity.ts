import { AbstractEntity } from '@app/infra/database';
import { Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('conversations')
export class Conversation extends AbstractEntity<Conversation> {
  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable()
  participants?: Array<string | User>;
}
