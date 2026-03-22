from __future__ import annotations

import hashlib
import json
from typing import Any

import httpx


def _mock_story_payload(user_prompt: str) -> dict[str, Any]:
  lowered = user_prompt.lower()
  markers = ("нужно", "добав", "требуется", "хотим", "проблем", "баг", "ошибка", "договорились")
  if not any(marker in lowered for marker in markers):
      return {"should_generate": False}

  if "## Уже существующие стори:" in user_prompt:
      snippet = user_prompt.split("## Уже существующие стори:")[0]
  else:
      snippet = user_prompt
  if "## История разговора (последние сообщения):" in snippet:
      snippet = snippet.split("## История разговора (последние сообщения):")[-1].strip()
  action = snippet.splitlines()[0][:180] if snippet else "уточнить новое требование"
  return {
      "should_generate": True,
      "role": "менеджер",
      "action": action.lower(),
      "value": "быстрее фиксировать требования по итогам встречи",
  }


class OpenAICompatibleChatAdapter:
    def __init__(self, *, base_url: str, api_key: str | None = None, default_headers: dict[str, str] | None = None):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.default_headers = default_headers or {}

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json", **self.default_headers}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def complete_json(self, *, system_prompt: str, user_prompt: str, model: str) -> dict[str, Any]:
        if not self.api_key:
            return _mock_story_payload(user_prompt)

        payload = {
            "model": model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        }
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(f"{self.base_url}/chat/completions", headers=self._headers(), json=payload)
            response.raise_for_status()
        message = response.json()["choices"][0]["message"]["content"]
        return json.loads(message)

    async def complete_text(self, *, system_prompt: str, user_prompt: str, model: str) -> str:
        if not self.api_key:
            return f"Mock completion for model {model}: {user_prompt[:240]}"

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        }
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(f"{self.base_url}/chat/completions", headers=self._headers(), json=payload)
            response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]


class OpenAICompatibleEmbeddingAdapter:
    def __init__(self, *, base_url: str, api_key: str | None = None, default_headers: dict[str, str] | None = None):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.default_headers = default_headers or {}

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json", **self.default_headers}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    def _mock_embedding(self, text: str, dimensions: int) -> list[float]:
        vector = [0.0] * min(dimensions, 64)
        digest = hashlib.sha256(text.encode("utf-8", errors="ignore")).digest()
        for index, value in enumerate(digest[: len(vector)]):
            vector[index] = value / 255.0
        return vector

    async def embed(self, *, texts: list[str], model: str, dimensions: int = 1536) -> list[list[float]]:
        if not self.api_key:
            return [self._mock_embedding(text, dimensions) for text in texts]

        payload = {"model": model, "input": texts, "dimensions": dimensions}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(f"{self.base_url}/embeddings", headers=self._headers(), json=payload)
            response.raise_for_status()
        data = response.json().get("data", [])
        return [item["embedding"] for item in data]
