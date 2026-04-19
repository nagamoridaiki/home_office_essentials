"""ドメイン層で使用するエラー定義

このモジュールでは、ドメイン層で使用される共通のエラークラスを定義します。
各エラークラスは、特定のエラー状況を表現し、適切なエラーメッセージを提供します。
"""

class DomainError(Exception):
    """ドメイン層で発生する一般的なエラーのベースクラス"""

    def __init__(self, error_code: str, message: str) -> None:
        """ドメイン層で発生する一般的なエラーのベースクラス

        Args:
            error_code: エラーを識別するコード
            message: エラーの詳細メッセージ
        """
        self.error_code = error_code
        self.message = message
        super().__init__(message)


class UnauthenticatedError(DomainError):
    def __init__(self, message: str = "Unauthenticated") -> None:
        super().__init__(error_code="unauthenticated", message=message)


class ForbiddenError(DomainError):
    def __init__(self, message: str = "Forbidden") -> None:
        super().__init__(error_code="forbidden", message=message)

class BadRequestError(DomainError):
    def __init__(self, message: str) -> None:
        super().__init__(error_code="bad_request", message=message)

class ConflictError(DomainError):
    def __init__(self, message: str) -> None:
        super().__init__(error_code="conflict", message=message)

class ValidationError(DomainError):
    def __init__(self, message: str) -> None:
        super().__init__(error_code="validation", message=message)