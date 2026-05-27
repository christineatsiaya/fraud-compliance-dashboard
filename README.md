# FinCEN Guard - Fraud Compliance Dashboard

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://fraud-compliance-dashboard.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20FastAPI%20%7C%20Supabase-blue)]()

**Tech Stack:** React - Vite - FastAPI - Python - Supabase - PostgreSQL - Recharts - Axios - Tailwind CSS - OpenAI-ready AI Copilot

---

## Overview

FinCEN Guard is a full-stack fraud compliance intelligence platform that helps compliance teams identify suspicious activity reporting blind spots, prioritize state-level risk, and translate SAR filing gaps into operational interventions.

The platform turns fragmented compliance signals into an executive-ready dashboard for regulated-industry decision-making. It combines SAR filing analytics, state risk scoring, intervention recommendations, role-based views, and an AI copilot experience in one workflow.

The platform enables compliance teams and reviewers to:

- Monitor state-level fraud and compliance risk scores
- Compare SAR filing gaps across U.S. states
- View SAR filing volume through a geographic risk map
- Analyze national and state-level SAR filing trends
- Prioritize recommended compliance interventions
- Switch between Executive, Analyst, and Operations views
- Export reports and CSV data for leadership review
- Ask plain-English compliance questions through an AI copilot interface

