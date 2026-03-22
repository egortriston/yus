from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "AI Meeting Assistant Sidecar"
    api_host: str = "127.0.0.1"
    api_port: int = 8765
    database_url: str = Field(
        default="postgresql+psycopg://postgres:postgres@127.0.0.1:5432/ai_meeting_assistant",
        alias="DATABASE_URL",
    )
    bootstrap_email: str = "local-user@desktop.local"
    bootstrap_username: str = "Локальный пользователь"
    system_prompt_default: str = (
        "Ты — AI-ассистент для захвата требований. Твоя задача — помогать пользователю "
        "фиксировать задачи и требования в формате User Stories."
    )
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    dashscope_api_key: str | None = None
    qwen_base_url: str = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    qwen_region: str = "singapore"
    local_openai_compatible_base_url: str | None = None
    storage_dir: Path = BASE_DIR / "storage"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.storage_dir.mkdir(parents=True, exist_ok=True)
    (settings.storage_dir / "documents").mkdir(parents=True, exist_ok=True)
    (settings.storage_dir / "audio").mkdir(parents=True, exist_ok=True)
    return settings
