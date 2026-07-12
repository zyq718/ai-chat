"""
AI 服务层：支持多种 LLM Provider
- mock: 本地模拟（默认，无需 API Key）
- deepseek: DeepSeek 官方 API
- doubao: 字节跳动豆包（火山方舟）
- qwen: 阿里通义千问
- qclaw: QClaw 兼容端点
- openai: OpenAI 官方
- custom: 自定义 OpenAI 兼容端点

通过环境变量切换：
    AI_PROVIDER=deepseek
    AI_API_KEY=sk-xxx
    AI_MODEL=deepseek-chat
"""
import os
import re
import time
import uuid
import logging
from typing import List, Dict, Optional
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


PERSONAS = {
    "assistant": {
        "name": "通用助手",
        "system": (
            "你是一个友好、专业的 AI 助手。"
            "请用清晰准确的中文回答用户问题。"
            "回答时优先给出结论，再补充细节，必要时用代码或列表辅助说明。"
        ),
    },
    "programmer": {
        "name": "编程专家",
        "system": (
            "你是一位资深软件工程师，精通 Python、JavaScript/TypeScript、"
            "Go、Java、SQL 等多种语言，并熟悉 React、Next.js、Flask、"
            "FastAPI、Spring 等主流框架。\n"
            "回答编程问题时：\n"
            "1. 先给可运行代码，再做原理说明；\n"
            "2. 代码要包含必要注释；\n"
            "3. 主动指出常见坑点和最佳实践；\n"
            "4. 必要时给出多种实现方案的对比。"
        ),
    },
    "writer": {
        "name": "文案写手",
        "system": (
            "你是一位资深文案写手，擅长撰写营销文案、"
            "公众号文章、产品介绍、邮件模板等内容。"
            "你的回答应文笔流畅、富有感染力，"
            "能根据不同平台调性调整风格。"
        ),
    },
    "translator": {
        "name": "翻译官",
        "system": (
            "你是一位专业翻译，擅长中英日法韩等多语言互译。"
            "翻译时既保持原文含义，又符合目标语言习惯；"
            "回答时直接给出译文，并附上关键术语解释。"
        ),
    },
    "tutor": {
        "name": "学习导师",
        "system": (
            "你是一位耐心、善于启发学生的学习导师。"
            "面对学生问题时：\n"
            "1. 先用通俗类比解释概念；\n"
            "2. 通过例题帮助理解；\n"
            "3. 鼓励学生主动思考；\n"
            "4. 根据学生基础循序渐进地深入。"
        ),
    },
}


# ============ Provider 元数据 ============
@dataclass
class ProviderInfo:
    key: str
    name: str
    base_url: str
    default_model: str
    models: List[str] = field(default_factory=list)
    docs_url: str = ""
    note: str = ""


