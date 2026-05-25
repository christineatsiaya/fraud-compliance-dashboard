# Phase 1 Intelligence Features Design

## Scope

Phase 1 adds executive intelligence features only:

- Executive Intelligence Feed
- State Drilldown Intelligence Drawer
- Compliance Score Methodology page

Phase 2 AI/copilot work is explicitly out of scope.

## Executive Intelligence Feed

The Risk Scores dashboard will include a concise intelligence feed near the top. Cards will summarize high-priority operational findings from the current dataset: high-risk states, total exposure, concentrated exposure, and recommended leadership action. These insights will be deterministic and data-derived, not AI-generated.

## Drilldown Intelligence Drawer

Clicking a state row will open a right-side drawer with state-level details. The drawer will show risk score, tier, revenue exposure, peer context, risk explanation, and recommended next action. This keeps the main dashboard scannable while adding enterprise-style investigation depth.

## Methodology Page

A dedicated `/methodology` route will explain the risk score formula, threshold tiers, revenue exposure assumption, confidence interpretation, assumptions, and limitations. The navbar will include Methodology so recruiters can quickly see analytical rigor.

## Verification

Verification will use `npm run lint`, `npm run build`, and browser review. The repo does not currently include a frontend unit-test runner, so this phase avoids adding a new testing stack just for UI-only changes.
