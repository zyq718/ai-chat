"""消息路由"""
from flask import Blueprint, request, jsonify
from sqlalchemy import asc

from ..database import db
from ..models import Conversation, Message

messages_bp = Blueprint("messages", __name__)


@messages_bp.get("/<conv_id>")
def list_messages(conv_id):
    """获取某对话的所有消息"""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "对话不存在"}), 404

    msgs = (
        Message.query
        .filter_by(conversation_id=conv_id)
        .order_by(asc(Message.created_at))
        .all()
    )
    return jsonify({
        "code": 0,
        "data": [m.to_dict() for m in msgs]
    })


@messages_bp.delete("/<message_id>")
def delete_message(message_id):
    """删除单条消息"""
    msg = Message.query.get(message_id)
    if not msg:
        return jsonify({"code": 404, "message": "消息不存在"}), 404
    db.session.delete(msg)
    db.session.commit()
    return jsonify({"code": 0, "message": "已删除"})


@messages_bp.post("/<conv_id>/clear")
def clear_messages(conv_id):
    """清空某个对话的所有消息"""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "对话不存在"}), 404

    Message.query.filter_by(conversation_id=conv_id).delete()
    db.session.commit()
    return jsonify({"code": 0, "message": "已清空"})
