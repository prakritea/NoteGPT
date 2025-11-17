# backend/routers/youtube.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
from backend.services.summarizer import summarize_youtube_video

router = APIRouter()

class YouTubeRequests(BaseModel):
    url: str

@router.post("/")
async def summarize_youtube(data: YouTubeRequests):
    try:
        # run heavy sync CPU/network work in a thread so uvicorn event loop isn't blocked
        summary = await asyncio.to_thread(summarize_youtube_video, data.url)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
