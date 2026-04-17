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
import apiClient from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function RiskScores() {
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTier, setFilterTier] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRiskScores = async () => {
      try {
        const response = await apiClient.get("/risk/risk-scores");
        setRiskScores(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch risk scores");
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
      <h2 className="text-3xl font-bold mb-6">State Risk Scores</h2>

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
      <div className="mb-6 flex flex-col md:flex-row gap-4">
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

      {/* Bar Chart */}
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

      {/* Table */}
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
              <tr key={score.id} className="hover:bg-gray-50">
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
    </div>
  );
}

export default RiskScores;
