import {
  ELASTIC_SEARCH_INDEX,
  ELASTIC_SEARCH_NODE,
  ELASTIC_SEARCH_PASSWORD,
  ELASTIC_SEARCH_USER,
} from '@app/common/env';

import { z } from 'zod';

export const ElasticSearchEnvSchema = z.object({
  ELASTIC_SEARCH_NODE,
  ELASTIC_SEARCH_INDEX,
  ELASTIC_SEARCH_USER,
  ELASTIC_SEARCH_PASSWORD,
});

export type TElasticSearchEnv = z.infer<typeof ElasticSearchEnvSchema>;
