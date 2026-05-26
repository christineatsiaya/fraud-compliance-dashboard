import { useEffect, useMemo, useState } from "react";
import {
  buildCopilotAnswer,
  suggestedCopilotQuestions,
} from "../utils/copilot";
import apiClient from "../services/api";

function ComplianceCopilot({ states, selectedState, activeRole = "executive" }) {
  const [activeQuestionId, setActiveQuestionId] = useState(
    suggestedCopilotQuestions[0].id,
  );
  const [copilotResponse, setCopilotResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fallbackAnswer = useMemo(
    () =>
      buildCopilotAnswer({
        questionId: activeQuestionId,
        states,
        selectedState,
      }),
    [activeQuestionId, selectedState, states],
  );

  const fallbackResponse = useMemo(
    () => ({
      summary: fallbackAnswer,
      risk_drivers: [
        "Generated from the visible dashboard records.",
        selectedState
          ? `Current state context is ${selectedState.state_code}.`
          : "No state is selected, so the highest-risk visible state is used.",
      ],
      recommended_actions: [
        "Review the highest-risk jurisdiction first.",
        "Use scenario forecasting before final budget allocation.",
      ],
      confidence_note:
        "Local deterministic fallback used because backend AI was unavailable.",
      source: "fallback",
    }),
    [fallbackAnswer, selectedState],
  );

  useEffect(() => {
    let isCurrent = true;

    const fetchCopilotResponse = async () => {
      if (states.length === 0) {
        setCopilotResponse(fallbackResponse);
        return;
      }

      setLoading(true);

      try {
        const response = await apiClient.post("/ai/compliance-copilot", {
          question_id: activeQuestionId,
          active_role: activeRole,
          selected_state: selectedState,
          states,
        });

        if (isCurrent) {
          setCopilotResponse(response.data);
        }
      } catch (error) {
        console.error("Error fetching AI copilot response:", error);
        if (isCurrent) {
          setCopilotResponse(fallbackResponse);
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchCopilotResponse();

    return () => {
      isCurrent = false;
    };
  }, [activeQuestionId, activeRole, fallbackResponse, selectedState, states]);

  const answer = copilotResponse || fallbackResponse;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            Compliance copilot preview
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Ask the dashboard what matters
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Backend-backed copilot that can use OpenAI when configured, with a
            deterministic fallback for local demos.
          </p>
          {selectedState && (
            <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              Current state context: {selectedState.state_code}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {suggestedCopilotQuestions.map((question) => (
              <button
                key={question.id}
                type="button"
                onClick={() => setActiveQuestionId(question.id)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  activeQuestionId === question.id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700"
                }`}
              >
                {question.label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Copilot response
              </p>
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                  answer.source === "openai"
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {loading
                  ? "loading"
                  : answer.source === "openai"
                    ? "OpenAI"
                    : "fallback"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {loading ? "Generating compliance intelligence..." : answer.summary}
            </p>

            {!loading && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-950">
                    Risk drivers
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    {answer.risk_drivers.map((driver) => (
                      <li key={driver}>- {driver}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-950">
                    Recommended actions
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    {answer.recommended_actions.map((action) => (
                      <li key={action}>- {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!loading && (
              <p className="mt-4 rounded-md bg-white p-3 text-sm leading-6 text-slate-600">
                {answer.confidence_note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComplianceCopilot;
