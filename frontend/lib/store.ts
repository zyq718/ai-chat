/** 全局状态管理 */
import { create } from "zustand";
import type { Conversation, Message, Persona } from "./types";
import {
  conversationApi,
  messageApi,
  chatApi,
  systemApi,
} from "./api";

interface ChatState {
  // 对话列表
  conversations: Conversation[];
  // 当前对话
  currentConversation: Conversation | null;
  // 当前对话的消息列表
  messages: Message[];
  // 可用 persona 列表
  personas: Persona[];
  // 当前选择的 persona
  currentPersona: string;
  // 加载状态
  loadingConversations: boolean;
  loadingMessages: boolean;
  sending: boolean;

  // Actions
  loadPersonas: () => Promise<void>;
  loadConversations: (keyword?: string) => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  createConversation: () => Promise<string | null>;
  deleteConversation: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => Promise<void>;
  setPersona: (p: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  personas: [],
  currentPersona: "assistant",
  loadingConversations: false,
  loadingMessages: false,
  sending: false,

  loadPersonas: async () => {
    try {
      const data = await systemApi.getPersonas();
      set({ personas: data });
    } catch (err) {
      console.error("加载 personas 失败:", err);
    }
  },

  loadConversations: async (keyword?: string) => {
    set({ loadingConversations: true });
    try {
      const data = await conversationApi.list(keyword);
      set({ conversations: data, loadingConversations: false });
    } catch (err) {
      console.error("加载对话列表失败:", err);
      set({ loadingConversations: false });
    }
  },

  selectConversation: async (id: string) => {
    set({ loadingMessages: true });
    try {
      const detail = await conversationApi.get(id);
      set({
        currentConversation: detail,
        messages: detail.messages || [],
        loadingMessages: false,
        currentPersona: detail.persona,
      });
    } catch (err) {
      console.error("加载对话失败:", err);
      set({ loadingMessages: false });
    }
  },

  createConversation: async () => {
    const { currentPersona } = get();
    try {
      const conv = await conversationApi.create({
        title: "新对话",
        persona: currentPersona,
      });
      set((state) => ({
        conversations: [conv, ...state.conversations],
        currentConversation: conv,
        messages: [],
      }));
      return conv.id;
    } catch (err) {
      console.error("创建对话失败:", err);
      return null;
    }
  },

  deleteConversation: async (id: string) => {
    try {
      await conversationApi.delete(id);
      set((state) => {
        const remaining = state.conversations.filter((c) => c.id !== id);
        const isCurrent = state.currentConversation?.id === id;
        return {
          conversations: remaining,
          currentConversation: isCurrent ? null : state.currentConversation,
          messages: isCurrent ? [] : state.messages,
        };
      });
    } catch (err) {
      console.error("删除对话失败:", err);
    }
  },

  sendMessage: async (content: string) => {
    const {
      currentConversation,
      currentPersona,
    } = get();

    // 读取本地设置（从 SettingsModal 保存的）
    let aiSettings: any = {};
    try {
      const raw = localStorage.getItem("ai_settings");
      if (raw) aiSettings = JSON.parse(raw);
    } catch {}

    let convId = currentConversation?.id;
    let tempConv: Conversation | null = null;

    // 如果没有当前对话，先创建一个
    if (!convId) {
      try {
        tempConv = await conversationApi.create({
          title: content.slice(0, 30) || "新对话",
          persona: currentPersona,
        });
        convId = tempConv.id;
        set((state) => ({
          conversations: [tempConv!, ...state.conversations],
          currentConversation: tempConv,
        }));
      } catch (err) {
        console.error("创建对话失败:", err);
        return;
      }
    }

    // 乐观更新：先显示用户消息
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: convId!,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    const tempAssistantMsg: Message = {
      id: `temp-ai-${Date.now()}`,
      conversation_id: convId!,
      role: "assistant",
      content: "",
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, tempUserMsg, tempAssistantMsg],
      sending: true,
    }));

    try {
      const result = await chatApi.send({
        conversation_id: convId,
        message: content,
        persona: currentPersona,
        provider: aiSettings.provider,
        api_key: aiSettings.api_key,
        base_url: aiSettings.base_url,
        model: aiSettings.model,
      });

      // 替换临时消息
      set((state) => {
        const realMessages = state.messages.filter(
          (m) => m.id !== tempUserMsg.id && m.id !== tempAssistantMsg.id
        );
        return {
          messages: [
            ...realMessages,
            result.user_message,
            result.assistant_message,
          ],
          sending: false,
          currentConversation: result.conversation,
          conversations: state.conversations.map((c) =>
            c.id === result.conversation.id ? result.conversation : c
          ),
        };
      });
    } catch (err) {
      console.error("发送消息失败:", err);
      // 移除临时 AI 消息，保留用户消息
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== tempAssistantMsg.id),
        sending: false,
      }));
    }
  },

  clearMessages: async () => {
    const { currentConversation } = get();
    if (!currentConversation) return;
    try {
      await messageApi.clear(currentConversation.id);
      set({ messages: [] });
    } catch (err) {
      console.error("清空消息失败:", err);
    }
  },

  setPersona: (p: string) => set({ currentPersona: p }),
}));
