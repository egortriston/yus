from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDMixin


class SessionRecord(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "sessions"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str | None] = mapped_column(String(255))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_seconds: Mapped[int | None] = mapped_column(Integer)
    full_transcript: Mapped[str | None] = mapped_column(Text)
    raw_audio_url: Mapped[str | None] = mapped_column(String(500))

    user = relationship("User", back_populates="sessions")
    stories = relationship("Story", back_populates="session", cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="session", uselist=False, cascade="all, delete-orphan")
    transcript_segments = relationship(
        "TranscriptSegment",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="TranscriptSegment.created_at",
    )


class TranscriptSegment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "transcript_segments"

    session_id: Mapped[str] = mapped_column(ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    source: Mapped[str] = mapped_column(String(32), nullable=False)
    speaker_label: Mapped[str] = mapped_column(String(64), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    chunk_started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    chunk_ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    session = relationship("SessionRecord", back_populates="transcript_segments")


class Summary(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "summaries"

    session_id: Mapped[str] = mapped_column(ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, unique=True)
    content: Mapped[dict] = mapped_column(JSONB, nullable=False)
    markdown: Mapped[str | None] = mapped_column(Text)

    session = relationship("SessionRecord", back_populates="summary")
