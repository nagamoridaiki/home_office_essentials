"""コンテキスト管理"""

from contextvars import ContextVar, Token
from dataclasses import dataclass
from typing import Generic, Optional, TypeVar

from src.common.roles import Role

T = TypeVar("T")


class _ContextManager(Generic[T]):
    def __init__(self, name: str) -> None:
        self._ctx: ContextVar[Optional[T]] = ContextVar(name, default=None)

    def get(self) -> Optional[T]:
        return self._ctx.get()

    def set(self, value: T) -> Token[T]:
        return self._ctx.set(value)

    def reset(self, token: Token[T]) -> None:
        self._ctx.reset(token)


@dataclass
class Principal:
    """リクエストのセッション情報"""

    user_id: str
    email: str
    roles: list[Role]


PrincipalContext = _ContextManager[Principal]("principal_context")
