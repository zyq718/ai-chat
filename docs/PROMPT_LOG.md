# AI 工具使用记录（Prompt Log）

> 本文档记录项目开发过程中使用 AI 工具（GitHub Copilot / DeepSeek / ChatGPT）时输入的 Prompt 和获得的回复摘要，作为 AI 工具运用维度的评估材料。

---

## 1. 项目立项阶段

### 1.1 解读考核方案

**Prompt**:
```
我是一名学生，刚拿到期末项目考核方案。考核权重是：
- 项目功能完整度 50%（线上可访问 20%、功能实现 30%）
- 工程规范与代码质量 25%（Git 提交 15%、代码结构 5%、代码审查 5%）
- AI 工具运用与文档 20%（Prompt 日志 10%、项目文档 10%）
- 个人总结 5%
要求：前端至少 3 个独立路由，后端至少 3 个 API，Git 至少 3 个不同日期有效提交。
请帮我分析这个考核方案的关键得分点，以及如何在 AI 聊天项目里拿到高分。
```

**AI 摘要**:
- 50% 的分数在功能完成度上，必须把"功能实现"做扎实
- Git 提交历史占 15%，需要养成频繁提交的好习惯
- AI 工具使用记录必须有，不能是"用了 AI 但没记录"
- 至少 3 个前端路由 + 3 个后端 API 是硬指标，建议做 4-5 个

**实际应用**: 决定做 4 个前端页面（/chat, /dashboard, /about, /）+ 12 个后端 API。

---

### 1.2 教学大纲解读

**Prompt**:
```
教学大纲要求使用 Next.js (React)、Ant Design、Flask、Supabase、Git+GitHub、Vercel 部署，
7 天完成全栈项目。请帮我设计：
1. 7 天时间表如何拆分
2. 关键里程碑是什么
3. 如何用最少时间覆盖评分点
```

**AI 摘要**:
- Day 1-2: 需求分析 + 项目初始化 + 后端基础
- Day 3-4: 后端业务 + 前端开发
- Day 5: 联调测试
- Day 6: 部署上线
- Day 7: 文档 + 答辩准备

**实际应用**: 严格按照此时间表推进。

---

## 2. 架构设计阶段

### 2.1 技术栈选型

**Prompt**:
```
我准备做 AI 聊天项目，候选技术栈：
A) Next.js + Flask + SQLite + Vercel
B) Next.js + Express + MongoDB + Vercel
C) Next.js + Django + PostgreSQL + Vercel

考虑因素：学习成本、部署难度、考核要求"AI 工具运用"、能否本地无 API Key 跑通。
请帮我分析哪种方案最合适。
```

**AI 摘要**:
- Flask 比 Django 轻量，比 Express 更适合 Python 学习者
- SQLite 部署简单，符合"快速可演示"
- Vercel 对 Next.js 支持最好
- **关键建议**：内置一个 Mock AI 模式，避免外部 API Key 依赖

**实际应用**: 选择 A 方案，并实现 Mock AI。

---

### 2.2 AI 服务层设计

**Prompt**:
```
我需要设计一个可切换的 AI 服务层，支持：
- Mock 模式（无 API Key）
- OpenAI 兼容模式（DeepSeek / 智谱 / 月之暗面）

请用 Python 帮我设计一个抽象基类，要求：
- 统一接口（chat(messages, persona, model)）
- 单例模式
- 易于扩展新的 Provider
- 支持 5 种 persona（通用助手、编程专家、文案写手、翻译官、学习导师）
```

**AI 提供的代码骨架**:
```python
class AIService(ABC):
    @abstractmethod
    def chat(self, messages, persona, model, **kwargs):
        pass

class MockAIService(AIService): ...
class OpenAICompatibleService(AIService): ...
```

**实际应用**: 完整实现了 `backend/app/services/ai_service.py`，包括 5 个 persona 调教 prompt 和 Mock 服务的关键词路由。

---

## 3. 后端开发阶段

### 3.1 Flask 应用工厂

**Prompt**:
```
帮我写一个 Flask 3.0 的应用工厂：
- 使用 blueprints 模块化路由
- 支持 CORS（多个 origin）
- 自动创建数据库表
- 统一错误处理
- 配置文件分离（开发/生产）
```

**AI 提供的关键代码**:
```python
def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": origins}})
    # 注册多个蓝图...
    return app
```

**实际应用**: 完整实现，新增 4 个蓝图（chat/conversations/messages/system）。

