# Phase 7 Reporting Export Design

## Scope

Phase 7 adds an executive report export to the Risk Scores dashboard.

In scope:

- Executive report button
- Structured HTML report generation
- Current filter and role context
- KPI summary
- Top risk state ranking
- Historical trend summary
- Scenario forecast summary
- Methodology note

Out of scope:

- PDF dependency
- Backend report persistence
- Email delivery
- Scheduled reporting
- Authentication-based report permissions

## Report Format

The export will generate a standalone `.html` report. This keeps the feature lightweight, browser-readable, printable to PDF, and easy for recruiters to inspect without adding a large client-side PDF library.

## Data Approach

The report will be generated from the same filtered dashboard data shown on screen. It will reuse existing deterministic utilities:

- Executive insight builder
- Historical trend builder
- Scenario forecast builder
- Role metadata

## User Experience

The report export button will sit next to the existing CSV export action. CSV remains the raw data export. The executive report becomes the polished business-facing artifact.

## Verification

Report helper functions will be covered with Node built-in tests. UI verification will use lint, production build, and browser review.
