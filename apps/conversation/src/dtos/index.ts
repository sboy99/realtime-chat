import { z } from 'zod';

export const CreateConversationSchema = z.object({
  friendId: z.string().uuid(),
});

export type CreateConversationDto = z.infer<typeof CreateConversationSchema>;
