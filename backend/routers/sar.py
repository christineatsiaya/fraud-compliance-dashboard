# imports for the routers
from fastapi import APIRouter
from database import supabase

#lrouter instances
router = APIRouter()

#endpoints for user_router
@router.get("/sar-filings")
async def get_sar_filings():
    sar_filings = supabase.table("sar_filings").select("*").execute()
    return sar_filings.data

@router.get("/sar-filings/{state_code}")
async def get_state_code(state_code: str):
    state = supabase.table("sar_filings").select("*").eq("state_code", state_code).execute()
    return state.data

