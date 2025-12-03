# backend/routers/chat.py
from fastapi import APIRouter, HTTPException
from backend.models.schemas import ChatRequest, ChatResponse
from backend.services.chatbot import generate_chat_response

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(data: ChatRequest):
    try:
        reply = await generate_chat_response(data.message)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
