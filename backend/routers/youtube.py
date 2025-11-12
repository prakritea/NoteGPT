from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.summarizer import summarize_youtube_video

router = APIRouter()

class YouTubeRequests(BaseModel):
    url:str
    
@router.post("/summarize")
def summarize_youtube(data: YouTubeRequests):
    try:
        summary = summarize_youtube_video(data.url)
        return{"summary" : summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    