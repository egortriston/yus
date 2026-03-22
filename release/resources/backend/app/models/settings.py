from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDMixin


class UserSetting(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_settings"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    llm_provider: Mapped[str] = mapped_column(String(100), nullable=False, default="qwen-dashscope-chat")
    llm_model: Mapped[str] = mapped_column(String(100), nullable=False, default="qwen-plus")
    embedding_provider: Mapped[str] = mapped_column(String(100), nullable=False, default="qwen-dashscope-embedding")
    embedding_model: Mapped[str] = mapped_column(String(100), nullable=False, default="text-embedding-v4")
    stt_provider: Mapped[str] = mapped_column(String(100), nullable=False, default="qwen-dashscope-asr-realtime")
    stt_model: Mapped[str] = mapped_column(String(100), nullable=False, default="qwen3-asr-flash-realtime")
    batch_stt_provider: Mapped[str] = mapped_column(String(100), nullable=False, default="qwen-dashscope-asr-file")
    batch_stt_model: Mapped[str] = mapped_column(String(100), nullable=False, default="qwen3-asr-flash-filetrans")
    provider_base_url: Mapped[str | None] = mapped_column(String(500))
    provider_region: Mapped[str] = mapped_column(String(50), nullable=False, default="singapore")
    api_key_ref: Mapped[str | None] = mapped_column(String(255))
    extra: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    user = relationship("User", back_populates="settings")
