import { useState, useEffect } from "react";
import apiClient from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Interventions() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await apiClient.get("/interventions/");
        setInterventions(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch interventions");
        setLoading(false);
        console.error("Error fetching interventions:", err);
      }
    };

    fetchInterventions();
  }, []);

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
      <h2 className="text-3xl font-bold mb-6">Recommended Interventions</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {interventions.map((intervention) => (
          <div
            key={intervention.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
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

      {interventions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No interventions found.
        </div>
      )}
    </div>
  );
}

export default Interventions;
