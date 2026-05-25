# Phase 3 Operational Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add operational alerting, intervention status tracking, and audit log behavior to the Interventions dashboard.

**Architecture:** Add deterministic workflow helpers with tests, then render the workflow through focused React components on the existing Interventions page. Keep all state local to the frontend for this phase.

**Tech Stack:** React, Vite, Tailwind CSS, Node built-in test runner.

---

### Task 1: Operational Helpers

**Files:**
- Create: `frontend/src/utils/operations.js`
- Create: `frontend/src/utils/operations.test.mjs`

- [ ] Test workflow defaults, alert generation, and audit event creation.
- [ ] Implement deterministic helpers.

### Task 2: UI Components

**Files:**
- Create: `frontend/src/components/OperationalAlertCenter.jsx`
- Create: `frontend/src/components/InterventionStatusControl.jsx`
- Create: `frontend/src/components/InterventionAuditLog.jsx`

- [ ] Render alert cards.
- [ ] Render status controls.
- [ ] Render audit events.

### Task 3: Interventions Integration

**Files:**
- Modify: `frontend/src/pages/Interventions.jsx`

- [ ] Add workflow state.
- [ ] Add alert center above summary stats.
- [ ] Add status controls to intervention cards.
- [ ] Add audit log below the card grid.

### Task 4: Verification

- [ ] Run `node --test src/utils/operations.test.mjs`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Verify in browser.
