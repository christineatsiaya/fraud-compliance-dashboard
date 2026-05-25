import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import StateDrilldownDrawer from "../components/StateDrilldownDrawer";
import AiInsightCards from "../components/AiInsightCards";
import ComplianceCopilot from "../components/ComplianceCopilot";
import HistoricalTrendAnalysis from "../components/HistoricalTrendAnalysis";
import { buildAiInsightCards } from "../utils/copilot";
import { buildExecutiveInsights } from "../utils/intelligence";

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
];

function RiskScores() {
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [filterTier, setFilterTier] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    const fetchRiskScores = async () => {
      try {
        const response = await apiClient.get("/risk/risk-scores");
        setRiskScores(response.data);
        setLoading(false);
      } catch (err) {
        setRiskScores(DEMO_RISK_SCORES);
        setUsingDemoData(true);
        setError(null);
        setLoading(false);
        console.error("Error fetching risk scores:", err);
      }
    };

    fetchRiskScores();
  }, []);

  // Filter data based on selected tier AND search term
  const filteredData = useMemo(() => {
    let filtered = riskScores;

    // Filter by tier
    if (filterTier !== "ALL") {
      filtered = filtered.filter((score) => score.risk_tier === filterTier);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((score) =>
        score.state_code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [riskScores, filterTier, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (filteredData.length === 0)
      return { count: 0, avgRisk: 0, totalRevenue: 0 };

    const totalRisk = filteredData.reduce((sum, s) => sum + s.risk_score, 0);
    const totalRevenue = filteredData.reduce(
      (sum, s) => sum + s.revenue_at_risk,
      0,
    );

    return {
      count: filteredData.length,
      avgRisk: totalRisk / filteredData.length,
      totalRevenue: totalRevenue,
    };
  }, [filteredData]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilterTier("ALL");
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
    toast.success("Filters cleared");
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (sortedData.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Create CSV content
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

    // Create download link
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

  // Check if any filters are active
  const hasActiveFilters =
    filterTier !== "ALL" || searchTerm !== "" || sortConfig.key !== null;

  const projectMetrics = [
    { label: "States analyzed", value: stats.count },
    {
      label: "Estimated exposure",
      value: `$${(stats.totalRevenue / 1000000).toFixed(1)}M`,
    },
    {
      label: "Interventions mapped",
      value: "5",
    },
  ];

  const executiveInsights = useMemo(
    () => buildExecutiveInsights(filteredData),
    [filteredData],
  );

  const aiInsights = useMemo(
    () => buildAiInsightCards(filteredData),
    [filteredData],
  );

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Toaster position="top-right" />

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
              Portfolio demo | Compliance intelligence
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              State Risk Scores
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Explore a working fraud compliance dashboard that turns
              state-level SAR gap signals into risk tiers, revenue exposure,
              and exportable review data.
            </p>
          </div>
          <a
            href="https://github.com/christineatsiaya/fraud-compliance-dashboard"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repo
          </a>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {projectMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {metric.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Risk Score Explorer</h2>
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {usingDemoData && (
        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Showing demo data because the live API is unavailable.
        </div>
      )}

      {executiveInsights.length > 0 && (
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
                Executive intelligence feed
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                What leadership should notice
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Data-derived insights from the current filters
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {executiveInsights.map((insight) => (
              <article
                key={insight.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    insight.severity === "critical"
                      ? "bg-red-100 text-red-800"
                      : insight.severity === "stable"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {insight.severity}
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
      )}

      <AiInsightCards insights={aiInsights} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total States</p>
          <p className="text-3xl font-bold text-gray-900">{stats.count}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Average Risk Score</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.avgRisk.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total Revenue at Risk</p>
          <p className="text-3xl font-bold text-gray-900">
            ${(stats.totalRevenue / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Risk Tier:
            </label>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Tiers</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Search State:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., CA, TX, FL..."
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Bar Chart */}
      {sortedData.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Risk Score by State</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state_code" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="risk_score" fill="#3b82f6" name="Risk Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 mb-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No data found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to see results.
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <HistoricalTrendAnalysis states={sortedData} />

      {/* Table */}
      {sortedData.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("state_code")}
                >
                  State{" "}
                  {sortConfig.key === "state_code" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("risk_score")}
                >
                  Risk Score{" "}
                  {sortConfig.key === "risk_score" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("revenue_at_risk")}
                >
                  Revenue at Risk{" "}
                  {sortConfig.key === "revenue_at_risk" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Tier
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((score) => (
                <tr
                  key={score.id}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => setSelectedState(score)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {score.state_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {score.risk_score.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(score.revenue_at_risk / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        score.risk_tier === "HIGH"
                          ? "bg-red-100 text-red-800"
                          : score.risk_tier === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {score.risk_tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
          Methodology
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          How the risk score is calculated
        </h2>
        <div className="mt-4 grid gap-4 text-sm leading-6 text-slate-600 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-slate-900">1. Compare filings</h3>
            <p className="mt-2">
              The backend compares actual SAR filing counts against expected
              filing counts for each state.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">2. Score the gap</h3>
            <p className="mt-2">
              Risk score is the filing gap percentage, clamped between 0 and
              100 so outliers remain readable.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">3. Assign tier</h3>
            <p className="mt-2">
              Scores up to 30 are low risk, up to 60 are medium risk, and
              scores above 60 are high risk.
            </p>
          </div>
        </div>
      </section>

      <ComplianceCopilot states={filteredData} selectedState={selectedState} />

      <StateDrilldownDrawer
        state={selectedState}
        states={riskScores}
        onClose={() => setSelectedState(null)}
      />
    </div>
  );
}

export default RiskScores;
