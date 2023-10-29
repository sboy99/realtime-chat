import { Queues } from '@app/common/constants';
import { AllExceptionsFilter } from '@app/common/filters';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { TFriendEnv } from './env';
import { FriendModule } from './friend.module';

async function bootstrap() {
  const app = await NestFactory.create(FriendModule);
  // config
  const configService = app.get<ConfigService<TFriendEnv>>(ConfigService);

  // filters
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // logger
  app.useLogger(app.get(Logger));

  // cookie
  const cookieSecret = configService.get<string>('COOKIE_SECRET');
  app.use(cookieParser(cookieSecret));

  // connect to microservices
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      queue: Queues.FRIEND_QUEUE,
    },
  });
  await app.startAllMicroservices();

  // port
  await app.listen(configService.getOrThrow<number>('HTTP_PORT'));
}
bootstrap();
