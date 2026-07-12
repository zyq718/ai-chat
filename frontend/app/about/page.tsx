"use client";

import { Card, Typography, Steps, Timeline, Tag, Row, Col, Alert } from "antd";
import {
  RobotOutlined,
  CodeOutlined,
  DatabaseOutlined,
  CloudOutlined,
  GithubOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <GithubOutlined style={{ fontSize: 48, color: "#1677ff" }} />
        <Title level={2} style={{ marginTop: 16 }}>
          关于项目
        </Title>
        <Paragraph type="secondary">
          AI Chat - 全栈智能对话助手
        </Paragraph>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>项目简介</Title>
        <Paragraph>
          AI Chat 是一个基于 Next.js + Flask 构建的全栈 AI 聊天应用。
          用户可以与 AI 助手进行自然语言对话，支持多种角色切换（通用助手、编程专家、
          文案写手、翻译官、学习导师），对话历史持久化存储，并提供了完整的对话管理功能。
        </Paragraph>
        <Alert
          message="核心特性"
          type="info"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>多角色 AI 对话：5 种预设角色，不同风格回复</li>
              <li>对话管理：创建、切换、删除、搜索对话</li>
              <li>消息持久化：基于 SQLite，对话历史不丢失</li>
              <li>Markdown 渲染：支持代码高亮、列表、引用等格式</li>
              <li>Mock AI 模式：无需 API Key 即可本地体验全部功能</li>
              <li>OpenAI 兼容：支持 DeepSeek、智谱、月之暗面等 API</li>
              <li>响应式设计：适配桌面和移动端</li>
            </ul>
          }
          style={{ marginTop: 16 }}
        />
      </Card>

      <Card title="技术栈详情" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card type="inner" title={<><CodeOutlined /> 前端</>} size="small">
              <Tag color="blue">Next.js 14</Tag>
              <Tag color="blue">React 18</Tag>
              <Tag color="blue">TypeScript</Tag>
              <Tag color="blue">Ant Design 5</Tag>
              <Tag color="blue">Zustand</Tag>
              <Tag color="blue">Axios</Tag>
              <Paragraph style={{ marginTop: 12, fontSize: 13 }}>
                使用 Next.js App Router 架构，支持 SSR/CSR。
                Ant Design 提供企业级 UI 组件，Zustand 管理全局状态。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card type="inner" title={<><DatabaseOutlined /> 后端</>} size="small">
              <Tag color="green">Flask 3.0</Tag>
              <Tag color="green">SQLAlchemy</Tag>
              <Tag color="green">Flask-CORS</Tag>
              <Tag color="green">SQLite</Tag>
              <Tag color="green">Gunicorn</Tag>
              <Paragraph style={{ marginTop: 12, fontSize: 13 }}>
                Flask 应用工厂模式，模块化蓝图设计。
                SQLAlchemy ORM 管理数据，支持平滑迁移到 PostgreSQL。
              </Paragraph>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <Card type="inner" title={<><CloudOutlined /> 部署</>} size="small">
              <Tag color="orange">Vercel</Tag>
              <Tag color="orange">Render</Tag>
              <Tag color="orange">GitHub</Tag>
              <Paragraph style={{ marginTop: 12, fontSize: 13 }}>
                前端部署在 Vercel（零配置 Next.js 部署），
                后端部署在 Render/Railway，代码托管在 GitHub。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card type="inner" title={<><RobotOutlined /> AI 服务</>} size="small">
              <Tag color="purple">DeepSeek</Tag>
              <Tag color="purple">OpenAI</Tag>
              <Tag color="purple">Mock AI</Tag>
              <Paragraph style={{ marginTop: 12, fontSize: 13 }}>
                内置 Mock AI 无需配置即可使用。
                支持 OpenAI 兼容协议，可接入 DeepSeek、智谱等服务。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="项目结构" style={{ marginBottom: 16 }}>
        <pre style={{ background: "#f6f8fa", padding: 16, borderRadius: 6, fontSize: 13, overflow: "auto" }}>
{`ai/
├── backend/                 # Flask 后端
│   ├── app/
│   │   ├── __init__.py     # 应用工厂
│   │   ├── config.py       # 配置
│   │   ├── database.py     # 数据库
│   │   ├── models.py       # 数据模型
│   │   ├── routes/         # API 路由
│   │   │   ├── chat.py     # 聊天接口
│   │   │   ├── conversations.py  # 对话管理
│   │   │   ├── messages.py      # 消息管理
│   │   │   └── system.py        # 系统接口
│   │   └── services/       # 业务层
│   │       └── ai_service.py    # AI 服务
│   ├── requirements.txt
│   ├── run.py              # 启动入口
│   └── .env.example
├── frontend/               # Next.js 前端
│   ├── app/
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页（重定向到 /chat）
│   │   ├── chat/page.tsx   # 聊天页面
│   │   ├── dashboard/page.tsx  # 仪表盘
│   │   └── about/page.tsx  # 关于页面
│   ├── lib/
│   │   ├── api.ts          # API 客户端
│   │   ├── types.ts        # 类型定义
│   │   ├── markdown.ts     # Markdown 渲染
│   │   └── store.ts        # 状态管理
│   ├── package.json
│   └── next.config.js
├── docs/                   # 项目文档
└── .gitignore`}
        </pre>
      </Card>

      <Card title="开发历程">
        <Timeline
          items={[
            {
              color: "blue",
              children: (
                <>
                  <Text strong>需求分析</Text>
                  <br />
                  <Text type="secondary">阅读考核方案和教学大纲，明确项目要求和技术栈</Text>
                </>
              ),
            },
            {
              color: "blue",
              children: (
                <>
                  <Text strong>项目初始化</Text>
                  <br />
                  <Text type="secondary">创建项目目录结构，初始化 Git 仓库</Text>
                </>
              ),
            },
            {
              color: "green",
              children: (
                <>
                  <Text strong>后端开发</Text>
                  <br />
                  <Text type="secondary">Flask 应用工厂、数据库模型、API 路由、AI 服务层（含 Mock）</Text>
                </>
              ),
            },
            {
              color: "green",
              children: (
                <>
                  <Text strong>前端开发</Text>
                  <br />
                  <Text type="secondary">Next.js 页面、Ant Design 组件、Zustand 状态管理、Markdown 渲染</Text>
                </>
              ),
            },
            {
              color: "orange",
              children: (
                <>
                  <Text strong>联调测试</Text>
                  <br />
                  <Text type="secondary">前后端联调、API 测试、UI 优化</Text>
                </>
              ),
            },
            {
              color: "purple",
              children: (
                <>
                  <Text strong>部署上线</Text>
                  <br />
                  <Text type="secondary">Vercel 部署前端、Render 部署后端、GitHub 仓库管理</Text>
                </>
              ),
            },
            {
              color: "gray",
              children: (
                <>
                  <Text strong>文档编写</Text>
                  <br />
                  <Text type="secondary">README、API 文档、Prompt 日志、个人总结</Text>
                </>
              ),
            },
          ]}
        />
      </Card>

      <div style={{ textAlign: "center", marginTop: 32, color: "#999", fontSize: 12 }}>
        <p><FileTextOutlined /> AI Chat v1.0.0</p>
        <p>© 2025 AI Chat Project · Built with ❤️ using Next.js + Flask</p>
      </div>
    </div>
  );
}
