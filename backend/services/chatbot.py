# backend/services/chatbot.py
from backend.utils.gemini_helper import generate_gemini_response_async


async def generate_chat_response(prompt: str) -> str:
    """
    Async wrapper around the LLM helper. Keeps logic in one place.
    """
    # TEMP: do NOT hide errors, let them show up in the reply
    try:
        resp = await generate_gemini_response_async(prompt)
        return resp or "No response from LLM."
    except Exception as e:
        # show what actually went wrong
        return f"DEBUG ERROR from Gemini: {e}"
