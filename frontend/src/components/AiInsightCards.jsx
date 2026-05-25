function AiInsightCards({ insights }) {
  if (insights.length === 0) return null;

  return (
    <section className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            AI-style insight cards
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Copilot preview signals
          </h2>
        </div>
        <p className="text-sm text-blue-800">
          Deterministic summaries, ready for future LLM integration
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {insights.map((insight) => (
          <article
            key={insight.title}
            className="rounded-lg border border-blue-200 bg-white p-4"
          >
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                insight.tone === "critical"
                  ? "bg-red-100 text-red-800"
                  : insight.tone === "stable"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {insight.tone}
            </span>
            <h3 className="mt-3 text-base font-semibold text-slate-950">
              {insight.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {insight.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AiInsightCards;
