import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { LoggerModule } from '../logger';
import { TElasticSearchEnv } from './env';
import { SearchService } from './search.service';

@Module({
  imports: [
    LoggerModule,
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TElasticSearchEnv>) => ({
        node: configService.getOrThrow<string>('ELASTIC_SEARCH_NODE'),
        auth: {
          username: configService.getOrThrow<string>('ELASTIC_SEARCH_USER'),
          password: configService.getOrThrow<string>('ELASTIC_SEARCH_PASSWORD'),
        },
        maxRetries: 10,
        requestTimeout: 50000,
      }),
    }),
  ],
  providers: [SearchService],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
