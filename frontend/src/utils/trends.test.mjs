import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDeteriorationLeaders,
  buildQuarterlyTrendSeries,
  buildStateTrendSummary,
  formatTrendDelta,
} from "./trends.js";

const demoStates = [
  {
    state_code: "CA",
    risk_score: 91.4,
    revenue_at_risk: 18400000,
    risk_tier: "HIGH",
  },
  {
    state_code: "NY",
    risk_score: 86.2,
    revenue_at_risk: 15100000,
    risk_tier: "HIGH",
  },
  {
    state_code: "TX",
    risk_score: 74.8,
    revenue_at_risk: 13200000,
    risk_tier: "MEDIUM",
  },
  {
    state_code: "WA",
    risk_score: 42.7,
    revenue_at_risk: 4100000,
    risk_tier: "LOW",
  },
];

test("buildQuarterlyTrendSeries creates four quarterly rollups ending with current data", () => {
  const trendSeries = buildQuarterlyTrendSeries(demoStates);

  assert.equal(trendSeries.length, 4);
  assert.deepEqual(
    trendSeries.map((point) => point.quarter),
    ["2026 Q1", "2026 Q2", "2026 Q3", "2026 Q4"],
  );
  assert.equal(trendSeries.at(-1).averageRisk, 73.8);
  assert.equal(trendSeries.at(-1).totalExposure, 50800000);
  assert.ok(trendSeries[0].averageRisk < trendSeries.at(-1).averageRisk);
});

test("buildStateTrendSummary calculates current risk, previous risk, and velocity", () => {
  const summary = buildStateTrendSummary(demoStates[0]);

  assert.equal(summary.stateCode, "CA");
  assert.equal(summary.currentRisk, 91.4);
  assert.equal(summary.previousRisk, 86.9);
  assert.equal(summary.riskVelocity, 12);
  assert.equal(summary.quarterDelta, 4.5);
  assert.equal(summary.direction, "deteriorating");
});

test("buildDeteriorationLeaders ranks states by risk velocity", () => {
  const leaders = buildDeteriorationLeaders(demoStates);

  assert.equal(leaders.length, 3);
  assert.deepEqual(
    leaders.map((leader) => leader.stateCode),
    ["CA", "NY", "TX"],
  );
  assert.equal(leaders[0].riskVelocity, 12);
  assert.equal(leaders[2].riskVelocity, 8);
});

test("formatTrendDelta renders signed one-decimal deltas", () => {
  assert.equal(formatTrendDelta(4.5), "+4.5");
  assert.equal(formatTrendDelta(-2), "-2.0");
  assert.equal(formatTrendDelta(0), "0.0");
});
