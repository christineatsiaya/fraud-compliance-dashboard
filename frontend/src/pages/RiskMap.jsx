import { useEffect, useState } from "react";
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
          apiClient.get("/sar/top-states"),
          apiClient.get("/risk/risk-scores"),
        ]);

        setFilingsData(filingsRes.data || []);
        setRiskScores(riskRes.data || []);
      } catch (err) {
        console.error("Error fetching map data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const riskByCode = Object.fromEntries(
    riskScores.map((d) => [d.state_code, d]),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4">
      <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-900">
            SAR Filing Risk Intelligence
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Top states ranked by suspicious activity filing volume
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  State
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Filings
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Risk Score
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Risk Tier
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filingsData.map((state) => {
                const risk = riskByCode[state.state_code];

                return (
                  <tr
                    key={state.state_code}
                    onClick={() => risk && setSelectedState(risk)}
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {state.state_name} ({state.state_code})
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {state.total_filings?.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {risk?.risk_score?.toFixed(1) || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                        {risk?.risk_tier || "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
