# Phase 8 Real AI Copilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a backend-backed Compliance Copilot integration path with deterministic fallback.

**Architecture:** Add a FastAPI AI router and service, wire the router into the app, update the frontend Copilot to call the endpoint, and preserve local deterministic fallback behavior.

**Tech Stack:** FastAPI, Pydantic, optional OpenAI Python SDK, React, Axios, Node built-in test runner, pytest.

---

### Task 1: Backend AI Service

**Files:**
- Create: `backend/services/ai_copilot.py`
- Create: `backend/routers/ai.py`
- Modify: `backend/main.py`
- Modify: `backend/requirements.txt`
- Modify: `backend/tests/test_api.py`

- [x] Add failing API tests for fallback copilot response.
- [x] Implement request and response models.
- [x] Implement deterministic fallback.
- [x] Implement optional OpenAI structured response path.
- [x] Register the AI router.

### Task 2: Frontend Copilot API Path

**Files:**
- Modify: `frontend/src/components/ComplianceCopilot.jsx`

- [x] Add loading and source state.
- [x] Call `/ai/compliance-copilot` when the active question changes.
- [x] Fall back to deterministic local answer when the backend is unavailable.
- [x] Render structured AI answer fields.

### Task 3: Verification

- [ ] Run backend pytest.
- [x] Run frontend utility tests.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Verify in browser.
