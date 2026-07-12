"""
Flask 应用工厂（兼容 Vercel serverless）
"""
import os
import sys

# 确保当前目录在 path 中
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS

from database import db
from routes.chat import chat_bp
from routes.conversations import conversations_bp
from routes.messages import messages_bp
from routes.system import system_bp


def create_app():
    """应用工厂函数"""
    app = Flask(__name__)
    
    # Vercel 环境用内存数据库
    db_url = os.getenv("DATABASE_URL", "sqlite:///:memory:")
    if not db_url.startswith("sqlite"):
        db_url = "sqlite:///:memory:"
    
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "vercel-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # 初始化数据库
    db.init_app(app)

    # 配置 CORS - 生产环境允许所有
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

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


# 模块级实例（Vercel Python runtime 会使用这个）
app = create_app()
