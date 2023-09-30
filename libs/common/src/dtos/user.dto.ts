import { AbstractSchema } from '@app/common/dtos';
import { z } from 'zod';

const firstName = z.string().transform((u) => u.toLowerCase());
const lastName = z.string().transform((u) => u.toLowerCase());
const avatar = z.string().url().nullable().default(null).optional();
const email = z
  .string()
  .email()
  .transform((u) => u.toLowerCase());
const password = z.string();

export const UserSchema = AbstractSchema.extend({
  firstName,
  lastName,
  avatar,
  email,
  password,
});

export type UserDto = z.infer<typeof UserSchema>;
