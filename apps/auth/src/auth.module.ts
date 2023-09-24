import { MicroServices, Queues } from '@app/common/constants';
import { DatabaseModule } from '@app/infra/database';
import { LoggerModule } from '@app/infra/logger';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthEnvSchema, TAuthEnv } from './env';
import { SessionModule } from './session/session.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: AuthEnvSchema,
      validate: (config) => AuthEnvSchema.parse(config),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: MicroServices.AUTH_CLIENT,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService<TAuthEnv>) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
              queue: Queues.AUTH_QUEUE,
            },
          }),
        },
      ],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ClientsModule],
      inject: [ConfigService<TAuthEnv>],
      useFactory: async (configService: ConfigService<TAuthEnv>) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    DatabaseModule,
    UserModule,
    LoggerModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
