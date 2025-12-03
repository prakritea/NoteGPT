# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import (
    chat as chat_router,
    flashcards as flashcards_router,
    pdf as pdf_router,
    ppt as ppt_router,
    youtube as youtube_router,
)

app = FastAPI(title="NoteGPT API")

# -----------------------
# 🔥 ENABLE CORS FOR FRONTEND
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# 🔗 ROUTES
# -----------------------
app.include_router(chat_router.router, prefix="/api/chat", tags=["Chat"])
app.include_router(flashcards_router.router, prefix="/api/flashcards", tags=["Flashcards"])
app.include_router(pdf_router.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(ppt_router.router, prefix="/api", tags=["PPT"])
app.include_router(youtube_router.router, prefix="/api/youtube", tags=["YouTube"])

@app.get("/")
def root():
    return {"status": "API is running"}
