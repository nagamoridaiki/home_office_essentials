"""ドメインエラーと HTTP レスポンスのマッピング"""

from pydantic import BaseModel
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
)

from src.common.errors import (
    BadRequestError,
    ConflictError,
    DomainError,
    ForbiddenError,
    UnauthenticatedError,
    ValidationError,
)


class ErrorResponse(BaseModel):
    """エラーレスポンスのスキーマ"""

    error_code: str
    message: str


def map_error_to_response(error: Exception) -> tuple[int, ErrorResponse]:
    """エラーを対応するステータスコードとエラーレスポンスに変換する。

    Args:
        error: 変換対象のエラー

    Returns:
        ステータスコードとエラーレスポンスのタプル
    """
    if isinstance(error, BadRequestError):
        return (
            HTTP_400_BAD_REQUEST,
            ErrorResponse(error_code=error.error_code, message=error.message),
        )
    if isinstance(error, ValidationError):
        return (
            HTTP_400_BAD_REQUEST,
            ErrorResponse(error_code=error.error_code, message=error.message),
        )
    if isinstance(error, UnauthenticatedError):
        return (
            HTTP_401_UNAUTHORIZED,
            ErrorResponse(error_code=error.error_code, message=error.message),
        )
    if isinstance(error, ForbiddenError):
        return (
            HTTP_403_FORBIDDEN,
            ErrorResponse(error_code=error.error_code, message=error.message),
        )
    if isinstance(error, ConflictError):
        return (
            HTTP_409_CONFLICT,
            ErrorResponse(error_code=error.error_code, message=error.message),
        )
    if isinstance(error, DomainError):
        return (
            HTTP_500_INTERNAL_SERVER_ERROR,
            ErrorResponse(error_code=error.error_code, message=error.message),
        )
    return (
        HTTP_500_INTERNAL_SERVER_ERROR,
        ErrorResponse(
            error_code="internal_server_error",
            message="Internal server error occurred",
        ),
    )
    