from __future__ import annotations

from pathlib import Path
from typing import Any

import httpx


class DashScopeRealtimeAsrAdapter:
    def __init__(self, *, api_key: str | None, base_url: str, model: str = "qwen3-asr-flash-realtime"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def transcribe_chunk(
        self,
        *,
        session_id: str,
        audio_bytes: bytes,
        mime_type: str,
        sample_rate_hz: int,
        source: str,
        model: str,
    ) -> dict[str, Any]:
        if not self.api_key:
            try:
                text = audio_bytes.decode("utf-8")
            except UnicodeDecodeError:
                text = ""
            return {
                "text": text,
                "speaker_label": "Пользователь" if source == "mic" else "Собеседник",
                "source": source,
                "mode": "mock",
            }

        files = {"file": (f"{session_id}-{source}.wav", audio_bytes, mime_type)}
        data = {"model": model or self.model, "sample_rate": str(sample_rate_hz), "source": source}
        headers = {"Authorization": f"Bearer {self.api_key}"}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(f"{self.base_url}/audio/transcriptions", headers=headers, data=data, files=files)
            response.raise_for_status()
        payload = response.json()
        return {
            "text": payload.get("text", ""),
            "speaker_label": "Пользователь" if source == "mic" else "Собеседник",
            "source": source,
            "mode": "provider",
        }


class DashScopeFileAsrAdapter:
    def __init__(self, *, api_key: str | None, base_url: str, model: str = "qwen3-asr-flash-filetrans"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def transcribe_file(self, *, file_path: str, model: str) -> dict[str, Any]:
        if not self.api_key:
            path = Path(file_path)
            text = path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""
            return {"text": text, "segments": [], "mode": "mock", "file_path": file_path}

        headers = {"Authorization": f"Bearer {self.api_key}"}
        data = {"model": model or self.model}
        with open(file_path, "rb") as audio_file:
            files = {"file": (Path(file_path).name, audio_file, "audio/wav")}
            async with httpx.AsyncClient(timeout=180) as client:
                response = await client.post(f"{self.base_url}/audio/transcriptions", headers=headers, data=data, files=files)
                response.raise_for_status()
        payload = response.json()
        return {
            "text": payload.get("text", ""),
            "segments": payload.get("segments", []),
            "mode": "provider",
            "file_path": file_path,
        }
