const TIER_RESPONSE_RATES = {
  HIGH: { risk: 0.315, exposure: 0.3 },
  MEDIUM: { risk: 0.335, exposure: 0.21 },
  LOW: { risk: 0.25, exposure: 0.205 },
};

const DEFAULT_RESPONSE_RATE = { risk: 0.12, exposure: 0.1 };
const SAVINGS_CAPTURE_RATE = 0.35;

const roundToOne = (value) => Number(value.toFixed(1));

const getTierResponseRate = (riskTier) =>
  TIER_RESPONSE_RATES[riskTier] ?? DEFAULT_RESPONSE_RATE;

const getScenarioMultiplier = ({
  budgetIncreasePercent,
  effectivenessPercent,
}) => (1 + Number(budgetIncreasePercent ?? 0) / 100) *
  (Number(effectivenessPercent ?? 0) / 100);

export function buildStateScenarioImpact(state, scenario) {
  const currentRisk = Number(state.risk_score ?? 0);
  const currentExposure = Number(state.revenue_at_risk ?? 0);
  const responseRate = getTierResponseRate(state.risk_tier);
  const scenarioMultiplier = getScenarioMultiplier(scenario);
  const riskReduction = roundToOne(
    Math.min(28, currentRisk * responseRate.risk * scenarioMultiplier),
  );
  const projectedRisk = roundToOne(Math.max(0, currentRisk - riskReduction));
  const exposureReduction = Math.round(
    currentExposure * responseRate.exposure * scenarioMultiplier,
  );
  const projectedExposure = Math.max(0, currentExposure - exposureReduction);
  const estimatedSavings = Math.round(exposureReduction * SAVINGS_CAPTURE_RATE);

  return {
    stateCode: state.state_code,
    riskTier: state.risk_tier,
    currentRisk,
    projectedRisk,
    riskReduction,
    currentExposure,
    projectedExposure,
    exposureReduction,
    estimatedSavings,
  };
}

export function buildScenarioForecast(states, scenario) {
  if (states.length === 0) {
    return {
      stateCount: 0,
      totalExposure: 0,
      projectedExposureReduction: 0,
      estimatedSavings: 0,
      averageRiskReduction: 0,
      projectedAverageRisk: 0,
      stateImpacts: [],
      chartData: [],
    };
  }

  const stateImpacts = states
    .map((state) => buildStateScenarioImpact(state, scenario))
    .sort((a, b) => b.exposureReduction - a.exposureReduction)
    .map((impact, index) => ({
      ...impact,
      impactTier: index === 0 ? "largest" : index === 1 ? "high" : "targeted",
    }));

  const totalExposure = stateImpacts.reduce(
    (sum, impact) => sum + impact.currentExposure,
    0,
  );
  const projectedExposureReduction = stateImpacts.reduce(
    (sum, impact) => sum + impact.exposureReduction,
    0,
  );
  const estimatedSavings = stateImpacts.reduce(
    (sum, impact) => sum + impact.estimatedSavings,
    0,
  );
  const averageRiskReduction = roundToOne(
    stateImpacts.reduce((sum, impact) => sum + impact.riskReduction, 0) /
      stateImpacts.length,
  );
  const projectedAverageRisk = roundToOne(
    stateImpacts.reduce((sum, impact) => sum + impact.projectedRisk, 0) /
      stateImpacts.length,
  );

  return {
    stateCount: states.length,
    totalExposure,
    projectedExposureReduction,
    estimatedSavings,
    averageRiskReduction,
    projectedAverageRisk,
    stateImpacts,
    chartData: stateImpacts.map((impact) => ({
      stateCode: impact.stateCode,
      currentRisk: impact.currentRisk,
      projectedRisk: impact.projectedRisk,
    })),
  };
}

export function formatScenarioPercent(value) {
  return `${Number(value).toFixed(1)} pts`;
}
