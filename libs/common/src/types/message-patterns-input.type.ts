export type TConversationLookupPayload = {
  userId: string;
  conversationId: string;
};

export type TConversationMessagePayload = {
  conversationId: string;
  message: string;
};
