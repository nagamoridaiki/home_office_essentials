"""ユーザーエンティティ"""

from dataclasses import dataclass


@dataclass(frozen=True)
class User:
    """モック認証で解決されるユーザー。"""

    id: str
    email: str
