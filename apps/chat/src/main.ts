import { AllExceptionsFilter } from '@app/common/filters';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { RedisIoAdapter } from './adapters/redis-io';
import { ChatModule } from './chat.module';
import { TChatEnv } from './env';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  // config
  const configService = app.get<ConfigService<TChatEnv>>(ConfigService);

  // filters
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // logger
  app.useLogger(app.get(Logger));

  // adapter
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // port
  await app.listen(configService.getOrThrow<number>('HTTP_PORT'));
  console.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
