"""娑堟伅璺敱"""
from flask import Blueprint, request, jsonify
from sqlalchemy import asc

from database import db
from models import Conversation, Message

messages_bp = Blueprint("messages", __name__)


@messages_bp.get("/<conv_id>")
def list_messages(conv_id):
    """鑾峰彇鏌愬璇濈殑鎵€鏈夋秷鎭?""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "瀵硅瘽涓嶅瓨鍦?}), 404

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
    """鍒犻櫎鍗曟潯娑堟伅"""
    msg = Message.query.get(message_id)
    if not msg:
        return jsonify({"code": 404, "message": "娑堟伅涓嶅瓨鍦?}), 404
    db.session.delete(msg)
    db.session.commit()
    return jsonify({"code": 0, "message": "宸插垹闄?})


@messages_bp.post("/<conv_id>/clear")
def clear_messages(conv_id):
    """娓呯┖鏌愪釜瀵硅瘽鐨勬墍鏈夋秷鎭?""
    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"code": 404, "message": "瀵硅瘽涓嶅瓨鍦?}), 404

    Message.query.filter_by(conversation_id=conv_id).delete()
    db.session.commit()
    return jsonify({"code": 0, "message": "宸叉竻绌?})

