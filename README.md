# fraud-compliance-dashboard
Full-stack US fraud compliance intelligence platform — React, FastAPI, Supabase

## Tech stack
- React
- FastAPI
- Supabase
- Streamlit
- Render
- Vercel

## Core Insight
The “SAR-gap” is the disconnect between how financial institutions report suspicious activity and what regulators can actually act on. Fraudsters exploit weak controls, fragmented oversight, outdated thresholds, and high volumes of vague, defensive SARs to operate in plain sight. This project argues that these conditions reflect a policy failure—systems prioritize deterrence over rapid disruption and risk-based resourcing—then explores how data and analytics can help close that gap.

## Project Structure
- frontend/ - User-facing app for dashboards and interaction.
- backend/ - Server logic, APIs, and data processing.
- streamlit/ -  Quick analytics app for testing and visualizing results.

## Database Schema
- `states` — stores all 50 US states with region classification
- `sar_filings` — stores actual vs expected SAR filing counts per state per year
- `risk_scores` — stores computed risk score and revenue at risk per state
- `interventions` — stores recommended compliance actions per state with confidence scores


## set up instructions
 coming soon 