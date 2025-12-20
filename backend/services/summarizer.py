import re
import asyncio
from typing import List, Dict, Any

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

from backend.utils.gemini_helper import generate_gemini_response_async


def extract_video_id(url: str) -> str:
    # Try several common patterns
    patterns = [
        r"(?:v=)([0-9A-Za-z_-]{11})",        # watch?v=...
        r"youtu\.be\/([0-9A-Za-z_-]{11})",   # youtu.be/...
        r"\/embed\/([0-9A-Za-z_-]{11})",     # /embed/...
        r"\/v\/([0-9A-Za-z_-]{11})"          # /v/...
    ]
    for p in patterns:
        m = re.search(p, url)
        if m:
            return m.group(1)
    # fallback: any 11-char id anywhere
    m = re.search(r"([0-9A-Za-z_-]{11})", url)
    if m:
        return m.group(1)
    raise ValueError("Invalid YouTube URL")


def get_transcript(video_id: str) -> List[dict]:
    """
    Fetch transcript for a YouTube video using the new YouTubeTranscriptApi instance API.
    Returns a list of dicts: {text, start, duration}.
    """
    try:
        api = YouTubeTranscriptApi()
        # In the latest version, `fetch` returns a FetchedTranscript object.
        fetched = api.fetch(video_id)

        transcript = [
            {
                "text": snippet.text,
                "start": snippet.start,
                "duration": snippet.duration,
            }
            for snippet in fetched.snippets
        ]
        return transcript

    except TranscriptsDisabled:
        # We raise a specific message so caller can handle gracefully
        raise RuntimeError("Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise RuntimeError("No transcript available for this video.")
    except Exception as e:
        raise RuntimeError(f"Failed to fetch transcript: {e}")


async def summarize_text_with_gemini(full_text: str) -> str:
    """
    Summarize long transcript text using Gemini.
    If text is very long, summarize in chunks then summarize the summaries.
    """
    max_chunk_chars = 4000  # Rough character limit per chunk

    if len(full_text) <= max_chunk_chars:
        prompt = (
            "You are an assistant that summarizes YouTube videos.\n\n"
            "Summarize the following transcript into 5–7 concise bullet points. "
            "Capture the main ideas, not every detail.\n\n"
            f"Transcript:\n{full_text}"
        )
        return await generate_gemini_response_async(prompt)

    # Split into chunks
    chunks = [
        full_text[i : i + max_chunk_chars]
        for i in range(0, len(full_text), max_chunk_chars)
    ]

    partial_summaries: List[str] = []
    for idx, chunk in enumerate(chunks, start=1):
        prompt = (
            "You are an assistant that summarizes parts of a YouTube transcript.\n\n"
            f"This is chunk {idx} of {len(chunks)}.\n"
            "Summarize this chunk into 3–5 concise bullet points:\n\n"
            f"{chunk}"
        )
        summary = await generate_gemini_response_async(prompt)
        partial_summaries.append(summary)

    combined = "\n\n".join(partial_summaries)

    # Final pass: summarize the summaries into one clean output
    final_prompt = (
        "You are an assistant that creates final summaries from partial summaries.\n\n"
        "Below are summaries of different chunks of a YouTube transcript.\n"
        "Combine them into a single, coherent summary with 5–7 bullet points. "
        "Avoid repetition and keep it concise and readable.\n\n"
        f"Chunk summaries:\n{combined}"
    )
    return await generate_gemini_response_async(final_prompt)


async def summarize_youtube_video(url: str) -> Dict[str, Any]:
    """
    Fetch transcript and return BOTH:
    - summary: text (or a helpful explanation message)
    - transcript: list of {text, start, duration}
    This function tries to avoid throwing errors up to the router.
    """
    try:
        video_id = extract_video_id(url)
    except ValueError as e:
        # Invalid URL format
        return {
            "summary": str(e),
            "transcript": [],
        }

    # get_transcript is blocking → run in thread
    try:
        transcript = await asyncio.to_thread(get_transcript, video_id)
    except RuntimeError as e:
        # Transcripts disabled / not found / fetch error
        return {
            "summary": str(e),
            "transcript": [],
        }

    text = " ".join([t.get("text", "") for t in transcript]).strip()
    if not text:
        return {"summary": "No transcript text found.", "transcript": []}

    try:
        summary = await summarize_text_with_gemini(text)
    except Exception as e:
        # Gemini failed – return at least the transcript
        summary = f"Failed to generate AI summary: {e}"

    return {
        "summary": summary,
        "transcript": transcript,
    }
