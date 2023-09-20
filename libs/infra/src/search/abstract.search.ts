import { estypes } from '@elastic/elasticsearch';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { AbstractEntity } from '../database';
import { TElasticSearchEnv } from './env';

export abstract class AbstractSearch<
  T extends Omit<AbstractEntity<T>, 'updatedAt'>,
> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService<TElasticSearchEnv>,
  ) {}

  async search({
    search,
    fields,
    limit = 5,
  }: {
    search: string;
    fields: Array<keyof T>;
    limit?: number;
  }) {
    return this.esService.search<T>({
      index: this.configService.getOrThrow<string>('ELASTIC_SEARCH_INDEX'),
      size: limit,
      query: {
        bool: {
          should: fields.map<estypes.QueryDslQueryContainer>((f) => ({
            wildcard: {
              [f]: {
                value: this.prepareSeachWildcard(search),
              },
            },
          })),
        },
      },
    });
  }

  async insertIndex(payload: T): Promise<estypes.IndexResponse> {
    return this.esService.index<T>({
      index: this.configService.getOrThrow<string>('ELASTIC_SEARCH_INDEX'),
      id: payload.id,
      document: payload,
    });
  }

  async removeIndex(id: T['id']) {
    return this.esService.delete({
      index: this.configService.getOrThrow<string>('ELASTIC_SEARCH_INDEX'),
      id,
    });
  }

  private prepareSeachWildcard(str: string) {
    let s = '*';
    for (const char of str) {
      s = `${s}${char}*`;
    }
    return s;
  }
}
