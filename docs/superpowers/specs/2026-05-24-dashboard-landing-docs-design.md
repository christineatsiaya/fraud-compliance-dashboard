# Dashboard Landing Page And Documentation Design

## Goal

Add a hybrid home page that explains the fraud compliance dashboard as both a policy-focused portfolio project and a usable analytics tool, then support it with comprehensive project documentation and screenshots.

## Routing And Navigation

The React app will use `/` for the new home page. The existing Risk Scores dashboard will move to `/risk-scores`, and the Interventions dashboard will remain at `/interventions`. The navbar will expose Home, Risk Scores, and Interventions so users can move directly from the explanation into the tools.

## Home Page

The home page will be a polished, content-rich landing page built with Tailwind classes. It will include a hero section that explains the SAR gap, primary links into the two dashboards, feature summaries, a simple workflow explanation, and a project-purpose section. The page should feel like a credible civic/compliance analytics project, not a generic SaaS marketing page.

## Documentation

The root README will be rewritten with project overview, features, screenshots, setup instructions, architecture, API endpoints, database schema, project structure, testing, deployment notes, and roadmap. A deeper `docs/PROJECT_DOCUMENTATION.md` file will document the product concept, frontend, backend, data model, workflows, and future improvements.

## Screenshots

Screenshots will live in `docs/screenshots/` and be referenced from the README. If the local frontend can be run, screenshots will be captured for the home page, risk scores page, and interventions page.

## Verification

Verification will include `npm run build`, `npm run lint`, and browser screenshot review when a local dev server can run.
