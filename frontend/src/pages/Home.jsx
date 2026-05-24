import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

const dashboardLinks = [
  {
    title: "Risk Scores",
    description:
      "Compare state-level exposure, risk tiers, and estimated revenue at risk.",
    to: "/",
    metric: "50 states",
  },
  {
    title: "Interventions",
    description:
      "Review recommended compliance actions with priorities, citations, and confidence scores.",
    to: "/interventions",
    metric: "Actionable controls",
  },
];

const featureCards = [
  {
    title: "SAR gap analysis",
    text: "Frames the disconnect between suspicious activity reporting volume and regulator-ready enforcement intelligence.",
  },
  {
    title: "Risk-based prioritization",
    text: "Surfaces high-priority jurisdictions so limited compliance resources can focus on the clearest exposure signals.",
  },
  {
    title: "Intervention guidance",
    text: "Connects risk patterns to recommended control actions and regulatory references.",
  },
  {
    title: "Exportable evidence",
    text: "Lets analysts filter, sort, and export dashboard views for reporting or review workflows.",
  },
];

const workflowSteps = [
  "Supabase stores state, SAR filing, risk, and intervention data.",
  "FastAPI exposes focused endpoints for dashboard consumption.",
  "Risk and intervention engines compute the intelligence layer.",
  "React presents the findings as interactive decision-support views.",
];

function Home() {
  return (
    <main className="bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-15">
          <div className="h-full w-full bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#2563eb_100%)]" />
        </div>
        <div className="container relative mx-auto grid min-h-[560px] gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
              Compliance intelligence prototype
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Fraud Compliance Dashboard
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              A full-stack analytics project exploring the SAR gap: the space
              between suspicious activity reports, regulator capacity, and the
              practical decisions needed to disrupt fraud faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                View Risk Scores
              </Link>
              <Link
                to="/interventions"
                className="inline-flex items-center justify-center rounded-md border border-slate-500 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Review Interventions
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-300">Dashboard signal</p>
                  <p className="text-2xl font-bold">Risk triage</p>
                </div>
                <img
                  src={heroImage}
                  alt=""
                  className="h-20 w-20 object-contain"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-4">
                {dashboardLinks.map((item) => (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="block rounded-md border border-white/10 bg-slate-900/70 p-4 transition hover:border-blue-300 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {item.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs font-semibold text-blue-100">
                        {item.metric}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            What the dashboard explains
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            From reporting volume to compliance action
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The project treats fraud compliance as a resource allocation
            problem. Instead of stopping at raw SAR activity, it organizes
            state-level signals into risk tiers and recommended interventions
            that analysts can inspect, filter, and export.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              A focused full-stack pipeline
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The app pairs a React interface with FastAPI endpoints and a
              Supabase-backed data model. The goal is to make the analytical
              argument visible in the product, not hidden in a notebook.
            </p>
          </div>
          <ol className="grid gap-4 md:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <li
                key={step}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm leading-6 text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto px-6 py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg bg-slate-900 p-6 text-white">
            <h2 className="text-2xl font-bold">Project purpose</h2>
            <p className="mt-4 leading-7 text-slate-200">
              This dashboard is built as a compliance intelligence prototype:
              part policy analysis, part engineering portfolio, and part
              decision-support interface. It shows how public-sector oversight
              questions can be translated into usable analytics workflows.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-950">
              Built with practical review flows
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Analysts can move from a high-level risk view to specific
              intervention recommendations, then export filtered results for
              review packets, stakeholder updates, or further investigation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
