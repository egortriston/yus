from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import documents, realtime, sessions, settings as settings_routes, stories, summaries
from app.core.config import get_settings
from app.core.container import create_container
from app.db.bootstrap import ensure_bootstrap_user
from app.db.migrations import run_migrations
from app.db.session import SessionLocal
from app.ws.routes import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    with SessionLocal() as db:
        ensure_bootstrap_user(db)
    yield


app_settings = get_settings()
app = FastAPI(title=app_settings.app_name, lifespan=lifespan)
app.state.container = create_container()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(settings_routes.router)
app.include_router(sessions.router)
app.include_router(realtime.router)
app.include_router(stories.router)
app.include_router(summaries.router)
app.include_router(documents.router)
app.include_router(ws_router)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
