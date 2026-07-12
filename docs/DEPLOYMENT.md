# 🚀 部署指南

## 架构

```
用户浏览器 → Vercel (前端) → Render (后端 Flask) → AI Provider
```

## 一、后端部署到 Render

### 1. 准备 GitHub 仓库
```bash
# 确保代码已推送到 GitHub
cd E:\ai
git remote add github https://github.com/你的用户名/ai-chat.git
git push github main
```

### 2. 在 Render 创建服务
1. 访问 https://render.com，注册/登录
2. 点击 **New** → **Web Service**
3. 连接你的 GitHub 仓库
4. 填写配置：
   - **Name**: `ai-chat-backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT run:app`
   - **Plan**: Free
5. 设置环境变量：
   - `FLASK_ENV` = `production`
   - `AI_PROVIDER` = `mock`（或 `deepseek` 等真实 Provider）
   - `AI_API_KEY` = 你的 API Key（如用真实 AI）
   - `AI_BASE_URL` = 对应的 API 地址
   - `AI_MODEL` = 模型名称
   - `CORS_ORIGINS` = `https://你的项目.vercel.app`
6. 点击 **Create Web Service**

部署完成后获得地址：`https://ai-chat-backend.onrender.com`

### 3. 验证后端
访问 `https://ai-chat-backend.onrender.com/api/health`，应返回：
```json
{"code":0,"data":{"service":"ai-chat-backend","status":"ok","version":"1.0.0"}}
```

## 二、前端部署到 Vercel

### 1. 在 Vercel 创建项目
1. 访问 https://vercel.com，注册/登录（可用 GitHub 账号）
2. 点击 **Add New** → **Project**
3. 导入你的 GitHub 仓库
4. 配置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
5. 设置环境变量：
   - `BACKEND_URL` = `https://ai-chat-backend.onrender.com`
6. 点击 **Deploy**

部署完成后获得地址：`https://ai-chat-xxx.vercel.app`

### 2. 更新后端 CORS
回到 Render，添加环境变量：
- `CORS_ORIGINS` = `https://ai-chat-xxx.vercel.app`

重启后端服务。

## 三、配置真实 AI（可选）

在 Render 的环境变量中设置：
```
AI_PROVIDER=deepseek
AI_API_KEY=sk-你的真实key
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-chat
```

其他 Provider 配置见 `.env.example`。

## 四、验证清单

- [ ] 后端 `https://xxx.onrender.com/api/health` 返回 200
- [ ] 前端 `https://xxx.vercel.app/chat` 能打开
- [ ] 发送消息能收到 AI 回复
- [ ] 对话历史正常保存
- [ ] 移动端访问正常

## 注意事项

1. **Render 免费版**：15 分钟无请求会休眠，首次访问需等待 ~30 秒冷启动
2. **Vercel 免费版**：每月 100GB 流量，个人项目足够
3. **数据库**：免费版 SQLite 数据在 Render 重启后会丢失，如需持久化请用 Render PostgreSQL
