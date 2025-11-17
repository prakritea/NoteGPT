# backend/models/schemas.py
from pydantic import BaseModel
from typing import List, Optional

class YouTubeRequest(BaseModel):
    url: str

class YouTubeRespons44e(BaseModel):
    summary: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

class FlashcardRequest(BaseModel):
    topic: Optional[str] = None
    text: Optional[str] = None
    file_name: Optional[str] = None

class Card(BaseModel):
    q: str
    a: str

class FlashcardResponse(BaseModel):
    cards: List[Card]

class PDFSummaryRequest(BaseModel):
    text: Optional[str] = None

class PDFSummaryResponse(BaseModel):
    summary: str

class PPTRequest(BaseModel):
    topic: str
    template_id: str
    num_slides: int = 5

class SlideContent(BaseModel):
    title: str
    bullets: List[str]

class PPTResponse(BaseModel):
    message: str
