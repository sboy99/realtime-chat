import { MicroServices, Queues } from '@app/common/constants';
import { DatabaseModule } from '@app/infra/database';
import { LoggerModule } from '@app/infra/logger';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatSessionManager } from './chat.session';
import { ChatEnvSchema, TChatEnv } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ChatEnvSchema,
      validate: (config) => ChatEnvSchema.parse(config),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: MicroServices.AUTH_CLIENT,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService<TChatEnv>) => ({
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
    LoggerModule,
  ],
  providers: [ChatGateway, ChatSessionManager, ChatService],
})
export class ChatModule {}
