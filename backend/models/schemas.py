from pydantic import BaseModel
from typing import List
from typing import Optional

class YouTubeRequest(BaseModel):
    url: str

class YouTubeResponse(BaseModel):
    summary: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    
class FlashcardRequest(BaseModel):
    topic: str | None = None
    text: str | None = None
    file_name: str | None = None

class Card(BaseModel):
    q: str
    a: str

class FlashcardResponse(BaseModel):
    cards: List[Card]
    
class PDFSummaryRequest(BaseModel):
    # If you allow both text input and PDF file, you can accept text
    # But here we focus on file upload route, so file is separate
    text: Optional[str] = None  # optional if you want to accept raw text too

class PDFSummaryResponse(BaseModel):
    summary: str
    
    
class PPTRequest(BaseModel):
    topic: str
    template_id: str   # or you could send template filename
    num_slides: int = 5  # how many slides to generate

class SlideContent(BaseModel):
    title: str
    bullets: List[str]

class PPTResponse(BaseModel):
    # Maybe not used; here we will return file, so response might be file
    message: str