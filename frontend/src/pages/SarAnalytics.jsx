import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import apiClient from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const TOP_STATES = ["CA", "NY", "TX", "FL", "IL"];
const STATE_COLORS = ["#185FA5", "#1D9E75", "#BA7517", "#A32D2D", "#7C3AED"];

export default function SarAnalytics() {
  const [trendByYear, setTrendByYear] = useState([]);
  const [stateTrends, setStateTrends] = useState({});
  const [topStates, setTopStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [yearRes, topRes, ...stateRes] = await Promise.all([
          apiClient.get("/sar/trend-by-year"),
          apiClient.get("/sar/top-states?limit=10"),
          ...TOP_STATES.map((s) =>
            apiClient.get(`/sar/trend-by-state?state_code=${s}`),
          ),
        ]);

        setTrendByYear(yearRes.data);
        setTopStates(topRes.data);

        const trends = {};
        TOP_STATES.forEach((code, i) => {
          trends[code] = stateRes[i].data.trend;
        });
        setStateTrends(trends);
      } catch (err) {
        console.error("Error fetching SAR analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Merge state trends into one array for multi-line chart
  const mergedTrends = trendByYear.map((row) => {
    const merged = { year: row.year };
    TOP_STATES.forEach((code) => {
      const match = stateTrends[code]?.find((t) => t.year === row.year);
      merged[code] = match?.filing_count || 0;
    });
    return merged;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-3">
      <div className="mx-auto max-w-[1440px] space-y-4">
        {/* Header */}
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <h1 className="text-base font-semibold text-slate-900">
            SAR Analytics — Filing Trends
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            FinCEN Depository Institution SAR filings · 2020–2024 · Public data
          </p>
        </div>

        {/* KPI strip */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total filings (all years)</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {(
                trendByYear.reduce((s, r) => s + r.filing_count, 0) / 1000000
              ).toFixed(1)}
              M
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Depository institutions only
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Peak filing year</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {trendByYear.sort((a, b) => b.filing_count - a.filing_count)[0]
                ?.year || "—"}
            </p>
            <p className="mt-1 text-xs text-slate-400">Highest annual volume</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Top filing state</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {topStates[0]?.state_code || "—"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {topStates[0]
                ? `${(topStates[0].total_filings / 1000).toFixed(0)}k total filings`
                : ""}
            </p>
          </div>
        </div>

        {/* National trend chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-slate-900">
            National SAR filing trend
          </p>
          <p className="mb-4 text-xs text-slate-400">
            Total filings across all states per year
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendByYear.sort((a, b) => a.year - b.year)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(v) => [v.toLocaleString(), "Filings"]} />
              <Bar
                dataKey="filing_count"
                fill="#185FA5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* State comparison chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-slate-900">
            Top 5 states — year-over-year comparison
          </p>
          <p className="mb-4 text-xs text-slate-400">
            CA, NY, TX, FL, IL filing trends
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mergedTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(v, name) => [v.toLocaleString(), name]} />
              <Legend />
              {TOP_STATES.map((code, i) => (
                <Line
                  key={code}
                  type="monotone"
                  dataKey={code}
                  stroke={STATE_COLORS[i]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top states table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-3">
            <p className="text-sm font-semibold text-slate-900">
              Top 10 states by total filing volume
            </p>
          </div>
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Rank
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  State
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Filings
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Share of national total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topStates.map((s, i) => {
                const national = topStates.reduce(
                  (sum, x) => sum + x.total_filings,
                  0,
                );
                const share = ((s.total_filings / national) * 100).toFixed(1);
                return (
                  <tr key={s.state_code} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-sm text-slate-400">
                      {i + 1}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-900">
                      {s.state_code}
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        {s.state_name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">
                      {s.total_filings.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
