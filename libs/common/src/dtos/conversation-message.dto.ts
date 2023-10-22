import { z } from 'zod';

export const ChatUserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
});

export const ConversationMessageSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string(),
  toUser: ChatUserSchema,
});

export type ConversationMessageDto = z.infer<typeof ConversationMessageSchema>;