---

### 3.2 SQLAlchemy 模型设计

**Prompt**:
```
设计两个表：
1. conversations（对话）
   - id (UUID)
   - title
   - persona
   - model
   - created_at, updated_at
2. messages（消息）
   - id (UUID)
   - conversation_id (FK)
   - role (user/assistant/system)
   - content (text)
   - created_at

要求：一对多关系，级联删除。
```

**AI 提供的关键代码**:
```python
class Conversation(db.Model):
    messages = db.relationship("Message", backref="conversation", 
                               cascade="all, delete-orphan", order_by="Message.created_at")
```

**实际应用**: 完整实现，并加上 `to_dict()` 序列化方法。

---

### 3.3 Mock AI 回复生成

**Prompt**:
```
帮我写一个 Python 函数，接收用户消息，返回"看起来合理"的回复。
不依赖任何外部 API。要求：
- 关键词匹配（代码/文案/翻译/学习/数学）
- 默认回复（友好但有信息量）
- 包含 Markdown 格式（代码块、列表、引用）
- 中文支持
- 让人感觉"这就是真的 AI"
```

**AI 摘要**:
AI 提供了完整的 Mock 路由策略：
- 编程关键词 → Python/JS 代码示例
- 文案关键词 → 营销文案模板
- 翻译关键词 → 多语言说明
- 数学关键词 → 安全 eval 求值
- 默认 → 友好引导

**实际应用**: 完整实现 `MockAIService` 类，包含 5 个回复模板分支。

---

## 4. 前端开发阶段

### 4.1 Next.js App Router 项目结构

**Prompt**:
```
Next.js 14 App Router 怎么组织多页面项目？要求：
- 至少 3 个独立页面
- 使用 Ant Design
- 客户端状态管理
- 集成后端 API
```

**AI 摘要**:
- App Router 用 `app/` 目录，每个子目录就是一个路由
- `'use client'` 指令标记客户端组件
- 状态管理建议 Zustand（轻量）
- 跨域用 `next.config.js` 的 rewrites 代理

**实际应用**: 创建 3 个页面 + 1 个首页（重定向），使用 Zustand 状态管理。

---

### 4.2 Markdown 渲染

**Prompt**:
```
我不想引入 markdown 库（如 react-markdown + remark + rehype 一堆依赖），
帮我写一个简单的 Markdown 渲染器，要求：
- 支持代码块（多行）
- 支持行内代码
- 支持粗体、斜体
- 支持列表（有序/无序）
- 支持标题、引用、分割线
- 转义 HTML 防 XSS
- 纯 TypeScript
```

**AI 提供的关键算法**:
- 用 `\`\`\`...\`\`\`` 检测代码块开始/结束
- 用正则处理行内格式
- 状态机管理 `inCodeBlock` 和 `inList`
- 每次输出前 `escapeHtml()`

**实际应用**: 完整实现 `lib/markdown.ts`，约 100 行代码。

---

### 4.3 Zustand 状态管理

**Prompt**:
```
用 Zustand 设计一个聊天 store，需要管理：
- 对话列表 (conversations)
- 当前对话 (currentConversation)
- 消息列表 (messages)
- 当前 persona
- 加载/发送状态
包含 actions：loadConversations, selectConversation, createConversation, 
deleteConversation, sendMessage（乐观更新）, clearMessages。
```

**AI 摘要**:
- 用 `create()` 初始化 store
- 用 `set()` 更新 state
- 用 `get()` 访问当前 state
- 乐观更新：先显示用户消息，收到响应后替换

**实际应用**: 完整实现 `lib/store.ts`，包含完整的乐观更新逻辑。

---

## 5. 联调与调试阶段

### 5.1 API 路径冲突

**问题**: 蓝图注册到 `/api` 前缀，路由写空字符串 `""`，结果路径变成 `/api` 而不是 `/api/chat`。

**Prompt**:
```
Flask 蓝图 url_prefix="/api" + 路由 @bp.post("") 出来的实际路径是什么？
我想要的是 POST /api/chat，但实际是 POST /api。
```

**AI 摘要**:
- 蓝图 prefix + 路由路径拼接
- 路由 `""` + prefix `/api` = `/api`
- 想要 `/api/chat` 应该 prefix="/api" + 路由="/chat"

**实际应用**: 修正 `chat_bp` 的 url_prefix 为 `/api/chat`。

---

### 5.2 终端中文乱码

