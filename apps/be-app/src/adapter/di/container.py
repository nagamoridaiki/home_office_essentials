"""依存の組み立て（DI）。

設定（パスなど）はConfigurationの穴にmainから流し込み、
Gatewaysで「外の世界」、UseCasesでアプリの手続きを生成する。
"""

from dependency_injector import containers, providers

from src.adapter.gateways.mock_user_file_gateway import MockUserFileGateway
from src.adapter.gateways.todo_file_gateway import TodoFileGateway
from src.application.usecases.auth import MockAuthUseCase
from src.application.usecases.todo.list_todos import ListTodosUseCase


class Gateways(containers.DeclarativeContainer):
    # main.pyで定義したSettings(config.py)を取得
    config = providers.Configuration()

    todo = providers.Factory(
        TodoFileGateway,
        # main.pyで定義した_container.config.from_dictでtodo_data_pathを注入している
        file_path=config.todo_data_path,
    )

    # IUserGatewayの実装：mock_users_pathのJSONをexternal_user_idで引く（アプリで1つでよいのでSingleton）
    user = providers.Singleton(
        MockUserFileGateway,
        file_path=config.mock_users_path,
    )


class UseCases(containers.DeclarativeContainer):
    # 親Containerから渡されるGatewaysコンテナ（todo/userなど）
    gateways = providers.DependenciesContainer()

    # 認証ユースケースにIUserGatewayを外から渡す（newせずコンテナが依存を解決する）
    auth = providers.Singleton(
        MockAuthUseCase,
        user_entity_gateway=gateways.user,
    )

    list_todos = providers.Factory(
        ListTodosUseCase,
        todo_gateway=gateways.todo,
    )


class Container(containers.DeclarativeContainer):
    # main.pyで定義したSettings(config.py)を取得
    config = providers.Configuration()

    gateways = providers.Container(
        Gateways,
        config=config.gateways,
    )

    usecases = providers.Container(
        UseCases,
        gateways=gateways,
    )
