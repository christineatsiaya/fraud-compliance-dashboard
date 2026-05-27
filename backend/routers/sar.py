from fastapi import APIRouter
from database import supabase
from collections import defaultdict

router = APIRouter(prefix="/sar", tags=["SAR Analytics"])


def is_state_code(value: str) -> bool:
    return isinstance(value, str) and len(value) == 2 and value.isalpha()


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
    response = supabase.table("sar_filings").select("year, filing_count, state_code").execute()

    totals = defaultdict(int)

    for row in response.data:
        if is_state_code(row.get("state_code")):
            totals[row["year"]] += row.get("filing_count", 0)

    return [
        {"year": year, "filing_count": totals[year]}
        for year in sorted(totals)
    ]


@router.get("/top-states")
async def top_states(limit: int = 10):
    response = supabase.table("sar_filings").select(
        "state_code, state_name, filing_count"
    ).execute()

    totals = defaultdict(lambda: {"state_code": "", "state_name": "", "total_filings": 0})

    for row in response.data:
        code = row.get("state_code")
        if is_state_code(code):
            totals[code]["state_code"] = code
            totals[code]["state_name"] = row.get("state_name")
            totals[code]["total_filings"] += row.get("filing_count", 0)

    return sorted(
        totals.values(),
        key=lambda x: x["total_filings"],
        reverse=True,
    )[:limit]


@router.get("/trend-by-state")
async def trend_by_state(state_code: str):
    code = state_code.upper()

    response = (
        supabase.table("sar_filings")
        .select("year, filing_count")
        .eq("state_code", code)
        .execute()
    )

    totals = defaultdict(int)

    for row in response.data:
        totals[row["year"]] += row.get("filing_count", 0)

    return {
        "state_code": code,
        "trend": [
            {"year": year, "filing_count": totals[year]}
            for year in sorted(totals)
        ],
    }