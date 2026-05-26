# Phase 8 Real AI Copilot Design

## Scope

Phase 8 adds a backend-backed Compliance Copilot path.

In scope:

- FastAPI endpoint for Compliance Copilot answers
- Optional OpenAI Responses API integration
- Structured response shape
- Deterministic fallback when no API key is configured
- Frontend request path with fallback to existing deterministic answers
- Environment variable documentation in code comments and docs

Out of scope:

- Deployment
- Streaming responses
- User authentication
- Conversation memory
- Storing prompts or answers

## Backend Behavior

The backend will expose `POST /ai/compliance-copilot`. The endpoint accepts:

- question id
- selected state
- visible dashboard states
- active role

If `OPENAI_API_KEY` is configured, the backend attempts a structured OpenAI response. If the key is missing or the call fails, the endpoint returns deterministic fallback content with `source: "fallback"`.

## Response Shape

The frontend receives:

- summary
- risk drivers
- recommended actions
- confidence note
- source

This keeps the UI stable whether the answer came from OpenAI or local fallback logic.

## Frontend Behavior

The existing Compliance Copilot remains usable. It will attempt the backend AI endpoint first and fall back to the current deterministic `buildCopilotAnswer` utility if the backend is unavailable.

## Verification

Backend tests cover fallback behavior and structured endpoint responses. Frontend verification covers existing utility tests, lint, build, and browser rendering.
