from typing import Protocol


class ITodoGateway(Protocol):
    def list_todos(self) -> list[str]:
        """永続化された Todo 一覧を返す。"""
