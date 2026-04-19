"""認証・認可ユースケース（ローカル Mock 用）"""

from pydantic import BaseModel

from src.application.gateways.i_user_gateway import IUserGateway
from src.common.errors import UnauthenticatedError
from src.common.roles import Role

_ROLE_KEYWORDS: list[tuple[tuple[str, ...], Role]] = [
    (("student", "受講者"), Role.STUDENT),
    (("teacher", "講師"), Role.TEACHER),
    (("admin", "運営"), Role.ADMIN),
    (("hr", "人事"), Role.HR),
]


class AuthUseCaseInput(BaseModel):
    header: str | None


class AuthUseCaseOutput(BaseModel):
    user_id: str
    email: str
    roles: list[Role]


class MockAuthUseCase:
    """ローカル開発専用の Mock 認証ユースケース。

    Bearerトークンを外部ユーザーIDとしてIUserGateway で解決する。
    トークン文字列に含まれるキーワードから業務ロールを推論し、未一致は roles=[]。
    """

    def __init__(self, user_entity_gateway: IUserGateway) -> None:
        self.user_entity_gateway = user_entity_gateway

    async def execute(self, input: AuthUseCaseInput) -> AuthUseCaseOutput:
        if not input.header:
            raise UnauthenticatedError("Authorization header is missing")

        split_header = input.header.split(" ")
        if len(split_header) != 2 or split_header[0] != "Bearer":
            raise UnauthenticatedError("Invalid Authorization header format")

        user_id_token = split_header[1]
        if not user_id_token:
            raise UnauthenticatedError("Token is empty")

        roles = next(
            (
                [role]
                for keywords, role in _ROLE_KEYWORDS
                if any(kw in user_id_token for kw in keywords)
            ),
            [],
        )

        user = await self.user_entity_gateway.find_by_user_id(user_id_token)
        if not user:
            raise UnauthenticatedError(
                f"ユーザーID {user_id_token} のユーザーが見つかりません"
            )

        return AuthUseCaseOutput(
            user_id=str(user.id),
            email=user.email,
            roles=roles,
        )
