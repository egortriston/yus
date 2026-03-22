from __future__ import annotations

import base64

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.bootstrap import ensure_bootstrap_user
from app.db.session import get_db
from app.models.session import SessionRecord
from app.models.story import Story
from app.schemas.contracts import AudioChunkIn
from app.services.ai_orchestrator import AIOrchestrator
from app.services.audio_storage_service import AudioStorageService
from app.services.document_service import DocumentService
from app.services.session_service import SessionService
from app.services.settings_service import SettingsService
from app.services.story_service import StoryService
from app.services.summary_service import SummaryService

router = APIRouter(prefix="/api/sessions/{session_id}", tags=["realtime"])
session_service = SessionService()
story_service = StoryService()
summary_service = SummaryService()
settings_service = SettingsService()
document_service = DocumentService()
audio_storage_service = AudioStorageService()


@router.post("/audio-chunk")
async def upload_audio_chunk(
    session_id: str,
    payload: AudioChunkIn,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    user = ensure_bootstrap_user(db)
    session = db.scalar(select(SessionRecord).where(SessionRecord.id == session_id))
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    settings = settings_service.get_or_create(db, user.id)
    audio_bytes = base64.b64decode(payload.audio_base64)
    stored_path = audio_storage_service.store_chunk(
        session_id=session_id,
        source=payload.source,
        mime_type=payload.mime_type,
        audio_bytes=audio_bytes,
        user_settings=settings,
    )
    if stored_path:
        session_service.set_raw_audio_path(db, session_id, stored_path)
    orchestrator = AIOrchestrator(request.app.state.container.providers, story_service)
    transcript = await orchestrator.transcribe_audio_chunk(
        session_id=session_id,
        source=payload.source,
        audio_base64=payload.audio_base64,
        mime_type=payload.mime_type,
        sample_rate_hz=payload.sample_rate_hz,
        settings=settings,
    )
    segment = session_service.append_segment(
        db,
        session_id=session_id,
        source=payload.source,
        speaker_label=transcript["speaker_label"],
        text=transcript["text"],
    )
    await request.app.state.container.event_bus.publish(
        session_id,
        {
            "type": "transcript.segment",
            "segment_id": segment.id,
            "source": segment.source,
            "speaker_label": segment.speaker_label,
            "text": segment.text,
            "created_at": segment.created_at.isoformat(),
        },
    )

    existing_stories = [story.full_story for story in session.stories]
    rag_context = await document_service.similarity_context(
        db,
        transcript_text=transcript["text"],
        providers=request.app.state.container.providers,
        provider_settings=settings,
    )
    candidate = await orchestrator.generate_story_candidate(
        system_prompt=user.system_prompt,
        transcript_text=transcript["text"],
        existing_stories=existing_stories,
        rag_context=rag_context,
        settings=settings,
    )
    if candidate and len([story for story in session.stories if story.status == "pending"]) < 3:
        story = story_service.create_story(
            db,
            session_id=session_id,
            user_id=user.id,
            role=candidate["role"],
            action=candidate["action"],
            value=candidate["value"],
            context_snippet=transcript["text"],
        )
        await request.app.state.container.event_bus.publish(
            session_id,
            {
                "type": "story.proposed",
                "story": {
                    "id": story.id,
                    "session_id": story.session_id,
                    "role": story.role,
                    "action": story.action,
                    "value": story.value,
                    "full_story": story.full_story,
                    "status": story.status,
                    "expires_at": story.expires_at.isoformat() if story.expires_at else None,
                },
            },
        )

    return {"status": "accepted", "segment_id": segment.id}


@router.post("/stop")
async def stop_session(session_id: str, request: Request, db: Session = Depends(get_db)) -> dict:
    try:
        session = session_service.stop_session(db, session_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    confirmed = list(db.scalars(select(Story).where(Story.session_id == session_id, Story.status == "confirmed")))
    content, markdown = summary_service.generate_markdown(
        title=session.title,
        transcript=session.full_transcript or "",
        confirmed_stories=confirmed,
    )
    summary_service.upsert_summary(db, session_id=session_id, content=content, markdown=markdown)
    await request.app.state.container.event_bus.publish(session_id, {"type": "session.stopped", "session_id": session_id})
    return {"status": "stopped", "session_id": session_id}
