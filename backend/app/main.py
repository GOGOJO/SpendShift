from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .database import init_db
from .routes import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown (if needed)


app = FastAPI(title=settings.app_name, lifespan=lifespan)

# CORS configuration - allow common Vite dev server ports
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]
if settings.cors_origins:
    # Convert AnyHttpUrl objects to strings if needed
    for origin in settings.cors_origins:
        origin_str = str(origin)
        if origin_str not in allowed_origins:
            allowed_origins.append(origin_str)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router, prefix="/api")
