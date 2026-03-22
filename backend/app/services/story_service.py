from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.story import Story


class StoryService:
    MARKERS = ("нужно", "добав", "требуется", "хотим", "проблем", "баг", "ошибка", "договорились")

    def should_generate(self, text: str) -> bool:
        lowered = text.lower()
        return any(marker in lowered for marker in self.MARKERS)

    def list_session_stories(self, db: Session, session_id: str) -> list[Story]:
        return list(db.scalars(select(Story).where(Story.session_id == session_id).order_by(Story.created_at.desc())))

    def create_story(self, db: Session, *, session_id: str, user_id: str, role: str, action: str, value: str, context_snippet: str | None) -> Story:
        full_story = f"Как {role}, я хочу {action}, чтобы {value}."
        story = Story(
            session_id=session_id,
            user_id=user_id,
            role=role,
            action=action,
            value=value,
            full_story=full_story,
            context_snippet=context_snippet,
            expires_at=datetime.now(UTC) + timedelta(minutes=3),
        )
        db.add(story)
        db.commit()
        db.refresh(story)
        return story

    def update_status(self, db: Session, story_id: str, status: str) -> Story:
        story = db.scalar(select(Story).where(Story.id == story_id))
        if story is None:
            raise ValueError("Story not found")
        story.status = status
        if status == "confirmed":
            story.confirmed_at = datetime.now(UTC)
        db.add(story)
        db.commit()
        db.refresh(story)
        return story
