import sys
from pathlib import Path

import uvicorn

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

if __name__ == '__main__':
    from app.core.config import get_settings

    settings = get_settings()
    uvicorn.run('app.main:app', host=settings.api_host, port=settings.api_port)
