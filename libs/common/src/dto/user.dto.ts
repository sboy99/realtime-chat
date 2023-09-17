import { AbstractSchema } from '@app/common/dto';
import { z } from 'zod';

const firstName = z.string();
const lastName = z.string();
const avatar = z.string().url().nullable();
const email = z.string().email();
const password = z.string();

export const UserSchema = AbstractSchema.extend({
  firstName,
  lastName,
  avatar,
  email,
  password,
});

export type UserDto = z.infer<typeof UserSchema>;
