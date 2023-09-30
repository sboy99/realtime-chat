import { Message, User } from '@app/common/entities';
import { AbstractEntity } from '@app/infra/database';
import { Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('conversations')
@Index(['creator.id', 'recipient.id'], {
  unique: true,
})
export class Conversation extends AbstractEntity<Conversation> {
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
