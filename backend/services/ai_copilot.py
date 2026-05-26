import json
import os
from typing import Literal

from pydantic import BaseModel, Field


class CopilotState(BaseModel):
    state_code: str
    risk_score: float
    revenue_at_risk: float
    risk_tier: str


class CopilotRequest(BaseModel):
    question_id: str
    active_role: str = "executive"
    selected_state: CopilotState | None = None
    states: list[CopilotState] = Field(default_factory=list)


class CopilotResponse(BaseModel):
    summary: str
    risk_drivers: list[str]
    recommended_actions: list[str]
    confidence_note: str
    source: Literal["openai", "fallback"]


def _format_millions(value: float) -> str:
    return f"${value / 1000000:.1f}M"


def _sort_by_risk(states: list[CopilotState]) -> list[CopilotState]:
    return sorted(states, key=lambda state: state.risk_score, reverse=True)


def _fallback_response(request: CopilotRequest) -> CopilotResponse:
    if not request.states:
        return CopilotResponse(
            summary="No risk score records are available for this dashboard view.",
            risk_drivers=["No visible state records were provided."],
            recommended_actions=[
                "Clear filters or load demo data before requesting an AI summary."
            ],
            confidence_note=(
                "Deterministic fallback response generated because no dashboard "
                "data was available."
            ),
            source="fallback",
        )

    sorted_states = _sort_by_risk(request.states)
    state_context = request.selected_state or sorted_states[0]
    high_risk_states = [
        state.state_code for state in request.states if state.risk_tier == "HIGH"
    ]
    total_exposure = sum(state.revenue_at_risk for state in request.states)

    return CopilotResponse(
        summary=(
            f"{state_context.state_code} is the primary review focus for the "
            f"{request.active_role} view with a {state_context.risk_score:.1f} "
            f"risk score and {_format_millions(state_context.revenue_at_risk)} "
            "in estimated exposure."
        ),
        risk_drivers=[
            f"{state_context.state_code} is classified as {state_context.risk_tier.lower()} risk.",
            f"The visible portfolio represents {_format_millions(total_exposure)} in exposure.",
            (
                f"High-risk jurisdictions in view: {', '.join(high_risk_states)}."
                if high_risk_states
                else "No visible jurisdictions currently exceed the high-risk threshold."
            ),
        ],
        recommended_actions=[
            f"Prioritize {state_context.state_code} for compliance review.",
            "Validate intervention readiness for the next highest-risk states.",
            "Use scenario forecasting to estimate exposure reduction before allocating budget.",
        ],
        confidence_note=(
            "Deterministic fallback response. Configure OPENAI_API_KEY to enable "
            "live AI-generated compliance reasoning."
        ),
        source="fallback",
    )


def _response_schema() -> dict:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "summary": {"type": "string"},
            "risk_drivers": {"type": "array", "items": {"type": "string"}},
            "recommended_actions": {"type": "array", "items": {"type": "string"}},
            "confidence_note": {"type": "string"},
            "source": {"type": "string", "enum": ["openai", "fallback"]},
        },
        "required": [
            "summary",
            "risk_drivers",
            "recommended_actions",
            "confidence_note",
            "source",
        ],
    }


def _build_prompt(request: CopilotRequest) -> str:
    return json.dumps(
        {
            "question_id": request.question_id,
            "active_role": request.active_role,
            "selected_state": request.selected_state.model_dump()
            if request.selected_state
            else None,
            "states": [state.model_dump() for state in request.states],
        }
    )


def _openai_response(request: CopilotRequest) -> CopilotResponse:
    from openai import OpenAI

    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        input=[
            {
                "role": "system",
                "content": (
                    "You are a fraud compliance intelligence copilot. Return "
                    "concise, business-readable JSON for dashboard users. Do "
                    "not invent states or numbers outside the provided data."
                ),
            },
            {"role": "user", "content": _build_prompt(request)},
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "compliance_copilot_response",
                "schema": _response_schema(),
                "strict": True,
            }
        },
    )
    payload = json.loads(response.output_text)
    payload["source"] = "openai"
    return CopilotResponse(**payload)


def build_copilot_response(request: CopilotRequest) -> CopilotResponse:
    if not os.getenv("OPENAI_API_KEY"):
        return _fallback_response(request)

    try:
        return _openai_response(request)
    except Exception:
        return _fallback_response(request)
