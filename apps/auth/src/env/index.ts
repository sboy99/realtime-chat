import { DatabaseEnvSchema } from '@app/infra/database';
import { z } from 'zod';

export const AuthEnvSchema = DatabaseEnvSchema.extend({});

export type TAuthEnv = z.infer<typeof AuthEnvSchema>;
