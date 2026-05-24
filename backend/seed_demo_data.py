from database import supabase


RISK_SCORES = [
    {
        "state_code": "CA",
        "risk_score": 91.4,
        "revenue_at_risk": 18400000,
        "risk_tier": "HIGH",
    },
    {
        "state_code": "NY",
        "risk_score": 86.2,
        "revenue_at_risk": 15100000,
        "risk_tier": "HIGH",
    },
    {
        "state_code": "TX",
        "risk_score": 74.8,
        "revenue_at_risk": 13200000,
        "risk_tier": "MEDIUM",
    },
    {
        "state_code": "FL",
        "risk_score": 69.5,
        "revenue_at_risk": 9800000,
        "risk_tier": "MEDIUM",
    },
    {
        "state_code": "WA",
        "risk_score": 42.7,
        "revenue_at_risk": 4100000,
        "risk_tier": "LOW",
    },
    {
        "state_code": "CO",
        "risk_score": 38.9,
        "revenue_at_risk": 3300000,
        "risk_tier": "LOW",
    },
]


INTERVENTIONS = [
    {
        "state_code": "CA",
        "priority_level": "HIGH",
        "recommendation": (
            "Increase review cadence for high-volume SAR categories and "
            "escalate repeat entity patterns."
        ),
        "regulatory_citation": "31 CFR Chapter X",
        "confidence_score": 0.92,
    },
    {
        "state_code": "NY",
        "priority_level": "HIGH",
        "recommendation": (
            "Coordinate targeted control testing for institutions with "
            "elevated filing gaps."
        ),
        "regulatory_citation": "Bank Secrecy Act",
        "confidence_score": 0.89,
    },
    {
        "state_code": "TX",
        "priority_level": "MEDIUM",
        "recommendation": (
            "Review threshold tuning for fraud typologies with inconsistent "
            "reporting coverage."
        ),
        "regulatory_citation": "FinCEN SAR guidance",
        "confidence_score": 0.81,
    },
    {
        "state_code": "FL",
        "priority_level": "MEDIUM",
        "recommendation": (
            "Prioritize analyst sampling for suspicious account velocity "
            "indicators."
        ),
        "regulatory_citation": "31 CFR 1020.320",
        "confidence_score": 0.77,
    },
    {
        "state_code": "WA",
        "priority_level": "LOW",
        "recommendation": (
            "Maintain quarterly monitoring and compare against regional peer "
            "baselines."
        ),
        "regulatory_citation": "FFIEC BSA/AML Manual",
        "confidence_score": 0.68,
    },
]


def seed_demo_data():
    risk_response = (
        supabase.table("risk_scores")
        .upsert(RISK_SCORES, on_conflict="state_code")
        .execute()
    )
    intervention_response = (
        supabase.table("interventions")
        .upsert(INTERVENTIONS, on_conflict="state_code")
        .execute()
    )

    return {
        "risk_scores": len(risk_response.data or []),
        "interventions": len(intervention_response.data or []),
    }


if __name__ == "__main__":
    result = seed_demo_data()
    print(
        "Seeded "
        f"{result['risk_scores']} risk scores and "
        f"{result['interventions']} interventions."
    )
