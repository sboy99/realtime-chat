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

export const ConversationLookupSchema = z.object({
  userId: z.string().uuid(),
  conversationId: z.string().uuid(),
});

export const CreateConversationMessageSchema = z.object({
  creator: ChatUserSchema,
  conversationId: z.string().uuid(),
  message: z.string(),
});

// types //
export type ConversationMessageDto = z.infer<typeof ConversationMessageSchema>;

export type ConversationLookupDto = z.infer<typeof ConversationLookupSchema>;

export type CreateConversationMessageDto = z.infer<
  typeof CreateConversationMessageSchema
>;
