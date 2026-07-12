"use client";

import { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Avatar,
  Space,
  Empty,
  Spin,
  Tooltip,
  Typography,
  Tag,
  Dropdown,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  SendOutlined,
  PaperClipOutlined,
  AudioOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  ShareAltOutlined,
  CrownOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  UserOutlined,
  FileTextOutlined,
  BulbOutlined,
  FileOutlined,
  MessageOutlined,
  AppstoreOutlined,
  DownOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  MoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useChatStore } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";
import type { Persona } from "@/lib/types";
import SettingsModal from "@/app/components/SettingsModal";

const { Text } = Typography;
const { TextArea } = Input;

// 三栏宽度
const LEFT_SIDER_WIDTH = 240;
const RIGHT_SIDER_WIDTH = 320;

export default function ChatPage() {
  // Hooks 全部在顶层
  const {
    conversations,
    currentConversation,
    messages,
    personas,
    currentPersona,
    loadingConversations,
    loadingMessages,
    sending,
    loadPersonas,
    loadConversations,
    selectConversation,
    createConversation,
    deleteConversation,
    sendMessage,
    setPersona,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeMainTab, setActiveMainTab] = useState("chat");
  const [activeRightTab, setActiveRightTab] = useState("info");
  const [aiProvider, setAiProvider] = useState<string>("mock");
  const [aiModel, setAiModel] = useState<string>("mock");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPersonas();
    loadConversations();
    // 读取当前 provider
    try {
      const raw = localStorage.getItem("ai_settings");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.provider) setAiProvider(s.provider);
        if (s.model) setAiModel(s.model);
      }
    } catch {}
  }, [loadPersonas, loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    createConversation();
    setActiveMainTab("chat");
  };

  const currentPersonaObj = personas.find((p) => p.key === currentPersona);

  // 过滤后的对话
  const filteredConversations = searchKeyword
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : conversations;

  // 消息统计
  const stats = {
    userMsgs: messages.filter((m) => m.role === "user").length,
    aiMsgs: messages.filter((m) => m.role === "assistant").length,
    total: messages.length,
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        background: "#ffffff",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ============ 左侧栏 ============ */}
      {!leftCollapsed && (
        <div
          style={{
            width: LEFT_SIDER_WIDTH,
            borderRight: "1px solid #ececec",
            display: "flex",
            flexDirection: "column",
            background: "#fafafa",
            flexShrink: 0,
          }}
        >
          {/* 搜索 */}
          <div style={{ padding: "12px 12px 8px" }}>
            <Input
              prefix={<SearchOutlined style={{ color: "#999" }} />}
              placeholder="搜索"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              bordered={false}
              style={{
                background: "#f0f0f0",
                borderRadius: 8,
                height: 32,
                fontSize: 13,
              }}
              allowClear
            />
          </div>

          {/* 新建 Agent 按钮 */}
          <div style={{ padding: "4px 12px 8px" }}>
            <Button
              type="default"
              icon={<PlusOutlined />}
              block
              onClick={handleNewChat}
              style={{
                height: 36,
                borderRadius: 8,
                background: "#fff",
                border: "1px solid #e0e0e0",
                fontSize: 13,
                color: "#333",
              }}
            >
              新建 Agent
            </Button>
          </div>

          {/* Agent 列表 - 既是 personas 也是对话历史 */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: "0 6px 12px",
            }}
          >
            {/* Personas 区域 */}
            <div
              style={{
                padding: "8px 8px 4px",
                fontSize: 11,
                color: "#999",
                fontWeight: 500,
              }}
            >
              AI 角色
            </div>
            {personas.map((p: Persona) => (
              <div
                key={p.key}
                onClick={() => {
                  setPersona(p.key);
                }}
                style={{
                  padding: "8px 10px",
                  marginBottom: 2,
                  borderRadius: 8,
                  cursor: "pointer",
                  background: currentPersona === p.key ? "#e6f4ff" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: currentPersona === p.key ? "#1677ff" : "#333",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (currentPersona !== p.key)
                    e.currentTarget.style.background = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  if (currentPersona !== p.key)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <Avatar
                  size={28}
                  icon={<RobotOutlined />}
                  style={{
                    background: currentPersona === p.key ? "#1677ff" : "#52c41a",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </div>
                </div>
              </div>
            ))}

            {/* 对话历史区域 */}
            <div
              style={{
                padding: "12px 8px 4px",
                fontSize: 11,
                color: "#999",
                fontWeight: 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>对话历史 ({conversations.length})</span>
            </div>
            <Spin spinning={loadingConversations}>
              {filteredConversations.length === 0 && (
                <div
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    color: "#bbb",
                    fontSize: 12,
                  }}
                >
                  暂无对话
                </div>
              )}
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    selectConversation(conv.id);
                    setActiveMainTab("chat");
                  }}
                  style={{
                    padding: "7px 10px",
                    marginBottom: 1,
                    borderRadius: 8,
                    cursor: "pointer",
                    background:
                      currentConversation?.id === conv.id
                        ? "#e6f4ff"
                        : "transparent",
                    fontSize: 13,
                    color:
                      currentConversation?.id === conv.id ? "#1677ff" : "#333",
                    transition: "background 0.15s",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (currentConversation?.id !== conv.id)
                      e.currentTarget.style.background = "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    if (currentConversation?.id !== conv.id)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <MessageOutlined
                    style={{ marginRight: 6, fontSize: 11, color: "#999" }}
                  />
                  {conv.title}
                </div>
              ))}
            </Spin>
          </div>

          {/* 底部用户信息 */}
          <div
            style={{
              borderTop: "1px solid #ececec",
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fafafa",
            }}
          >
            <Avatar
              size={28}
              icon={<UserOutlined />}
              style={{ background: "#1677ff", flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#333" }}>
                我的文件路径
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#999",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                E:\ai\frontend\
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ 中间主区 ============ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          minWidth: 0,
        }}
      >
        {/* 顶部 tab 栏 */}
        <div
          style={{
            height: 44,
            borderBottom: "1px solid #ececec",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 4,
            flexShrink: 0,
            background: "#fff",
          }}
        >
          <Button
            type="text"
            size="small"
            icon={
              leftCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            style={{ width: 28, height: 28 }}
          />

          <Tabs
            activeKey={activeMainTab}
            onChange={setActiveMainTab}
            size="small"
            style={{ flex: 1 }}
            items={[
              { key: "chat", label: "对话" },
              { key: "workspace", label: "工作室" },
            ]}
            tabBarStyle={{ borderBottom: "none", marginBottom: 0 }}
          />

          <Space size={4}>
            <Tag
              color="orange"
              style={{ fontSize: 11, borderRadius: 4, margin: 0 }}
            >
              嫌积分
            </Tag>
            <Tooltip title="分享">
              <Button
                type="text"
                size="small"
                icon={<ShareAltOutlined />}
                style={{ width: 28, height: 28 }}
              />
            </Tooltip>
            <Tooltip title="升级">
              <Button
                type="text"
                size="small"
                icon={<CrownOutlined />}
                style={{ width: 28, height: 28 }}
              />
            </Tooltip>
            <Tooltip title="信息">
              <Button
                type="text"
                size="small"
                icon={<InfoCircleOutlined />}
                onClick={() => setRightCollapsed(!rightCollapsed)}
                style={{ width: 28, height: 28 }}
              />
            </Tooltip>
          </Space>
        </div>

        {/* 消息区域 */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "32px 48px 16px",
            background: "#fff",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                paddingTop: "8vh",
                color: "#999",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  color: "#666",
                  marginBottom: 6,
                }}
              >
                开始新的对话
              </div>
              <div style={{ fontSize: 12, color: "#bbb" }}>
                按 Enter 发送，Shift+Enter 换行
              </div>
            </div>
          ) : (
            <Spin spinning={loadingMessages}>
              {messages.map((msg) => (
                <MessageBlock key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </Spin>
          )}
        </div>

        {/* emoji 工具条（空状态时显示） */}
        {messages.length > 0 && (
          <div
            style={{
              padding: "4px 48px 0",
              display: "flex",
              gap: 8,
              color: "#999",
              fontSize: 16,
            }}
          >
            <SmileOutlined style={{ cursor: "pointer" }} />
            <span style={{ cursor: "pointer" }}>👍</span>
            <span style={{ cursor: "pointer" }}>❤️</span>
            <span style={{ cursor: "pointer" }}>🎉</span>
            <span style={{ cursor: "pointer" }}>😄</span>
            <span style={{ cursor: "pointer" }}>🤔</span>
          </div>
        )}

        {/* 底部输入区 */}
        <div
          style={{
            padding: "12px 48px 16px",
            background: "#fafafa",
            borderTop: "1px solid #ececec",
            flexShrink: 0,
          }}
        >
          {/* 输入框 */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: "8px 12px",
              transition: "border-color 0.15s",
            }}
          >
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="可以描述任务或提问任何问题"
              autoSize={{ minRows: 2, maxRows: 8 }}
              disabled={sending}
              variant="borderless"
              style={{
                resize: "none",
                padding: 0,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 6,
                borderTop: "1px solid #f5f5f5",
                marginTop: 4,
              }}
            >
              <Space size={12}>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "model",
                        label: `当前: ${aiProvider} · ${aiModel}`,
                        disabled: true,
                      },
                      { type: "divider" },
                      ...personas.map((p) => ({
                        key: `persona-${p.key}`,
                        label: p.name,
                        icon:
                          currentPersona === p.key ? (
                            <CheckCircleOutlined />
                          ) : null,
                        onClick: () => setPersona(p.key),
                      })),
                    ],
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#666",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <ThunderboltOutlined />
                    <span>
                      {aiModel} · {currentPersonaObj?.name || "通用助手"} ·{" "}
                      <span style={{ color: "#52c41a" }}>连接</span>
                    </span>
                    <DownOutlined style={{ fontSize: 9 }} />
                  </div>
                </Dropdown>
              </Space>
              <Space size={6}>
                <Tooltip title="附件">
                  <Button
                    type="text"
                    size="small"
                    icon={<PaperClipOutlined />}
                    style={{ width: 28, height: 28 }}
                  />
                </Tooltip>
                <Tooltip title="语音">
                  <Button
                    type="text"
                    size="small"
                    icon={<AudioOutlined />}
                    style={{ width: 28, height: 28 }}
                  />
                </Tooltip>
                <Tooltip title="设置">
                  <Button
                    type="text"
                    size="small"
                    icon={<SettingOutlined />}
                    onClick={() => setSettingsOpen(true)}
                    style={{ width: 28, height: 28 }}
                  />
                </Tooltip>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  loading={sending}
                  size="small"
                  style={{ width: 32, height: 32 }}
                />
              </Space>
            </div>
          </div>

          {/* 提示 */}
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#bbb",
              marginTop: 8,
            }}
          >
            内容由AI生成，请仔细甄别
          </div>
        </div>
      </div>

      {/* ============ 右侧栏 ============ */}
      {!rightCollapsed && (
        <div
          style={{
            width: RIGHT_SIDER_WIDTH,
            borderLeft: "1px solid #ececec",
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <Tabs
            activeKey={activeRightTab}
            onChange={setActiveRightTab}
            size="small"
            centered
            style={{ borderBottom: "1px solid #ececec", background: "#fff" }}
            items={[
              { key: "info", label: "对话信息" },
              { key: "expert", label: "专家信息" },
            ]}
          />

          <div style={{ flex: 1, overflow: "auto", padding: "12px 0" }}>
            {activeRightTab === "info" ? (
              <>
                {/* 对话结论 */}
                <div style={{ padding: "0 16px 12px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#333",
                      marginBottom: 8,
                    }}
                  >
                    <FileTextOutlined style={{ color: "#1677ff" }} />
                    对话结论
                    <DownOutlined
                      style={{ fontSize: 9, color: "#999", marginLeft: "auto" }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#666",
                      lineHeight: 1.6,
                      background: "#fff",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ececec",
                    }}
                  >
                    {messages.length === 0
                      ? "等待对话生成结论..."
                      : currentConversation?.title || "新对话"}
                  </div>
                </div>

                {/* 结论建议 */}
                <div style={{ padding: "0 16px 12px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#333",
                      marginBottom: 8,
                    }}
                  >
                    <BulbOutlined style={{ color: "#faad14" }} />
                    结论建议
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      fontSize: 12,
                      color: "#666",
                      lineHeight: 1.8,
                    }}
                  >
                    <li>角色: {currentPersonaObj?.name || "通用助手"}</li>
                    <li>用户消息: {stats.userMsgs} 条</li>
                    <li>AI 回复: {stats.aiMsgs} 条</li>
                    <li>对话状态: {sending ? "生成中" : "已完成"}</li>
                  </ul>
                </div>

                {/* 文件 */}
                <div style={{ padding: "0 16px 12px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      <FileOutlined style={{ color: "#722ed1" }} />
                      文件 ({stats.total})
                    </div>
                    <Button
                      type="text"
                      size="small"
                      icon={<MoreOutlined />}
                      style={{ width: 20, height: 20 }}
                    />
                  </div>
                  {messages.length === 0 ? (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#bbb",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      暂无附件
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #ececec",
                        borderRadius: 6,
                        padding: 8,
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      {messages.slice(-3).map((m) => (
                        <div
                          key={m.id}
                          style={{
                            padding: "4px 0",
                            borderBottom: "1px solid #f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <FileTextOutlined
                            style={{ color: "#999", fontSize: 11 }}
                          />
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {(m.content || "").slice(0, 30) || "..."}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* 专家信息 */}
                <div style={{ padding: "0 16px 12px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <Avatar
                      size={40}
                      icon={<RobotOutlined />}
                      style={{ background: "#52c41a" }}
                    />
                    <div>
                      <div
                        style={{ fontSize: 13, fontWeight: 600, color: "#333" }}
                      >
                        {currentPersonaObj?.name || "通用助手"}
                      </div>
                      <div style={{ fontSize: 11, color: "#999" }}>
                        AI 角色 · {personas.length} 种可选
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#666",
                      lineHeight: 1.6,
                      background: "#fff",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ececec",
                    }}
                  >
                    {currentPersonaObj?.description ||
                      "智能对话助手，可处理各种问题。"}
                  </div>
                </div>

                <div style={{ padding: "0 16px 12px" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#333",
                      marginBottom: 8,
                    }}
                  >
                    当前模型
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #ececec",
                      borderRadius: 6,
                      padding: 10,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ color: "#666" }}>
                      Provider: <Tag color="blue">{aiProvider}</Tag>
                    </div>
                    <div style={{ color: "#666", marginTop: 4 }}>
                      Model: <Tag>{aiModel}</Tag>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <SettingsModal
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          try {
            const raw = localStorage.getItem("ai_settings");
            if (raw) {
              const s = JSON.parse(raw);
              if (s.provider) setAiProvider(s.provider);
              if (s.model) setAiModel(s.model);
            }
          } catch {}
        }}
      />
    </div>
  );
}

/** QClaw 风格消息块 */
function MessageBlock({
  message,
}: {
  message: { id: string; role: string; content: string; created_at: string };
}) {
  const isUser = message.role === "user";
  const html = isUser ? "" : renderMarkdown(message.content || "...");

  if (isUser) {
    // 用户消息：• 列表样式（QClaw 风格）
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: 16,
          gap: 8,
        }}
      >
        <span
          style={{
            color: "#999",
            fontSize: 14,
            lineHeight: 1.7,
            flexShrink: 0,
          }}
        >
          •
        </span>
        <div
          style={{
            fontSize: 14,
            color: "#333",
            lineHeight: 1.7,
            flex: 1,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  // AI 消息：结构化展示
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: 16,
        gap: 8,
      }}
    >
      <span
        style={{
          color: "#999",
          fontSize: 14,
          lineHeight: 1.7,
          flexShrink: 0,
        }}
      >
        •
      </span>
      <div
        className="markdown-body"
        style={{
          fontSize: 14,
          color: "#333",
          lineHeight: 1.7,
          flex: 1,
          wordBreak: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
