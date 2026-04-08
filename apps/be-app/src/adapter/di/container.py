from dependency_injector import containers, providers

from src.adapter.gateways.todo_file_gateway import TodoFileGateway
from src.application.usecases.todo.list_todos import ListTodosUseCase


class Gateways(containers.DeclarativeContainer):
    config = providers.Configuration()

    todo = providers.Factory(
        TodoFileGateway,
        file_path=config.todo_data_path,
    )


class UseCases(containers.DeclarativeContainer):
    gateways = providers.DependenciesContainer()

    list_todos = providers.Factory(
        ListTodosUseCase,
        todo_gateway=gateways.todo,
    )


class Container(containers.DeclarativeContainer):
    config = providers.Configuration()

    gateways = providers.Container(
        Gateways,
        config=config.gateways,
    )

    usecases = providers.Container(
        UseCases,
        gateways=gateways,
    )
