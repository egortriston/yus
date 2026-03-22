from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class SessionCreate(BaseModel):
    title: str | None = None


class SessionUpdate(BaseModel):
    title: str | None = None
    full_transcript: str | None = None


class SessionResponse(BaseModel):
    id: str
    title: str | None
    started_at: str
    ended_at: str | None = None
    duration_seconds: int | None = None
    raw_audio_path: str | None = None


class AudioChunkIn(BaseModel):
    source: Literal["mic", "desktop"]
    mime_type: str = "audio/wav"
    sample_rate_hz: int = 16000
    audio_base64: str = Field(min_length=1)


class StoryCreate(BaseModel):
    role: str
    action: str
    value: str
    context_snippet: str | None = None


class StoryOut(BaseModel):
    id: str
    session_id: str
    role: str
    action: str
    value: str
    full_story: str
    status: str
    expires_at: str | None = None


class PromptSettings(BaseModel):
    system_prompt: str


class ProviderSettings(BaseModel):
    llm_provider: str = "qwen-dashscope-chat"
    llm_model: str = "qwen-plus"
    embedding_provider: str = "qwen-dashscope-embedding"
    embedding_model: str = "text-embedding-v4"
    stt_provider: str = "qwen-dashscope-asr-realtime"
    stt_model: str = "qwen3-asr-flash-realtime"
    batch_stt_provider: str = "qwen-dashscope-asr-file"
    batch_stt_model: str = "qwen3-asr-flash-filetrans"
    provider_base_url: str | None = None
    provider_region: str = "singapore"
    api_key_ref: str | None = None
    user_country: str = "RU"
    user_timezone: str = "Europe/Moscow"
    ui_language: str = "ru-RU"
    transcript_language: str = "auto"
    audio_storage_enabled: bool = True
    audio_storage_dir: str | None = None


class SummaryOut(BaseModel):
    session_id: str
    markdown: str | None = None
    content: dict


class DocumentOut(BaseModel):
    id: str
    filename: str
    original_name: str
    status: str
    error_message: str | None = None


class SessionDetail(BaseModel):
    id: str
    title: str | None
    started_at: str
    ended_at: str | None = None
    duration_seconds: int | None = None
    full_transcript: str | None = None
    raw_audio_path: str | None = None
    summary_markdown: str | None = None
    segments: list[dict]
    stories: list[StoryOut]
