import { useState, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const DEMO_INTERVENTIONS = [
  {
    id: "demo-ca",
    state_code: "CA",
    priority_level: "HIGH",
    recommendation:
      "Increase review cadence for high-volume SAR categories and escalate repeat entity patterns.",
    regulatory_citation: "31 CFR Chapter X",
    confidence_score: 0.92,
  },
  {
    id: "demo-ny",
    state_code: "NY",
    priority_level: "HIGH",
    recommendation:
      "Coordinate targeted control testing for institutions with elevated filing gaps.",
    regulatory_citation: "Bank Secrecy Act",
    confidence_score: 0.89,
  },
  {
    id: "demo-tx",
    state_code: "TX",
    priority_level: "MEDIUM",
    recommendation:
      "Review threshold tuning for fraud typologies with inconsistent reporting coverage.",
    regulatory_citation: "FinCEN SAR guidance",
    confidence_score: 0.81,
  },
  {
    id: "demo-fl",
    state_code: "FL",
    priority_level: "MEDIUM",
    recommendation:
      "Prioritize analyst sampling for suspicious account velocity indicators.",
    regulatory_citation: "31 CFR 1020.320",
    confidence_score: 0.77,
  },
  {
    id: "demo-wa",
    state_code: "WA",
    priority_level: "LOW",
    recommendation:
      "Maintain quarterly monitoring and compare against regional peer baselines.",
    regulatory_citation: "FFIEC BSA/AML Manual",
    confidence_score: 0.68,
  },
];

function Interventions() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [filterPriority, setFilterPriority] = useState("ALL");

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await apiClient.get("/interventions/");
        setInterventions(response.data);
        setLoading(false);
      } catch (err) {
        setInterventions(DEMO_INTERVENTIONS);
        setUsingDemoData(true);
        setError(null);
        setLoading(false);
        console.error("Error fetching interventions:", err);
      }
    };

    fetchInterventions();
  }, []);

  // Filter interventions by priority
  const filteredInterventions = useMemo(() => {
    if (filterPriority === "ALL") return interventions;
    return interventions.filter(
      (intervention) => intervention.priority_level === filterPriority,
    );
  }, [interventions, filterPriority]);

  // Clear filters
  const handleClearFilters = () => {
    setFilterPriority("ALL");
    toast.success("Filter cleared");
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredInterventions.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Create CSV content
    const headers = [
      "State",
      "Priority",
      "Recommendation",
      "Regulatory Citation",
      "Confidence Score",
    ];
    const rows = filteredInterventions.map((intervention) => [
      intervention.state_code,
      intervention.priority_level,
      `"${intervention.recommendation.replace(/"/g, '""')}"`, // Escape quotes
      intervention.regulatory_citation,
      `${(intervention.confidence_score * 100).toFixed(0)}%`,
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
    link.download = `interventions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(
      `Exported ${filteredInterventions.length} interventions to CSV`,
    );
  };

  const hasActiveFilters = filterPriority !== "ALL";

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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Recommended Interventions</h2>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total Interventions</p>
          <p className="text-3xl font-bold text-gray-900">
            {filteredInterventions.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">High Priority</p>
          <p className="text-3xl font-bold text-gray-900">
            {
              filteredInterventions.filter((i) => i.priority_level === "HIGH")
                .length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Average Confidence</p>
          <p className="text-3xl font-bold text-gray-900">
            {filteredInterventions.length > 0
              ? (
                  (filteredInterventions.reduce(
                    (sum, i) => sum + i.confidence_score,
                    0,
                  ) /
                    filteredInterventions.length) *
                  100
                ).toFixed(0)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Filter by Priority:
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredInterventions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInterventions.map((intervention) => (
            <div
              key={intervention.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {intervention.state_code}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    intervention.priority_level === "HIGH"
                      ? "bg-red-100 text-red-800"
                      : intervention.priority_level === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {intervention.priority_level}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Recommendation:
                  </p>
                  <p className="text-sm text-gray-600">
                    {intervention.recommendation}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Regulatory Citation:
                  </p>
                  <p className="text-sm text-gray-600">
                    {intervention.regulatory_citation}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Confidence Score:
                  </p>
                  <p className="text-sm text-gray-600">
                    {(intervention.confidence_score * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No interventions found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filter to see results.
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Interventions;
