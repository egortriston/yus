from __future__ import annotations

import base64
import json
from typing import Any

from app.models.settings import UserSetting
from app.providers.registry import DefaultProviderRegistry
from app.services.story_service import StoryService


class AIOrchestrator:
    def __init__(self, providers: DefaultProviderRegistry, story_service: StoryService) -> None:
        self.providers = providers
        self.story_service = story_service

    async def transcribe_audio_chunk(
        self,
        *,
        session_id: str,
        source: str,
        audio_base64: str,
        mime_type: str,
        sample_rate_hz: int,
        settings: UserSetting,
    ) -> dict[str, Any]:
        audio_bytes = base64.b64decode(audio_base64)
        provider = self.providers.get_realtime_transcription_provider(settings.stt_provider, settings)
        return await provider.transcribe_chunk(
            session_id=session_id,
            audio_bytes=audio_bytes,
            mime_type=mime_type,
            sample_rate_hz=sample_rate_hz,
            source=source,
            model=settings.stt_model,
        )

    async def generate_story_candidate(
        self,
        *,
        system_prompt: str,
        transcript_text: str,
        existing_stories: list[str],
        rag_context: str,
        settings: UserSetting,
    ) -> dict[str, Any] | None:
        if not self.story_service.should_generate(transcript_text):
            return None

        provider = self.providers.get_chat_provider(settings.llm_provider, settings)
        user_prompt = (
            "## Контекст проекта (RAG):\n"
            f"{rag_context or '-'}\n\n"
            "## История разговора (последние сообщения):\n"
            f"{transcript_text}\n\n"
            "## Уже существующие стори:\n"
            f"{json.dumps(existing_stories, ensure_ascii=False)}\n\n"
            "Верни JSON с полями should_generate, role, action, value. Если нет новой стори, should_generate=false."
        )
        payload = await provider.complete_json(system_prompt=system_prompt, user_prompt=user_prompt, model=settings.llm_model)
        if not payload.get("should_generate"):
            return None
        return payload
