import { z } from 'zod';

const id = z.string().uuid('Invalid id');
const createdAt = z.coerce.date();
const updatedAt = z.coerce.date();

export const AbstractSchema = z.object({
  id,
  createdAt,
  updatedAt,
});
