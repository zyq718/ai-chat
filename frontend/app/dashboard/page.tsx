"use client";

import { Card, Row, Col, Statistic, Progress, Tag, Typography, Divider, List } from "antd";
import {
  ApiOutlined,
  MessageOutlined,
  RobotOutlined,
  CodeOutlined,
  DatabaseOutlined,
  GithubOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { systemApi } from "@/lib/api";

const { Title, Paragraph, Text } = Typography;

export default function DashboardPage() {
  const [info, setInfo] = useState<{
    ai_provider?: string;
    ai_model?: string;
    debug?: boolean;
  }>({});

  useEffect(() => {
    systemApi.getInfo().then((res) => setInfo(res.data || {}));
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <RobotOutlined style={{ fontSize: 56, color: "#1677ff" }} />
        <Title level={2} style={{ marginTop: 16 }}>
          AI Chat 项目仪表盘
        </Title>
        <Paragraph type="secondary">
          全栈 AI 聊天应用 · Next.js + Flask + SQLite
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="前端路由"
              value={3}
              prefix={<CodeOutlined style={{ color: "#1677ff" }} />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="后端 API"
              value={11}
              prefix={<ApiOutlined style={{ color: "#52c41a" }} />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="AI 角色"
              value={5}
              prefix={<MessageOutlined style={{ color: "#faad14" }} />}
              suffix="种"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="技术栈"
              value={7}
              prefix={<DatabaseOutlined style={{ color: "#eb2f96" }} />}
              suffix="项"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 技术架构 */}
      <Title level={3}>技术架构</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="前端 (Frontend)" size="small">
            <List
              size="small"
              dataSource={[
                { label: "框架", value: "Next.js 14 (App Router)" },
                { label: "UI 库", value: "Ant Design 5" },
                { label: "状态管理", value: "Zustand" },
                { label: "HTTP 客户端", value: "Axios" },
                { label: "语言", value: "TypeScript" },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Text strong>{item.label}:</Text>
                  <Text> {item.value}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="后端 (Backend)" size="small">
            <List
              size="small"
              dataSource={[
                { label: "框架", value: "Flask 3.0" },
                { label: "ORM", value: "Flask-SQLAlchemy" },
                { label: "数据库", value: "SQLite (开发) / PostgreSQL (生产)" },
                { label: "AI 服务", value: "DeepSeek / OpenAI 兼容" },
                { label: "部署", value: "Gunicorn + Vercel" },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Text strong>{item.label}:</Text>
                  <Text> {item.value}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* API 概览 */}
      <Title level={3}>API 接口概览</Title>
      <Card size="small">
        <List
          size="small"
          dataSource={[
            { method: "GET", path: "/api/health", desc: "健康检查" },
            { method: "GET", path: "/api/personas", desc: "获取 AI 角色列表" },
            { method: "GET", path: "/api/info", desc: "获取服务信息" },
            { method: "POST", path: "/api/chat", desc: "发送消息并获取 AI 回复" },
            { method: "GET", path: "/api/conversations", desc: "获取对话列表" },
            { method: "POST", path: "/api/conversations", desc: "创建新对话" },
            { method: "GET", path: "/api/conversations/:id", desc: "获取对话详情（含消息）" },
            { method: "PATCH", path: "/api/conversations/:id", desc: "更新对话（标题/角色）" },
            { method: "DELETE", path: "/api/conversations/:id", desc: "删除对话" },
            { method: "GET", path: "/api/messages/:convId", desc: "获取对话消息列表" },
            { method: "DELETE", path: "/api/messages/:msgId", desc: "删除单条消息" },
            { method: "POST", path: "/api/messages/:convId/clear", desc: "清空对话消息" },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Tag
                color={
                  item.method === "GET"
                    ? "blue"
                    : item.method === "POST"
                    ? "green"
                    : item.method === "PATCH"
                    ? "orange"
                    : "red"
                }
                style={{ minWidth: 60, textAlign: "center" }}
              >
                {item.method}
              </Tag>
              <Text code style={{ marginLeft: 8 }}>
                {item.path}
              </Text>
              <Text type="secondary" style={{ marginLeft: 16 }}>
                {item.desc}
              </Text>
            </List.Item>
          )}
        />
      </Card>

      <Divider />

      {/* 服务状态 */}
      <Title level={3}>服务状态</Title>
      <Card size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Statistic title="AI Provider" value={info.ai_provider || "loading..."} />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic title="AI Model" value={info.ai_model || "loading..."} />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="调试模式"
              value={info.debug ? "开启" : "关闭"}
              valueStyle={{ color: info.debug ? "#faad14" : "#52c41a" }}
            />
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* 部署信息 */}
      <Title level={3}>部署信息</Title>
      <Card size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Statistic
              title="前端部署"
              value="Vercel"
              prefix={<CloudOutlined />}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="后端部署"
              value="Render/Railway"
              prefix={<CloudOutlined />}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="代码托管"
              value="GitHub"
              prefix={<GithubOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <div style={{ textAlign: "center", marginTop: 32, color: "#999", fontSize: 12 }}>
        <p>AI Chat v1.0.0 · Built with Next.js + Flask</p>
        <p>© 2025 AI Chat Project</p>
      </div>
    </div>
  );
}
