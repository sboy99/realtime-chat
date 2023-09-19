import {
  NODE_ENV,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from '@app/common/env';

import { z } from 'zod';

export const DatabaseEnvSchema = z.object({
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
});

export type TDatabaseEnv = z.infer<typeof DatabaseEnvSchema>;
