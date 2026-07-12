"""对话管理路由"""
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify

from ..database import db
from ..models import Conversation, Message

conversations_bp = Blueprint("conversations", __name__)


@conversations_bp.get("")
def list_conversations():
    """获取所有对话（按更新时间倒序）"""
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
    """新建对话"""
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "新对话").strip()[:200]
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
    """获取单个对话（含消息）"""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "对话不存在"}), 404
    return jsonify({
        "code": 0,
        "data": conv.to_dict(include_messages=True)
    })


@conversations_bp.patch("/<conv_id>")
def update_conversation(conv_id):
    """更新对话（标题 / persona）"""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "对话不存在"}), 404

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
    """删除对话"""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "对话不存在"}), 404
    db.session.delete(conv)
    db.session.commit()
    return jsonify({"code": 0, "message": "已删除"})
