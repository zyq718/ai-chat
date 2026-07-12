"""瀵硅瘽绠＄悊璺敱"""
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify

from database import db
from models import Conversation, Message

conversations_bp = Blueprint("conversations", __name__)


@conversations_bp.get("")
def list_conversations():
    """鑾峰彇鎵€鏈夊璇濓紙鎸夋洿鏂版椂闂村€掑簭锛?""
    keyword = request.args.get("keyword", "").strip()
    query = Conversation.query
    if keyword:
        query = query.filter(Conversation.title.contains(keyword))
    items = query.order_by(Conversation.updated_at.desc()).all()
    return jsonify({
        "code": 0,
        "data": [c.to_dict() for c in items]
    })


@conversations_bp.post("")
def create_conversation():
    """鏂板缓瀵硅瘽"""
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "鏂板璇?).strip()[:200]
    persona = data.get("persona") or "assistant"
    model = data.get("model") or "mock-ai"

    conv = Conversation(
        id=str(uuid.uuid4()),
        title=title,
        persona=persona,
        model=model,
    )
    db.session.add(conv)
    db.session.commit()
    return jsonify({
        "code": 0,
        "data": conv.to_dict()
    })


@conversations_bp.get("/<conv_id>")
def get_conversation(conv_id):
    """鑾峰彇鍗曚釜瀵硅瘽锛堝惈娑堟伅锛?""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "瀵硅瘽涓嶅瓨鍦?}), 404
    return jsonify({
        "code": 0,
        "data": conv.to_dict(include_messages=True)
    })


@conversations_bp.patch("/<conv_id>")
def update_conversation(conv_id):
    """鏇存柊瀵硅瘽锛堟爣棰?/ persona锛?""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "瀵硅瘽涓嶅瓨鍦?}), 404

    data = request.get_json(silent=True) or {}
    if "title" in data:
        conv.title = data["title"].strip()[:200] or conv.title
    if "persona" in data:
        conv.persona = data["persona"]
    conv.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({
        "code": 0,
        "data": conv.to_dict()
    })


@conversations_bp.delete("/<conv_id>")
def delete_conversation(conv_id):
    """鍒犻櫎瀵硅瘽"""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "瀵硅瘽涓嶅瓨鍦?}), 404
    db.session.delete(conv)
    db.session.commit()
    return jsonify({"code": 0, "message": "宸插垹闄?})

