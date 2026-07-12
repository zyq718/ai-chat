"""数据模型"""
from datetime import datetime
from .database import db


class Conversation(db.Model):
    """对话模型"""

    __tablename__ = "conversations"

    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(200), nullable=False, default="新对话")
    persona = db.Column(db.String(50), nullable=False, default="assistant")
    model = db.Column(db.String(100), nullable=False, default="mock-ai")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    messages = db.relationship(
        "Message",
        backref="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    def to_dict(self, include_messages=False):
        data = {
            "id": self.id,
            "title": self.title,
            "persona": self.persona,
            "model": self.model,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "message_count": len(self.messages),
        }
        if include_messages:
            data["messages"] = [m.to_dict() for m in self.messages]
        return data


class Message(db.Model):
    """消息模型"""

    __tablename__ = "messages"

    id = db.Column(db.String(36), primary_key=True)
    conversation_id = db.Column(
        db.String(36),
        db.ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role = db.Column(db.String(20), nullable=False)  # user / assistant / system
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "role": self.role,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
