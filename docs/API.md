# API 文档

## 基础信息

- **Base URL**: `http://127.0.0.1:5000/api` (开发环境)
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: 无（公开 API）

## 通用响应格式

### 成功响应

```json
{
  "code": 0,
  "data": { ... },
  "message": "可选，成功消息"
}
```

### 错误响应

```json
{
  "code": 4xx/5xx,
  "message": "错误描述"
}
```

| Code | 含义 |
|------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 系统接口

### 1. 健康检查

```http
GET /api/health
```

**响应**:
```json
{
  "code": 0,
  "data": {
    "status": "ok",
    "service": "ai-chat-backend",
    "version": "1.0.0"
  }
}
```

### 2. 获取 AI 角色列表

```http
GET /api/personas
```

**响应**:
```json
{
  "code": 0,
  "data": [
    {"key": "assistant", "name": "通用助手"},
    {"key": "programmer", "name": "编程专家"},
    {"key": "writer", "name": "文案写手"},
    {"key": "translator", "name": "翻译官"},
    {"key": "tutor", "name": "学习导师"}
  ]
}
```

### 3. 获取服务信息

```http
GET /api/info
```

**响应**:
```json
{
  "code": 0,
  "data": {
    "ai_provider": "mock",
    "ai_model": "deepseek-chat",
    "debug": true
  }
}
```

---

## 对话接口

### 4. 获取对话列表

```http
GET /api/conversations?keyword=<搜索词>
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `keyword` | string | 否 | 标题模糊搜索 |

**响应**:
```json
{
  "code": 0,
  "data": [
    {
      "id": "uuid",
      "title": "Python 学习",
      "persona": "programmer",
      "model": "deepseek-chat",
      "created_at": "2025-07-10T12:00:00",
      "updated_at": "2025-07-10T12:30:00",
      "message_count": 10
    }
  ]
}
```

### 5. 创建对话

```http
POST /api/conversations
```

**请求体**:
```json
{
  "title": "可选，默认 '新对话'",
  "persona": "可选，默认 'assistant'",
  "model": "可选，默认 'mock-ai'"
}
```

**响应**: 返回创建的对话对象。

### 6. 获取对话详情（含消息）

```http
GET /api/conversations/:id
```

**响应**:
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "title": "...",
    "persona": "assistant",
    "model": "...",
    "created_at": "...",
    "updated_at": "...",
    "message_count": 4,
    "messages": [
      {
        "id": "msg-uuid",
        "conversation_id": "conv-uuid",
        "role": "user",
        "content": "你好",
        "created_at": "..."
      },
      {
        "id": "msg-uuid-2",
        "conversation_id": "conv-uuid",
        "role": "assistant",
        "content": "你好！有什么可以帮你？",
        "created_at": "..."
      }
    ]
  }
}
```

### 7. 更新对话

```http
PATCH /api/conversations/:id
```

**请求体**:
```json
{
  "title": "新标题",
  "persona": "programmer"
}
```

### 8. 删除对话

```http
DELETE /api/conversations/:id
```

**响应**:
```json
{"code": 0, "message": "已删除"}
```

---

## 消息接口

### 9. 获取对话消息列表

```http
GET /api/messages/:conversationId
```

**响应**:
```json
{
  "code": 0,
  "data": [
    {"id": "...", "role": "user", "content": "...", "created_at": "..."},
    {"id": "...", "role": "assistant", "content": "...", "created_at": "..."}
  ]
}
```

### 10. 删除单条消息

```http
DELETE /api/messages/:messageId
```

### 11. 清空对话消息

```http
POST /api/messages/:conversationId/clear
```

---

## 聊天接口（核心）

### 12. 发送消息并获取 AI 回复

```http
POST /api/chat
```

**请求体**:
```json
{
  "conversation_id": "uuid（可选，不传则自动创建）",
  "message": "用户消息内容（必填）",
  "persona": "assistant（可选）",
  "temperature": 0.7（可选，0-1）
}
```

