from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.services.summarizer import summarize_youtube_video

router = APIRouter()


class YouTubeRequests(BaseModel):
    url: str


@router.post("/")
async def summarize_youtube(data: YouTubeRequests):
    """
    Returns JSON:
    {
      "summary": str,
      "transcript": [ { "text": str, "start": float, "duration": float }, ... ]
    }
    We only raise HTTPException on unexpected errors.
    """
    try:
        result = await summarize_youtube_video(data.url)

        # If summarize_youtube_video managed its own errors,
        # `result` will always be a dict with "summary" and "transcript".
        if not isinstance(result, dict):
            raise RuntimeError("Internal summarizer returned invalid data.")

        return result

    except HTTPException:
        # Re-raise if it was already an HTTPException
        raise
    except Exception as e:
        # Unexpected error
        raise HTTPException(status_code=500, detail=str(e))
