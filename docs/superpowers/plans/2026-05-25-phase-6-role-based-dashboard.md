# Phase 6 Role-Based Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add role-based dashboard views to the Risk Scores page.

**Architecture:** Create a focused role utility module with tested metadata and visibility rules, add a reusable role switcher component, then conditionally render existing dashboard sections by active role.

**Tech Stack:** React, Vite, Tailwind CSS, Node built-in test runner.

---

### Task 1: Role View Helpers

**Files:**
- Create: `frontend/src/utils/roleViews.js`
- Create: `frontend/src/utils/roleViews.test.mjs`

- [x] Write tests for role metadata.
- [x] Write tests for section visibility by role.
- [x] Write tests for safe fallback behavior.
- [x] Implement role helper utilities.

### Task 2: Role Switcher Component

**Files:**
- Create: `frontend/src/components/RoleViewSwitcher.jsx`

- [x] Render three role options.
- [x] Highlight the active role.
- [x] Show the active role summary.
- [x] Expose button clicks through `onRoleChange`.

### Task 3: Dashboard Integration

**Files:**
- Modify: `frontend/src/pages/RiskScores.jsx`

- [x] Add active role state.
- [x] Render the role switcher near the top.
- [x] Conditionally render dashboard sections by role.

### Task 4: Verification

- [x] Run `node --test src/utils/roleViews.test.mjs`.
- [x] Run all frontend utility tests.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Verify in browser.
