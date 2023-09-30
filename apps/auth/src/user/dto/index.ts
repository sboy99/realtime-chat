import { z } from 'zod';

const firstName = z
  .string()
  .max(128)
  .transform((u) => u.toLowerCase());
const lastName = z
  .string()
  .max(128)
  .transform((u) => u.toLowerCase());
const avatar = z.string().url('Provide a valid url').optional();
const email = z
  .string()
  .email()
  .transform((u) => u.toLowerCase());
const password = z.string();

export const CreateUserSchema = z.object({
  firstName,
  lastName,
  avatar,
  email,
  password,
});

export const UpdateUserSchema = z.object({
  firstName: firstName.optional(),
  lastName: lastName.optional(),
  avatar: avatar.optional(),
  email: email.optional(),
  password: password.optional(),
});

export const SearchUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type SearchUserDto = z.infer<typeof SearchUserSchema>;
