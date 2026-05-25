# Phase 5 Scenario Forecasting Design

## Scope

Phase 5 adds scenario forecasting to the Risk Scores dashboard. The feature answers: "What happens if compliance leadership increases intervention investment and execution effectiveness improves?"

In scope:

- Budget uplift control
- Execution effectiveness control
- Projected risk reduction
- Projected exposure reduction
- Estimated operational savings
- State-level impact ranking
- Current vs projected risk chart

Out of scope:

- Real ML forecasting
- Backend persistence
- Multi-year forecasting
- Role-based dashboards
- Real AI integration

## Data Approach

The app still uses current risk score records as its primary data source. Scenario forecasting will use deterministic frontend helper functions so the demo remains stable, testable, and deployable without external services.

The model will use:

- Current state risk score
- Current revenue at risk
- Risk tier
- Budget uplift percentage
- Execution effectiveness percentage

Risk tiers create different response rates. High-risk states have more room for improvement, medium-risk states improve moderately, and low-risk states improve conservatively.

## Dashboard Placement

The scenario forecasting section will appear after Historical Trend Analysis and before the detailed table. That placement keeps the workflow natural:

1. See current risk
2. Understand trend movement
3. Simulate intervention impact
4. Inspect individual state rows

## User Experience

The section will include two sliders:

- Intervention budget uplift
- Execution effectiveness

The output will update immediately and show:

- Projected exposure reduction
- Estimated operational savings
- Average projected risk improvement
- Best state-level impact opportunities
- Current vs projected risk chart

## Verification

Forecast helper functions will be covered with Node built-in tests. UI verification will use lint, production build, and browser review with a screenshot.
