from __future__ import annotations

from app.core.config import get_settings
from app.models.settings import UserSetting
from app.providers.dashscope_asr import DashScopeFileAsrAdapter, DashScopeRealtimeAsrAdapter
from app.providers.openai_compatible import OpenAICompatibleChatAdapter, OpenAICompatibleEmbeddingAdapter


class DefaultProviderRegistry:
    def __init__(self) -> None:
        settings = get_settings()
        self._config = settings
        self._realtime = {
            "qwen-dashscope-asr-realtime": DashScopeRealtimeAsrAdapter(
                api_key=settings.dashscope_api_key,
                base_url=settings.qwen_base_url,
            )
        }
        self._batch = {
            "qwen-dashscope-asr-file": DashScopeFileAsrAdapter(
                api_key=settings.dashscope_api_key,
                base_url=settings.qwen_base_url,
            )
        }

    def _openai_compatible_base_url(self, settings: UserSetting | None) -> str:
        if settings and settings.provider_base_url:
            return settings.provider_base_url
        return self._config.local_openai_compatible_base_url or "http://localhost:11434/v1"

    def get_chat_provider(self, provider_key: str, settings: UserSetting | None = None):
        if provider_key == "qwen-local-openai-compatible":
            return OpenAICompatibleChatAdapter(base_url=self._openai_compatible_base_url(settings))
        if provider_key == "qwen-dashscope-chat":
            return OpenAICompatibleChatAdapter(
                base_url=self._config.qwen_base_url,
                api_key=self._config.dashscope_api_key,
            )
        raise KeyError(provider_key)

    def get_embedding_provider(self, provider_key: str, settings: UserSetting | None = None):
        if provider_key == "qwen-local-openai-compatible":
            return OpenAICompatibleEmbeddingAdapter(base_url=self._openai_compatible_base_url(settings))
        if provider_key == "qwen-dashscope-embedding":
            return OpenAICompatibleEmbeddingAdapter(
                base_url=self._config.qwen_base_url,
                api_key=self._config.dashscope_api_key,
            )
        raise KeyError(provider_key)

    def get_realtime_transcription_provider(self, provider_key: str, settings: UserSetting | None = None):
        return self._realtime[provider_key]

    def get_batch_transcription_provider(self, provider_key: str, settings: UserSetting | None = None):
        return self._batch[provider_key]
