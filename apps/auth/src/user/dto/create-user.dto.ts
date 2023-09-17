import { z } from 'zod';

const firstName = z.string().max(128);
const lastName = z.string().max(128);
const avatar = z.string().url('Provide a valid url').optional();
const email = z.string().email();
const password = z.string();

export const CreateUserSchema = z.object({
  firstName,
  lastName,
  avatar,
  email,
  password,
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
