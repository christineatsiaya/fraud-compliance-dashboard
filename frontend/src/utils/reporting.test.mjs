import test from "node:test";
import assert from "node:assert/strict";
import {
  buildExecutiveReport,
  buildExecutiveReportHtml,
  buildReportFilename,
} from "./reporting.js";

const demoStates = [
  {
    state_code: "CA",
    risk_score: 91.4,
    revenue_at_risk: 18400000,
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

test("buildExecutiveReport summarizes the current dashboard context", () => {
  const report = buildExecutiveReport({
    states: demoStates,
    activeRole: "executive",
    filters: { riskTier: "ALL", searchTerm: "" },
  });

  assert.equal(report.stateCount, 3);
  assert.equal(report.totalExposure, 35700000);
  assert.equal(report.averageRisk, 69.6);
  assert.equal(report.topRiskStates[0].stateCode, "CA");
  assert.equal(report.trendSummary.latestAverageRisk, 69.6);
  assert.equal(report.scenarioSummary.projectedExposureReduction, 7671300);
});

test("buildExecutiveReportHtml includes sections recruiters expect to inspect", () => {
  const report = buildExecutiveReport({
    states: demoStates,
    activeRole: "executive",
    filters: { riskTier: "HIGH", searchTerm: "CA" },
  });
  const html = buildExecutiveReportHtml(report);

  assert.match(html, /Fraud Compliance Executive Report/);
  assert.match(html, /Active role: Executive View/);
  assert.match(html, /Risk tier filter: HIGH/);
  assert.match(html, /CA/);
  assert.match(html, /Scenario forecast/);
  assert.match(html, /Methodology/);
});

test("buildExecutiveReport handles empty data safely", () => {
  const report = buildExecutiveReport({
    states: [],
    activeRole: "analyst",
    filters: { riskTier: "LOW", searchTerm: "ZZ" },
  });

  assert.equal(report.stateCount, 0);
  assert.equal(report.totalExposure, 0);
  assert.equal(report.averageRisk, 0);
  assert.deepEqual(report.topRiskStates, []);
  assert.equal(report.trendSummary.latestAverageRisk, 0);
  assert.equal(report.scenarioSummary.projectedExposureReduction, 0);
});

test("buildReportFilename creates a dated html filename", () => {
  assert.equal(
    buildReportFilename(new Date("2026-05-25T12:00:00Z")),
    "fraud-compliance-executive-report-2026-05-25.html",
  );
});
