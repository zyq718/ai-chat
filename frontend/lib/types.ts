/** 公共类型定义 */

export interface Conversation {
  id: string;
  title: string;
  persona: string;
  model: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface Persona {
  key: string;
  name: string;
  description?: string;
}

export interface ChatResponse {
  code: number;
  data: {
    conversation: Conversation;
    user_message: Message;
    assistant_message: Message;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}
