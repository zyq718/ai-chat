/** API 客户端 */
import axios from "axios";
import type {
  Conversation,
  ConversationDetail,
  Message,
  Persona,
  ChatResponse,
} from "./types";

// 动态 API 基地址：优先用环境变量，其次用 localStorage 中设置的地址
function getApiBase(): string {
  if (typeof window !== "undefined") {
    // 浏览器端：优先用 localStorage 中保存的后端地址
    try {
      const raw = localStorage.getItem("api_base_url");
      if (raw) return raw.replace(/\/$+$/, "") + "/api";
    } catch {}
  }
  // 默认相对路径（同源部署或开发环境代理）
  return "/api";
}

const client = axios.create({
  baseURL: getApiBase(),
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

/** 系统相关 */
export const systemApi = {
  health: () => client.get("/health").then((r) => r.data),
  getPersonas: () =>
    client.get<{ code: number; data: Persona[] }>("/personas").then((r) => r.data.data),
  getInfo: () => client.get("/info").then((r) => r.data),
};

/** 对话相关 */
export const conversationApi = {
  list: (keyword?: string) =>
    client
      .get<{ code: number; data: Conversation[] }>("/conversations", {
        params: keyword ? { keyword } : undefined,
      })
      .then((r) => r.data.data),

  get: (id: string) =>
    client
      .get<{ code: number; data: ConversationDetail }>(`/conversations/${id}`)
      .then((r) => r.data.data),

  create: (data: { title?: string; persona?: string; model?: string }) =>
    client
      .post<{ code: number; data: Conversation }>("/conversations", data)
      .then((r) => r.data.data),

  update: (id: string, data: { title?: string; persona?: string }) =>
    client
      .patch<{ code: number; data: Conversation }>(`/conversations/${id}`, data)
      .then((r) => r.data.data),

  delete: (id: string) =>
    client.delete(`/conversations/${id}`).then((r) => r.data),
};

/** 消息相关 */
export const messageApi = {
  list: (conversationId: string) =>
    client
      .get<{ code: number; data: Message[] }>(`/messages/${conversationId}`)
      .then((r) => r.data.data),

  delete: (messageId: string) =>
    client.delete(`/messages/${messageId}`).then((r) => r.data),

  clear: (conversationId: string) =>
    client.post(`/messages/${conversationId}/clear`).then((r) => r.data),
};

/** 聊天 */
export const chatApi = {
  send: (data: {
    conversation_id?: string;
    message: string;
    persona?: string;
    temperature?: number;
    provider?: string;
    api_key?: string;
    base_url?: string;
    model?: string;
  }) =>
    client
      .post<ChatResponse>("/chat", data)
      .then((r) => r.data.data),
};
