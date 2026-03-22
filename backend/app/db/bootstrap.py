from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.user import User


def ensure_bootstrap_user(db: Session) -> User:
    settings = get_settings()
    user = db.scalar(select(User).where(User.email == settings.bootstrap_email))
    if user:
        return user

    user = User(
        email=settings.bootstrap_email,
        username=settings.bootstrap_username,
        system_prompt=settings.system_prompt_default,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
