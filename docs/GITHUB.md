# GitHub 仓库说明

## 仓库信息

- **仓库名**: ai-chat
- **可见性**: Public（公开，考核要求）
- **主分支**: main

## 仓库应包含的内容

```
ai-chat/
├── .git/                       # Git 历史
├── .gitignore                  # 忽略文件配置
├── README.md                   # 项目说明
├── LICENSE                     # MIT 许可证
│
├── backend/                    # Flask 后端
│   ├── app/
│   ├── test_api.py
│   ├── requirements.txt
│   ├── run.py
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                   # Next.js 前端
│   ├── app/
│   ├── lib/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .eslintrc.json
│   └── .gitignore
│
├── docs/                       # 项目文档
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── PROMPT_LOG.md
│   └── SUMMARY.md
│
├── demo/                       # 演示材料
│   └── screenshots/
│       ├── 01-homepage.png
│       ├── 02-chat-interface.png
│       ├── 03-dashboard.png
│       └── 04-about.png
│
├── ppt/                        # 答辩 PPT
│   ├── AI-Chat-答辩.pptx
│   └── AI-Chat-答辩.pdf
│
└── scripts/                    # 辅助脚本
    └── write.ps1
```

## README 顶部应包含的链接

- 部署 URL（Vercel 前端）
- GitHub 仓库地址
- 演示录屏链接（可上传到 Bilibili / YouTube / 腾讯视频）

## 推荐 README 章节

1. 项目徽章（Build / License / Tech）
2. 项目简介
3. 核心特性截图
4. 在线 Demo
5. 技术栈
6. 快速开始
7. API 文档
8. 部署指南
9. AI 工具使用记录
10. 贡献指南
11. 许可证
12. 作者

## Commit Message 规范

参考考核方案要求，commit message 需有具体描述：

```
feat: 添加聊天页面 UI
fix: 修复对话删除时消息未级联删除的 bug
docs: 完善 API 文档
style: 统一代码缩进为 2 空格
refactor: 重构 AI 服务层为抽象基类
test: 添加 conversations API 单元测试
chore: 更新 .gitignore 忽略 .env 文件
```

## 至少 3 个不同日期的提交

按考核要求，提交历史需要跨越至少 3 天。建议按以下节奏：

- **Day 1**: 项目初始化 + 后端基础
- **Day 2**: 前端 + 联调
- **Day 3**: 文档 + 部署

具体见本仓库的 commit history。

## 仓库设置建议

### 1. 添加 README 徽章

```markdown
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js)
![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask)
![License](https://img.shields.io/badge/License-MIT-yellow)
```

### 2. 添加 GitHub Topics

```
nextjs flask typescript python ant-design ai chat
```

### 3. 启用 Issues 和 Discussions

方便收集用户反馈。

### 4. 添加 LICENSE

推荐 MIT License。

---

**创建日期**: 2025-07-10
