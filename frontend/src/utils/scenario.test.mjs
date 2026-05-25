import test from "node:test";
import assert from "node:assert/strict";
import {
  buildScenarioForecast,
  buildStateScenarioImpact,
  formatScenarioPercent,
} from "./scenario.js";

const demoStates = [
  {
    state_code: "CA",
    risk_score: 90,
    revenue_at_risk: 18000000,
    risk_tier: "HIGH",
  },
  {
    state_code: "TX",
    risk_score: 70,
    revenue_at_risk: 12000000,
    risk_tier: "MEDIUM",
  },
  {
    state_code: "WA",
    risk_score: 40,
    revenue_at_risk: 4000000,
    risk_tier: "LOW",
  },
];

test("buildStateScenarioImpact projects risk and exposure reduction", () => {
  const impact = buildStateScenarioImpact(demoStates[0], {
    budgetIncreasePercent: 20,
    effectivenessPercent: 70,
  });

  assert.equal(impact.stateCode, "CA");
  assert.equal(impact.currentRisk, 90);
  assert.equal(impact.projectedRisk, 66.2);
  assert.equal(impact.riskReduction, 23.8);
  assert.equal(impact.exposureReduction, 4536000);
  assert.equal(impact.estimatedSavings, 1587600);
});

test("buildScenarioForecast summarizes portfolio-level projection", () => {
  const forecast = buildScenarioForecast(demoStates, {
    budgetIncreasePercent: 20,
    effectivenessPercent: 70,
  });

  assert.equal(forecast.stateCount, 3);
  assert.equal(forecast.totalExposure, 34000000);
  assert.equal(forecast.projectedExposureReduction, 7341600);
  assert.equal(forecast.estimatedSavings, 2569560);
  assert.equal(forecast.averageRiskReduction, 17.3);
  assert.equal(forecast.projectedAverageRisk, 49.4);
});

test("buildScenarioForecast ranks highest-impact states by exposure reduction", () => {
  const forecast = buildScenarioForecast(demoStates, {
    budgetIncreasePercent: 20,
    effectivenessPercent: 70,
  });

  assert.deepEqual(
    forecast.stateImpacts.map((impact) => impact.stateCode),
    ["CA", "TX", "WA"],
  );
  assert.equal(forecast.stateImpacts[0].impactTier, "largest");
  assert.equal(forecast.stateImpacts[2].impactTier, "targeted");
});

test("buildScenarioForecast handles empty datasets safely", () => {
  const forecast = buildScenarioForecast([], {
    budgetIncreasePercent: 20,
    effectivenessPercent: 70,
  });

  assert.equal(forecast.stateCount, 0);
  assert.equal(forecast.totalExposure, 0);
  assert.equal(forecast.projectedExposureReduction, 0);
  assert.deepEqual(forecast.stateImpacts, []);
});

test("formatScenarioPercent renders signed percentage-point movement", () => {
  assert.equal(formatScenarioPercent(17.25), "17.3 pts");
  assert.equal(formatScenarioPercent(0), "0.0 pts");
});
