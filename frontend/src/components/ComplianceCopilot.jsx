import { useMemo, useState } from "react";
import {
  buildCopilotAnswer,
  suggestedCopilotQuestions,
} from "../utils/copilot";

function ComplianceCopilot({ states, selectedState }) {
  const [activeQuestionId, setActiveQuestionId] = useState(
    suggestedCopilotQuestions[0].id,
  );

  const answer = useMemo(
    () =>
      buildCopilotAnswer({
        questionId: activeQuestionId,
        states,
        selectedState,
      }),
    [activeQuestionId, selectedState, states],
  );

  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            Compliance copilot preview
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Ask the dashboard what matters
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This is a deterministic copilot prototype. It answers from the
            current dashboard data and is designed as a future AI integration
            point.
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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Copilot response
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{answer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComplianceCopilot;
