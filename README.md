# AI Meeting Assistant

Greenfield desktop application scaffold built from the approved plan:
- Electron + React/Vite desktop shell
- FastAPI local sidecar
- PostgreSQL-backed storage everywhere
- Qwen-first provider abstraction with DashScope and local OpenAI-compatible endpoints

## Project layout
- `backend/` FastAPI sidecar, Alembic migrations, SQLAlchemy models, provider adapters
- `electron/` Electron main/preload
- `src/` React UI for recording, history, knowledge base, settings

## Local requirements
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+

## Suggested setup
1. Create PostgreSQL database `ai_meeting_assistant`.
2. Copy `backend/.env.example` to `backend/.env` and fill provider keys/DSN.
3. Install backend requirements with `python -m pip install -r backend/requirements.txt`.
4. Run `npm install` in the repository root.
5. Start frontend with `npm run app:dev`.

## Current implementation scope
- Postgres models and Alembic migration for sessions, transcript segments, stories, summaries, documents, chunks, user settings.
- Capability-based provider abstraction for chat, embeddings, realtime STT and batch STT.
- Qwen profiles for DashScope and local OpenAI-compatible endpoints.
- Localhost API for sessions, prompt/settings, stories, summaries, documents, websocket events, transcript editing and summary regeneration.
- Document upload flow with storage, parsing for `txt/md/pdf/docx`, chunking and embedding attempts for RAG indexing.
- Desktop recording screen wired to real renderer-side audio capture via `getUserMedia`, `getDisplayMedia` and `MediaRecorder` chunk streaming.
- Desktop UI for recording, history, knowledge base and settings with live websocket transcript/story updates.

## Important notes
- Native desktop audio capture now uses browser/Electron media APIs from the renderer. Actual transcript quality still depends on the configured STT provider.
- This machine did not have a working local `pgvector` extension/runtime, so embeddings are currently stored in PostgreSQL JSON and ranked in application code. The rest of the stack remains PostgreSQL-native.
- Qwen/OpenAI-compatible adapters are in place, with mock fallbacks for local smoke-testing when API keys are absent.