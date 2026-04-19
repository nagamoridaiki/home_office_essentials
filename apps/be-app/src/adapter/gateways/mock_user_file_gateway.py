import json
from pathlib import Path

from src.application.gateways.i_user_gateway import IUserGateway
from src.enterprise.entities.user import User


class MockUserFileGateway(IUserGateway):
    """ローカル開発用: JSON の external_user_id と Bearer トークンを突き合わせる。"""

    def __init__(self, file_path: Path) -> None:
        self._file_path = file_path

    async def find_by_user_id(self, user_id: str) -> User | None:
        if not self._file_path.is_file():
            return None
        with self._file_path.open(encoding="utf-8") as f:
            users_data = json.load(f)
        if not isinstance(users_data, list):
            raise ValueError("mock users data must be a JSON array")
        for user_entry in users_data:
            if not isinstance(user_entry, dict):
                continue
            external_user_id = user_entry.get("external_user_id")
            if external_user_id != user_id:
                continue
            uid = user_entry.get("id")
            email = user_entry.get("email")
            if not isinstance(uid, str) or not isinstance(email, str):
                raise ValueError("mock user entry requires string id and email")
            return User(id=uid, email=email)
        return None
   