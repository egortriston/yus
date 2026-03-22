from __future__ import annotations

from dataclasses import dataclass

from app.providers.registry import DefaultProviderRegistry
from app.ws.event_bus import InMemoryEventBus


@dataclass(slots=True)
class AppContainer:
    providers: DefaultProviderRegistry
    event_bus: InMemoryEventBus


def create_container() -> AppContainer:
    return AppContainer(providers=DefaultProviderRegistry(), event_bus=InMemoryEventBus())
