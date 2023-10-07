import { z } from 'zod';

export const ConversationMessageSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string(),
  user: z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().nullable().optional(),
  }),
});

export type ConversationMessageDto = z.infer<typeof ConversationMessageSchema>;