**参数说明**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `conversation_id` | string | 否 | 不传则自动创建新对话 |
| `message` | string | ✅ | 1-8000 字符 |
| `persona` | string | 否 | assistant/programmer/writer/translator/tutor |
| `temperature` | number | 否 | 0-1，默认 0.7 |

**响应**:
```json
{
  "code": 0,
  "data": {
    "conversation": {
      "id": "uuid",
      "title": "消息前 30 字",
      "persona": "assistant",
      "model": "...",
      "created_at": "...",
      "updated_at": "...",
      "message_count": 2
    },
    "user_message": {
      "id": "msg-uuid",
      "role": "user",
      "content": "...",
      "created_at": "..."
    },
    "assistant_message": {
      "id": "msg-uuid-2",
      "role": "assistant",
      "content": "AI 回复",
      "created_at": "..."
    },
    "usage": {
      "prompt_tokens": 10,
      "completion_tokens": 50,
      "total_tokens": 60
    }
  }
}
```

**错误码**:
- `400` — 消息为空或过长
- `404` — 对话不存在

---

## 完整使用示例

### cURL

```bash
# 1. 健康检查
curl http://127.0.0.1:5000/api/health

# 2. 发送第一条消息（自动创建对话）
curl -X POST http://127.0.0.1:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好，请介绍一下Python", "persona":"programmer"}'

# 3. 继续对话（传入 conversation_id）
curl -X POST http://127.0.0.1:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversation_id":"xxx","message":"它有什么优势？"}'

# 4. 查看对话历史
curl http://127.0.0.1:5000/api/conversations/xxx
```

### JavaScript (Fetch)

```javascript
// 发送消息
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello',
    persona: 'assistant'
  })
});
const { data } = await response.json();
console.log('AI:', data.assistant_message.content);
```

### Python (requests)

```python
import requests

response = requests.post('http://127.0.0.1:5000/api/chat', json={
    'message': '你好',
    'persona': 'assistant'
})
data = response.json()['data']
print('AI:', data['assistant_message']['content'])
```

---

## AI Provider 配置

通过环境变量切换 AI Provider：

| AI_PROVIDER | 说明 | 所需配置 |
|-------------|------|---------|
| `mock` | 内置 Mock，无依赖 | 无 |
| `openai` | OpenAI 兼容协议 | `AI_API_KEY` |

```bash
# 使用 Mock（默认）
AI_PROVIDER=mock

# 使用 DeepSeek
AI_PROVIDER=openai
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-chat
AI_API_KEY=sk-xxxxx

# 使用 OpenAI
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com
AI_MODEL=gpt-3.5-turbo
AI_API_KEY=sk-xxxxx

# 使用智谱
AI_PROVIDER=openai
AI_BASE_URL=https://open.bigmodel.cn/api/paas
AI_MODEL=glm-4
AI_API_KEY=xxxxx
```

---

## 数据模型

### Conversation（对话）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string (uuid) | 主键 |
| `title` | string | 标题（自动截取首条消息） |
| `persona` | string | 角色 key |
| `model` | string | 使用的 AI 模型 |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 最后更新时间 |

### Message（消息）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string (uuid) | 主键 |
| `conversation_id` | string (uuid) | 外键 → conversations.id |
| `role` | enum | user / assistant / system |
| `content` | text | 消息内容（支持 Markdown） |
| `created_at` | datetime | 创建时间 |

---

## 错误处理

所有错误都返回 JSON 格式：

```json
{
  "code": 400,
  "message": "消息内容不能为空"
}
```

常见错误：
- `400` - 请求参数错误
- `404` - 资源不存在
- `500` - 服务器内部错误

---

## 性能与限制

- **消息长度**: ≤ 8000 字符
- **上下文窗口**: 最近 20 条消息
- **请求超时**: 60 秒（外部 AI）
- **并发**: Gunicorn 默认 4 worker

---

**最后更新**: 2025-07-10
