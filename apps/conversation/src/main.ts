import { AllExceptionsFilter } from '@app/common/filters';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { ConversationModule } from './conversation.module';
import { TConversationEnv } from './env';

async function bootstrap() {
  const app = await NestFactory.create(ConversationModule);
  // config
  const configService = app.get<ConfigService<TConversationEnv>>(ConfigService);

  // filters
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // logger
  app.useLogger(app.get(Logger));

  // cookie
  const cookieSecret = configService.get<string>('COOKIE_SECRET');
  app.use(cookieParser(cookieSecret));

  // port
  await app.listen(configService.getOrThrow<number>('HTTP_PORT'));
}
bootstrap();
