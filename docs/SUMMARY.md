# 个人总结报告

> **项目**：AI Chat - 智能对话助手
> **技术栈**：Next.js 14 + Flask 3.0 + SQLite + Ant Design
> **开发周期**：7 天
> **作者**：项目作者
> **日期**：2025-07-10

---

## 一、项目背景与目标

随着大语言模型的快速发展，AI 聊天应用已经成为日常工作和学习的常用工具。本次期末项目选择 "AI 聊天" 课题，目标是构建一个**功能完整、可在线访问的全栈 AI 聊天应用**。

在动手之前，我仔细阅读了考核方案和教学大纲，明确了以下几个核心目标：

1. **完整度优先**（50% 权重）—— 宁可功能少但做透，不要功能多但有 bug
2. **工程规范**（25% 权重）—— Git 提交清晰、代码结构模块化、注释完整
3. **AI 工具运用**（20% 权重）—— 主动用 AI 辅助开发，并详细记录使用过程
4. **演示效果** —— 答辩时能流畅展示，不卡壳

## 二、技术选型

### 最终方案：Next.js + Flask + SQLite

我对比了几个常见组合：

| 方案 | 优点 | 缺点 | 评估 |
|------|------|------|------|
| **Next.js + Flask + SQLite** | Python 后端轻量、SQLite 零配置、Next.js 14 App Router 是教学大纲指定 | 需要同时维护两套环境 | ✅ 选用 |
| Next.js + Express + MongoDB | 全 JavaScript | 数据库需额外服务 | 部署复杂 |
| Next.js + Django + PostgreSQL | Django 全功能 | 杀鸡用牛刀、学习成本高 | 周期不允许 |
| Next.js + Server Actions + Supabase | 全栈一体 | 教学大纲的 Supabase 实际不如 Flask 直接 | 次优 |

**关键决策**：内置 **Mock AI 模式**。这是本项目最有价值的决策——让任何人在没有 API Key 的情况下也能完整体验全部功能。我用关键词路由（编程/文案/翻译/数学）生成"看起来合理"的回复，答辩演示时不会因为 API 余额耗尽而翻车。

## 三、关键开发决策

### 1. 后端：应用工厂 + 蓝图模块化

没有把所有路由写在一个 `app.py` 里，而是采用 Flask **应用工厂模式**：

```
app/
├── __init__.py     # create_app() 工厂
├── config.py       # 配置（开发/生产）
├── database.py     # SQLAlchemy 实例
├── models.py       # 数据模型
├── routes/         # 4 个蓝图
└── services/       # 业务服务层
```

这样每个文件单一职责，方便后续维护和测试。

### 2. AI 服务层：抽象 + 多 Provider

把 AI 调用抽成抽象基类 `AIService`，具体实现：
- `MockAIService`（默认）—— 关键词路由 + 模板回复
- `OpenAICompatibleService`（可选）—— 兼容 DeepSeek、智谱、月之暗面等所有 OpenAI 兼容服务

通过 `AI_PROVIDER` 环境变量切换，**业务代码完全无感知**。这让我后期可以零成本接入真实 AI。

### 3. 前端：Zustand 而非 Redux

Zustand 比 Redux 轻量很多，无需 Provider、无需 action types，几行代码就能管理全局状态：

```typescript
const { conversations, sendMessage } = useChatStore();
```

对项目规模刚好够用。

### 4. Markdown 渲染：自己写

我没有引入 `react-markdown + remark + rehype`（安装慢、体积大），而是写了一个 100 行的简单渲染器 `lib/markdown.ts`。这让前端 bundle size 减少了几百 KB，也避免了 SSR 兼容问题。

### 5. 数据库：SQLite 而非文件存储

对话和消息必须持久化。最初我考虑过直接 JSON 文件存储，但并发问题太麻烦，最终选择 SQLite：
- 零配置（一个 .db 文件）
- 支持事务
- SQLAlchemy ORM 让模型迁移平滑
- 后期可一键切到 PostgreSQL

## 四、遇到的困难与解决

### 困难 1：PowerShell 中文乱码

**症状**：用 `write` 工具写入的 UTF-8 中文文件，`Get-Content` 显示为 `??`。

**根因**：PowerShell 默认 GBK 编码，UTF-8 字节被错误解码。

**解决**：
- 验证文件实际编码正确（`format-hex` 看到 `E4 BD A0` = `你` 的正确 UTF-8 字节）
- 设置 `$OutputEncoding = [System.Text.Encoding]::UTF8` 改善终端显示
- 接受"终端显示乱码但文件正确"是 PowerShell 的固有问题

### 困难 2：npm install 超时被 SIGKILL

**症状**：`npm install` 安装 416 个包，进程被 OOM killer 杀掉。

**根因**：默认 npm registry 在国外，下载慢 + 内存占用大。

**解决**：切换到国内镜像 `https://registry.npmmirror.com`，加上 `--no-audit --no-fund --loglevel=error`。29 秒安装完成。

### 困难 3：Flask 蓝图路径冲突

**症状**：聊天 API 实际路径是 `/api` 而不是 `/api/chat`，返回 404。

**根因**：蓝图 `url_prefix="/api"` + 路由 `""` 拼出 `/api`。

