"""系统相关路由：健康检查、AI 配置"""
import os
from flask import Blueprint, request, jsonify, current_app

from ..services import get_ai_service, PROVIDERS, PERSONAS
from ..services.ai_service import (
    OpenAICompatibleService,
    MockAIService,
    get_ai_service as _get_ai_service,
)

system_bp = Blueprint("system", __name__)


@system_bp.get("/health")
def health():
    """健康检查"""
    return jsonify({
        "code": 0,
        "data": {
            "service": "ai-chat-backend",
            "status": "ok",
            "version": "1.0.0",
        }
    })


@system_bp.get("/providers")
def list_providers():
    """列出所有可用的 AI Provider"""
    from ..services.ai_service import PROVIDERS, PERSONAS

    providers = []
    for p in PROVIDERS.values():
        item = {
            "key": p.key,
            "name": p.name,
            "base_url": p.base_url,
            "default_model": p.default_model,
            "models": p.models,
            "docs_url": p.docs_url,
            "note": p.note,
        }
        providers.append(item)

    return jsonify({
        "code": 0,
        "data": {
            "providers": providers,
            "personas": [
                {"key": k, "name": v["name"]} for k, v in PERSONAS.items()
            ],
            "current": {
                "provider": os.getenv("AI_PROVIDER", "mock"),
                "model": os.getenv("AI_MODEL", "mock-ai-v1"),
                "has_api_key": bool(os.getenv("AI_API_KEY")),
            }
        }
    })


@system_bp.post("/test-ai")
def test_ai():
    """测试 AI 连接（不入库）"""
    data = request.get_json(silent=True) or {}
    provider = data.get("provider", os.getenv("AI_PROVIDER", "mock"))
    api_key = data.get("api_key", os.getenv("AI_API_KEY", ""))
    base_url = data.get("base_url", os.getenv("AI_BASE_URL", ""))
    model = data.get("model", os.getenv("AI_MODEL", ""))

    test_messages = [{"role": "user", "content": "你好，请用一句话介绍你自己。"}]

    if provider == "mock":
        svc = MockAIService()
    else:
        svc = OpenAICompatibleService(
            api_key=api_key or None,
            base_url=base_url or None,
            model=model or None,
        )

    result = svc.chat(test_messages, persona="assistant")
    return jsonify({
        "code": 0 if not result.get("error") else 1,
        "data": result,
    })
