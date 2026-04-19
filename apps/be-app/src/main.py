from dependency_injector.wiring import Provide, inject
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware

from src.adapter.di.container import Container
from src.adapter.web.fastapi import create_app
from src.adapter.web.middleware.auth import require_role
from src.adapter.web.routers import private_router, public_router
from src.adapter.web.schemas.todo import TodoListResponse
from src.adapter.web.schemas.user import MeResponse
from src.application.usecases.todo.list_todos import ListTodosUseCase
from src.common.context import PrincipalContext
from src.common.roles import Role
from src.config import get_settings

# 【設定とDIの流れ】mock_users_pathを例に（Mermaidのflowchartと同じつながり）
#
#   config.py
#     .env/環境変数 ──→ pydantic-settingsがSettingsへ反映
#     get_settings() ──→ 確定したSettingsインスタンスを返す
#
#   main.py（このファイル）
#     settings=get_settings() ──→ 上記のSettingsを取得
#     _container.config.from_dict({gateways:{mock_users_path:...}}) ──→ DIのGateways用Configurationへ注入
#     _container.usecases.auth() ──→ ゲートウェイ注入済みのMockAuthUseCaseを取得（下でapp.stateへ）
#
#   container.py
#     Gateways.user ──→ MockUserFileGateway(file_path=config.mock_users_path)
#     （認証時にそのパスのmock_users.jsonを開く）
#
#   get_settings() ──→ settings ──→ from_dict ──→ Gateways.user ──→ MockUserFileGateway
settings = get_settings()

app = create_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Depends(Provide[usecases.list_todos])などで参照するためのエイリアス（コンテナのusecasesブロック）
usecases = Container.usecases


@public_router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@private_router.get("/me", response_model=MeResponse)
async def get_me() -> MeResponse:
    """ログイン中のユーザー情報を返す。"""
    principal = PrincipalContext.get()
    return MeResponse(
        id=principal.user_id,
        email=principal.email,
        role=principal.roles[0].value if principal.roles else None,
    )


@private_router.get("/todos", response_model=TodoListResponse)
@require_role(list(Role))
@inject
async def get_todo_list(
    list_todos_use_case: ListTodosUseCase = Depends(Provide[usecases.list_todos]),
) -> TodoListResponse:
    todos = list_todos_use_case.execute()
    return TodoListResponse(todos=todos)


# container.pyのGatewaysが持つConfigurationの穴を埋める
_container = Container()
# Containerのconfig.gatewaysに対応
_container.config.from_dict(
    {
        "gateways": {
            "todo_data_path": settings.todo_data_path,
            "mock_users_path": settings.mock_users_path,
        },
    }
)
# このモジュール（main.py）内の Depends(Provide[usecases.list_todos])のようなwiringを有効にするためのdependency-injectorの手続き
# このモジュールの中にある @inject と Provide[...] を、さきほど作ったコンテナとつなぐ。
_container.wire(modules=[__name__])

# 認証ユースケースを1つ用意してアプリ全体(app.state)で共有する。
# MockAuthUseCaseは内部でユーザーを探すゲートウェイが必要なので、container.pyで定義したusecases.auth()でゲートウェイまで差し込んだインスタンスを返す。
# 下の代入でFastAPIのapp.stateに載せ、routers.pyのauth_dependencyがrequest.app.stateから同じものを取って使う。
app.state.auth_usecase = _container.usecases.auth()

app.include_router(public_router)
app.include_router(private_router)
