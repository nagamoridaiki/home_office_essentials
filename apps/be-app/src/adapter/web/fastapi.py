"""FastAPI アプリケーションの初期化"""

from fastapi import FastAPI

from src.adapter.web.exception_handlers import register_exception_handlers
from src.config import get_settings


def create_app() -> FastAPI:
    """FastAPI アプリケーションを生成し、例外ハンドラ等を登録する。"""
    settings = get_settings()
    app = FastAPI(debug=settings.debug)
    register_exception_handlers(app)
    return app
