import { Conversation, Message } from '@app/common/entities';
import { DatabaseModule } from '@app/infra/database';
import { Module } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [DatabaseModule.forFeature([Conversation, Message])],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
