# Phase 2A AI-Style Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deterministic AI-style insight cards and a mock compliance copilot without external AI services.

**Architecture:** Add pure helper functions for copilot responses, test those helpers with Node's built-in test runner, then render the helpers through focused React components on the Risk Scores page.

**Tech Stack:** React, Vite, Tailwind CSS, Node built-in test runner.

---

### Task 1: Copilot Helpers

**Files:**
- Create: `frontend/src/utils/copilot.js`
- Create: `frontend/src/utils/copilot.test.mjs`

- [ ] Write tests for AI-style insight card generation and suggested-question responses.
- [ ] Implement deterministic helper functions.

### Task 2: UI Components

**Files:**
- Create: `frontend/src/components/AiInsightCards.jsx`
- Create: `frontend/src/components/ComplianceCopilot.jsx`

- [ ] Render insight cards from helper output.
- [ ] Render suggested question buttons and deterministic response panel.

### Task 3: Dashboard Integration

**Files:**
- Modify: `frontend/src/pages/RiskScores.jsx`

- [ ] Add AI-style insight cards near executive intelligence.
- [ ] Add Compliance Copilot near the drilldown/table area.
- [ ] Pass selected state context into the copilot.

### Task 4: Docs And Screenshots

**Files:**
- Modify: `README.md`
- Modify: `docs/PROJECT_DOCUMENTATION.md`
- Update: `docs/screenshots/home.png`

- [ ] Document Phase 2A honestly as deterministic AI-style intelligence.
- [ ] Capture updated screenshot.

### Task 5: Verification

- [ ] Run `node --test src/utils/copilot.test.mjs` from `frontend/`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Verify dashboard in browser.
