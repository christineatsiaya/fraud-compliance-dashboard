import { useEffect, useMemo, useState } from "react";
import apiClient from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import StateDrilldownDrawer from "../components/StateDrilldownDrawer";

const stateTiles = [
  ["WA", 1, 0],
  ["MT", 2, 0],
  ["ND", 3, 0],
  ["MN", 4, 0],
  ["WI", 5, 0],
  ["MI", 6, 0],
  ["NY", 8, 0],
  ["VT", 9, 0],
  ["NH", 10, 0],
  ["ME", 11, 0],
  ["OR", 1, 1],
  ["ID", 2, 1],
  ["SD", 3, 1],
  ["IA", 4, 1],
  ["IL", 5, 1],
  ["IN", 6, 1],
  ["OH", 7, 1],
  ["PA", 8, 1],
  ["NJ", 9, 1],
  ["MA", 10, 1],
  ["CA", 1, 2],
  ["NV", 2, 2],
  ["WY", 3, 2],
  ["NE", 4, 2],
  ["MO", 5, 2],
  ["KY", 6, 2],
  ["WV", 7, 2],
  ["VA", 8, 2],
  ["MD", 9, 2],
  ["CT", 10, 2],
  ["AZ", 2, 3],
  ["UT", 3, 3],
  ["CO", 4, 3],
  ["KS", 5, 3],
  ["AR", 6, 3],
  ["TN", 7, 3],
  ["NC", 8, 3],
  ["SC", 9, 3],
  ["RI", 10, 3],
  ["NM", 3, 4],
  ["OK", 4, 4],
  ["LA", 5, 4],
  ["MS", 6, 4],
  ["AL", 7, 4],
  ["GA", 8, 4],
  ["DE", 9, 4],
  ["AK", 0, 5],
  ["HI", 1, 5],
  ["TX", 4, 5],
  ["FL", 9, 5],
];

function getFilingColor(filings, maxFilings) {
  if (!filings || !maxFilings) return "#E2E8F0";

  const ratio = filings / maxFilings;

  if (ratio >= 0.8) return "#B91C1C";
  if (ratio >= 0.6) return "#EA580C";
  if (ratio >= 0.4) return "#F59E0B";
  if (ratio >= 0.2) return "#60A5FA";
  return "#BFDBFE";
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

  const filingsByCode = useMemo(
    () => Object.fromEntries(validFilingsData.map((d) => [d.state_code, d])),
    [validFilingsData],
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
    <DashboardLayout>
      <div className="p-4">
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

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-lg bg-white p-4 shadow-inner">
                <svg
                  viewBox="0 0 840 460"
                  role="img"
                  aria-label="United States map colored by SAR filing volume"
                  className="mx-auto block w-full max-w-4xl"
                >
                  <rect width="840" height="460" rx="18" fill="#FFFFFF" />
                  {stateTiles.map(([code, col, row]) => {
                    const filing = filingsByCode[code];
                    const risk = riskByCode[code];
                    const filings = filing?.total_filings || 0;
                    const fill = getFilingColor(filings, maxFilings);
                    const x = 24 + col * 66;
                    const y = 34 + row * 60;

                    return (
                      <g key={code}>
                        <rect
                          x={x}
                          y={y}
                          width="56"
                          height="48"
                          rx="8"
                          fill={fill}
                          stroke={risk ? "#FFFFFF" : "#CBD5E1"}
                          strokeWidth="2"
                          className="cursor-pointer transition hover:opacity-80"
                          onClick={() => risk && setSelectedState(risk)}
                        >
                          <title>
                            {filing
                              ? `${code}: ${filings.toLocaleString()} SAR filings`
                              : `${code}: no filing data loaded`}
                          </title>
                        </rect>
                        <text
                          x={x + 28}
                          y={y + 22}
                          textAnchor="middle"
                          fill={filings / maxFilings >= 0.4 ? "#FFFFFF" : "#0F172A"}
                          fontSize="14"
                          fontWeight="700"
                          fontFamily="Inter, Arial, sans-serif"
                          pointerEvents="none"
                        >
                          {code}
                        </text>
                        <text
                          x={x + 28}
                          y={y + 38}
                          textAnchor="middle"
                          fill={filings / maxFilings >= 0.4 ? "#F8FAFC" : "#475569"}
                          fontSize="10"
                          fontWeight="600"
                          fontFamily="Inter, Arial, sans-serif"
                          pointerEvents="none"
                        >
                          {filings ? `${Math.round(filings / 1000)}k` : "n/a"}
                        </text>
                      </g>
                    );
                  })}

                  <g transform="translate(34 405)">
                    <text
                      x="0"
                      y="0"
                      fill="#475569"
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="Inter, Arial, sans-serif"
                    >
                      SAR filing volume
                    </text>
                    {[
                      ["Low", "#BFDBFE"],
                      ["Moderate", "#60A5FA"],
                      ["Elevated", "#F59E0B"],
                      ["High", "#EA580C"],
                      ["Highest", "#B91C1C"],
                      ["No data", "#E2E8F0"],
                    ].map(([label, color], index) => (
                      <g key={label} transform={`translate(${index * 126} 18)`}>
                        <rect width="22" height="12" rx="6" fill={color} />
                        <text
                          x="30"
                          y="11"
                          fill="#64748B"
                          fontSize="11"
                          fontFamily="Inter, Arial, sans-serif"
                        >
                          {label}
                        </text>
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {validFilingsData.slice(0, 3).map((state) => (
                  <button
                    key={state.state_code}
                    type="button"
                    onClick={() => {
                      const risk = riskByCode[state.state_code];
                      if (risk) setSelectedState(risk);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <p className="text-xs font-semibold text-slate-900">
                      {state.state_code} filings
                    </p>
                    <p className="mt-1 text-lg font-semibold text-blue-700">
                      {state.total_filings.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {state.state_name}
                    </p>
                  </button>
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
      </div>

      <StateDrilldownDrawer
        state={selectedState}
        states={riskScores}
        onClose={() => setSelectedState(null)}
      />
    </DashboardLayout>
  );
}
