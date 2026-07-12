"""
开发环境启动入口
生产环境使用: gunicorn -w 4 -b 0.0.0.0:5000 'run:app'
"""
import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(host=host, port=port, debug=debug)
