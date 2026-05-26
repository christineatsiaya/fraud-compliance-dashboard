import { useEffect, useMemo, useState } from "react";
import apiClient from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import StateDrilldownDrawer from "../components/StateDrilldownDrawer";

const MAP_ROWS = [
  ["WA", "MT", "ND", "MN", "WI", "MI", "NY", "VT", "ME"],
  ["OR", "ID", "SD", "IA", "IL", "IN", "OH", "PA", "NH"],
  ["CA", "NV", "WY", "NE", "MO", "KY", "WV", "VA", "MA"],
  ["AZ", "UT", "CO", "KS", "AR", "TN", "NC", "MD", "RI"],
  ["NM", "OK", "LA", "MS", "AL", "GA", "SC", "NJ", "CT"],
  ["AK", "HI", "TX", "FL", "DE", "DC"],
];

function getHeatClass(total, max) {
  const ratio = max ? total / max : 0;

  if (ratio >= 0.8) return "bg-blue-900 text-white";
  if (ratio >= 0.6) return "bg-blue-700 text-white";
  if (ratio >= 0.4) return "bg-blue-500 text-white";
  if (ratio >= 0.2) return "bg-blue-300 text-blue-950";
  if (ratio > 0) return "bg-blue-100 text-blue-900";
  return "bg-slate-100 text-slate-400";
}

export default function RiskMap() {
  const [filingsData, setFilingsData] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filingsRes, riskRes] = await Promise.all([
          apiClient.get("/sar/top-states?limit=60"),
          apiClient.get("/risk/risk-scores"),
        ]);

        setFilingsData(filingsRes.data || []);
        setRiskScores(riskRes.data || []);
      } catch (err) {
        console.error("Error fetching SAR map data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filingsByCode = useMemo(
    () => Object.fromEntries(filingsData.map((d) => [d.state_code, d])),
    [filingsData],
  );

  const riskByCode = useMemo(
    () => Object.fromEntries(riskScores.map((d) => [d.state_code, d])),
    [riskScores],
  );

  const maxFilings = useMemo(
    () => Math.max(...filingsData.map((d) => d.total_filings || 0), 0),
    [filingsData],
  );

  const totalFilings = useMemo(
    () => filingsData.reduce((sum, d) => sum + (d.total_filings || 0), 0),
    [filingsData],
  );

  const topState = filingsData[0];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4">
      <div className="mx-auto max-w-[1440px] space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            SAR Geographic Intelligence
          </p>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">
            SAR Filing Risk Map — United States
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tile-based state heatmap showing suspicious activity filing volume
            by state from Supabase-powered FinCEN data.
          </p>
        </div>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total SAR filings</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {(totalFilings / 1000000).toFixed(1)}M
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Across available states
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Highest filing state</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {topState?.state_code || "—"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {topState
                ? `${topState.total_filings.toLocaleString()} filings`
                : "No data loaded"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Risk records matched</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {riskScores.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Click tiles for drilldown where available
            </p>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  State filing heatmap
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Darker tiles represent higher total SAR filing volume.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Low</span>
                <span className="h-3 w-5 rounded bg-blue-100" />
                <span className="h-3 w-5 rounded bg-blue-300" />
                <span className="h-3 w-5 rounded bg-blue-500" />
                <span className="h-3 w-5 rounded bg-blue-700" />
                <span className="h-3 w-5 rounded bg-blue-900" />
                <span>High</span>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[760px] space-y-2">
                {MAP_ROWS.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-9 gap-2"
                    style={{ marginLeft: `${rowIndex % 2 === 0 ? 0 : 24}px` }}
                  >
                    {row.map((code) => {
                      const filing = filingsByCode[code];
                      const risk = riskByCode[code];
                      const total = filing?.total_filings || 0;

                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => risk && setSelectedState(risk)}
                          title={`${filing?.state_name || code}: ${total.toLocaleString()} filings`}
                          className={`h-16 rounded-xl border border-white/70 p-2 text-left shadow-sm transition hover:scale-[1.03] hover:ring-2 hover:ring-blue-300 ${getHeatClass(
                            total,
                            maxFilings,
                          )}`}
                        >
                          <div className="text-sm font-bold">{code}</div>
                          <div className="mt-1 text-[11px] opacity-80">
                            {total ? `${(total / 1000).toFixed(0)}k` : "—"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Top states by filing volume
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Ranked by total filings across available years.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {filingsData.slice(0, 12).map((state, index) => {
                const risk = riskByCode[state.state_code];
                const width = maxFilings
                  ? Math.min(100, (state.total_filings / maxFilings) * 100)
                  : 0;

                return (
                  <button
                    key={state.state_code}
                    type="button"
                    onClick={() => risk && setSelectedState(risk)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-50"
                  >
                    <span className="w-5 text-xs text-slate-400">
                      {index + 1}
                    </span>

                    <div className="w-12">
                      <p className="text-sm font-semibold text-slate-900">
                        {state.state_code}
                      </p>
                      <p className="truncate text-[10px] text-slate-400">
                        {state.state_name}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      {(state.total_filings / 1000).toFixed(0)}k
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <StateDrilldownDrawer
        state={selectedState}
        states={riskScores}
        onClose={() => setSelectedState(null)}
      />
    </div>
  );
}
