const tierRows = [
  { range: "0-30", tier: "Low", meaning: "Baseline monitoring" },
  { range: "30.01-60", tier: "Medium", meaning: "Targeted monitoring" },
  { range: "60.01-100", tier: "High", meaning: "Immediate review" },
];

function Methodology() {
  return (
    <main className="container mx-auto px-6 py-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
          Compliance score methodology
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          How the dashboard translates SAR gaps into risk intelligence
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          This methodology page explains the current prototype logic. It is
          designed to make the assumptions inspectable for recruiters,
          analysts, and technical reviewers.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Risk score formula
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The backend compares actual SAR filing counts against expected
            filing counts for each state, then converts the gap into a
            normalized score.
          </p>
          <div className="mt-5 rounded-md bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100">
            <p>gap = ((expected - actual) / expected) * 100</p>
            <p>risk_score = clamp(gap, 0, 100)</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Exposure estimate
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Revenue at risk is stored separately from the score. This keeps the
            compliance signal and business-impact estimate understandable as
            separate assumptions.
          </p>
          <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
            Current prototype assumption: each risk-score point can be mapped
            to an estimated exposure value for portfolio demonstration.
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Risk tiers</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Score range
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tier
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Operational meaning
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {tierRows.map((row) => (
                <tr key={row.range}>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.range}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-950">
                    {row.tier}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">Assumptions</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Expected filings are treated as the benchmark for each state.</li>
            <li>Higher filing gaps indicate stronger review priority.</li>
            <li>Risk tiers are intentionally simple for portfolio clarity.</li>
            <li>Intervention priority follows the computed risk tier.</li>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">Limitations</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>The current model does not yet include historical velocity.</li>
            <li>Peer normalization and institution-level weighting are future work.</li>
            <li>Confidence scores are prototype values for recommendation clarity.</li>
            <li>The methodology is designed for demonstration, not regulatory use.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Methodology;
