# backend/routers/ppt.py
import os
import uuid
import asyncio
from typing import Any

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from backend.services.ppt_logic import generate_slide_content, build_ppt_from_content
from backend.models.schemas import PPTRequest

router = APIRouter()


@router.post("/ppt/generate", status_code=status.HTTP_201_CREATED)
async def generate_ppt(req: PPTRequest):
    """
    Generate slide content (async LLM call) and build a PPTX file (sync file I/O executed in a thread).
    Returns the generated PPTX file as a download.
    """
    try:
        # 1) Generate slide outlines/content — this should be an async function in ppt_logic.py
        slides = await generate_slide_content(req.topic, req.num_slides)
        if not slides:
            raise HTTPException(status_code=500, detail="Failed to generate slide content.")

        # 2) Prepare output path
        fname = f"ppt_{uuid.uuid4().hex}.pptx"
        output_dir = "generated"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, fname)

        # 3) Build PPTX in a background thread to avoid blocking the event loop
        # build_ppt_from_content is synchronous (uses python-pptx); run it with asyncio.to_thread
        try:
            await asyncio.to_thread(build_ppt_from_content, slides, req.template_id, output_path)
        except FileNotFoundError as fnf:
            # Template not found or similar
            raise HTTPException(status_code=400, detail=str(fnf))
        except Exception as e:
            # Unexpected error while building PPT
            raise HTTPException(status_code=500, detail=f"Failed to build PPT: {e}")

        # 4) Return file for download
        return FileResponse(
            path=output_path,
            filename=f"{req.topic}.pptx",
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        )

    except HTTPException:
        # Re-raise HTTPExceptions unchanged
        raise
    except Exception as e:
        # Generic fallback
        raise HTTPException(status_code=500, detail=str(e))
