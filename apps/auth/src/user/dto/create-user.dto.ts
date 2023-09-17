import { z } from 'zod';

const email = z.string().email();
const password = z.string();

export const CreateUserSchema = z.object({
  email,
  password,
});

export type CreateUserDto = Required<z.infer<typeof CreateUserSchema>>;
