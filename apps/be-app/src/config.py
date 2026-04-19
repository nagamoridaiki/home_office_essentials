from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_default_todo_data_path = Path(__file__).resolve().parent.parent / "data" / "todos.json"
# モック認証で「Bearerのトークン＝external_user_id」と照合するユーザーの一覧JSON
# 環境変数MOCK_USERS_PATHに別パスを書けば上書きされ、最終的にはmainがDIコンテナへ渡し、
# MockUserFileGatewayがそのパスを開いて読む。
_default_mock_users_path = (
    Path(__file__).resolve().parent.parent / "data" / "mock_users.json"
)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000"]
    todo_data_path: Path = _default_todo_data_path
    # mock_users_path はモックユーザJSONの場所を表す設定で、通常はデフォルトパスだが
    # .envのMOCK_USERS_PATHで変えられ、ファイル下部のget_settings() で値が決まり、
    # main経由でDIコンテナに渡され、認証時にMockUserFileGatewayがそのパスのファイルを読む
    mock_users_path: Path = _default_mock_users_path

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return []
            return [part.strip() for part in stripped.split(",") if part.strip()]
        return []


def get_settings() -> Settings:
    return Settings()
