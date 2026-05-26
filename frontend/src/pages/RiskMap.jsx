import { useEffect, useMemo, useState } from "react";
import apiClient from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import StateDrilldownDrawer from "../components/StateDrilldownDrawer";

export default function RiskMap() {
  const [filingsData, setFilingsData] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filingsRes, riskRes] = await Promise.all([
          apiClient.get("/sar/top-states?limit=80"),
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

  const validFilingsData = useMemo(
    () => filingsData.filter((d) => /^[A-Z]{2}$/.test(d.state_code)),
    [filingsData],
  );

  const riskByCode = useMemo(
    () => Object.fromEntries(riskScores.map((d) => [d.state_code, d])),
    [riskScores],
  );

  const maxFilings = useMemo(
    () => Math.max(...validFilingsData.map((d) => d.total_filings || 0), 0),
    [validFilingsData],
  );

  const totalFilings = useMemo(
    () => validFilingsData.reduce((sum, d) => sum + (d.total_filings || 0), 0),
    [validFilingsData],
  );

  const topState = validFilingsData[0];

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
            Geographic view of suspicious activity filing volume by state using
            Supabase-powered FinCEN data.
          </p>
        </div>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total SAR filings</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {(totalFilings / 1000000).toFixed(1)}M
            </p>
            <p className="mt-1 text-xs text-slate-400">U.S. states only</p>
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
              Click table rows for drilldown
            </p>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                United States SAR filing map
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Visual geographic reference for state-level SAR analysis.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <object
                data="/usa-map.svg"
                type="image/svg+xml"
                aria-label="Map of the United States with states"
                className="mx-auto block h-[420px] w-full max-w-4xl rounded-lg bg-white p-4"
              >
                <p>Map of the United States</p>
              </object>
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
              {validFilingsData.slice(0, 12).map((state, index) => {
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

                    <div className="w-14">
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
