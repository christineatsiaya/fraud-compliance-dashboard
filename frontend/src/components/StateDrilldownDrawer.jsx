import {
  formatMillions,
  getRecommendedAction,
  getStateExplanation,
  getStateRank,
  getRiskTierLabel,
} from "../utils/intelligence";

const tierStyles = {
  HIGH: "bg-red-100 text-red-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  LOW: "bg-green-100 text-green-800",
};

function StateDrilldownDrawer({ state, states, onClose }) {
  if (!state) return null;

  const rank = getStateRank(state, states);
  const explanation = getStateExplanation(state, states);
  const action = getRecommendedAction(state);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40">
      <button
        type="button"
        className="flex-1 cursor-default"
        aria-label="Close drilldown"
        onClick={onClose}
      />
      <aside className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
                State intelligence
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                {state.state_code}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-500"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Risk score
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-950">
                {state.risk_score.toFixed(1)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Peer rank
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-950">
                #{rank}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Exposure
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-950">
                {formatMillions(state.revenue_at_risk)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Risk tier
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tierStyles[state.risk_tier]}`}
              >
                {getRiskTierLabel(state.risk_tier)}
              </span>
            </div>
          </div>

          <section className="rounded-lg border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-950">
              Risk explanation
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {explanation}
            </p>
          </section>

          <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
            <h3 className="text-lg font-semibold text-blue-950">
              Recommended next action
            </h3>
            <p className="mt-3 text-sm leading-6 text-blue-900">{action}</p>
          </section>

          <section className="rounded-lg border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-950">
              Review checklist
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>Confirm current SAR filing gap assumptions.</li>
              <li>Review intervention priority and regulatory citation.</li>
              <li>Compare exposure against peer states before escalation.</li>
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default StateDrilldownDrawer;
