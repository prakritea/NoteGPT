# backend/routers/pdf.py

from fastapi import APIRouter, HTTPException, UploadFile, File
from backend.models.schemas import PDFSummaryResponse
from backend.services.pdf_logic import summarize_pdf_file

router = APIRouter()

@router.post("/pdf/summary", response_model=PDFSummaryResponse)
async def pdf_summary(file: UploadFile = File(...)):
    try:
        # Check file type if you want
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        summary = summarize_pdf_file(file.file)  # file.file is a file-like object
        return PDFSummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
