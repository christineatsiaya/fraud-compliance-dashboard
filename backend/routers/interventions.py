# imports
from fastapi import APIRouter
from database import supabase
from services.intervention_engine import generate_intervention

# router
router = APIRouter(
    prefix="/interventions",
    tags=["interventions"],
)

@router.post("/generate")
async def trigger_intervention():
    return generate_intervention()

@router.get("/")
async def get_interventions():
    response = supabase.table("interventions").select("*").execute()
    return response.data

@router.get("/{state_code}")
async def get_interventions_by_state(state_code: str):
    response = supabase.table("interventions").select("*").eq("state_code", state_code).execute()
    return response.data