PROVIDERS: Dict[str, ProviderInfo] = {
    "mock": ProviderInfo(
        key="mock",
        name="Mock（本地模拟，无需 API Key）",
        base_url="",
        default_model="mock-ai-v1",
        models=["mock-ai-v1"],
        note="内置示例回复，仅用于演示",
    ),
    "deepseek": ProviderInfo(
        key="deepseek",
        name="DeepSeek（深度求索）",
        base_url="https://api.deepseek.com",
        default_model="deepseek-chat",
        models=["deepseek-chat", "deepseek-reasoner"],
        docs_url="https://platform.deepseek.com/",
        note="国产高性价比模型，长文本能力强",
    ),
    "doubao": ProviderInfo(
        key="doubao",
        name="豆包（字节跳动·火山方舟）",
        base_url="https://ark.cn-beijing.volces.com/api/v3",
        default_model="doubao-pro-32k",
        models=[
            "doubao-pro-32k",
            "doubao-pro-128k",
            "doubao-lite-32k",
            "doubao-1-5-pro-32k-250115",
        ],
        docs_url="https://www.volcengine.com/product/doubao",
        note="字节跳动豆包大模型，需先在火山方舟开通",
    ),
    "qwen": ProviderInfo(
        key="qwen",
        name="通义千问（阿里·DashScope）",
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        default_model="qwen-plus",
        models=["qwen-turbo", "qwen-plus", "qwen-max", "qwen-long"],
        docs_url="https://dashscope.aliyun.com/",
        note="阿里云通义千问，OpenAI 兼容模式",
    ),
    "qclaw": ProviderInfo(
        key="qclaw",
        name="QClaw（OpenAI 兼容端点）",
        base_url=os.getenv("QCLAW_BASE_URL", "https://api.qclaw.ai/v1"),
        default_model=os.getenv("QCLAW_MODEL", "qclaw-pro"),
        models=[
            os.getenv("QCLAW_MODEL", "qclaw-pro"),
            "qclaw-mini",
            "qclaw-vision",
        ],
        docs_url="https://docs.qclaw.ai",
        note="QClaw 提供的 OpenAI 兼容端点（需自行配置 base_url）",
    ),
    "openai": ProviderInfo(
        key="openai",
        name="OpenAI（官方）",
        base_url="https://api.openai.com",
        default_model="gpt-4o-mini",
        models=["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
        docs_url="https://platform.openai.com/",
        note="OpenAI 官方 API（需海外网络）",
    ),
    "custom": ProviderInfo(
        key="custom",
        name="自定义（OpenAI 兼容协议）",
        base_url=os.getenv("CUSTOM_BASE_URL", ""),
        default_model=os.getenv("CUSTOM_MODEL", "gpt-3.5-turbo"),
        models=[os.getenv("CUSTOM_MODEL", "gpt-3.5-turbo")],
        docs_url="",
        note="任何 OpenAI 兼容协议的服务（如本地 Ollama、vLLM、FastChat）",
    ),
}


class AIService:
    """AI 服务抽象基类"""

    provider: str = "base"

    def chat(
        self,
        messages: List[Dict[str, str]],
        persona: str = "assistant",
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> Dict:
        raise NotImplementedError

    @staticmethod
    def list_personas() -> List[Dict]:
        return [{"key": k, "name": v["name"]} for k, v in PERSONAS.items()]

    @staticmethod
    def list_providers() -> List[Dict]:
        return [
            {
                "key": p.key,
                "name": p.name,
                "base_url": p.base_url,
                "default_model": p.default_model,
                "models": p.models,
                "docs_url": p.docs_url,
                "note": p.note,
            }
            for p in PROVIDERS.values()
        ]


class MockAIService(AIService):
    """本地模拟 AI：基于关键词的简单路由（无需 API Key）"""

    provider = "mock"

    def chat(self, messages, persona="assistant", model=None, **kwargs):
        user_msg = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                user_msg = m.get("content", "").strip()
                break
        return {
            "content": self._reply(user_msg, persona),
            "model": "mock-ai-v1",
            "usage": {"prompt_tokens": len(user_msg) // 2,
                      "completion_tokens": 100, "total_tokens": 100},
        }

    def _reply(self, user_msg: str, persona: str) -> str:
        greetings = ["你好！", "hi", "hello", "在吗"]
        if any(g in user_msg.lower() for g in greetings):
            return f"你好！我是「{PERSONAS.get(persona, PERSONAS['assistant'])['name']}」。当前使用 **Mock 模式**，请点击右上角设置按钮配置真实大模型 API Key。"
        return (
            f"**当前为 Mock 模式**\n\n"
            f"你发送了：{user_msg}\n\n"
            f"要让 AI 真正理解你的问题并智能回答，请：\n"
            f"1. 点击右上角「设置」按钮\n"
            f"2. 选择大模型 Provider（DeepSeek / 豆包 / 通义千问 / QClaw 等）\n"
            f"3. 填入 API Key\n"
            f"4. 保存后即可使用真实大模型对话"
        )


class OpenAICompatibleService(AIService):
    """
    OpenAI 兼容协议服务
    适用于：OpenAI / DeepSeek / 豆包(火山方舟) / 通义千问(DashScope) /
            QClaw / Ollama / vLLM / 任何 OpenAI 兼容端点
    """

    provider = "openai"

    def __init__(
        self,
        api_key: str = None,
        base_url: str = None,
        model: str = None,
    ):
        self.api_key = api_key or os.getenv("AI_API_KEY", "")
        self.base_url = (
            base_url
            or os.getenv("AI_BASE_URL")
            or PROVIDERS[os.getenv("AI_PROVIDER", "deepseek")].base_url
        ).rstrip("/")
        self.model = model or os.getenv("AI_MODEL") or PROVIDERS[
            os.getenv("AI_PROVIDER", "deepseek")
        ].default_model

    def chat(self, messages, persona="assistant", model=None, **kwargs):
        try:
            import requests
        except ImportError:
            return {"content": "❌ 缺少 requests 依赖", "model": self.model, "error": True}

        if not self.api_key:
            return {
                "content": (
                    "❌ **未配置 API Key**\n\n"
                    "请按以下步骤配置：\n"
                    "1. 在 `.env` 中设置 `AI_PROVIDER` / `AI_API_KEY` / `AI_MODEL`\n"
                    "2. 或在 Web 界面「设置」中填入\n"
                    "3. 重启后端服务"
                ),
                "model": self.model,
                "error": True,
            }

        # 拼装 system prompt + 对话历史
        system_prompt = PERSONAS.get(persona, PERSONAS["assistant"])["system"]
        full_messages = [{"role": "system", "content": system_prompt}] + [
            {"role": m["role"], "content": m["content"]}
            for m in messages
            if m.get("role") in ("user", "assistant")
        ]

        url = f"{self.base_url}/chat/completions"
        payload = {
            "model": model or self.model,
            "messages": full_messages,
            "temperature": kwargs.get("temperature", 0.7),
            "max_tokens": kwargs.get("max_tokens", 2048),
            "stream": False,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        # 豆包/部分服务使用 header 鉴权而非 Bearer
        if self.api_key and not self.api_key.startswith("sk-") and "volces" in self.base_url:
            headers["Authorization"] = f"Bearer {self.api_key}"

        try:
            t0 = time.time()
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            elapsed = time.time() - t0
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            return {
                "content": content,
                "model": data.get("model", self.model),
                "usage": data.get("usage", {}),
                "elapsed_s": round(elapsed, 2),
            }
        except requests.exceptions.Timeout:
            return {
                "content": f"❌ 请求超时（60s）\n\n请检查网络或换用其他模型。Provider: `{self.provider}`",
                "model": self.model,
                "error": True,
            }
        except requests.exceptions.HTTPError as e:
            err_body = ""
            try:
                err_body = e.response.text[:500]
            except Exception:
                pass
            return {
                "content": (
                    f"❌ **API 调用失败**\n\n"
                    f"- HTTP {e.response.status_code}\n"
                    f"- Provider: `{self.provider}`\n"
                    f"- Model: `{self.model}`\n"
                    f"- URL: `{url}`\n\n"
                    f"**错误详情**：\n```\n{err_body}\n```\n\n"
                    f"**排查建议**：\n"
                    f"1. 检查 API Key 是否正确\n"
                    f"2. 确认模型名称（部分服务需要先在控制台开通模型）\n"
                    f"3. 检查账户余额/配额"
                ),
                "model": self.model,
                "error": True,
            }
        except Exception as e:
            logger.exception("AI service error")
            return {
                "content": f"❌ 未预期错误：`{type(e).__name__}: {e}`",
                "model": self.model,
                "error": True,
            }


def get_ai_service(
    provider: str = None,
    api_key: str = None,
    base_url: str = None,
    model: str = None,
) -> AIService:
    """
    根据 provider 返回对应 AI 服务实例
    - provider=mock: 返回 MockAIService
    - 其他: 返回 OpenAICompatibleService
    """
    provider = (provider or os.getenv("AI_PROVIDER", "mock")).lower()

    if provider == "mock":
        return MockAIService()
    return OpenAICompatibleService(
        api_key=api_key,
        base_url=base_url,
        model=model,
    )
