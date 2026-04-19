"""ユーザー永続化のポート"""

from abc import ABC, abstractmethod

from src.enterprise.entities.user import User


class IUserGateway(ABC):
    """Bearer トークン値（外部ユーザーID）でユーザーを検索する。"""

    @abstractmethod
    async def find_by_user_id(self, user_id: str) -> User | None:
        pass
