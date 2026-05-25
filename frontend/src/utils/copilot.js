import {
  formatMillions,
  getRecommendedAction,
  getRiskTierLabel,
  getStateRank,
} from "./intelligence.js";

export const suggestedCopilotQuestions = [
  {
    id: "why-state-risk",
    label: "Why is this state high risk?",
  },
  {
    id: "leadership-next",
    label: "What should leadership do next?",
  },
  {
    id: "highest-review",
    label: "Which state needs review first?",
  },
  {
    id: "exposure-summary",
    label: "Summarize current exposure.",
  },
];

function getSortedByRisk(states) {
  return [...states].sort((a, b) => b.risk_score - a.risk_score);
}

function getHighRiskStates(states) {
  return states.filter((state) => state.risk_tier === "HIGH");
}

function joinStateCodes(states) {
  if (states.length === 0) return "none";
  if (states.length === 1) return states[0].state_code;

  const stateCodes = states.map((state) => state.state_code);
  return `${stateCodes.slice(0, -1).join(", ")} and ${stateCodes.at(-1)}`;
}

export function buildAiInsightCards(states) {
  if (states.length === 0) return [];

  const highRiskStates = getHighRiskStates(states);
  const totalExposure = states.reduce(
    (sum, state) => sum + state.revenue_at_risk,
    0,
  );
  const highestRisk = getSortedByRisk(states)[0];

  return [
    {
      title: "High-risk concentration",
      detail: `${joinStateCodes(highRiskStates)} currently drive high-risk compliance attention.`,
      tone: highRiskStates.length > 0 ? "critical" : "stable",
    },
    {
      title: "Exposure summary",
      detail: `${formatMillions(totalExposure)} in estimated exposure is represented in the current view.`,
      tone: "watch",
    },
    {
      title: "Copilot recommendation",
      detail: `Start with ${highestRisk.state_code}, then validate intervention readiness for the next highest-risk jurisdictions.`,
      tone: "action",
    },
  ];
}

export function buildCopilotAnswer({ questionId, states, selectedState }) {
  if (states.length === 0) {
    return "No risk score records are available for this view.";
  }

  const sortedByRisk = getSortedByRisk(states);
  const highestRisk = sortedByRisk[0];
  const highRiskStates = getHighRiskStates(states);
  const stateContext = selectedState || highestRisk;
  const totalExposure = states.reduce(
    (sum, state) => sum + state.revenue_at_risk,
    0,
  );

  if (questionId === "why-state-risk") {
    return `${stateContext.state_code} is classified as ${getRiskTierLabel(stateContext.risk_tier).toLowerCase()} with a ${stateContext.risk_score.toFixed(1)} score and ${formatMillions(stateContext.revenue_at_risk)} in estimated exposure. Immediate review guidance: ${getRecommendedAction(stateContext)}`;
  }

  if (questionId === "leadership-next") {
    return `Leadership should prioritize ${highestRisk.state_code} first, then review ${joinStateCodes(highRiskStates.filter((state) => state.state_code !== highestRisk.state_code)) || "the remaining monitored states"} for intervention readiness.`;
  }

  if (questionId === "highest-review") {
    return `${highestRisk.state_code} needs review first because it ranks #${getStateRank(highestRisk, states)} with the highest current risk score at ${highestRisk.risk_score.toFixed(1)}.`;
  }

  if (questionId === "exposure-summary") {
    return `The current view contains ${formatMillions(totalExposure)} in estimated exposure across ${states.length} states, with ${joinStateCodes(highRiskStates)} in the high-risk tier.`;
  }

  return "Select one of the suggested questions to generate a compliance intelligence summary.";
}
