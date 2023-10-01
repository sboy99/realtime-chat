import { Conversation, MessageAttachment, User } from '@app/common/entities';
import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('messages')
export class Message extends AbstractEntity<Message> {
  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'creator_id' })
  creator: Partial<User>;

  @Column()
  message: string;

  @OneToMany(() => MessageAttachment, (attachment) => attachment.message, {
    onDelete: 'CASCADE',
  })
  attachments: MessageAttachment[];

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Partial<Conversation>;
}
