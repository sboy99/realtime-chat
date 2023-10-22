import { MicroServices, Queues } from '@app/common/constants';
import {
  Conversation,
  Message,
  MessageAttachment,
  Session,
  User,
} from '@app/common/entities';
import { DatabaseModule } from '@app/infra/database';
import { LoggerModule } from '@app/infra/logger';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ConversationHttpController,
  ConversationMsController,
} from './controllers';
import { ConversationRepository } from './conversation.repository';
import { ConversationService } from './conversation.service';
import { ConversationEnvSchema, TConversationEnv } from './env';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConversationEnvSchema,
      validate: (config) => ConversationEnvSchema.parse(config),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: MicroServices.AUTH_CLIENT,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService<TConversationEnv>) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
              queue: Queues.AUTH_QUEUE,
            },
          }),
        },
      ],
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      User,
      Session,
      Conversation,
      Message,
      MessageAttachment,
    ]),
    LoggerModule,
    MessageModule,
  ],
  controllers: [ConversationHttpController, ConversationMsController],
  providers: [ConversationService, ConversationRepository],
})
export class ConversationModule {}
