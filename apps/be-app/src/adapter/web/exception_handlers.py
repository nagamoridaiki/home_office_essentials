"""FastAPI アプリケーションの例外ハンドラ登録"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.adapter.web.error_mapping import map_error_to_response


def register_exception_handlers(app: FastAPI) -> None:
    """ドメインエラー等を JSON レスポンスに変換するハンドラを登録する。"""

    @app.exception_handler(Exception)
    async def handle_exceptions(_request: Request, exc: Exception) -> JSONResponse:
        status_code, error_response = map_error_to_response(exc)
        return JSONResponse(
            status_code=status_code,
            content=error_response.model_dump(),
        )
