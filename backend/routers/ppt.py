import os
import uuid
import asyncio
from typing import Any, List

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.services.ppt_logic import (
    generate_slide_content,
    build_ppt_from_content,
    list_available_templates,
)
from backend.models.schemas import PPTRequest

router = APIRouter()


class TemplateInfo(BaseModel):
    id: str
    label: str


@router.get("/ppt/templates", response_model=List[TemplateInfo])
async def get_templates():
    """
    List available PPT templates in backend/templates.
    """
    templates = list_available_templates()
    return [TemplateInfo(**t) for t in templates]


@router.post("/ppt/generate", status_code=status.HTTP_201_CREATED)
async def generate_ppt(req: PPTRequest):
    """
    Generate slide content (async LLM call) and build a PPTX file (sync file I/O executed in a thread).
    Returns the generated PPTX file as a download.
    """
    try:
        slides = await generate_slide_content(req.topic, req.num_slides)
        if not slides:
            raise HTTPException(status_code=500, detail="Failed to generate slide content.")

        fname = f"ppt_{uuid.uuid4().hex}.pptx"
        output_dir = "generated"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, fname)

        try:
            await asyncio.to_thread(
                build_ppt_from_content,
                slides,
                req.template_id,
                output_path,
            )
        except FileNotFoundError as fnf:
            raise HTTPException(status_code=400, detail=str(fnf))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to build PPT: {e}")

        return FileResponse(
            path=output_path,
            filename=f"{req.topic}.pptx",
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
