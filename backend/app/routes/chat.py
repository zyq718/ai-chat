"""聊天核心路由"""
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app

from ..database import db
from ..models import Conversation, Message
from ..services import get_ai_service, PERSONAS

chat_bp = Blueprint("chat", __name__)


@chat_bp.post("")
def chat():
    """
    发送一条消息并获取 AI 回复
    Body:
    {
        "conversation_id": "uuid (optional, 不传则自动创建)",
        "message": "user message",
        "persona": "assistant"
    }
    """
    data = request.get_json(silent=True) or {}
    user_msg = (data.get("message") or "").strip()
    if not user_msg:
        return jsonify({"code": 400, "message": "消息内容不能为空"}), 400
    if len(user_msg) > 8000:
        return jsonify({"code": 400, "message": "消息过长（>8000 字符）"}), 400

    # 找到或创建对话
    conv_id = data.get("conversation_id")
    conv = None
    if conv_id:
        conv = Conversation.query.get(conv_id)
        if not conv:
            return jsonify({"code": 404, "message": "对话不存在"}), 404

    persona = data.get("persona") or (conv.persona if conv else "assistant")
    if persona not in PERSONAS:
        persona = "assistant"

    if not conv:
        # 自动创建对话，标题取消息前 30 字
        title = user_msg[:30] + ("..." if len(user_msg) > 30 else "")
        conv = Conversation(
            id=str(uuid.uuid4()),
            title=title,
            persona=persona,
            model=current_app.config.get("AI_MODEL", "mock-ai"),
        )
        db.session.add(conv)
        db.session.flush()

    # 构造上下文（最近 20 条消息，避免 token 爆炸）
    history = (
        Message.query
        .filter_by(conversation_id=conv.id)
        .order_by(Message.created_at)
        .all()
    )
    history = history[-20:]

    messages_payload = [
        {"role": m.role, "content": m.content}
        for m in history if m.role in ("user", "assistant")
    ]
    messages_payload.append({"role": "user", "content": user_msg})

    # 写入用户消息
    user_message = Message(
        id=str(uuid.uuid4()),
        conversation_id=conv.id,
        role="user",
        content=user_msg,
    )
    db.session.add(user_message)

    # 调用 AI（支持前端动态覆盖 provider/api_key/model）
    from ..services.ai_service import get_ai_service as _make_ai
    ai = _make_ai(
        provider=data.get("provider"),
        api_key=data.get("api_key"),
        base_url=data.get("base_url"),
        model=data.get("model"),
    )
    result = ai.chat(
        messages=messages_payload,
        persona=persona,
        model=data.get("model") or conv.model,
        temperature=float(data.get("temperature", 0.7)),
    )

    # 写入 AI 消息
    assistant_message = Message(
        id=str(uuid.uuid4()),
        conversation_id=conv.id,
        role="assistant",
        content=result.get("content", ""),
    )
    db.session.add(assistant_message)

    # 更新对话时间
    conv.updated_at = datetime.utcnow()
    # 第一次对话后自动改标题
    if conv.title == "新对话" and history == []:
        conv.title = user_msg[:30] + ("..." if len(user_msg) > 30 else "")

    db.session.commit()

    return jsonify({
        "code": 0,
        "data": {
            "conversation": conv.to_dict(),
            "user_message": user_message.to_dict(),
            "assistant_message": assistant_message.to_dict(),
            "usage": result.get("usage", {}),
        }
    })


@chat_bp.post("/stream")
def stream_chat():
    """
    简化版流式接口占位（返回非流式结果）
    真正流式需要 SSE / WebSocket，此处为兼容设计
    """
    return chat()
