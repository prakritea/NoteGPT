# backend/core/config.py
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL_NAME: str = "gemini-2.0-flash"  # default model

    # we won't actually use GEMINI_API_URL anymore, but you can keep it
    GEMINI_API_URL: str = (
        "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()

print("DEBUG: GEMINI_API_KEY length:", len(settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None)
print("DEBUG: GEMINI_MODEL_NAME from settings:", settings.GEMINI_MODEL_NAME)
