# backend/routers/pdf.py
from fastapi import APIRouter, HTTPException, UploadFile, File
from backend.models.schemas import PDFSummaryResponse
from backend.services import pdf_logic
import io

router = APIRouter()

@router.post("/", response_model=PDFSummaryResponse)
async def pdf_summary(file: UploadFile = File(...)):
    # Validate extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        contents = await file.read()  # async read from UploadFile
        stream = io.BytesIO(contents)
        # pdf_logic.summarize_pdf_file is async — await it
        summary = await pdf_logic.summarize_pdf_file(stream)
        return PDFSummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
