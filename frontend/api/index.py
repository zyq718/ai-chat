"""
Vercel Python Serverless Function - Flask App 入口
自动被 Vercel 识别为 WSGI 应用
"""
import sys
import os

# 确保模块路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from __init__ import app

# Vercel Python runtime 使用 `app` 作为 WSGI handler
