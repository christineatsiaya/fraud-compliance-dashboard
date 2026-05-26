import { buildScenarioForecast } from "./scenario.js";
import { buildQuarterlyTrendSeries } from "./trends.js";
import { buildExecutiveInsights, formatMillions } from "./intelligence.js";
import { getRoleView } from "./roleViews.js";

const DEFAULT_SCENARIO = {
  budgetIncreasePercent: 20,
  effectivenessPercent: 70,
};

const roundToOne = (value) => Number(value.toFixed(1));

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatRiskTierFilter = (riskTier) =>
  riskTier && riskTier !== "ALL" ? riskTier : "All tiers";

function buildTopRiskStates(states) {
  return [...states]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5)
    .map((state) => ({
      stateCode: state.state_code,
      riskScore: roundToOne(Number(state.risk_score ?? 0)),
      riskTier: state.risk_tier,
      exposure: Number(state.revenue_at_risk ?? 0),
    }));
}

function buildTrendSummary(states) {
  const trendSeries = buildQuarterlyTrendSeries(states);

  if (trendSeries.length === 0) {
    return {
      firstQuarter: null,
      latestQuarter: null,
      firstAverageRisk: 0,
      latestAverageRisk: 0,
      riskMovement: 0,
      exposureMovement: 0,
    };
  }

  const firstPoint = trendSeries[0];
  const latestPoint = trendSeries.at(-1);

  return {
    firstQuarter: firstPoint.quarter,
    latestQuarter: latestPoint.quarter,
    firstAverageRisk: firstPoint.averageRisk,
    latestAverageRisk: latestPoint.averageRisk,
    riskMovement: roundToOne(latestPoint.averageRisk - firstPoint.averageRisk),
    exposureMovement: latestPoint.totalExposure - firstPoint.totalExposure,
  };
}

export function buildExecutiveReport({ states, activeRole, filters }) {
  const totalExposure = states.reduce(
    (sum, state) => sum + Number(state.revenue_at_risk ?? 0),
    0,
  );
  const averageRisk =
    states.length === 0
      ? 0
      : roundToOne(
          states.reduce((sum, state) => sum + Number(state.risk_score ?? 0), 0) /
            states.length,
        );
  const roleView = getRoleView(activeRole);
  const scenarioForecast = buildScenarioForecast(states, DEFAULT_SCENARIO);

  return {
    title: "Fraud Compliance Executive Report",
    generatedAt: new Date().toISOString(),
    activeRole: roleView.label,
    filters: {
      riskTier: formatRiskTierFilter(filters?.riskTier),
      searchTerm: filters?.searchTerm || "None",
    },
    stateCount: states.length,
    totalExposure,
    averageRisk,
    executiveInsights: buildExecutiveInsights(states),
    topRiskStates: buildTopRiskStates(states),
    trendSummary: buildTrendSummary(states),
    scenarioSummary: {
      budgetIncreasePercent: DEFAULT_SCENARIO.budgetIncreasePercent,
      effectivenessPercent: DEFAULT_SCENARIO.effectivenessPercent,
      projectedExposureReduction: scenarioForecast.projectedExposureReduction,
      estimatedSavings: scenarioForecast.estimatedSavings,
      averageRiskReduction: scenarioForecast.averageRiskReduction,
      projectedAverageRisk: scenarioForecast.projectedAverageRisk,
    },
  };
}

function renderInsightList(insights) {
  if (insights.length === 0) return "<p>No insights available for this view.</p>";

  return `<ul>${insights
    .map(
      (insight) =>
        `<li><strong>${escapeHtml(insight.title)}</strong><br>${escapeHtml(
          insight.detail,
        )}</li>`,
    )
    .join("")}</ul>`;
}

function renderStateRows(states) {
  if (states.length === 0) {
    return '<tr><td colspan="4">No states matched the current filters.</td></tr>';
  }

  return states
    .map(
      (state) => `<tr>
        <td>${escapeHtml(state.stateCode)}</td>
        <td>${state.riskScore.toFixed(1)}</td>
        <td>${escapeHtml(state.riskTier)}</td>
        <td>${formatMillions(state.exposure)}</td>
      </tr>`,
    )
    .join("");
}

export function buildExecutiveReportHtml(report) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(report.title)}</title>
    <style>
      body { color: #0f172a; font-family: Arial, sans-serif; line-height: 1.5; margin: 40px; }
      h1, h2 { margin-bottom: 8px; }
      .meta, .note { color: #475569; }
      .grid { display: grid; gap: 12px; grid-template-columns: repeat(3, 1fr); margin: 20px 0; }
      .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; }
      .value { font-size: 28px; font-weight: 700; margin: 4px 0; }
      table { border-collapse: collapse; margin-top: 12px; width: 100%; }
      th, td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; }
      th { background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; }
      li { margin-bottom: 10px; }
      @media print { body { margin: 24px; } }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(report.title)}</h1>
    <p class="meta">Generated: ${escapeHtml(report.generatedAt)}</p>
    <p class="meta">Active role: ${escapeHtml(report.activeRole)} | Risk tier filter: ${escapeHtml(
      report.filters.riskTier,
    )} | Search: ${escapeHtml(report.filters.searchTerm)}</p>

    <section class="grid">
      <div class="card"><div>States analyzed</div><div class="value">${report.stateCount}</div></div>
      <div class="card"><div>Total exposure</div><div class="value">${formatMillions(
        report.totalExposure,
      )}</div></div>
      <div class="card"><div>Average risk</div><div class="value">${report.averageRisk.toFixed(
        1,
      )}</div></div>
    </section>

    <section>
      <h2>Executive insights</h2>
      ${renderInsightList(report.executiveInsights)}
    </section>

    <section>
      <h2>Top risk states</h2>
      <table>
        <thead><tr><th>State</th><th>Risk score</th><th>Tier</th><th>Exposure</th></tr></thead>
        <tbody>${renderStateRows(report.topRiskStates)}</tbody>
      </table>
    </section>

    <section>
      <h2>Historical trend summary</h2>
      <p>Average risk moved from ${report.trendSummary.firstAverageRisk.toFixed(
        1,
      )} to ${report.trendSummary.latestAverageRisk.toFixed(1)} across ${
        report.trendSummary.firstQuarter ?? "the baseline period"
      } to ${report.trendSummary.latestQuarter ?? "the latest period"}.</p>
      <p>Exposure movement: ${formatMillions(report.trendSummary.exposureMovement)}</p>
    </section>

    <section>
      <h2>Scenario forecast</h2>
      <p>Assumption: ${report.scenarioSummary.budgetIncreasePercent}% intervention budget uplift and ${report.scenarioSummary.effectivenessPercent}% execution effectiveness.</p>
      <p>Projected exposure reduction: ${formatMillions(
        report.scenarioSummary.projectedExposureReduction,
      )}. Estimated operational savings: ${formatMillions(
        report.scenarioSummary.estimatedSavings,
      )}. Average risk improvement: ${report.scenarioSummary.averageRiskReduction.toFixed(
        1,
      )} points.</p>
    </section>

    <section>
      <h2>Methodology</h2>
      <p class="note">Risk score compares actual SAR filing counts against expected filing counts, then assigns low, medium, or high risk tiers. Trend and scenario values are deterministic prototype analytics for portfolio demonstration.</p>
    </section>
  </body>
</html>`;
}

export function buildReportFilename(date = new Date()) {
  return `fraud-compliance-executive-report-${date.toISOString().split("T")[0]}.html`;
}
