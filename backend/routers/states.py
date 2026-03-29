from fastapi import APIRouter
from database import supabase

router = APIRouter()

@router.get("/states")
async def get_states():
    states = supabase.table("states").select("*").execute()
    return states.data   

@router.get("/states/{state_code}")
async def get_state_code(state_code: str):
    state = supabase.table("states").select("*").eq("state_code", state_code).execute()
    return state.data
