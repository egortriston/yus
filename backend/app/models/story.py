from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDMixin


class Story(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "stories"
    __table_args__ = (
        CheckConstraint("status IN ('pending', 'confirmed', 'declined', 'expired')", name="valid_story_status"),
    )

    session_id: Mapped[str] = mapped_column(ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    full_story: Mapped[str] = mapped_column(Text, nullable=False)
    context_snippet: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", server_default="pending")
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now() + interval '3 minutes'"),
    )
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    session = relationship("SessionRecord", back_populates="stories")
    user = relationship("User", back_populates="stories")