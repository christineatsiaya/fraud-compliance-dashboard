# Phase 4 Historical Trend Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add historical trend analytics to the Risk Scores dashboard.

**Architecture:** Add deterministic trend helper functions with Node tests, a focused React trend component, and wire it into the existing Risk Scores page.

**Tech Stack:** React, Vite, Tailwind CSS, Recharts, Node built-in test runner.

---

### Task 1: Trend Helpers

**Files:**
- Create: `frontend/src/utils/trends.js`
- Create: `frontend/src/utils/trends.test.mjs`

- [x] Test generated quarterly trend points.
- [x] Test risk velocity and deteriorating state rankings.
- [x] Implement deterministic trend helpers.

### Task 2: Trend UI Component

**Files:**
- Create: `frontend/src/components/HistoricalTrendAnalysis.jsx`

- [x] Render risk and exposure trend charts.
- [x] Render velocity cards.
- [x] Render fastest deteriorating state list.

### Task 3: Dashboard Integration

**Files:**
- Modify: `frontend/src/pages/RiskScores.jsx`

- [x] Import and render the trend component.
- [x] Pass filtered data into the component.

### Task 4: Verification

- [x] Run `node --test src/utils/trends.test.mjs`.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Verify in browser.
