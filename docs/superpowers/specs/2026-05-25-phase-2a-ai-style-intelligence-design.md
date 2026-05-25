# Phase 2A AI-Style Intelligence Design

## Scope

Phase 2A adds AI-style intelligence features without using an external AI API. The experience should look and feel like an intelligence copilot, but responses must be deterministic, data-derived, and honest in documentation.

In scope:

- AI-style insight cards
- Mock Compliance Copilot panel
- Suggested questions
- State-aware responses when a state is selected

Out of scope:

- Real OpenAI or LLM integration
- Streaming responses
- Chat history persistence
- Authentication
- Forecasting or scenario simulation
- Role-based dashboards

## AI Insight Cards

The Risk Scores page will include a section labeled as AI-style or copilot preview insights. Cards will summarize the current dataset using deterministic logic, such as exposure concentration, high-risk states, recommended leadership focus, and monitoring posture.

## Mock Compliance Copilot

The dashboard will include a copilot panel where a reviewer can choose common questions:

- Why is the selected state high risk?
- What should leadership do next?
- Which state needs review first?
- Summarize current compliance exposure.

Responses will be generated from the current risk score data and selected state. If no state is selected, the copilot will use the highest-risk state as context for state-specific questions.

## Documentation

README and project docs must describe the feature as deterministic AI-style intelligence, designed as a future LLM integration point. Do not imply real AI inference is running.

## Verification

Use Node's built-in test runner for copilot helper logic, then run `npm run lint`, `npm run build`, and browser verification.
