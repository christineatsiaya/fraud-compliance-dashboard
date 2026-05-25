export const TREND_QUARTERS = ["2026 Q1", "2026 Q2", "2026 Q3", "2026 Q4"];

const TIER_RISK_OFFSETS = {
  HIGH: [12, 7.5, 4.5, 0],
  MEDIUM: [8, 5, 2.5, 0],
  LOW: [3, 2, 1, 0],
};

const DEFAULT_OFFSETS = [6, 4, 2, 0];

const roundToOne = (value) => Number(value.toFixed(1));

const getOffsetsForTier = (riskTier) =>
  TIER_RISK_OFFSETS[riskTier] ?? DEFAULT_OFFSETS;

const clampRiskScore = (score) => Math.max(0, Math.min(100, score));

export function buildStateTrendPoints(state) {
  const currentRisk = Number(state.risk_score ?? 0);
  const currentExposure = Number(state.revenue_at_risk ?? 0);
  const offsets = getOffsetsForTier(state.risk_tier);

  return TREND_QUARTERS.map((quarter, index) => {
    const riskScore = roundToOne(clampRiskScore(currentRisk - offsets[index]));
    const exposureRatio = currentRisk > 0 ? riskScore / currentRisk : 0;

    return {
      quarter,
      stateCode: state.state_code,
      riskScore,
      exposure: Math.round(currentExposure * exposureRatio),
    };
  });
}

export function buildQuarterlyTrendSeries(states) {
  if (states.length === 0) return [];

  return TREND_QUARTERS.map((quarter, quarterIndex) => {
    const points = states.map(
      (state) => buildStateTrendPoints(state)[quarterIndex],
    );
    const totalRisk = points.reduce((sum, point) => sum + point.riskScore, 0);
    const totalExposure = points.reduce((sum, point) => sum + point.exposure, 0);

    return {
      quarter,
      averageRisk: roundToOne(totalRisk / points.length),
      totalExposure,
    };
  });
}

export function buildStateTrendSummary(state) {
  const trendPoints = buildStateTrendPoints(state);
  const firstPoint = trendPoints[0];
  const previousPoint = trendPoints[trendPoints.length - 2];
  const currentPoint = trendPoints.at(-1);
  const quarterDelta = roundToOne(currentPoint.riskScore - previousPoint.riskScore);
  const riskVelocity = roundToOne(currentPoint.riskScore - firstPoint.riskScore);
  const direction =
    quarterDelta > 0 ? "deteriorating" : quarterDelta < 0 ? "improving" : "stable";

  return {
    stateCode: state.state_code,
    riskTier: state.risk_tier,
    currentRisk: currentPoint.riskScore,
    previousRisk: previousPoint.riskScore,
    quarterDelta,
    riskVelocity,
    currentExposure: currentPoint.exposure,
    direction,
    trendPoints,
  };
}

export function buildDeteriorationLeaders(states, limit = 3) {
  return states
    .map(buildStateTrendSummary)
    .sort((a, b) => {
      if (b.riskVelocity !== a.riskVelocity) {
        return b.riskVelocity - a.riskVelocity;
      }

      return b.currentExposure - a.currentExposure;
    })
    .slice(0, limit);
}

export function formatTrendDelta(value) {
  if (value === 0) return "0.0";

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}
