from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    app_name: str = "SpendShift API"
    environment: str = "development"
    database_url: str = "sqlite:///./spendshift.db"
    cors_origins: List[AnyHttpUrl] | None = None
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    model_config = {
        "env_prefix": "SPENDSHIFT_",
        "case_sensitive": False,
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()
