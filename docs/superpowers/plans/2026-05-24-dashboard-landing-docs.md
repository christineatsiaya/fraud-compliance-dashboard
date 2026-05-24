# Dashboard Landing Page And Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hybrid home page, comprehensive README, supporting project documentation, and screenshots.

**Architecture:** The frontend remains a React/Vite single page app with route-level page components. Documentation lives in Markdown files at the repository root and under `docs/`, with screenshots stored in `docs/screenshots/`.

**Tech Stack:** React, React Router, Tailwind CSS, Vite, FastAPI, Supabase, Markdown.

---

### Task 1: Add Home Page Route

**Files:**
- Create: `frontend/src/pages/Home.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/Navbar.jsx`

- [ ] Create a `Home.jsx` page with hero content, dashboard entry links, feature sections, workflow explanation, and project context.
- [ ] Update `App.jsx` so `/` renders `Home`, `/risk-scores` renders `RiskScores`, and `/interventions` renders `Interventions`.
- [ ] Update `Navbar.jsx` so it links to Home, Risk Scores, and Interventions.
- [ ] Run `npm run build` from `frontend/`.
- [ ] Run `npm run lint` from `frontend/`.

### Task 2: Add Documentation

**Files:**
- Modify: `README.md`
- Create: `docs/PROJECT_DOCUMENTATION.md`

- [ ] Rewrite README with overview, features, screenshots, architecture, setup, API endpoints, schema, structure, tests, deployment, and roadmap.
- [ ] Create project documentation with deeper product, technical, data, and workflow notes.
- [ ] Ensure Markdown links point to existing repo paths.

### Task 3: Capture Screenshots

**Files:**
- Create: `docs/screenshots/home.png`
- Create: `docs/screenshots/risk-scores.png`
- Create: `docs/screenshots/interventions.png`

- [ ] Start the frontend dev server.
- [ ] Open the app in a browser.
- [ ] Capture screenshots for `/`, `/risk-scores`, and `/interventions`.
- [ ] Confirm README references the screenshot paths.
