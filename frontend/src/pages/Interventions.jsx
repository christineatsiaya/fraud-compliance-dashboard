import { useState, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import OperationalAlertCenter from "../components/OperationalAlertCenter";
import InterventionStatusControl from "../components/InterventionStatusControl";
import InterventionAuditLog from "../components/InterventionAuditLog";
import {
  buildInitialAuditEvents,
  buildInterventionWorkflow,
  buildOperationalAlerts,
  buildStatusAuditEvent,
} from "../utils/operations";

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
  const [statusById, setStatusById] = useState({});
  const [auditEvents, setAuditEvents] = useState([]);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await apiClient.get("/interventions/");
        setInterventions(response.data);
        setAuditEvents(buildInitialAuditEvents(response.data));
        setLoading(false);
      } catch (err) {
        setInterventions(DEMO_INTERVENTIONS);
        setAuditEvents(buildInitialAuditEvents(DEMO_INTERVENTIONS));
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

  const workflowInterventions = useMemo(
    () => buildInterventionWorkflow(filteredInterventions, statusById),
    [filteredInterventions, statusById],
  );

  const operationalAlerts = useMemo(
    () => buildOperationalAlerts(workflowInterventions),
    [workflowInterventions],
  );

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

  const handleStatusChange = (intervention, nextStatus) => {
    const currentStatus = intervention.status;

    if (currentStatus === nextStatus) return;

    setStatusById((current) => ({
      ...current,
      [intervention.id]: nextStatus,
    }));
    setAuditEvents((current) => [
      ...current,
      buildStatusAuditEvent({
        intervention,
        fromStatus: currentStatus,
        toStatus: nextStatus,
        sequence: current.length + 1,
      }),
    ]);
    toast.success(`${intervention.state_code} moved to workflow status`);
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
    <DashboardLayout
      interventionCount={
        filteredInterventions.filter((item) => item.priority_level === "HIGH")
          .length
      }
    >
      <Toaster position="top-right" />
      <div className="flex flex-col bg-white">
        <header className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold text-slate-950">
              Recommended Interventions
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              BSA/SAR compliance action queue - Ranked by priority and confidence
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
          >
            Export CSV
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8fafc] p-4 lg:p-5">
          {usingDemoData && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="font-semibold">Demo mode:</span> Showing sample
              data - live API unavailable.
            </div>
          )}

          <OperationalAlertCenter alerts={operationalAlerts} />

          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-slate-500">Total Interventions</p>
              <p className="mt-2 text-2xl font-semibold">
                {filteredInterventions.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">Current filter scope</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-slate-500">High Priority</p>
              <p className="mt-2 text-2xl font-semibold text-red-700">
                {
                  filteredInterventions.filter(
                    (item) => item.priority_level === "HIGH",
                  ).length
                }
              </p>
              <p className="mt-1 text-xs text-red-600">
                Requires immediate action
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-slate-500">Average Confidence</p>
              <p className="mt-2 text-2xl font-semibold">
                {filteredInterventions.length > 0
                  ? (
                      (filteredInterventions.reduce(
                        (sum, item) => sum + item.confidence_score,
                        0,
                      ) /
                        filteredInterventions.length) *
                      100
                    ).toFixed(0)
                  : 0}
                %
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Model confidence score
              </p>
            </div>
          </section>

          <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
            <span className="text-sm font-medium text-slate-600">Filter:</span>
            <select
              value={filterPriority}
              onChange={(event) => setFilterPriority(event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                Clear
              </button>
            )}
          </div>

          {workflowInterventions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workflowInterventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div
                    className={`h-1 w-full ${
                      intervention.priority_level === "HIGH"
                        ? "bg-red-500"
                        : intervention.priority_level === "MEDIUM"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                    }`}
                  />
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {intervention.state_code}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          intervention.priority_level === "HIGH"
                            ? "bg-red-50 text-red-700"
                            : intervention.priority_level === "MEDIUM"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {intervention.priority_level}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Recommendation
                        </p>
                        <p className="mt-1 leading-5 text-slate-600">
                          {intervention.recommendation}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Regulatory citation
                        </p>
                        <p className="mt-1 text-slate-600">
                          {intervention.regulatory_citation}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Confidence
                        </p>
                        <span className="text-sm font-semibold text-slate-900">
                          {(intervention.confidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <InterventionStatusControl
                        status={intervention.status}
                        onChange={(nextStatus) =>
                          handleStatusChange(intervention, nextStatus)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-sm font-medium text-slate-900">
                No interventions found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your filter.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}

          <InterventionAuditLog events={auditEvents} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Interventions;

