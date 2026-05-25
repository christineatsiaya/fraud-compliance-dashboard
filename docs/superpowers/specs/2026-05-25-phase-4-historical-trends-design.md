# Phase 4 Historical Trend Analysis Design

## Scope

Phase 4 adds historical trend analysis to the Risk Scores dashboard.

In scope:

- Quarterly risk trend chart
- Quarterly exposure trend chart
- Risk velocity metrics
- Fastest deteriorating states

Out of scope:

- Scenario forecasting
- Real-time updates
- Backend historical persistence
- ML forecasting
- Role-based dashboards

## Data Approach

The current app has current-state risk records but not historical records. For this phase, the frontend will derive deterministic demo trend data from the current risk score dataset. The UI will clearly present it as trend analysis for the dashboard prototype.

## Dashboard Placement

The historical trend analysis section will appear on the Risk Scores page after the main chart/table workflow. It should make the dashboard feel more analytical without disrupting the current recruiter-first landing experience.

## Verification

Trend helper functions will be tested with Node's built-in test runner. UI verification will use lint, build, and browser review.
