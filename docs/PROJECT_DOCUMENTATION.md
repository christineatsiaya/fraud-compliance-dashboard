# Project Documentation

## Product Summary

Fraud Compliance Dashboard is a decision-support prototype for understanding state-level fraud compliance exposure. It uses the SAR gap as the core policy frame: suspicious activity reporting is necessary, but the value comes from turning fragmented reporting signals into prioritized action.

The app is designed for reviewers, analysts, and evaluators who need to understand both the project argument and the working software quickly.

## Core User Workflows

### 1. Understand the project

Users start on the Risk Scores dashboard so reviewers immediately see a working analytics product. The About page explains the compliance problem, data workflow, and purpose of the prototype without delaying access to the dashboard.

### 2. Review risk scores

The Risk Scores page fetches saved risk score records from the backend. Users can:

- Filter by risk tier.
- Search by state code.
- Sort table columns.
- Review a bar chart of risk score by state.
- Export the current filtered view to CSV.

### 3. Review recommended interventions

The Interventions page fetches recommended compliance actions. Users can:

- Filter by priority level.
- Review recommendation text.
- Review regulatory citations.
- Compare confidence scores.
- Export the filtered intervention set to CSV.

## Frontend Architecture

The frontend is a Vite React app.

Key files:

- `frontend/src/App.jsx`: route definitions.
- `frontend/src/components/Navbar.jsx`: global navigation.
- `frontend/src/pages/Home.jsx`: About page with project explanation and dashboard entry links.
- `frontend/src/pages/RiskScores.jsx`: risk score dashboard.
- `frontend/src/pages/Interventions.jsx`: intervention recommendation dashboard.
- `frontend/src/services/api.js`: shared Axios client.

The frontend uses Tailwind CSS utility classes for layout and visual styling. `api.js` reads `VITE_API_BASE_URL` and defaults to `http://localhost:8000`.

The shared Axios client uses a six-second timeout. If the live API is unavailable, the Risk Scores and Interventions pages display labeled demo data so reviewers can still inspect the dashboard interface during local setup.

## Backend Architecture

The backend is a FastAPI app with routers organized by domain.

Key files:

- `backend/main.py`: FastAPI app setup, router registration, CORS, and health check.
- `backend/database.py`: Supabase client setup.
- `backend/routers/states.py`: state reference endpoints.
- `backend/routers/sar.py`: SAR filing endpoints.
- `backend/routers/risk.py`: risk score endpoints.
- `backend/routers/interventions.py`: intervention endpoints.
- `backend/services/risk_engine.py`: risk scoring logic.
- `backend/services/intervention_engine.py`: intervention generation logic.

## Data Model

### `states`

Stores state reference records, including state code and regional classification.

### `sar_filings`

Stores SAR filing counts and expected SAR filing counts by state and year. This table supports the analytical foundation for identifying reporting gaps.

### `risk_scores`

Stores computed state-level risk scores, risk tier labels, and estimated revenue at risk.

### `interventions`

Stores recommended compliance actions by state, including priority level, recommendation text, regulatory citation, and confidence score.

## Demo Data

Use `backend/seed_demo_data.py` to populate Supabase with the same portfolio demo records used by the frontend fallback. This is the preferred deployment path because Vercel should call the Render-hosted FastAPI backend, and the backend should return real Supabase records.

```bash
cd backend
python seed_demo_data.py
```

## Risk Methodology

The risk engine uses SAR filing gap analysis:

```text
gap percentage = ((expected_count - filing_count) / expected_count) * 100
risk score = gap percentage clamped from 0 to 100
```

Tiering:

| Score range | Tier |
| --- | --- |
| `0-30` | Low |
| `30.01-60` | Medium |
| `60.01-100` | High |

Revenue at risk is kept as a separate estimated exposure field. This lets the project explain compliance risk and business impact without hard-coding one permanent dollar model.

## API Contract

The frontend currently depends on these backend response fields:

### Risk score records

```json
{
  "id": 1,
  "state_code": "CA",
  "risk_score": 87.5,
  "revenue_at_risk": 12500000,
  "risk_tier": "HIGH"
}
```

### Intervention records

```json
{
  "id": 1,
  "state_code": "CA",
  "priority_level": "HIGH",
  "recommendation": "Increase review cadence for high-risk filings.",
  "regulatory_citation": "31 CFR Chapter X",
  "confidence_score": 0.91
}
```

## Design Principles

- Make the policy argument visible in the product.
- Keep dashboard workflows direct and inspectable.
- Prioritize filters, sorting, summaries, and exports over decorative UI.
- Keep the app easy to explain to evaluators, recruiters, and technical reviewers.
- Preserve clear boundaries between frontend presentation, API routes, data access, and service logic.

## Local Development Workflow

1. Start the backend with `uvicorn main:app --reload` from `backend/`.
2. Start the frontend with `npm run dev` from `frontend/`.
3. Visit the Vite local URL.
4. Review the Risk Scores dashboard at `/`, then navigate to Interventions or About.
5. Run `npm run lint` and `npm run build` before committing frontend changes.
6. Run `pytest` from `backend/` before committing backend changes.

## Known Gaps

- Local seed data setup is not yet documented as a repeatable script.
- Backend tests cover only basic API availability.
- Frontend tests are not configured yet.
- Supabase environment variable documentation depends on the final database client configuration.
- Deployment configuration should be expanded once production URLs are known.
- Demo fallback data is frontend-only and should be replaced by seeded local data for production-like demos.

## Suggested Next Improvements

- Add sample data fixtures for demo use.
- Add state detail pages with SAR filing trends.
- Add a methodology page explaining the risk score formula.
- Add authentication for analyst-only workflows.
- Add status tracking for interventions.
- Add CI checks for frontend lint/build and backend tests.
