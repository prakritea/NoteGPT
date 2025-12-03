# backend/utils/gemini_helper.py
import httpx
from typing import Any

from backend.core.config import settings

BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"


async def generate_gemini_response_async(prompt: str, timeout: int = 30) -> str:
    """
    Async helper to call Gemini's generateContent endpoint.
    """
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set. Check your .env file.")

    model_name = settings.GEMINI_MODEL_NAME or "gemini-2.0-flash"

    url = f"{BASE_URL}/{model_name}:generateContent"
    print("DEBUG: calling Gemini model:", model_name, "URL:", url)

    body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": settings.GEMINI_API_KEY,
    }

    async with httpx.AsyncClient(timeout=timeout) as client:
        r = await client.post(url, json=body, headers=headers)

    if r.status_code != 200:
        raise RuntimeError(f"Gemini returned {r.status_code}: {r.text}")

    data: Any = r.json()

    candidates = data.get("candidates", [])
    if not candidates:
        return ""

    content = candidates[0].get("content", {}) or {}
    parts = content.get("parts", []) or []

    texts = [
        (p.get("text") or "")
        for p in parts
        if isinstance(p, dict) and p.get("text")
    ]
    return " ".join(texts).strip()
