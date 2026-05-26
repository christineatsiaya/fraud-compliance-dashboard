from fastapi import APIRouter
from database import supabase

router = APIRouter(prefix="/sar", tags=["SAR Analytics"])


@router.get("/sar-filings")
async def get_sar_filings():
    response = supabase.table("sar_filings").select("*").execute()
    return response.data


@router.get("/sar-filings/{state_code}")
async def get_state_filings(state_code: str):
    response = (
        supabase.table("sar_filings")
        .select("*")
        .eq("state_code", state_code.upper())
        .execute()
    )
    return response.data


@router.get("/trend-by-year")
async def trend_by_year():
    response = supabase.rpc("sar_trend_by_year").execute()
    return response.data


@router.get("/top-states")
async def top_states(limit: int = 10):
    response = supabase.rpc(
        "sar_top_states",
        {"limit_count": limit}
    ).execute()

    return response.data


@router.get("/trend-by-state")
async def trend_by_state(state_code: str):
    response = supabase.rpc(
        "sar_trend_by_state",
        {"state_input": state_code.upper()}
    ).execute()

    return {
        "state_code": state_code.upper(),
        "trend": response.data
    }