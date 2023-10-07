import { MicroServices, Queues } from '@app/common/constants';
import { Conversation, Message } from '@app/common/entities';
import { DatabaseModule } from '@app/infra/database';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TChatEnv } from 'apps/chat/src/env';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [
    DatabaseModule.forFeature([Conversation, Message]),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: MicroServices.CHAT_CLIENT,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService<TChatEnv>) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
              queue: Queues.CHAT_QUEUE,
            },
          }),
        },
      ],
    }),
  ],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
