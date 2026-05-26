from fastapi import APIRouter

from services.ai_copilot import (
    CopilotRequest,
    CopilotResponse,
    build_copilot_response,
)


router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)


@router.post("/compliance-copilot", response_model=CopilotResponse)
async def compliance_copilot(request: CopilotRequest):
    return build_copilot_response(request)
