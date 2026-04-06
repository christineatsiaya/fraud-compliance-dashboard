# imports

from database import supabase


def generate_intervention():
        # Fetch user data from the database
        response = supabase.table('risk_scores').select('*').execute()
        risk_rows = response.data or []
        results = []

        for row in risk_rows:
            state_code = row["state_code"]
            risk_tier = row["risk_tier"]
             
            # Determine the intervention based on the risk level
            if risk_tier == 'HIGH':
                intervention = 'Immediate regulatory review required.'
                confidence_score = 0.95
            elif risk_tier == 'MEDIUM':
                intervention = 'Increase SAR filing audits quarterly.'
                confidence_score = 0.82
            else:
                intervention = 'Maintain current SAR monitoring cadence.'
                confidence_score = 0.75

            payload = {
                "state_code": state_code,
                "recommendation": intervention,
                "priority_level": risk_tier,
                "confidence_score": confidence_score,
                "regulatory_citation": "31 CFR 1020.320"
            }
            response = (
                supabase
                .table('interventions')
                .upsert(payload, on_conflict='state_code')
                .execute()
                )

            results.append({
                'state_code': state_code,
                'priority_level': risk_tier,
                'saved': response.data
            })
        return results
    