**Live Demo:** [https://fraud-compliance-dashboard.vercel.app/](https://fraud-compliance-dashboard.vercel.app/)

The demo includes a guided "Try Demo" tour, API-backed dashboard pages, role-based dashboard views, SAR analytics, intervention workflow controls, and fallback demo data if the backend is waking up.

## Demo Access

The live demo is public and does not require login credentials.

If the Render backend is cold, the frontend may show a wake-up message or fallback demo data while the API starts. This is expected for free-tier deployment.

---

## Why I Built This

Suspicious Activity Reports are one of the core tools used in anti-money laundering and fraud compliance, but filing volume alone does not tell teams where to focus. Compliance teams need to understand where reporting gaps, high-volume jurisdictions, operational exposure, and intervention priorities intersect.

I built FinCEN Guard to demonstrate how analytics engineering and full-stack product design can support regulated-industry decision-making. Instead of building a generic dashboard, I chose a domain with real business stakes: BSA/SAR compliance, state-level fraud monitoring, and regulator-ready risk intelligence.

The goal was to build a production-style analytics application that shows:

- Technical depth through a real frontend, backend, database, and deployed API
- Product thinking through role-specific dashboard views
- Domain fluency through FinCEN, SAR, BSA, risk tiers, and intervention framing
- Data storytelling through dashboards, maps, KPIs, and guided demo flows
- AI readiness through a compliance copilot interface

This project was designed for portfolio review by analytics, fintech, banking, healthcare compliance, and risk intelligence teams.

---

## Screenshots

## Landing Page

Public-facing overview with a direct live demo entry point.

![Landing Page](docs/screenshots/home.png)

---

## Risk Scores Dashboard

State-level risk scoring dashboard with live data status, KPIs, filters, exports, role switching, and AI copilot.

![Risk Scores Dashboard](docs/screenshots/risk-scores.png)

---

## Recommended Interventions

Compliance action queue with priority levels, confidence scores, regulatory citations, and workflow status controls.

![Interventions Dashboard](docs/screenshots/interventions.png)

---

## State Drilldown

State-level drawer showing risk explanation, revenue exposure, peer context, and recommended next action.

![State Drilldown](docs/screenshots/state-drilldown.png)

---

## Methodology

Transparent explanation of scoring assumptions, risk tiers, exposure framing, and current model limitations.

![Methodology Page](docs/screenshots/methodology.png)

---

## Business Problem

Fraud and compliance teams often face fragmented workflows:

- **SAR filing data** is available, but hard to translate into action
- **State-level exposure** is difficult to compare consistently
- **Risk reporting** often lives in spreadsheets or static slide decks
- **Operational recommendations** are disconnected from analytics
- **Executives, analysts, and operations teams** need different levels of detail
- **AI adoption** is expected, but needs structured guardrails in regulated domains

These gaps create:

- Slow compliance triage
- Weak prioritization of high-risk jurisdictions
- Limited visibility into filing blind spots
- Manual reporting overhead
- Poor translation from analytics to intervention

FinCEN Guard addresses this by combining data ingestion, scoring, visualization, workflow recommendations, and role-based intelligence in one dashboard experience.

---

## Key Features

### Multi-Role Dashboard Experience

| Role | Key Capabilities |
| --- | --- |
| **Executive** | Portfolio KPIs, revenue exposure, executive intelligence feed, leadership-level risk summary |
| **Analyst** | Filters, drilldowns, methodology, state-level evidence, AI copilot access |
| **Operations** | Intervention workflow, recommended actions, status tracking, operational follow-through |

### SAR Risk Intelligence Workflow

**End-to-End Pipeline:**

```text
SAR Filing Data -> Risk Score Calculation -> State Dashboard
-> AI Copilot Insight -> Intervention Recommendation -> Exportable Report
```

This workflow:

- Converts filing gaps into normalized risk scores
- Separates compliance risk from estimated revenue exposure
- Flags high-risk states for review
- Provides intervention recommendations with confidence scores
- Supports executive review and analyst investigation

### Business Intelligence Dashboards

Real-time dashboard areas include:

- State-level risk scores
- SAR filing gap metrics
- Revenue at risk estimates
- U.S. SAR filing map
- National SAR filing trend analytics
- Top-state filing comparisons
- Recommended intervention queue
- Executive intelligence feed
- AI copilot response panel

---

## Technical Architecture

```text
Landing Page
Risk Dashboard
Risk Map
SAR Analytics
Interventions
Reports
    |
    v
React + Vite Frontend
    |
    v
FastAPI Backend API
    |
    +--> Supabase PostgreSQL
    +--> Risk Scoring Engine
    +--> Intervention Engine
```

### Frontend - React + Vite

- **Route-based dashboard architecture** with React Router
- **Shared DashboardLayout** for consistent desktop, tablet, and mobile navigation
- **Responsive sidebar** with collapse behavior and mobile drawer
- **Role-based dashboard views** for executive, analyst, and operations workflows
- **Reusable cards, tables, charts, drawers, and export controls**
- **Guided Try Demo tour** for recruiters and reviewers
- **API state handling** with loading, fallback, and backend wake-up messaging

### Backend - FastAPI + Python

REST-style API architecture supporting:

- Risk score retrieval and calculation
- SAR filing trend endpoints
- Top-state filing volume endpoints
- State-level SAR history
- Intervention recommendations
- Backend health checks

**Key Design Priorities:**

- Clear service boundaries for risk scoring and intervention logic
- API-backed dashboard data instead of static frontend-only mockups
- Deployment-ready backend for Render
- Demo seed workflow for Supabase-backed portfolio data

### Database - Supabase PostgreSQL

Core tables:

- `states` - U.S. state reference data and regional classification
- `sar_filings` - SAR filing counts by state, year, and industry
- `risk_scores` - Computed state risk score, tier, and revenue exposure
- `interventions` - Recommended actions, priority, citations, and confidence scores

The database supports state-level analytics, intervention workflows, and dashboard drilldowns.

### Analytics and Scoring

The backend risk engine compares actual SAR filing counts against expected filing counts:

```text
gap_percentage = ((expected_count - filing_count) / expected_count) * 100
risk_score = clamp(gap_percentage, 0, 100)
```

Risk tiers:

| Score Range | Tier | Operational Meaning |
| --- | --- | --- |
| `0-30` | Low | Baseline monitoring |
| `30.01-60` | Medium | Targeted monitoring |
| `60.01-100` | High | Immediate review |

Revenue at risk is modeled separately so the compliance signal and business-impact estimate remain explainable.

---

## Engineering Highlights

### API-Backed Portfolio Demo

The deployed dashboard reads from Supabase through FastAPI endpoints and shows live sync status. A broader 15-state seed dataset is included so the dashboard has meaningful risk distribution instead of looking like a static mockup.

### Shared Dashboard Layout

Built a reusable `DashboardLayout` component so Dashboard, Risk Map, SAR Analytics, Interventions, and Reports all share consistent navigation, collapse behavior, mobile responsiveness, and demo tour access.

### Role-Based Product Thinking

Implemented Executive, Analyst, and Operations views to show how the same data can be repackaged for different stakeholders. This demonstrates product judgment beyond basic dashboard construction.

### SAR Filing Map

Created a state-level SAR filing map that colors all U.S. states based on loaded filing volume, making geographic concentration easier to understand at a glance.

### Intervention Workflow

Designed an action queue that translates risk intelligence into recommended compliance interventions with priority levels, confidence scores, regulatory citations, and status controls.

### Backend Cold-Start Handling

Updated the shared Axios client timeout and SAR Analytics loading/error states so Render free-tier cold starts do not silently produce blank charts.

### AI Copilot Interface

Added a structured AI copilot panel that lets reviewers ask plain-English questions about states, risk drivers, recommended actions, and portfolio priorities.

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase project
- Render or local FastAPI runtime

### Local Setup

```bash
# Clone repository
git clone https://github.com/christineatsiaya/fraud-compliance-dashboard
cd fraud-compliance-dashboard

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup in a second terminal
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Visit `http://localhost:5173`.

### Environment Variables

Frontend `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Backend environment variables:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
```

### Seed Demo Data

After configuring Supabase credentials:

```bash
cd backend
python seed_demo_data.py
```

This writes a 15-state risk-score portfolio and intervention queue to Supabase so the deployed frontend shows meaningful API-backed demo data.

---

## Deployment

### Frontend - Vercel

- Deployed as a Vite React app
- Production URL: [https://fraud-compliance-dashboard.vercel.app/](https://fraud-compliance-dashboard.vercel.app/)
- Required environment variable:

```bash
VITE_API_BASE_URL=https://your-render-api-url.onrender.com
```

### Backend - Render

- FastAPI app deployed on Render
- Supabase credentials configured in Render environment variables
- Free-tier cold starts are handled with a longer frontend timeout and visible loading messaging

---

## Use Cases

### Banking and Fintech Compliance Teams

- Identify SAR filing blind spots
- Prioritize high-risk jurisdictions
- Translate analytics into operational interventions
- Produce leadership-ready risk summaries

### Healthcare and Regulated Operations Teams

- Monitor fraud risk across regions
- Track suspicious activity patterns
- Build repeatable intervention workflows
- Support audit-ready reporting

### Analytics and Risk Intelligence Teams

- Combine API-backed data with business intelligence dashboards
- Visualize geographic risk concentration
- Explore state-level risk drivers
- Prototype AI-assisted compliance workflows

---

## Future Enhancements

Strategic roadmap priorities:

### Institution-Level Data Modeling

Expand from state-level scoring to institution-level filing behavior, peer benchmarking, and risk normalization.

### Authentication and Protected Workflows

Add Supabase Auth or OAuth-based login for analyst, operations, and executive users.

### Advanced Risk Forecasting

Add time-series risk movement, intervention impact simulation, and SAR filing velocity detection.

### AI Compliance Workbench

Connect the copilot to richer state context, methodology references, and structured report generation.

### Production Reporting

Generate downloadable PDF or HTML executive reports with selected filters, state drilldowns, and intervention history.

---

## Technical Concepts Demonstrated

This project showcases practical implementation of:

- Full-stack analytics application development
- React dashboard architecture
- FastAPI backend API design
- Supabase PostgreSQL persistence
- Risk scoring and analytics modeling
- Recharts-based KPI visualization
- Responsive dashboard navigation
- Role-based dashboard presentation
- API loading, fallback, and cold-start handling
- CSV and report export workflows
- Compliance-domain product framing
- AI-assisted analytics interface design
- Vercel and Render deployment patterns

---

## Lessons Learned

Building FinCEN Guard provided hands-on experience with:

1. **Domain-Driven Analytics** - A dashboard is stronger when it is grounded in a real regulated-industry problem rather than generic sample data.

2. **Full-Stack Data Flow** - Building the frontend, backend, and Supabase layer together made API contracts, loading states, and deployment behavior much more concrete.

3. **Product Framing** - Executive, Analyst, and Operations users need different views of the same underlying data.

4. **Deployment Reality** - Render free-tier cold starts require thoughtful timeout handling and visible user feedback.

5. **Data Storytelling** - Recruiters and stakeholders need the README, landing page, and demo data to tell the same story as the code.

The project reinforced that strong analytics software combines technical execution, domain fluency, and clear product storytelling.

---

## Author

**Christine Rita Akinyi**  
MS Business Analytics - Montclair State University

**Areas of Interest:**

- Analytics Engineering
- Risk Intelligence Systems
- Fraud and Compliance Analytics
- Full-Stack Analytics Applications
- SaaS Platforms and Product Development
- Business Analytics and Data Visualization

**Connect:**

- GitHub: [@christineatsiaya](https://github.com/christineatsiaya)

---

## License

MIT License - feel free to use this project for learning or as a foundation for your own compliance analytics dashboard.

---

## Acknowledgments

Built with inspiration from modern compliance intelligence platforms, fraud analytics workflows, and enterprise risk dashboards. Special thanks to the open-source community for the tools that made this project possible.

---

**If you found this project helpful, please consider giving it a star.**