**问题**: PowerShell 默认 GBK 编码，中文显示为 `??`。

**Prompt**:
```
PowerShell 7 中文乱码怎么办？Get-Content 显示中文是 ?? 
但实际文件是 UTF-8 编码正确的（VSCode 打开正常）。
```

**AI 摘要**:
- PowerShell 默认 OEM/GBK 编码
- 不影响文件本身，只影响终端显示
- 解决方案：设置 `$OutputEncoding = [System.Text.Encoding]::UTF8`
- 或者用 `format-hex` 验证文件字节

**实际应用**: 验证文件编码正确后忽略终端显示问题。

---

### 5.3 npm install 超时

**问题**: npm install 持续运行被 SIGKILL。

**Prompt**:
```
npm install 安装 Next.js 项目（依赖 416 个包）一直超时被 kill，
默认 registry 太慢。怎么办？
```

**AI 摘要**:
- 切换到国内镜像：`npm config set registry https://registry.npmmirror.com`
- 加上 `--no-audit --no-fund --loglevel=error` 减少日志和审计
- 加大超时时间

**实际应用**: 切换到 npmmirror 镜像后 29 秒安装完成。

---

## 6. 文档编写阶段

### 6.1 README 模板

**Prompt**:
```
帮我生成一个完整 GitHub README 模板，包括：
- 项目徽章（badges）
- 核心特性
- 技术栈表格
- 项目结构
- 快速开始
- API 文档链接
- 部署指南
- 贡献指南
- 许可证
```

**AI 提供的章节结构**:
1. Title + Badges
2. 一句话简介
3. ✨ 核心特性（列表 + emoji）
4. 🏗️ 技术栈（表格）
5. 📂 项目结构（tree）
6. 🚀 快速开始（代码块）
7. 📡 API 文档（指向 docs/API.md）
8. 🌐 部署
9. 🤝 贡献
10. 📄 许可

**实际应用**: 按此结构写完整 README.md（~200 行）。

---

### 6.2 个人总结报告

**Prompt**:
```
我是一名学生，刚完成 AI 聊天项目（Next.js + Flask + SQLite + Mock AI）。
请帮我写一份 500 字以上的个人总结报告，要求：
- 项目背景与目标
- 技术选型理由
- 开发过程中的关键决策
- 遇到的困难与解决方案
- 学到的技术与经验
- 项目不足与改进方向
- 心得体会
语气：真诚、有反思、不堆砌套话。
```

**AI 摘要**:
AI 提供了大纲和写作要点，重点突出"过程"和"反思"。

**实际应用**: 完整撰写 [docs/SUMMARY.md](./SUMMARY.md)。

---

## 7. 工具使用统计

| AI 工具 | 用途 | 使用次数 |
|---------|------|----------|
| DeepSeek / ChatGPT | 架构设计、问题排查、代码生成 | 20+ 次 |
| GitHub Copilot | 实时代码补全 | 持续（开发全程） |
| Cursor | 编辑器 AI 辅助 | 部分使用 |

### AI 工具使用比例

- **直接使用 AI 生成的代码**: 约 30%（基础结构、样板代码）
- **AI 辅助 + 自己修改**: 约 50%（业务逻辑、错误处理）
- **完全自己写的代码**: 约 20%（核心算法、个性化设计）

---

## 8. 反思与心得

### AI 帮到我的地方

1. **快速搭建骨架** — Flask 应用工厂、Next.js 项目结构，AI 几分钟给出我可能要写半天的样板代码
2. **错误诊断** — PowerShell 乱码、Flask 蓝图路径问题，AI 几秒定位
3. **知识盲区** — Next.js 14 App Router 的最新写法、Zustand 的最佳实践
4. **文档结构** — README、API 文档的规范写法

### AI 不擅长的地方

1. **业务逻辑** — 仍然需要我自己设计 persona 调教、Mock AI 路由策略
2. **风格统一** — 多个 AI 生成的代码片段需要我手动统一风格
3. **项目特定约束** — AI 不知道我的考核方案具体要求，必须自己判断
4. **跨平台细节** — 编码、换行符、路径处理，AI 给的建议经常不全面

### 与 AI 协作的关键

- **明确需求** — 模糊的 prompt 得到模糊的答案
- **追问与验证** — AI 的代码不能直接复制，要理解后修改
- **保留判断** — AI 的建议是参考，不是命令

---

**记录人**: 项目作者
**最后更新**: 2025-07-10
