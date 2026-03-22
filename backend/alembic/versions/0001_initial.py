"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-03-22 00:00:00
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("username", sa.String(length=100), nullable=False),
        sa.Column("system_prompt", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_table(
        "sessions",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=255)),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("ended_at", sa.DateTime(timezone=True)),
        sa.Column("duration_seconds", sa.Integer()),
        sa.Column("full_transcript", sa.Text()),
        sa.Column("raw_audio_url", sa.String(length=500)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_sessions_user_date", "sessions", ["user_id", "started_at"], unique=False)
    op.create_table(
        "transcript_segments",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("session_id", sa.UUID(), sa.ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("source", sa.String(length=32), nullable=False),
        sa.Column("speaker_label", sa.String(length=64), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("chunk_started_at", sa.DateTime(timezone=True)),
        sa.Column("chunk_ended_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_table(
        "stories",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("session_id", sa.UUID(), sa.ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("role", sa.String(length=255), nullable=False),
        sa.Column("action", sa.Text(), nullable=False),
        sa.Column("value", sa.Text(), nullable=False),
        sa.Column("full_story", sa.Text(), nullable=False),
        sa.Column("context_snippet", sa.Text()),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), server_default=sa.text("now() + interval '3 minutes'"), nullable=False),
        sa.Column("confirmed_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint("status IN ('pending', 'confirmed', 'declined', 'expired')", name="valid_story_status"),
    )
    op.create_index("idx_stories_session", "stories", ["session_id"], unique=False)
    op.create_index("idx_stories_session_status", "stories", ["session_id", "status"], unique=False)
    op.create_table(
        "summaries",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("session_id", sa.UUID(), sa.ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("content", sa.JSON(), nullable=False),
        sa.Column("markdown", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_table(
        "documents",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("original_name", sa.String(length=255), nullable=False),
        sa.Column("file_path", sa.String(length=500)),
        sa.Column("file_size_bytes", sa.Integer()),
        sa.Column("mime_type", sa.String(length=100)),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("error_message", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("processed_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_documents_user", "documents", ["user_id", "status"], unique=False)
    op.create_table(
        "document_chunks",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("document_id", sa.UUID(), sa.ForeignKey("documents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("embedding", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("idx_document_chunks_document", "document_chunks", ["document_id", "chunk_index"], unique=False)
    op.create_table(
        "user_settings",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("llm_provider", sa.String(length=100), nullable=False, server_default="qwen-dashscope-chat"),
        sa.Column("llm_model", sa.String(length=100), nullable=False, server_default="qwen-plus"),
        sa.Column("embedding_provider", sa.String(length=100), nullable=False, server_default="qwen-dashscope-embedding"),
        sa.Column("embedding_model", sa.String(length=100), nullable=False, server_default="text-embedding-v4"),
        sa.Column("stt_provider", sa.String(length=100), nullable=False, server_default="qwen-dashscope-asr-realtime"),
        sa.Column("stt_model", sa.String(length=100), nullable=False, server_default="qwen3-asr-flash-realtime"),
        sa.Column("batch_stt_provider", sa.String(length=100), nullable=False, server_default="qwen-dashscope-asr-file"),
        sa.Column("batch_stt_model", sa.String(length=100), nullable=False, server_default="qwen3-asr-flash-filetrans"),
        sa.Column("provider_base_url", sa.String(length=500)),
        sa.Column("provider_region", sa.String(length=50), nullable=False, server_default="singapore"),
        sa.Column("api_key_ref", sa.String(length=255)),
        sa.Column("extra", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("user_settings")
    op.drop_index("idx_document_chunks_document", table_name="document_chunks")
    op.drop_table("document_chunks")
    op.drop_index("idx_documents_user", table_name="documents")
    op.drop_table("documents")
    op.drop_table("summaries")
    op.drop_index("idx_stories_session_status", table_name="stories")
    op.drop_index("idx_stories_session", table_name="stories")
    op.drop_table("stories")
    op.drop_table("transcript_segments")
    op.drop_index("idx_sessions_user_date", table_name="sessions")
    op.drop_table("sessions")
    op.drop_table("users")