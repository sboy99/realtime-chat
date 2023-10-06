import {
  COOKIE_SECRET,
  HTTP_PORT,
  RABBITMQ_URI,
  REDIS_URI,
} from '@app/common/env';
import { DatabaseEnvSchema } from '@app/infra/database';
import { z } from 'zod';

export const ChatEnvSchema = DatabaseEnvSchema.extend({
  COOKIE_SECRET,
  HTTP_PORT,
  RABBITMQ_URI,
  REDIS_URI,
});

export type TChatEnv = z.infer<typeof ChatEnvSchema>;
