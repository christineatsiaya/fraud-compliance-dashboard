from database import supabase


def get_risk_tier(risk_score: float) -> str:
    if risk_score <= 30:
        return "LOW"
    elif risk_score <= 60:
        return "MEDIUM"
    return "HIGH"


def calculate_risk_scores():
    filings_response = supabase.table("sar_filings").select("*").execute()
    filings = filings_response.data or []

    results = []

    for row in filings:
        state_code = row["state_code"]
        filing_count = row["filing_count"]
        expected_count = row["expected_count"]

        if expected_count and expected_count > 0:
            gap_percentage = ((expected_count - filing_count) / expected_count) * 100
        else:
            gap_percentage = 0

        risk_score = round(min(max(gap_percentage, 0), 100), 2)
        risk_tier = get_risk_tier(risk_score)
        revenue_at_risk = round(risk_score * 500000, 2)

        payload = {
            "state_code": state_code,
            "risk_score": risk_score,
            "revenue_at_risk": revenue_at_risk,
            "risk_tier": risk_tier,
        }

        upsert_response = (
            supabase
            .table("risk_scores")
            .upsert(payload, on_conflict="state_code")
            .execute()
        )

        results.append({
            "input": {
                "state_code": state_code,
                "filing_count": filing_count,
                "expected_count": expected_count,
            },
            "computed": {
                "gap_percentage": round(gap_percentage, 2),
                "risk_score": risk_score,
                "risk_tier": risk_tier,
                "revenue_at_risk": revenue_at_risk,
            },
            "saved": upsert_response.data,
        })

    return results