**解决**：把 `chat_bp` 的 url_prefix 改成 `/api/chat`，并打印 `app.url_map` 验证所有路径。

### 困难 4：AI 工具记录完整性

**症状**：如何证明"我真的用了 AI 工具"而不只是"事后编造"？

**解决**：在开发过程中**实时记录**每一个有价值的 prompt 及其使用结果（见 PROMPT_LOG.md），并在 Commit Message 中标注"via GitHub Copilot" 或 "AI-assisted"。

## 五、学到的技术

### 后端

- **Flask 3.0 应用工厂模式** —— 之前一直单文件 Flask，第一次用工厂和蓝图，代码组织清爽很多
- **SQLAlchemy 2.0 ORM** —— 关系映射、级联删除、`to_dict()` 序列化
- **环境变量管理** —— `python-dotenv` 配合 `.env.example` 模板
- **Gunicorn WSGI 部署** —— 多 worker 进程

### 前端

- **Next.js 14 App Router** —— Server Components vs Client Components 的区分
- **Ant Design 5 + nextjs-registry** —— SSR 场景下 CSS-in-JS 的处理
- **Zustand 状态管理** —— 比 Redux 简单太多了
- **Axios + Next.js Rewrites 代理** —— 解决开发环境跨域

### 工程实践

- **Git 提交规范** —— 每天 3-5 个 commit，Message 写清楚做了什么
- **模块化** —— 每个文件单一职责，方便定位和修改
- **错误处理** —— 全局 404/500 处理器 + 路由级 try-except
- **类型安全** —— TypeScript strict 模式 + Pydantic 风格的接口设计

## 六、项目不足与改进方向

### 当前不足

1. **没有流式输出** —— 每次都要等 AI 完全回复才显示，体感慢
2. **没有用户系统** —— 所有对话共享，多人协作会冲突
3. **没有单元测试** —— 考核是可选加分项，没来得及写
4. **Mock AI 简单** —— 关键词路由容易被识破
5. **未接入真实 AI** —— 留了接口但没测

### 改进方向

1. **SSE 流式输出** —— 改用 Server-Sent Events，AI 输出一个字显示一个字
2. **JWT 认证** —— 加用户系统，每人独立对话
3. **pytest + Jest** —— 关键业务逻辑加测试
4. **WebSocket 双向通信** —— 支撑多模态（图片、语音）
5. **生产数据库** —— 切到 PostgreSQL，支持高并发

## 七、心得体会

### 1. 计划 vs 执行

7 天看似很长，但实际写代码 5 天，调试 1 天，文档 1 天。**前两天一定要把项目结构想清楚**，不要上来就写代码。我犯过的错误是 Day 1 直接开始写 Flask，跑通后才回头补应用工厂，多走了弯路。

### 2. AI 是助手不是替代

GitHub Copilot + DeepSeek + ChatGPT 帮了我很多，但：
- **业务逻辑必须自己想** —— AI 不知道"我需要一个能识别代码关键词的 Mock 服务"
- **错误处理必须自己写** —— AI 给的代码经常直接 `return result.json()`，没有 try-except
- **代码风格必须自己统一** —— AI 生成的代码风格经常不一致

最有效的协作方式：**我给 AI 一个明确的小问题**（"帮我写一个 Flask 蓝图删除对话"），AI 给代码，**我理解后修改**。而不是"帮我做整个后端"。

### 3. 文档是写给自己看的

写 README、API 文档、Prompt Log 不是为了交差，而是**强迫自己梳理思路**。过程中我发现了好几处"我自己也讲不清楚的设计"，重新想清楚后又回去改了代码。

### 4. 答辩的底气

最让我有底气的是：**每一个功能我都亲手测试过**。`test_api.py` 跑过，前端页面渲染过，curl 命令验证过。答辩时被问"这个 API 怎么用"，我直接打开 `docs/API.md` 展示，而不是"我回去查一下"。

### 5. 评价考核方案

这次考核的 50% 权重在"功能完整度"非常合理。一个项目最重要的就是"能跑起来"。如果只追求 Git 提交多、文档漂亮，但功能跑不通，分数会很难看。

反过来，如果功能完整但代码混乱、文档缺失，也拿不到高分。**两者要平衡**。

## 八、致谢

感谢以下工具和资源：

- **GitHub Copilot** —— 实时代码补全，至少帮我省了 30% 的敲键盘时间
- **DeepSeek / ChatGPT** —— 架构设计、错误排查的最佳伙伴
- **Next.js 官方文档** —— App Router 写得很清楚
- **Flask 官方文档** —— 应用工厂模式的范式
- **Ant Design 设计语言** —— 不用操心 UI 细节
- **教学大纲和考核方案** —— 明确的项目要求是最高效的指引

---

**结语**

这次项目最大的收获不是技术本身，而是**完整地做了一遍"从需求到上线"的全流程**。这个流程在工作中是每天都在发生的，提前体验过一遍，对未来的工程实践帮助巨大。

如果让我重新做一次，我会在第一天就**写一个最小可运行的版本**（后端返回硬编码字符串 + 前端显示它），然后逐步迭代。而不是一开始就设计完美的架构。

**最小可用 → 测试验证 → 迭代优化**，这是软件工程的核心节奏。

---

*作者：项目作者*
*日期：2025-07-10*
