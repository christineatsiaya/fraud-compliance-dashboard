# Phase 1 Intelligence Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add executive intelligence, state drilldown, and methodology features without entering Phase 2 AI scope.

**Architecture:** Keep the existing React/Vite frontend. Add pure helper functions for data-derived insights, a focused drawer component, and a route-level methodology page.

**Tech Stack:** React, React Router, Tailwind CSS, Recharts, Vite.

---

### Task 1: Intelligence Helpers

**Files:**
- Create: `frontend/src/utils/intelligence.js`

- [ ] Add helper functions that compute summary insight cards, state explanations, and peer rank from risk score data.
- [ ] Keep helpers deterministic and frontend-only.

### Task 2: Drilldown Component

**Files:**
- Create: `frontend/src/components/StateDrilldownDrawer.jsx`

- [ ] Add a drawer component that accepts selected state, all states, and close handler.
- [ ] Show score, tier, exposure, peer rank, explanation, and recommended action.

### Task 3: Dashboard Integration

**Files:**
- Modify: `frontend/src/pages/RiskScores.jsx`

- [ ] Add executive intelligence feed above the chart.
- [ ] Add click handlers to table rows.
- [ ] Render the drilldown drawer when a state is selected.

### Task 4: Methodology Page

**Files:**
- Create: `frontend/src/pages/Methodology.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/Navbar.jsx`

- [ ] Add `/methodology` route.
- [ ] Add navbar link.
- [ ] Explain score formula, tiers, assumptions, and limitations.

### Task 5: Verify And Document

**Files:**
- Modify: `README.md`
- Modify: `docs/PROJECT_DOCUMENTATION.md`
- Update screenshots under `docs/screenshots/`

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Review in browser and update screenshots.
