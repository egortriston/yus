from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.session import Summary
from app.models.story import Story


class SummaryService:
    def generate_markdown(self, *, title: str | None, transcript: str, confirmed_stories: list[Story]) -> tuple[dict, str]:
        content = {
            "main_topics": ["Обсуждение требований и задач"],
            "decisions": ["Сессия завершена, сводка сформирована автоматически"],
            "notes": ["Проверьте формулировки и при необходимости отредактируйте transcript."],
            "stories": [story.full_story for story in confirmed_stories],
        }
        markdown = "\n".join(
            [
                f"# Сводка встречи: {title or 'Без названия'}",
                "",
                "## Основные темы обсуждения",
                *[f"- {item}" for item in content["main_topics"]],
                "",
                "## Принятые решения",
                *[f"- {item}" for item in content["decisions"]],
                "",
                "## User Stories (подтвержденные)",
                *[f"- {item}" for item in content["stories"]],
                "",
                "## Дополнительные заметки",
                *[f"- {item}" for item in content["notes"]],
                "",
                "## Транскрипт",
                transcript or "-",
            ]
        )
        return content, markdown

    def upsert_summary(self, db: Session, *, session_id: str, content: dict, markdown: str) -> Summary:
        summary = db.scalar(select(Summary).where(Summary.session_id == session_id))
        if summary is None:
            summary = Summary(session_id=session_id, content=content, markdown=markdown)
        else:
            summary.content = content
            summary.markdown = markdown
        db.add(summary)
        db.commit()
        db.refresh(summary)
        return summary
