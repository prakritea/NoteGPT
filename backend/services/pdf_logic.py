# # backend/services/pdf_logic.py

# from typing import Union
# import io
# from transformers import pipeline
# from PyPDF2 import PdfReader

# # Summarizer model — choose lightweight but good
# summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

# def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
#     reader = PdfReader(file_stream)
#     text = ""
#     for page in reader.pages:
#         # `extract_text()` may return None or empty string
#         page_text = page.extract_text()
#         if page_text:
#             text += page_text + "\n"
#     return text

# def summarize_text(text: str) -> str:
#     # chunk if too large
#     max_chunk_size = 1000  # adjust as needed
#     chunks = [text[i:i + max_chunk_size] for i in range(0, len(text), max_chunk_size)]
#     summary = ""
#     for chunk in chunks:
#         result = summarizer(chunk, max_length=150, min_length=50, do_sample=False)
#         summary += result[0]['summary_text'] + " "
#     return summary.strip()

# def summarize_pdf_file(file) -> str:
#     """
#     file: File-like (UploadFile.file in FastAPI)
#     """
#     # Read file bytes
#     file_bytes = file.read()
#     # Use BytesIO
#     stream = io.BytesIO(file_bytes)
#     text = extract_text_from_pdf(stream)
#     if not text or text.strip() == "":
#         raise ValueError("Could not extract any text from PDF")
#     summary = summarize_text(text)
#     return summary


from typing import Union
import io
from backend.utils.grok_helper import generate_grok_response
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    """Extract text from a PDF file."""
    reader = PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

def summarize_text(text: str) -> str:
    """Summarize text using Grok API."""
    # Check for text length, and handle chunking if too long
    max_length = 2000  # Grok may have limits on input length
    if len(text) > max_length:
        # If the text is too long, split it into chunks and summarize each part
        chunks = [text[i:i + max_length] for i in range(0, len(text), max_length)]
        summary = ""
        for chunk in chunks:
            prompt = f"Please summarize the following text:\n{chunk}"
            chunk_summary = generate_grok_response(prompt)
            summary += chunk_summary + " "
        return summary.strip()

    # For shorter text, generate a direct summary
    prompt = f"Please summarize the following text:\n{text}"
    summary = generate_grok_response(prompt)
    return summary.strip()

def summarize_pdf_file(file) -> str:
    """Summarize the text extracted from a PDF file using Grok API."""
    # Read the file's bytes
    file_bytes = file.read()
    
    # Use BytesIO to handle the file stream
    stream = io.BytesIO(file_bytes)
    text = extract_text_from_pdf(stream)
    
    if not text or text.strip() == "":
        raise ValueError("Could not extract any text from PDF")
    
    # Get the summary using Grok API
    summary = summarize_text(text)
    return summary
