from src.application.gateways.i_todo_gateway import ITodoGateway


class ListTodosUseCase:
    def __init__(self, todo_gateway: ITodoGateway) -> None:
        self._todo_gateway = todo_gateway

    def execute(self) -> list[str]:
        return self._todo_gateway.list_todos()
