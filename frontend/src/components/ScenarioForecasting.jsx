import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buildScenarioForecast,
  formatScenarioPercent,
} from "../utils/scenario";

const formatMillions = (value) => `$${(value / 1000000).toFixed(1)}M`;

function ScenarioForecasting({ states }) {
  const [budgetIncreasePercent, setBudgetIncreasePercent] = useState(20);
  const [effectivenessPercent, setEffectivenessPercent] = useState(70);

  const forecast = useMemo(
    () =>
      buildScenarioForecast(states, {
        budgetIncreasePercent,
        effectivenessPercent,
      }),
    [states, budgetIncreasePercent, effectivenessPercent],
  );

  if (forecast.stateCount === 0) return null;

  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            Scenario forecasting
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Simulate intervention investment impact
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Deterministic forecast model for portfolio decision support
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-900">
              Intervention budget uplift
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
              {budgetIncreasePercent}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={budgetIncreasePercent}
            onChange={(event) =>
              setBudgetIncreasePercent(Number(event.target.value))
            }
            className="mt-4 w-full accent-blue-600"
          />
        </label>

        <label className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-900">
              Execution effectiveness
            </span>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
              {effectivenessPercent}%
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="90"
            step="5"
            value={effectivenessPercent}
            onChange={(event) =>
              setEffectivenessPercent(Number(event.target.value))
            }
            className="mt-4 w-full accent-teal-600"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Exposure reduction
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatMillions(forecast.projectedExposureReduction)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Projected reduction from {formatMillions(forecast.totalExposure)} baseline
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Operational savings
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatMillions(forecast.estimatedSavings)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Estimated savings captured from avoided exposure
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Average risk improvement
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatScenarioPercent(forecast.averageRiskReduction)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Projected average score: {forecast.projectedAverageRisk.toFixed(1)}
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-lg border border-slate-200 p-4">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-950">
              Current vs projected risk
            </h3>
            <p className="text-sm text-slate-500">
              State-level score impact under the selected scenario
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forecast.chartData}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="stateCode" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [Number(value).toFixed(1), "Risk score"]}
              />
              <Legend />
              <Bar dataKey="currentRisk" fill="#94a3b8" name="Current risk" />
              <Bar dataKey="projectedRisk" fill="#2563eb" name="Projected risk" />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-950">
              Highest impact opportunities
            </h3>
            <p className="text-sm text-slate-500">
              Ranked by projected exposure reduction
            </p>
          </div>

          <div className="space-y-3">
            {forecast.stateImpacts.slice(0, 4).map((impact) => (
              <div
                key={impact.stateCode}
                className="rounded-md border border-slate-200 bg-white p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {impact.stateCode}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {impact.impactTier} impact
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                    {formatMillions(impact.exposureReduction)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Risk improves by {formatScenarioPercent(impact.riskReduction)} to{" "}
                  {impact.projectedRisk.toFixed(1)}.
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ScenarioForecasting;
