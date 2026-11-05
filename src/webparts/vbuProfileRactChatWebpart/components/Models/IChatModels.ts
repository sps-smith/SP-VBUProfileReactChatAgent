// ─── Chat data models ─────────────────────────────────────────────────────────

export interface IMessage {
  id:        string;
  role:      'user' | 'assistant';
  content:   string;
  createdAt: string;
}

export interface IConversation {
  id:        string;
  threadId:  string;
  title:     string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── API request models ───────────────────────────────────────────────────────

export interface IStartChatRequest {
  userId:  string;
  message: string;
}

export interface IContinueChatRequest {
  conversationId: string;
  message:        string;
}

// ─── API response models ──────────────────────────────────────────────────────

export interface IStartChatResponse {
  conversationId: string;
  response:       string;
}

export interface IContinueChatResponse {
  response: string;
}
