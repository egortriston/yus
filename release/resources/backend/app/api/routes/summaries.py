from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.session import Summary
from app.models.story import Story
from app.schemas.contracts import SummaryOut
from app.services.session_service import SessionService
from app.services.summary_service import SummaryService

router = APIRouter(prefix="/api/sessions/{session_id}", tags=["summary"])
summary_service = SummaryService()
session_service = SessionService()


@router.get("/summary", response_model=SummaryOut)
def get_summary(session_id: str, db: Session = Depends(get_db)) -> SummaryOut:
    summary = db.scalar(select(Summary).where(Summary.session_id == session_id))
    if summary is None:
        raise HTTPException(status_code=404, detail="Summary not found")
    return SummaryOut(session_id=session_id, markdown=summary.markdown, content=summary.content)


@router.post("/regenerate-summary", response_model=SummaryOut)
def regenerate_summary(session_id: str, db: Session = Depends(get_db)) -> SummaryOut:
    session = session_service.get_session(db, session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    confirmed = list(db.scalars(select(Story).where(Story.session_id == session_id, Story.status == "confirmed")))
    content, markdown = summary_service.generate_markdown(
        title=session.title,
        transcript=session.full_transcript or "",
        confirmed_stories=confirmed,
    )
    summary = summary_service.upsert_summary(db, session_id=session_id, content=content, markdown=markdown)
    return SummaryOut(session_id=session_id, markdown=summary.markdown, content=summary.content)
