from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from app.db.bootstrap import ensure_bootstrap_user
from app.db.session import get_db
from app.schemas.contracts import DocumentOut
from app.services.document_service import DocumentService
from app.services.settings_service import SettingsService

router = APIRouter(prefix="/api/documents", tags=["documents"])
service = DocumentService()
settings_service = SettingsService()


@router.get("", response_model=list[DocumentOut])
def list_documents(db: Session = Depends(get_db)) -> list[DocumentOut]:
    user = ensure_bootstrap_user(db)
    documents = service.list_documents(db, user.id)
    return [DocumentOut(id=item.id, filename=item.filename, original_name=item.original_name, status=item.status, error_message=item.error_message) for item in documents]


@router.post("/upload", response_model=DocumentOut)
async def upload_document(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)) -> DocumentOut:
    user = ensure_bootstrap_user(db)
    provider_settings = settings_service.get_or_create(db, user.id)
    document = await service.ingest_upload(
        db,
        user_id=user.id,
        upload_file=file,
        providers=request.app.state.container.providers,
        provider_settings=provider_settings,
    )
    return DocumentOut(id=document.id, filename=document.filename, original_name=document.original_name, status=document.status, error_message=document.error_message)


@router.delete("/{document_id}")
def delete_document(document_id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        service.delete_document(db, document_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"status": "deleted"}
