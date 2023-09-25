import { z } from 'zod';

export const CreateMessageSchema = z.object({
  message: z.string(),
  conversationId: z.string().uuid(),
});

export type CreateMessageDto = z.infer<typeof CreateMessageSchema>;
