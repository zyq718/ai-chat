"""鑱婂ぉ鏍稿績璺敱"""
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app

from database import db
from models import Conversation, Message
from services import get_ai_service, PERSONAS

chat_bp = Blueprint("chat", __name__)


@chat_bp.post("")
def chat():
    """
    鍙戦€佷竴鏉℃秷鎭苟鑾峰彇 AI 鍥炲
    Body:
    {
        "conversation_id": "uuid (optional, 涓嶄紶鍒欒嚜鍔ㄥ垱寤?",
        "message": "user message",
        "persona": "assistant"
    }
    """
    data = request.get_json(silent=True) or {}
    user_msg = (data.get("message") or "").strip()
    if not user_msg:
        return jsonify({"code": 400, "message": "娑堟伅鍐呭涓嶈兘涓虹┖"}), 400
    if len(user_msg) > 8000:
        return jsonify({"code": 400, "message": "娑堟伅杩囬暱锛?8000 瀛楃锛?}), 400

    # 鎵惧埌鎴栧垱寤哄璇?    conv_id = data.get("conversation_id")
    conv = None
    if conv_id:
        conv = Conversation.query.get(conv_id)
        if not conv:
            return jsonify({"code": 404, "message": "瀵硅瘽涓嶅瓨鍦?}), 404

    persona = data.get("persona") or (conv.persona if conv else "assistant")
    if persona not in PERSONAS:
        persona = "assistant"

    if not conv:
        # 鑷姩鍒涘缓瀵硅瘽锛屾爣棰樺彇娑堟伅鍓?30 瀛?        title = user_msg[:30] + ("..." if len(user_msg) > 30 else "")
        conv = Conversation(
            id=str(uuid.uuid4()),
            title=title,
            persona=persona,
            model=current_app.config.get("AI_MODEL", "mock-ai"),
        )
        db.session.add(conv)
        db.session.flush()

    # 鏋勯€犱笂涓嬫枃锛堟渶杩?20 鏉℃秷鎭紝閬垮厤 token 鐖嗙偢锛?    history = (
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

    # 鍐欏叆鐢ㄦ埛娑堟伅
    user_message = Message(
        id=str(uuid.uuid4()),
        conversation_id=conv.id,
        role="user",
        content=user_msg,
    )
    db.session.add(user_message)

    # 璋冪敤 AI锛堟敮鎸佸墠绔姩鎬佽鐩?provider/api_key/model锛?    from services.ai_service import get_ai_service as _make_ai
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

    # 鍐欏叆 AI 娑堟伅
    assistant_message = Message(
        id=str(uuid.uuid4()),
        conversation_id=conv.id,
        role="assistant",
        content=result.get("content", ""),
    )
    db.session.add(assistant_message)

    # 鏇存柊瀵硅瘽鏃堕棿
    conv.updated_at = datetime.utcnow()
    # 绗竴娆″璇濆悗鑷姩鏀规爣棰?    if conv.title == "鏂板璇? and history == []:
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
    绠€鍖栫増娴佸紡鎺ュ彛鍗犱綅锛堣繑鍥為潪娴佸紡缁撴灉锛?    鐪熸娴佸紡闇€瑕?SSE / WebSocket锛屾澶勪负鍏煎璁捐
    """
    return chat()

