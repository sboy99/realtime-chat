import { COOKIE_SECRET, HTTP_PORT, RABBITMQ_URI } from '@app/common/env';
import { DatabaseEnvSchema } from '@app/infra/database';
import { z } from 'zod';

export const FriendEnvSchema = DatabaseEnvSchema.extend({
  COOKIE_SECRET,
  HTTP_PORT,
  RABBITMQ_URI,
});

export type TFriendEnv = z.infer<typeof FriendEnvSchema>;
