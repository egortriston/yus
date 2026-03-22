from __future__ import annotations

from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["events"])


@router.websocket("/ws/sessions/{session_id}/events")
async def session_events(websocket: WebSocket, session_id: str, request: Request) -> None:
    await websocket.accept()
    try:
        async for event in request.app.state.container.event_bus.stream(session_id):
            await websocket.send_json(event)
    except WebSocketDisconnect:
        return
