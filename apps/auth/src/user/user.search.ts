import { User } from '@app/common/entities';
import { AbstractSearch } from '@app/infra/search';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TAuthEnv } from '../env';

@Injectable()
export class UserSearch extends AbstractSearch<
  Omit<User, 'password' | 'sessions' | 'updatedAt'>
> {
  protected readonly logger = new Logger(UserSearch.name);
  constructor(
    esService: ElasticsearchService,
    configService: ConfigService<TAuthEnv>,
  ) {
    super(esService, configService);
  }
}
