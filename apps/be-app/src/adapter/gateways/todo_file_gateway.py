import json
from pathlib import Path

from src.application.gateways.i_todo_gateway import ITodoGateway


class TodoFileGateway(ITodoGateway):
    """JSON ファイルから Todo 一覧を読み取る（同期 I/O）。"""

    def __init__(self, file_path: Path) -> None:
        self._file_path = file_path

    def list_todos(self) -> list[str]:
        with self._file_path.open(encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list) or not all(isinstance(x, str) for x in data):
            raise ValueError("todos data must be a JSON array of strings")
        return data
