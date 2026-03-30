# imports for the end points
from fastapi import APIRouter
from database import supabase
from services.risk_engine import calculate_risk_scores


router = APIRouter(
    prefix="/risk",
    tags=['Risk']
)

# get all the risk

@router.post("/risk-scores/calculate")
async def trigger_calculation():
    risk_scores = calculate_risk_scores()
    return risk_scores

#fetch all saved risk scores from the database
@router.get("/risk-scores")
async def get_risk_scores():
    risk_scores = supabase.table("risk_scores").select("*").execute()
    return risk_scores.data

