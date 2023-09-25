import { Conversation, User } from '@app/common/entities';
import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Message extends AbstractEntity<Message> {
  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: Partial<User>;

  @Column()
  message: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn()
  conversation: Partial<Conversation>;
}
