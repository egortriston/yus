from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.session import SessionRecord, TranscriptSegment


class SessionService:
    def create_session(self, db: Session, *, user_id: str, title: str | None) -> SessionRecord:
        session = SessionRecord(user_id=user_id, title=title)
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    def append_segment(
        self,
        db: Session,
        *,
        session_id: str,
        source: str,
        speaker_label: str,
        text: str,
    ) -> TranscriptSegment:
        segment = TranscriptSegment(
            session_id=session_id,
            source=source,
            speaker_label=speaker_label,
            text=text,
        )
        db.add(segment)
        db.commit()
        db.refresh(segment)
        return segment

    def get_session(self, db: Session, session_id: str) -> SessionRecord | None:
        return db.scalar(select(SessionRecord).where(SessionRecord.id == session_id))

    def update_session(self, db: Session, session_id: str, *, title: str | None, full_transcript: str | None) -> SessionRecord:
        session = self.get_session(db, session_id)
        if session is None:
            raise ValueError("Session not found")
        if title is not None:
            session.title = title
        if full_transcript is not None:
            session.full_transcript = full_transcript
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    def set_raw_audio_path(self, db: Session, session_id: str, raw_audio_path: str) -> SessionRecord:
        session = self.get_session(db, session_id)
        if session is None:
            raise ValueError("Session not found")
        session.raw_audio_url = raw_audio_path
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    def delete_session(self, db: Session, session_id: str) -> None:
        session = self.get_session(db, session_id)
        if session is None:
            raise ValueError("Session not found")
        db.delete(session)
        db.commit()

    def stop_session(self, db: Session, session_id: str) -> SessionRecord:
        session = self.get_session(db, session_id)
        if session is None:
            raise ValueError("Session not found")
        session.ended_at = datetime.now(UTC)
        if session.started_at and session.ended_at:
            session.duration_seconds = int((session.ended_at - session.started_at).total_seconds())
        session.full_transcript = "\n".join(segment.text for segment in session.transcript_segments)
        db.add(session)
        db.commit()
        db.refresh(session)
        return session
