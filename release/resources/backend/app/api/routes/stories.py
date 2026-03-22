from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.bootstrap import ensure_bootstrap_user
from app.db.session import get_db
from app.models.story import Story
from app.schemas.contracts import StoryCreate, StoryOut
from app.services.story_service import StoryService

router = APIRouter(prefix="/api/sessions/{session_id}/stories", tags=["stories"])
service = StoryService()


def _to_story_out(story: Story) -> StoryOut:
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


@router.get("", response_model=list[StoryOut])
def list_stories(session_id: str, db: Session = Depends(get_db)) -> list[StoryOut]:
    return [_to_story_out(story) for story in service.list_session_stories(db, session_id)]


@router.post("", response_model=StoryOut)
async def create_story(session_id: str, payload: StoryCreate, request: Request, db: Session = Depends(get_db)) -> StoryOut:
    user = ensure_bootstrap_user(db)
    story = service.create_story(
        db,
        session_id=session_id,
        user_id=user.id,
        role=payload.role,
        action=payload.action,
        value=payload.value,
        context_snippet=payload.context_snippet,
    )
    await request.app.state.container.event_bus.publish(session_id, {"type": "story.proposed", "story_id": story.id})
    return _to_story_out(story)


@router.post("/{story_id}/confirm", response_model=StoryOut)
async def confirm_story(session_id: str, story_id: str, request: Request, db: Session = Depends(get_db)) -> StoryOut:
    try:
        story = service.update_status(db, story_id, "confirmed")
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    await request.app.state.container.event_bus.publish(session_id, {"type": "story.confirmed", "story_id": story.id})
    return _to_story_out(story)


@router.post("/{story_id}/decline", response_model=StoryOut)
async def decline_story(session_id: str, story_id: str, request: Request, db: Session = Depends(get_db)) -> StoryOut:
    try:
        story = service.update_status(db, story_id, "declined")
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    await request.app.state.container.event_bus.publish(session_id, {"type": "story.declined", "story_id": story.id})
    return _to_story_out(story)
