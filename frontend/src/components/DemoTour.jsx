import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tourSteps = [
  {
    title: "Dashboard",
    route: "/dashboard",
    eyebrow: "Risk command center",
    body: "Start here to see state-level risk scores, portfolio exposure, filters, export tools, and the AI copilot. The role switcher changes which dashboard sections are emphasized.",
  },
  {
    title: "Risk Map",
    route: "/risk-map",
    eyebrow: "Geographic view",
    body: "The map shows every U.S. state colored by SAR filing volume. Darker warm colors mean higher filing concentration, while gray means no data loaded.",
  },
  {
    title: "SAR Analytics",
    route: "/sar-analytics",
    eyebrow: "Filing trends",
    body: "This page explains national filing volume over time, compares the top states year over year, and ranks states by total filings.",
  },
  {
    title: "Interventions",
    route: "/interventions",
    eyebrow: "Action queue",
    body: "Interventions translate risk into operational recommendations with priority, confidence, regulatory citation, and workflow status controls.",
  },
  {
    title: "Reports",
    route: "/methodology",
    eyebrow: "Methodology",
    body: "Reports explain how risk scores, tiers, exposure estimates, assumptions, and limitations are framed for reviewers.",
  },
];

export default function DemoTour({ open, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  const step = tourSteps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === tourSteps.length - 1;

  if (!open) return null;

  const handleVisit = () => {
    navigate(step.route);
    onClose();
  };

  const handleClose = () => {
    setStepIndex(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                Try demo
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">
                {step.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close demo tour"
            >
              x
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {step.eyebrow}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{step.body}</p>
          </div>

          <div className="flex items-center gap-2">
            {tourSteps.map((item, index) => (
              <button
                key={item.route}
                type="button"
                onClick={() => setStepIndex(index)}
                className={`h-2 flex-1 rounded-full transition ${
                  index === stepIndex ? "bg-[#185FA5]" : "bg-slate-200"
                }`}
                aria-label={`Go to ${item.title} tour step`}
              />
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Step {stepIndex + 1} of {tourSteps.length}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            disabled={isFirst}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleVisit}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              Open this page
            </button>
            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  handleClose();
                  return;
                }
                setStepIndex((current) => current + 1);
              }}
              className="rounded-md bg-[#185FA5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#134c84]"
            >
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
