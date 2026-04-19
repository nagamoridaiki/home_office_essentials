"""ロールベースのアクセス制御デコレータ"""

from functools import wraps

from src.common.context import PrincipalContext
from src.common.errors import ForbiddenError
from src.common.roles import Role


def require_role(allowed_roles: list[Role]):
    """特定のロールを要求するデコレータ。

    @private_router エンドポイントに @require_role([Role.ADMIN]) のように付与する。
    auth_dependency で PrincipalContext が設定されていることが前提。
    """

    def decorator(f):
        @wraps(f)
        async def decorated_function(*args, **kwargs):
            principal = PrincipalContext.get()
            if principal is None:
                raise ValueError("PrincipalContext が設定されていません")

            if not any(role in principal.roles for role in allowed_roles):
                raise ForbiddenError("アクセスが拒否されました: 権限が不足しています")

            return await f(*args, **kwargs)

        return decorated_function

    return decorator
