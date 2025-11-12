# backend/main.py
from fastapi import FastAPI
from backend.routers import youtube as youtube_router
from backend.routers import chat as chat_router
from backend.routers import pdf as pdf_router
from backend.routers import flashcards as flashcards_router
from backend.routers import ppt as ppt_router       # <<< add this

app = FastAPI(title="NoteGPT API")

app.include_router(chat_router.router, prefix="/api/chat", tags=["Chat"])
app.include_router(youtube_router.router, prefix="/api/youtube", tags=["YouTube"])
app.include_router(pdf_router.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(flashcards_router.router, prefix="/api/flashcards", tags=["Flashcards"])
app.include_router(ppt_router.router, prefix="/api/ppt", tags=["PPT"])  # <<< add this

@app.get("/")
async def root():
    return {"message": "NoteGPT backend is up and running"}
