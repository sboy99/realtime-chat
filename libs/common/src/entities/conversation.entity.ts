import { AbstractEntity } from '@app/infra/database';
import { Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('conversations')
@Index(['creator.id', 'recipient.id'], {
  unique: true,
})
export class Conversation extends AbstractEntity<Conversation> {
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: User;
}
