from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.bootstrap import ensure_bootstrap_user
from app.db.session import get_db
from app.models.session import SessionRecord
from app.models.story import Story
from app.schemas.contracts import SessionCreate, SessionDetail, SessionResponse, SessionUpdate, StoryOut
from app.services.session_service import SessionService

router = APIRouter(prefix="/api/sessions", tags=["sessions"])
service = SessionService()


def _story_out(story: Story) -> StoryOut:
    return StoryOut(
        id=story.id,
        session_id=story.session_id,
        role=story.role,
        action=story.action,
        value=story.value,
        full_story=story.full_story,
        status=story.status,
        expires_at=story.expires_at.isoformat() if story.expires_at else None,
    )


def _session_detail(session: SessionRecord) -> SessionDetail:
    return SessionDetail(
        id=session.id,
        title=session.title,
        started_at=session.started_at.isoformat(),
        ended_at=session.ended_at.isoformat() if session.ended_at else None,
        duration_seconds=session.duration_seconds,
        full_transcript=session.full_transcript,
        raw_audio_path=session.raw_audio_url,
        summary_markdown=session.summary.markdown if session.summary else None,
        segments=[
            {
                "id": segment.id,
                "source": segment.source,
                "speaker_label": segment.speaker_label,
                "text": segment.text,
                "created_at": segment.created_at.isoformat(),
            }
            for segment in session.transcript_segments
        ],
        stories=[_story_out(story) for story in session.stories],
    )


@router.post("", response_model=SessionResponse)
def create_session(payload: SessionCreate, db: Session = Depends(get_db)) -> SessionResponse:
    user = ensure_bootstrap_user(db)
    session = service.create_session(db, user_id=user.id, title=payload.title)
    return SessionResponse(
        id=session.id,
        title=session.title,
        started_at=session.started_at.isoformat(),
        ended_at=session.ended_at.isoformat() if session.ended_at else None,
        duration_seconds=session.duration_seconds,
        raw_audio_path=session.raw_audio_url,
    )


@router.get("", response_model=list[SessionResponse])
def list_sessions(db: Session = Depends(get_db)) -> list[SessionResponse]:
    sessions = list(db.scalars(select(SessionRecord).order_by(SessionRecord.started_at.desc())))
    return [
        SessionResponse(
            id=item.id,
            title=item.title,
            started_at=item.started_at.isoformat(),
            ended_at=item.ended_at.isoformat() if item.ended_at else None,
            duration_seconds=item.duration_seconds,
            raw_audio_path=item.raw_audio_url,
        )
        for item in sessions
    ]


@router.get("/{session_id}", response_model=SessionDetail)
def get_session(session_id: str, db: Session = Depends(get_db)) -> SessionDetail:
    session = service.get_session(db, session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return _session_detail(session)


@router.patch("/{session_id}", response_model=SessionDetail)
def update_session(session_id: str, payload: SessionUpdate, db: Session = Depends(get_db)) -> SessionDetail:
    try:
        session = service.update_session(db, session_id, title=payload.title, full_transcript=payload.full_transcript)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return _session_detail(session)


@router.delete("/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        service.delete_session(db, session_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"status": "deleted"}
