"""
配置文件：从环境变量加载所有可配置项
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """基础配置"""

    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "ai-chat-dev-secret-change-in-prod")

    # 数据库（支持 PostgreSQL/SQLite）
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///chat.db"
    ).replace("postgres://", "postgresql://", 1)  # Render 兼容
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # AI 服务
    AI_PROVIDER = os.getenv("AI_PROVIDER", "mock").lower()
    AI_API_KEY = os.getenv("AI_API_KEY", "")
    AI_BASE_URL = os.getenv("AI_BASE_URL", "https://api.deepseek.com")
    AI_MODEL = os.getenv("AI_MODEL", "deepseek-chat")

    # CORS（支持多个来源）
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


def get_config():
    env = os.getenv("FLASK_ENV", "development").lower()
    return config_map.get(env, DevelopmentConfig)
