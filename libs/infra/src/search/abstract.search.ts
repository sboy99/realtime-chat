import { estypes } from '@elastic/elasticsearch';
import { QueryDslMatchQuery } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { AbstractEntity } from '../database';
import { TElasticSearchEnv } from './env';

export abstract class AbstractSearch<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService<TElasticSearchEnv>,
  ) {}

  async searchIndex(
    match: Partial<
      Record<keyof T, string | number | boolean | QueryDslMatchQuery>
    >,
  ) {
    console.log(this.prepareRegex(match));

    return this.esService.search<T>({
      index: this.configService.getOrThrow<string>('ELASTIC_SEARCH_INDEX'),
      query: {
        regexp: this.prepareRegex(match),
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

  private prepareRegex(
    query: Partial<
      Record<keyof T, string | number | boolean | QueryDslMatchQuery>
    >,
  ): Record<string, estypes.QueryDslRegexpQuery> {
    return Object.keys(query).reduce<
      Record<string, estypes.QueryDslRegexpQuery>
    >((acc, curr) => {
      if (!!query?.[curr]) {
        const currRegx: estypes.QueryDslRegexpQuery = {
          value: `${query[curr]}`,
          flags: 'ALL',
          case_insensitive: true,
          max_determinized_states: 10000,
          rewrite: 'constant_score',
        };
        acc[curr] = currRegx;
      }
      return acc;
    }, {});
  }
}
