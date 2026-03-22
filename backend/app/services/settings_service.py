from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.settings import UserSetting
from app.schemas.contracts import ProviderSettings


class SettingsService:
    EXTRA_DEFAULTS = {
        "user_country": "RU",
        "user_timezone": "Europe/Moscow",
        "ui_language": "ru-RU",
        "transcript_language": "auto",
        "audio_storage_enabled": True,
        "audio_storage_dir": None,
    }

    def get_or_create(self, db: Session, user_id: str) -> UserSetting:
        settings = db.scalar(select(UserSetting).where(UserSetting.user_id == user_id))
        if settings:
            self._ensure_defaults(settings)
            return settings
        settings = UserSetting(
            user_id=user_id,
            llm_provider="qwen-local-openai-compatible",
            embedding_provider="qwen-local-openai-compatible",
            provider_base_url="http://127.0.0.1:11434/v1",
            provider_region="local",
            extra=dict(self.EXTRA_DEFAULTS),
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
        return settings

    def update(self, db: Session, user_id: str, payload: ProviderSettings) -> UserSetting:
        settings = self.get_or_create(db, user_id)
        payload_data = payload.model_dump()
        extra = dict(settings.extra or {})
        for field, value in payload_data.items():
            if field in self.EXTRA_DEFAULTS:
                extra[field] = value
            else:
                setattr(settings, field, value)
        settings.extra = extra
        db.add(settings)
        db.commit()
        db.refresh(settings)
        return settings

    def serialize(self, settings: UserSetting) -> ProviderSettings:
        self._ensure_defaults(settings)
        base_data = {
            "llm_provider": settings.llm_provider,
            "llm_model": settings.llm_model,
            "embedding_provider": settings.embedding_provider,
            "embedding_model": settings.embedding_model,
            "stt_provider": settings.stt_provider,
            "stt_model": settings.stt_model,
            "batch_stt_provider": settings.batch_stt_provider,
            "batch_stt_model": settings.batch_stt_model,
            "provider_base_url": settings.provider_base_url,
            "provider_region": settings.provider_region,
            "api_key_ref": settings.api_key_ref,
        }
        return ProviderSettings(**base_data, **settings.extra)

    def _ensure_defaults(self, settings: UserSetting) -> None:
        current = dict(settings.extra or {})
        changed = False
        for field, value in self.EXTRA_DEFAULTS.items():
            if field not in current:
                current[field] = value
                changed = True
        if changed:
            settings.extra = current
