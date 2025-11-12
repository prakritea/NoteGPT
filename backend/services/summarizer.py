# backend/services/summarizer.py
import re
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
from typing import List
from transformers import pipeline

# Lazy load summarizer
_summarizer = None

def get_summarizer():
    global _summarizer
    if _summarizer is None:
        _summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
    return _summarizer

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
    try:
        return YouTubeTranscriptApi.get_transcript(video_id)
    except TranscriptsDisabled:
        raise RuntimeError("Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise RuntimeError("No transcript available for this video.")
    except Exception as e:
        raise RuntimeError(f"Failed to fetch transcript: {e}")

def summarize_youtube_video(url: str) -> str:
    """Synchronous function (heavy). Consider running this in a worker or using asyncio.to_thread."""
    video_id = extract_video_id(url)
    transcript = get_transcript(video_id)
    text = " ".join([t.get("text", "") for t in transcript]).strip()
    if not text:
        return "No transcript available."

    # Chunk text sensibly (you may prefer sentence splitting)
    chunk_size = 1000
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
    s = get_summarizer()
    parts = []
    for chunk in chunks:
        res = s(chunk, max_length=150, min_length=50, do_sample=False)
        parts.append(res[0]["summary_text"])
    return " ".join(parts).strip()
