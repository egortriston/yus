from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

from app.core.config import get_settings
from app.models.settings import UserSetting


def _extension_for_mime_type(mime_type: str) -> str:
    lowered = mime_type.lower()
    if "webm" in lowered:
        return "webm"
    if "mp4" in lowered or "mpeg" in lowered:
        return "mp4"
    if "wav" in lowered:
        return "wav"
    if "ogg" in lowered:
        return "ogg"
    return "bin"


class AudioStorageService:
    def __init__(self) -> None:
        self._default_root = get_settings().storage_dir / "audio"
        self._default_root.mkdir(parents=True, exist_ok=True)

    def is_enabled(self, user_settings: UserSetting) -> bool:
        return bool((user_settings.extra or {}).get("audio_storage_enabled", True))

    def resolve_root(self, user_settings: UserSetting) -> Path:
        configured = (user_settings.extra or {}).get("audio_storage_dir")
        root = Path(configured) if configured else self._default_root
        root.mkdir(parents=True, exist_ok=True)
        return root

    def store_chunk(
        self,
        *,
        session_id: str,
        source: str,
        mime_type: str,
        audio_bytes: bytes,
        user_settings: UserSetting,
    ) -> str | None:
        if not self.is_enabled(user_settings):
            return None

        session_dir = self.resolve_root(user_settings) / session_id / source
        session_dir.mkdir(parents=True, exist_ok=True)
        filename = f"{datetime.now(UTC).strftime('%Y%m%dT%H%M%S%fZ')}.{_extension_for_mime_type(mime_type)}"
        chunk_path = session_dir / filename
        chunk_path.write_bytes(audio_bytes)
        return str(session_dir.parent)
