import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TElasticSearchEnv } from './env';

@Injectable()
export class SearchService implements OnModuleInit {
  private logger = new Logger(SearchService.name);

  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService<TElasticSearchEnv>,
  ) {}

  async onModuleInit() {
    await this.createIndex();
  }

  public async createIndex() {
    try {
      const index = this.configService.getOrThrow<string>(
        'ELASTIC_SEARCH_INDEX',
      );
      const isIndexExists = await this.esService.indices.exists({
        index,
      });
      if (!isIndexExists) {
        // create an index
        await this.esService.indices.create({
          index,
        });
      }

      this.logger.log(`Search index: ${index} has been created`);
    } catch (error) {
      console.log(error);
      this.logger.error('Error while creating index');
    }
  }
}
