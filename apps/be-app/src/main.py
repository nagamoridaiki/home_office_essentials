from dependency_injector.wiring import Provide, inject
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.adapter.di.container import Container
from src.adapter.web.schemas.todo import TodoListResponse
from src.application.usecases.todo.list_todos import ListTodosUseCase
from src.config import get_settings

settings = get_settings()

app = FastAPI(debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

usecases = Container.usecases


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/todos", response_model=TodoListResponse)
@inject
def get_todo_list(
    list_todos_use_case: ListTodosUseCase = Depends(Provide[usecases.list_todos]),
) -> TodoListResponse:
    todos = list_todos_use_case.execute()
    return TodoListResponse(todos=todos)


_container = Container()
_container.config.from_dict(
    {
        "gateways": {
            "todo_data_path": settings.todo_data_path,
        },
    }
)
_container.wire(modules=[__name__])
