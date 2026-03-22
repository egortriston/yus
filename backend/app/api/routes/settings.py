from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.bootstrap import ensure_bootstrap_user
from app.db.session import get_db
from app.schemas.contracts import PromptSettings, ProviderSettings
from app.services.settings_service import SettingsService

router = APIRouter(prefix="/api", tags=["settings"])
settings_service = SettingsService()


@router.get("/prompt", response_model=PromptSettings)
def get_prompt(db: Session = Depends(get_db)) -> PromptSettings:
    user = ensure_bootstrap_user(db)
    return PromptSettings(system_prompt=user.system_prompt)


@router.put("/prompt", response_model=PromptSettings)
def update_prompt(payload: PromptSettings, db: Session = Depends(get_db)) -> PromptSettings:
    user = ensure_bootstrap_user(db)
    user.system_prompt = payload.system_prompt
    db.add(user)
    db.commit()
    db.refresh(user)
    return PromptSettings(system_prompt=user.system_prompt)


@router.post("/prompt/preview")
def preview_prompt(payload: PromptSettings) -> dict[str, str]:
    return {"preview": f"Preview: {payload.system_prompt[:160]}"}


@router.get("/settings", response_model=ProviderSettings)
def get_settings_route(db: Session = Depends(get_db)) -> ProviderSettings:
    user = ensure_bootstrap_user(db)
    settings = settings_service.get_or_create(db, user.id)
    return settings_service.serialize(settings)


@router.put("/settings", response_model=ProviderSettings)
def update_settings_route(payload: ProviderSettings, db: Session = Depends(get_db)) -> ProviderSettings:
    user = ensure_bootstrap_user(db)
    settings = settings_service.update(db, user.id, payload)
    return settings_service.serialize(settings)
