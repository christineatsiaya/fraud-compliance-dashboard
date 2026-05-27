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
        "state_code": "IL",
        "risk_score": 83.7,
        "revenue_at_risk": 12700000,
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
        "state_code": "GA",
        "risk_score": 64.1,
        "revenue_at_risk": 8700000,
        "risk_tier": "MEDIUM",
    },
    {
        "state_code": "NJ",
        "risk_score": 58.6,
        "revenue_at_risk": 7600000,
        "risk_tier": "MEDIUM",
    },
    {
        "state_code": "AZ",
        "risk_score": 55.2,
        "revenue_at_risk": 6900000,
        "risk_tier": "MEDIUM",
    },
    {
        "state_code": "NC",
        "risk_score": 51.8,
        "revenue_at_risk": 6200000,
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
    {
        "state_code": "MA",
        "risk_score": 34.5,
        "revenue_at_risk": 2900000,
        "risk_tier": "LOW",
    },
    {
        "state_code": "MN",
        "risk_score": 28.9,
        "revenue_at_risk": 2200000,
        "risk_tier": "LOW",
    },
    {
        "state_code": "OR",
        "risk_score": 24.6,
        "revenue_at_risk": 1800000,
        "risk_tier": "LOW",
    },
    {
        "state_code": "UT",
        "risk_score": 18.4,
        "revenue_at_risk": 1200000,
        "risk_tier": "LOW",
    },
    {
        "state_code": "VT",
        "risk_score": 12.9,
        "revenue_at_risk": 650000,
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
        "state_code": "IL",
        "priority_level": "HIGH",
        "recommendation": (
            "Expand targeted testing for correspondent banking and "
            "cash-intensive customer segments."
        ),
        "regulatory_citation": "31 CFR 1020.320",
        "confidence_score": 0.86,
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
        "state_code": "GA",
        "priority_level": "MEDIUM",
        "recommendation": (
            "Validate analyst staffing against higher-risk filing categories "
            "and regional escalation volume."
        ),
        "regulatory_citation": "FinCEN SAR guidance",
        "confidence_score": 0.74,
    },
    {
        "state_code": "NJ",
        "priority_level": "MEDIUM",
        "recommendation": (
            "Review customer due diligence refresh cadence for elevated "
            "transaction-volume segments."
        ),
        "regulatory_citation": "FFIEC BSA/AML Manual",
        "confidence_score": 0.71,
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
    {
        "state_code": "CO",
        "priority_level": "LOW",
        "recommendation": (
            "Maintain baseline monitoring and review quarterly movement "
            "against peer-state thresholds."
        ),
        "regulatory_citation": "Bank Secrecy Act",
        "confidence_score": 0.66,
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
