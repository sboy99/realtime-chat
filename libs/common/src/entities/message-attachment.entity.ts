import { Conversation, Message } from '@app/common/entities';
import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('message_attachments')
export class MessageAttachment extends AbstractEntity<MessageAttachment> {
  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column()
  url: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Partial<Conversation>;
}
