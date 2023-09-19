import {
  COOKIE_SECRET,
  HTTP_PORT,
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_SECRET,
  RABBITMQ_URI,
} from '@app/common/env';
import { DatabaseEnvSchema } from '@app/infra/database';
import { ElasticSearchEnvSchema } from '@app/infra/search';
import { z } from 'zod';

export const AuthEnvSchema = DatabaseEnvSchema.extend({
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY,
  COOKIE_SECRET,
  JWT_SECRET,
  HTTP_PORT,
  RABBITMQ_URI,
}).and(ElasticSearchEnvSchema);

export type TAuthEnv = z.infer<typeof AuthEnvSchema>;
