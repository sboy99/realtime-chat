import { z } from 'zod';

const email = z.string().email();
const password = z.string();

export const LoginSchema = z.object({
  email,
  password,
});

export type LoginDto = z.infer<typeof LoginSchema>;
