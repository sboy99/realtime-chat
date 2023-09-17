import { LoggerModule } from '@app/infra/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthEnvSchema } from './env';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: AuthEnvSchema,
      validate: (config) => AuthEnvSchema.parse(config),
    }),
    UserModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
