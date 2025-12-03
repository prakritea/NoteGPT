# backend/services/pdf_logic.py

import io
from typing import List

from PyPDF2 import PdfReader
from backend.utils.gemini_helper import generate_gemini_response_async


def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    """
    Extracts plain text from all pages of a PDF using PyPDF2.
    """
    reader = PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


async def summarize_long_text_with_gemini(text: str) -> str:
    """
    Summarize a long text using Gemini in two passes:
    1) Chunk the text and summarize each chunk.
    2) Summarize the chunk summaries into a final concise summary.
    """
    # Rough character limit per chunk to stay within token limits
    max_chunk_chars = 4000

    if len(text) <= max_chunk_chars:
        prompt = (
            "You are an assistant that summarizes PDF documents.\n\n"
            "Summarize the following content into a clear, concise explanation. "
            "Use bullet points where helpful, but keep it under about 10 bullet points. "
            "Focus on the main ideas, definitions, and conclusions, not minor details.\n\n"
            f"CONTENT:\n{text}"
        )
        return (await generate_gemini_response_async(prompt)).strip()

    # Split into chunks
    chunks: List[str] = [
        text[i : i + max_chunk_chars]
        for i in range(0, len(text), max_chunk_chars)
    ]

    partial_summaries: List[str] = []
    for idx, chunk in enumerate(chunks, start=1):
        prompt = (
            "You are an assistant that summarizes parts of a longer PDF document.\n\n"
            f"This is chunk {idx} of {len(chunks)}.\n"
            "Summarize this chunk into 3–6 concise bullet points highlighting "
            "the most important concepts, definitions, or steps.\n\n"
            f"CHUNK CONTENT:\n{chunk}"
        )
        summary = await generate_gemini_response_async(prompt)
        partial_summaries.append(summary)

    combined = "\n\n".join(partial_summaries)

    # Final pass: summarize summaries
    final_prompt = (
        "You are an assistant that creates a final summary from partial summaries "
        "of a PDF document.\n\n"
        "Below are bullet-point summaries of different parts of the same document.\n"
        "Combine them into a single, coherent summary with:\n"
        "- 5–10 bullet points\n"
        "- No repetition\n"
        "- Clear structure (group related ideas together)\n\n"
        "Keep the summary focused on the key concepts and main arguments.\n\n"
        f"PARTIAL SUMMARIES:\n{combined}"
    )
    final_summary = await generate_gemini_response_async(final_prompt)
    return final_summary.strip()


async def summarize_pdf_file(file_stream: io.BytesIO) -> str:
    """
    Main entry point used by the router:
    1) Extract all text from the PDF.
    2) Summarize the extracted text using Gemini.
    """
    text = extract_text_from_pdf(file_stream)
    if not text or text.strip() == "":
        raise ValueError("Could not extract any text from PDF")

    return await summarize_long_text_with_gemini(text)
