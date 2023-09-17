import { UserSchema } from '@app/common/dto';
import { z } from 'zod';

const ip = z.string();
const userAgent = z.string();
const userDevice = z.string();
const isBlocked = z.boolean().default(false);
const user = UserSchema;

export const CreateSessionSchema = z.object({
  ip,
  userAgent,
  userDevice,
  isBlocked,
  user,
});

export type CreateSessionDto = z.infer<typeof CreateSessionSchema>;
