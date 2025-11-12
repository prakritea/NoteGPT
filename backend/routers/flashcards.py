# backend/routers/flashcards.py
from fastapi import APIRouter, HTTPException
from backend.models.schemas import FlashcardRequest, FlashcardResponse
from backend.services.flashcards_logic import generate_flashcards  # will be async

router = APIRouter()

@router.post("/", response_model=FlashcardResponse)
async def flashcards_endpoint(req: FlashcardRequest):
    try:
        cards = await generate_flashcards(req)
        if not cards:
            raise HTTPException(status_code=500, detail="No flashcards generated.")
        return FlashcardResponse(cards=cards)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
