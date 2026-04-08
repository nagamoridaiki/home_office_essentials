from pydantic import BaseModel


class TodoListResponse(BaseModel):
    todos: list[str]
