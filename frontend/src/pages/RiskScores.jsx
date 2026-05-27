import { useCallback, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import StateDrilldownDrawer from "../components/StateDrilldownDrawer";
import AiInsightCards from "../components/AiInsightCards";
import ComplianceCopilot from "../components/ComplianceCopilot";
import HistoricalTrendAnalysis from "../components/HistoricalTrendAnalysis";
import ScenarioForecasting from "../components/ScenarioForecasting";
import ReportExportButton from "../components/ReportExportButton";
import { buildAiInsightCards } from "../utils/copilot";
import { buildExecutiveInsights } from "../utils/intelligence";
import {
  DASHBOARD_SECTIONS,
  ROLE_VIEW_IDS,
  shouldShowSection,
} from "../utils/roleViews";

const DEMO_RISK_SCORES = [
  {
    id: "demo-ca",
    state_code: "CA",
    risk_score: 91.4,
    revenue_at_risk: 18400000,
    risk_tier: "HIGH",
  },
  {
    id: "demo-ny",
    state_code: "NY",
    risk_score: 86.2,
    revenue_at_risk: 15100000,
    risk_tier: "HIGH",
  },
  {
    id: "demo-il",
    state_code: "IL",
    risk_score: 83.7,
    revenue_at_risk: 12700000,
    risk_tier: "HIGH",
  },
  {
    id: "demo-tx",
    state_code: "TX",
    risk_score: 74.8,
    revenue_at_risk: 13200000,
    risk_tier: "MEDIUM",
  },
  {
    id: "demo-fl",
    state_code: "FL",
    risk_score: 69.5,
    revenue_at_risk: 9800000,
    risk_tier: "MEDIUM",
  },
  {
    id: "demo-ga",
    state_code: "GA",
    risk_score: 64.1,
    revenue_at_risk: 8700000,
    risk_tier: "MEDIUM",
  },
  {
    id: "demo-nj",
    state_code: "NJ",
    risk_score: 58.6,
    revenue_at_risk: 7600000,
    risk_tier: "MEDIUM",
  },
  {
    id: "demo-az",
    state_code: "AZ",
    risk_score: 55.2,
    revenue_at_risk: 6900000,
    risk_tier: "MEDIUM",
  },
  {
    id: "demo-nc",
    state_code: "NC",
    risk_score: 51.8,
    revenue_at_risk: 6200000,
    risk_tier: "MEDIUM",
  },
  {
    id: "demo-wa",
    state_code: "WA",
    risk_score: 42.7,
    revenue_at_risk: 4100000,
    risk_tier: "LOW",
  },
  {
    id: "demo-co",
    state_code: "CO",
    risk_score: 38.9,
    revenue_at_risk: 3300000,
    risk_tier: "LOW",
  },
  {
    id: "demo-ma",
    state_code: "MA",
    risk_score: 34.5,
    revenue_at_risk: 2900000,
    risk_tier: "LOW",
  },
  {
    id: "demo-mn",
    state_code: "MN",
    risk_score: 28.9,
    revenue_at_risk: 2200000,
    risk_tier: "LOW",
  },
  {
    id: "demo-or",
    state_code: "OR",
    risk_score: 24.6,
    revenue_at_risk: 1800000,
    risk_tier: "LOW",
  },
  {
    id: "demo-ut",
    state_code: "UT",
    risk_score: 18.4,
    revenue_at_risk: 1200000,
    risk_tier: "LOW",
  },
  {
    id: "demo-vt",
    state_code: "VT",
    risk_score: 12.9,
    revenue_at_risk: 650000,
    risk_tier: "LOW",
  },
];

const stateNames = {
  CA: "California",
  NY: "New York",
  TX: "Texas",
  FL: "Florida",
  AZ: "Arizona",
  WA: "Washington",
  CO: "Colorado",
  IL: "Illinois",
  GA: "Georgia",
  MA: "Massachusetts",
  MN: "Minnesota",
  NC: "North Carolina",
  NJ: "New Jersey",
  OR: "Oregon",
  UT: "Utah",
  VT: "Vermont",
};

const roleOptions = [
  {
    id: ROLE_VIEW_IDS.EXECUTIVE,
    label: "Executive",
    detail: "Portfolio exposure, trend movement, and investment decisions.",
  },
  {
    id: ROLE_VIEW_IDS.ANALYST,
    label: "Analyst",
    detail: "Filters, state evidence, methodology, and drilldowns.",
  },
  {
    id: ROLE_VIEW_IDS.OPERATIONS,
    label: "Operations",
    detail: "Intervention impact, review queues, and follow-through.",
  },
];

function riskBadge(score) {
  if (score >= 80)
    return {
      label: "Critical",
      className: "bg-red-50 text-red-700",
      color: "#A32D2D",
    };
  if (score >= 60)
    return {
      label: "High",
      className: "bg-amber-50 text-amber-700",
      color: "#BA7517",
    };
  return {
    label: "Medium",
    className: "bg-blue-50 text-blue-700",
    color: "#185FA5",
  };
}

function RiskScores() {
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [filterTier, setFilterTier] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [activeRole, setActiveRole] = useState(ROLE_VIEW_IDS.ANALYST);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const fetchRiskScores = useCallback(async ({ showToast = false } = {}) => {
    setRefreshing(true);

    try {
      const response = await apiClient.get("/risk/risk-scores");
      setRiskScores(response.data);
      setUsingDemoData(false);
      setError(null);
      setLastSyncedAt(new Date());

      if (showToast) {
        toast.success("Live Supabase data refreshed");
      }
    } catch (err) {
      setRiskScores(DEMO_RISK_SCORES);
      setUsingDemoData(true);
      setError(null);
      setLastSyncedAt(new Date());
      console.error("Error fetching risk scores:", err);

      if (showToast) {
        toast.error("Live API unavailable. Showing fallback demo data.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRiskScores();
  }, [fetchRiskScores]);

  const filteredData = useMemo(() => {
    let filtered = riskScores;

    if (filterTier !== "ALL") {
      filtered = filtered.filter((score) => score.risk_tier === filterTier);
    }

    if (searchTerm) {
      filtered = filtered.filter((score) =>
        score.state_code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [riskScores, filterTier, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const rankedRiskScores = useMemo(
    () => [...sortedData].sort((a, b) => b.risk_score - a.risk_score),
    [sortedData],
  );

  const stats = useMemo(() => {
    if (filteredData.length === 0)
      return { count: 0, avgRisk: 0, totalRevenue: 0 };

    const totalRisk = filteredData.reduce(
      (sum, score) => sum + score.risk_score,
      0,
    );
    const totalRevenue = filteredData.reduce(
      (sum, score) => sum + score.revenue_at_risk,
      0,
    );

    return {
      count: filteredData.length,
      avgRisk: totalRisk / filteredData.length,
      totalRevenue,
    };
  }, [filteredData]);

  const executiveInsights = useMemo(
    () => buildExecutiveInsights(filteredData),
    [filteredData],
  );

  const aiInsights = useMemo(
    () => buildAiInsightCards(filteredData),
    [filteredData],
  );

  const canShow = (sectionId) => shouldShowSection(activeRole, sectionId);
  const hasActiveFilters =
    filterTier !== "ALL" || searchTerm !== "" || sortConfig.key !== null;
  const highRiskCount = filteredData.filter(
    (score) => score.risk_score >= 80 || score.risk_tier === "HIGH",
  ).length;
  const criticalRiskCount = filteredData.filter(
    (score) => score.risk_score >= 80,
  ).length;
  const dataSourceLabel = usingDemoData
    ? "Fallback demo data"
    : "Live Supabase data";
  const dataSourceDetail = usingDemoData
    ? "Backend unavailable"
    : "Connected through FastAPI";
  const lastSyncedLabel = lastSyncedAt
    ? lastSyncedAt.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Sync pending";

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleClearFilters = () => {
    setFilterTier("ALL");
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
    toast.success("Filters refreshed");
  };

  const handleRefreshData = () => {
    setFilterTier("ALL");
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
    fetchRiskScores({ showToast: true });
  };

  const handleExportCSV = () => {
    if (sortedData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["State", "Risk Score", "Revenue at Risk", "Risk Tier"];
    const rows = sortedData.map((score) => [
      score.state_code,
      score.risk_score.toFixed(2),
      `$${(score.revenue_at_risk / 1000000).toFixed(2)}M`,
      score.risk_tier,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `risk-scores-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`Exported ${sortedData.length} records to CSV`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      interventionCount={highRiskCount}
      activeRole={activeRole}
      onRoleChange={setActiveRole}
      roleOptions={roleOptions}
    >
      <Toaster position="top-right" />
      <div className="flex min-h-screen flex-col bg-white">
          <header className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-semibold text-slate-950">
                  Risk Scores - United States
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    usingDemoData
                      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      usingDemoData ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  />
                  {dataSourceLabel}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                BSA/SAR filing gap analysis · {dataSourceDetail} · Last synced{" "}
                {lastSyncedLabel}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ReportExportButton
                states={sortedData}
                activeRole={activeRole}
                filters={{ riskTier: filterTier, searchTerm }}
              />
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={handleRefreshData}
                disabled={refreshing}
                className="flex items-center justify-center rounded-md bg-[#185FA5] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#134c84] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8fafc] p-4 lg:p-5">
            <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div
                className={`rounded-lg border px-4 py-3 ${
                  usingDemoData
                    ? "border-amber-200 bg-amber-50"
                    : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${
                      usingDemoData
                        ? "text-amber-700 ring-amber-200"
                        : "text-emerald-700 ring-emerald-200"
                    }`}
                  >
                    {usingDemoData ? "Fallback active" : "Backend connected"}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      usingDemoData ? "text-amber-950" : "text-emerald-950"
                    }`}
                  >
                    {usingDemoData
                      ? "The live API is unavailable, so the dashboard is protecting the demo with fallback data."
                      : "Supabase-powered risk scores are loading through your FastAPI API."}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    usingDemoData ? "text-amber-800" : "text-emerald-800"
                  }`}
                >
                  Current view reflects records returned by the{" "}
                  <span className="font-semibold">risk_scores</span> table.
                  Refresh re-queries the backend instead of using hardcoded
                  values.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Data source
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {dataSourceLabel}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {riskScores.length} records · Synced {lastSyncedLabel}
                </p>
              </div>
            </section>

            {usingDemoData && !bannerDismissed && (
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span>
                  <span className="font-semibold">Demo mode:</span> Showing
                  sample data - live API unavailable.
                </span>
                <button
                  onClick={() => setBannerDismissed(true)}
                  className="ml-4 text-amber-500 hover:text-amber-800"
                >
                  ✕
                </button>
              </div>
            )}

            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs text-slate-500">States High Risk</p>
                <p className="mt-2 text-2xl font-semibold">
                  {highRiskCount}
                </p>
                <p className="mt-1 text-xs text-red-700">
                  {criticalRiskCount} critical risk
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs text-slate-500">Revenue at Risk</p>
                <p className="mt-2 text-2xl font-semibold">
                  ${(stats.totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="mt-1 text-xs text-red-700">Portfolio exposure</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs text-slate-500">SAR Filing Gap</p>
                <p className="mt-2 text-2xl font-semibold">
                  {stats.avgRisk.toFixed(1)}%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Average risk score
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs text-slate-500">Interventions Active</p>
                <p className="mt-2 text-2xl font-semibold">5</p>
                <p className="mt-1 text-xs text-emerald-700">2 resolved</p>
              </div>
            </section>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center border-b border-slate-200 px-4 py-3">
                  <span className="text-sm font-semibold">
                    State risk scores
                  </span>
                  <span className="ml-auto text-xs text-blue-700">
                    View all states
                  </span>
                </div>

                {canShow(DASHBOARD_SECTIONS.FILTERS) && (
                  <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 md:flex-row md:items-center">
                    <select
                      value={filterTier}
                      onChange={(e) => setFilterTier(e.target.value)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL">All Tiers</option>
                      <option value="HIGH">High Risk</option>
                      <option value="MEDIUM">Medium Risk</option>
                      <option value="LOW">Low Risk</option>
                    </select>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search state code..."
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="text-sm font-medium text-blue-700 hover:text-blue-900"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}

                <div className="divide-y divide-slate-100">
                  {rankedRiskScores.length > 0 ? (
                    rankedRiskScores.slice(0, 8).map((score) => {
                      const badge = riskBadge(score.risk_score);

                      return (
                        <button
                          key={score.id}
                          type="button"
                          onClick={() => setSelectedState(score)}
                          className="grid w-full grid-cols-[38px_90px_minmax(0,1fr)_44px_78px] items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <span className="text-sm font-semibold">
                            {score.state_code}
                          </span>
                          <span className="truncate text-sm text-slate-500">
                            {stateNames[score.state_code] || score.state_code}
                          </span>
                          <span className="h-2 rounded-full bg-slate-200">
                            <span
                              className="block h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, score.risk_score)}%`,
                                background: badge.color,
                              }}
                            />
                          </span>
                          <span className="text-right text-sm font-semibold">
                            {score.risk_score.toFixed(0)}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-center text-[11px] font-semibold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No data found. Try adjusting your filters.
                    </div>
                  )}
                </div>
              </section>

              {canShow(DASHBOARD_SECTIONS.COPILOT) ? (
                <ComplianceCopilot
                  states={filteredData}
                  selectedState={selectedState}
                  activeRole={activeRole}
                />
              ) : (
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Compliance copilot
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">
                    AI analysis available in Analyst and Operations views
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Switch roles to ask about state risk, exposure, and
                    recommended interventions.
                  </p>
                </section>
              )}
            </div>

            {canShow(DASHBOARD_SECTIONS.EXECUTIVE_FEED) &&
              executiveInsights.length > 0 && (
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                        Executive intelligence feed
                      </p>
                      <h2 className="mt-1 text-xl font-semibold">
                        What leadership should notice
                      </h2>
                    </div>
                    <p className="text-sm text-slate-500">
                      Data-derived insights from the current filters
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {executiveInsights.map((insight) => (
                      <article
                        key={insight.title}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                          {insight.severity}
                        </span>
                        <h3 className="mt-3 text-sm font-semibold">
                          {insight.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {insight.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

            {canShow(DASHBOARD_SECTIONS.AI_INSIGHTS) && (
              <AiInsightCards insights={aiInsights} />
            )}

            {canShow(DASHBOARD_SECTIONS.HISTORICAL_TRENDS) && (
              <HistoricalTrendAnalysis states={sortedData} />
            )}
            {canShow(DASHBOARD_SECTIONS.SCENARIO_FORECAST) && (
              <ScenarioForecasting states={sortedData} />
            )}

            {canShow(DASHBOARD_SECTIONS.DETAILED_TABLE) &&
              sortedData.length > 0 && (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          ["state_code", "State"],
                          ["risk_score", "Risk Score"],
                          ["revenue_at_risk", "Revenue at Risk"],
                        ].map(([key, label]) => (
                          <th
                            key={key}
                            className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            onClick={() => handleSort(key)}
                          >
                            {label}{" "}
                            {sortConfig.key === key &&
                              (sortConfig.direction === "asc" ? "↑" : "↓")}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Risk Tier
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedData.map((score) => (
                        <tr
                          key={score.id}
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => setSelectedState(score)}
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {score.state_code}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {score.risk_score.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            ${(score.revenue_at_risk / 1000000).toFixed(2)}M
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                              {score.risk_tier}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

            {canShow(DASHBOARD_SECTIONS.METHODOLOGY) && (
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                  Methodology
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  How the risk score is calculated
                </h2>
                <div className="mt-4 grid gap-4 text-sm leading-6 text-slate-600 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      1. Compare filings
                    </h3>
                    <p className="mt-2">
                      Actual SAR filing counts are compared against expected
                      filing counts for each state.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      2. Score the gap
                    </h3>
                    <p className="mt-2">
                      Risk score is the filing gap percentage, clamped between 0
                      and 100 so outliers remain readable.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      3. Assign tier
                    </h3>
                    <p className="mt-2">
                      Scores up to 30 are low risk, up to 60 are medium risk,
                      and scores above 60 are high risk.
                    </p>
                  </div>
                </div>
              </section>
            )}
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

export default RiskScores;


