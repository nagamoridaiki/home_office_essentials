"""FastAPI ルーター定義"""

from fastapi import APIRouter, Depends, Request

from src.application.usecases.auth import AuthUseCaseInput, MockAuthUseCase
from src.common.context import Principal, PrincipalContext


async def auth_dependency(request: Request) -> Principal:
    """認証チェックを行う Dependency。private_router に付与する。"""
    auth_header = request.headers.get("Authorization")
    usecase: MockAuthUseCase = request.app.state.auth_usecase

    output = await usecase.execute(AuthUseCaseInput(header=auth_header))

    principal = Principal(
        user_id=output.user_id,
        email=output.email,
        roles=output.roles,
    )
    PrincipalContext.set(principal)
    return principal


public_router = APIRouter()
private_router = APIRouter(dependencies=[Depends(auth_dependency)])
