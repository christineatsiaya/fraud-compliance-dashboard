# Phase 5 Scenario Forecasting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deterministic scenario forecasting to the Risk Scores dashboard.

**Architecture:** Create focused forecast helper functions with Node tests, add a React scenario component with sliders and charts, then wire it into the existing Risk Scores page after historical trends.

**Tech Stack:** React, Vite, Tailwind CSS, Recharts, Node built-in test runner.

---

### Task 1: Forecast Helpers

**Files:**
- Create: `frontend/src/utils/scenario.js`
- Create: `frontend/src/utils/scenario.test.mjs`

- [x] Write tests for scenario summary metrics.
- [x] Write tests for state-level impact ranking.
- [x] Write tests for empty datasets and percentage formatting.
- [x] Implement deterministic forecasting helpers.

### Task 2: Forecast UI Component

**Files:**
- Create: `frontend/src/components/ScenarioForecasting.jsx`

- [x] Render budget and effectiveness sliders.
- [x] Render projected impact metric cards.
- [x] Render current vs projected risk chart.
- [x] Render highest-impact state list.

### Task 3: Dashboard Integration

**Files:**
- Modify: `frontend/src/pages/RiskScores.jsx`

- [x] Import and render the forecast component.
- [x] Pass sorted filtered data into the component.

### Task 4: Verification

- [x] Run `node --test src/utils/scenario.test.mjs`.
- [x] Run all frontend utility tests.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Verify in browser.
