import { Message, User } from '@app/common/entities';
import { AbstractEntity } from '@app/infra/database';
import { Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
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

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
