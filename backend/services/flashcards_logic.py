# backend/services/flashcards_logic.py

from typing import List
import json
import re

from backend.models.schemas import FlashcardRequest, Card
from backend.utils.gemini_helper import generate_gemini_response_async


def _extract_json_array(text: str) -> str:
    """
    Try to extract the first top-level JSON array from the text.
    This handles cases where the model wraps JSON in code fences or adds explanations.
    """
    # Remove Markdown code fences if present
    cleaned = re.sub(r"```(?:json)?", "", text, flags=re.IGNORECASE).strip()

    # Find the first '[' and last ']'
    start = cleaned.find("[")
    end = cleaned.rfind("]")

    if start == -1 or end == -1 or end <= start:
        # fallback: just return the whole text
        return cleaned

    return cleaned[start : end + 1]


async def generate_flashcards(req: FlashcardRequest) -> List[Card]:
    prompt_parts = []

    if req.topic:
        prompt_parts.append(f"Topic: {req.topic}")
    if req.text:
        # Optionally truncate very long text to avoid token limits
        max_chars = 8000
        text = req.text if len(req.text) <= max_chars else req.text[:max_chars]
        prompt_parts.append(f"Text:\n{text}")
    if req.file_name:
        prompt_parts.append(f"Source file name: {req.file_name}")

    if prompt_parts:
        prompt_body = "\n\n".join(prompt_parts)
    else:
        prompt_body = "No specific text provided. Create flashcards on a general educational topic."

    prompt = (
        "You are an assistant that creates study flashcards (question and answer pairs).\n\n"
        "From the content below, generate exactly 5 high-quality flashcards that help someone revise the key ideas.\n"
        "Each flashcard must have:\n"
        "- 'q': a clear question\n"
        "- 'a': a concise but complete answer\n\n"
        "CONTENT:\n"
        f"{prompt_body}\n\n"
        "Now respond ONLY with a valid JSON array of objects in this exact format:\n"
        '[{"q": "Question one?", "a": "Answer one."}, {"q": "Question two?", "a": "Answer two."}, ...]\n\n'
        "Do NOT include any extra text, explanations, comments, or Markdown. Only the JSON array."
    )

    raw_content = await generate_gemini_response_async(prompt)
    if not raw_content:
        return []

    # Try to extract just the JSON array part
    json_str = _extract_json_array(raw_content)

    try:
        cards_list = json.loads(json_str)
    except json.JSONDecodeError:
        # As a last resort, try a very lenient line-by-line recovery
        cards_list = []
        for line in raw_content.splitlines():
            line = line.strip()
            if not line or not line.startswith("{"):
                continue
            try:
                obj = json.loads(line.rstrip(","))
                if "q" in obj and "a" in obj:
                    cards_list.append(obj)
            except Exception:
                continue

    result: List[Card] = []
    if isinstance(cards_list, list):
        for c in cards_list:
            if not isinstance(c, dict):
                continue
            q = str(c.get("q", "")).strip()
            a = str(c.get("a", "")).strip()
            if q and a:
                result.append(Card(q=q, a=a))

    return result
