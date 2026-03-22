from __future__ import annotations

import asyncio
from collections import defaultdict
from collections.abc import AsyncIterator
from typing import Any


class InMemoryEventBus:
    def __init__(self) -> None:
        self._queues: dict[str, list[asyncio.Queue[dict[str, Any]]]] = defaultdict(list)

    async def publish(self, session_id: str, event: dict[str, Any]) -> None:
        for queue in self._queues[session_id]:
            await queue.put(event)

    async def stream(self, session_id: str) -> AsyncIterator[dict[str, Any]]:
        queue: asyncio.Queue[dict[str, Any]] = asyncio.Queue()
        self._queues[session_id].append(queue)
        try:
            while True:
                yield await queue.get()
        finally:
            self._queues[session_id].remove(queue)
