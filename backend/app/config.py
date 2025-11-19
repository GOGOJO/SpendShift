from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl, BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    app_name: str = "SpendShift API"
    environment: str = "development"
    database_url: str = "sqlite:///./spendshift.db"
    cors_origins: List[AnyHttpUrl] | None = None

    class Config:
        env_prefix = "SPENDSHIFT_"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
