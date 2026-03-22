from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Any, Protocol


class ChatCompletionProvider(Protocol):
    async def complete_json(self, *, system_prompt: str, user_prompt: str, model: str) -> dict[str, Any]: ...
    async def complete_text(self, *, system_prompt: str, user_prompt: str, model: str) -> str: ...


class EmbeddingProvider(Protocol):
    async def embed(self, *, texts: list[str], model: str, dimensions: int = 1536) -> list[list[float]]: ...


class RealtimeTranscriptionProvider(Protocol):
    async def transcribe_chunk(
        self,
        *,
        session_id: str,
        audio_bytes: bytes,
        mime_type: str,
        sample_rate_hz: int,
        source: str,
        model: str,
    ) -> dict[str, Any]: ...


class BatchTranscriptionProvider(Protocol):
    async def transcribe_file(self, *, file_path: str, model: str) -> dict[str, Any]: ...


class ProviderRegistry(Protocol):
    def get_chat_provider(self, provider_key: str, settings: Any | None = None) -> ChatCompletionProvider: ...
    def get_embedding_provider(self, provider_key: str, settings: Any | None = None) -> EmbeddingProvider: ...
    def get_realtime_transcription_provider(self, provider_key: str, settings: Any | None = None) -> RealtimeTranscriptionProvider: ...
    def get_batch_transcription_provider(self, provider_key: str, settings: Any | None = None) -> BatchTranscriptionProvider: ...


class EventSink(Protocol):
    async def publish(self, session_id: str, event: dict[str, Any]) -> None: ...
    async def stream(self, session_id: str) -> AsyncIterator[dict[str, Any]]: ...
