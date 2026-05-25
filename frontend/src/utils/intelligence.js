export function formatMillions(value) {
  return `$${(value / 1000000).toFixed(1)}M`;
}

export function getRiskTierLabel(tier) {
  if (tier === "HIGH") return "High risk";
  if (tier === "MEDIUM") return "Medium risk";
  return "Low risk";
}

export function getStateRank(state, states) {
  const rankedStates = [...states].sort((a, b) => b.risk_score - a.risk_score);
  return rankedStates.findIndex((item) => item.state_code === state.state_code) + 1;
}

export function getRecommendedAction(state) {
  if (state.risk_tier === "HIGH") {
    return "Prioritize immediate compliance review and intervention approval.";
  }

  if (state.risk_tier === "MEDIUM") {
    return "Schedule targeted monitoring and reassess intervention priority.";
  }

  return "Maintain baseline monitoring and compare against peer movement.";
}

export function getStateExplanation(state, states) {
  const rank = getStateRank(state, states);
  const exposure = formatMillions(state.revenue_at_risk);
  const tier = getRiskTierLabel(state.risk_tier).toLowerCase();

  return `${state.state_code} ranks #${rank} by risk score in the current dataset, with ${exposure} in estimated exposure and a ${tier} classification.`;
}

export function buildExecutiveInsights(states) {
  if (states.length === 0) return [];

  const highRiskStates = states.filter((state) => state.risk_tier === "HIGH");
  const totalExposure = states.reduce(
    (sum, state) => sum + state.revenue_at_risk,
    0,
  );
  const sortedByRisk = [...states].sort((a, b) => b.risk_score - a.risk_score);
  const highestRisk = sortedByRisk[0];
  const topExposureStates = [...states]
    .sort((a, b) => b.revenue_at_risk - a.revenue_at_risk)
    .slice(0, 2);

  return [
    {
      title: `${highRiskStates.length} high-risk jurisdictions`,
      detail:
        highRiskStates.length > 0
          ? `${highRiskStates.map((state) => state.state_code).join(", ")} exceed the high-risk threshold.`
          : "No jurisdictions currently exceed the high-risk threshold.",
      severity: highRiskStates.length > 0 ? "critical" : "stable",
    },
    {
      title: `${formatMillions(totalExposure)} estimated exposure`,
      detail: "Current dataset exposure is concentrated across the monitored states.",
      severity: "watch",
    },
    {
      title: `${highestRisk.state_code} leads current risk`,
      detail: `${highestRisk.state_code} has the highest score at ${highestRisk.risk_score.toFixed(1)}.`,
      severity: highestRisk.risk_tier === "HIGH" ? "critical" : "watch",
    },
    {
      title: "Leadership focus area",
      detail: `${topExposureStates.map((state) => state.state_code).join(" and ")} represent the largest exposure pools.`,
      severity: "action",
    },
  ];
}
