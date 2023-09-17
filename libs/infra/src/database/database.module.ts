import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { TDatabaseEnvSchema } from './env';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService<TDatabaseEnvSchema>],
      useFactory: (configService: ConfigService<TDatabaseEnvSchema>) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        database: configService.getOrThrow<string>('POSTGRES_DB'),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        synchronize:
          configService.getOrThrow<string>('NODE_ENV') === 'development'
            ? true
            : false,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {
  static forFeature(entities?: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
