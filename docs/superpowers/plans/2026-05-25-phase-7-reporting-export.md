# Phase 7 Reporting Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished executive report export to the Risk Scores dashboard.

**Architecture:** Create tested report helper functions that assemble dashboard data into a report model and HTML document, add a small export button component, and wire it beside the existing CSV export.

**Tech Stack:** React, Vite, Tailwind CSS, Node built-in test runner, browser Blob download API.

---

### Task 1: Report Helper Utilities

**Files:**
- Create: `frontend/src/utils/reporting.js`
- Create: `frontend/src/utils/reporting.test.mjs`

- [x] Write tests for report summary model.
- [x] Write tests for HTML report contents.
- [x] Write tests for safe empty-state report generation.
- [x] Implement report helper utilities.

### Task 2: Report Export Button

**Files:**
- Create: `frontend/src/components/ReportExportButton.jsx`

- [x] Render a business-facing report export action.
- [x] Generate the report from current dashboard data.
- [x] Download the report as `.html`.
- [x] Show toast feedback after export.

### Task 3: Dashboard Integration

**Files:**
- Modify: `frontend/src/pages/RiskScores.jsx`

- [x] Import and render the report export button beside CSV export.
- [x] Pass filtered data, active role, and filter context into the report button.

### Task 4: Verification

- [x] Run `node --test src/utils/reporting.test.mjs`.
- [x] Run all frontend utility tests.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Verify in browser.
