# Phase 6 Role-Based Dashboard Design

## Scope

Phase 6 adds role-based dashboard views to the Risk Scores page.

In scope:

- Executive View
- Compliance Analyst View
- Operations View
- Role switcher UI
- Deterministic section visibility rules
- Role-specific context summary

Out of scope:

- Authentication
- User accounts
- Permissions
- Backend persistence
- Separate route architecture

## Role Behavior

Executive View emphasizes portfolio-level decision making:

- Executive intelligence feed
- AI-style insight cards
- Historical trends
- Scenario forecasting
- High-level methodology

Compliance Analyst View emphasizes investigation:

- Filters and search
- Risk score chart
- Detailed state table
- Methodology
- Compliance Copilot
- State drilldown

Operations View emphasizes action management:

- Executive intelligence feed
- Scenario forecasting
- Detailed state table
- Compliance Copilot
- State drilldown

## Data Approach

Role behavior stays frontend-only. A small utility module will define role metadata and section visibility so the page does not hard-code business rules throughout JSX.

## User Experience

The role switcher will appear near the top of the dashboard after the project summary. It will use three compact buttons with role names and short descriptions. Changing roles should immediately adjust which dashboard sections are visible.

## Verification

Role metadata and visibility behavior will be tested with Node's built-in test runner. UI verification will use lint, production build, and browser review.
