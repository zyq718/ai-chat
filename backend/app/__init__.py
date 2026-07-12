"""
Flask 应用工厂
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import get_config
from .database import db
from .routes.chat import chat_bp
from .routes.conversations import conversations_bp
from .routes.messages import messages_bp
from .routes.system import system_bp


def create_app():
    """应用工厂函数"""
    app = Flask(__name__)
    app.config.from_object(get_config())

    # 初始化数据库
    db.init_app(app)

    # 配置 CORS
    origins = app.config.get("CORS_ORIGINS", [])
    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)

    # 注册蓝图
    app.register_blueprint(system_bp, url_prefix="/api")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(conversations_bp, url_prefix="/api/conversations")
    app.register_blueprint(messages_bp, url_prefix="/api/messages")

    # 错误处理
    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"code": 404, "message": "Not Found"}), 404

    @app.errorhandler(500)
    def server_error(_e):
        return jsonify({"code": 500, "message": "Internal Server Error"}), 500

    # 初始化数据库表
    with app.app_context():
        db.create_all()

    return app
