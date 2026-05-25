import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buildDeteriorationLeaders,
  buildQuarterlyTrendSeries,
  formatTrendDelta,
} from "../utils/trends";

const formatMillions = (value) => `$${(value / 1000000).toFixed(1)}M`;

function HistoricalTrendAnalysis({ states }) {
  const trendSeries = buildQuarterlyTrendSeries(states);
  const deteriorationLeaders = buildDeteriorationLeaders(states);

  if (trendSeries.length === 0) return null;

  const firstQuarter = trendSeries[0];
  const latestQuarter = trendSeries.at(-1);
  const previousQuarter = trendSeries.at(-2);
  const averageRiskVelocity = formatTrendDelta(
    latestQuarter.averageRisk - firstQuarter.averageRisk,
  );
  const latestQuarterDelta = formatTrendDelta(
    latestQuarter.averageRisk - previousQuarter.averageRisk,
  );
  const exposureMovement = latestQuarter.totalExposure - firstQuarter.totalExposure;
  const fastestLeader = deteriorationLeaders[0];

  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            Historical trend analysis
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Risk movement over the last four quarters
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Deterministic prototype trend model based on current filters
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Risk velocity
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {averageRiskVelocity}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Average score movement since {firstQuarter.quarter}
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Latest quarter delta
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {latestQuarterDelta}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Average score movement from {previousQuarter.quarter}
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Exposure movement
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatMillions(exposureMovement)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Estimated increase since {firstQuarter.quarter}
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-slate-200 p-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-950">
                Average risk trend
              </h3>
              <p className="text-sm text-slate-500">
                Quarterly risk score progression
              </p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendSeries}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="quarter" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [Number(value).toFixed(1), "Average risk"]}
                />
                <Line
                  type="monotone"
                  dataKey="averageRisk"
                  name="Average risk"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </article>

          <article className="rounded-lg border border-slate-200 p-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-950">
                Exposure trend
              </h3>
              <p className="text-sm text-slate-500">
                Estimated revenue exposure over time
              </p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendSeries}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="quarter" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={formatMillions}
                />
                <Tooltip formatter={(value) => [formatMillions(value), "Exposure"]} />
                <Area
                  type="monotone"
                  dataKey="totalExposure"
                  name="Exposure"
                  stroke="#0f766e"
                  fill="#ccfbf1"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </article>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-950">
              Fastest deterioration
            </h3>
            <p className="text-sm text-slate-500">
              States with the highest modeled risk velocity
            </p>
          </div>

          <div className="space-y-3">
            {deteriorationLeaders.map((leader) => (
              <div
                key={leader.stateCode}
                className="rounded-md border border-slate-200 bg-white p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {leader.stateCode}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {leader.riskTier} risk
                    </p>
                  </div>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
                    {formatTrendDelta(leader.riskVelocity)}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${Math.min(100, leader.currentRisk)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Current score {leader.currentRisk.toFixed(1)}, up{" "}
                  {leader.riskVelocity.toFixed(1)} points since {firstQuarter.quarter}.
                </p>
              </div>
            ))}
          </div>

          {fastestLeader && (
            <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm leading-6 text-blue-900">
              {fastestLeader.stateCode} is the fastest-moving jurisdiction in
              the current view and should stay near the top of the review queue.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default HistoricalTrendAnalysis;
