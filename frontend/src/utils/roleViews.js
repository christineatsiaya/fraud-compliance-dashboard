export const ROLE_VIEW_IDS = {
  EXECUTIVE: "executive",
  ANALYST: "analyst",
  OPERATIONS: "operations",
};

export const DASHBOARD_SECTIONS = {
  EXECUTIVE_FEED: "executive-feed",
  AI_INSIGHTS: "ai-insights",
  SUMMARY_STATS: "summary-stats",
  FILTERS: "filters",
  RISK_CHART: "risk-chart",
  HISTORICAL_TRENDS: "historical-trends",
  SCENARIO_FORECAST: "scenario-forecast",
  DETAILED_TABLE: "detailed-table",
  METHODOLOGY: "methodology",
  COPILOT: "copilot",
};

const roleSections = {
  [ROLE_VIEW_IDS.EXECUTIVE]: [
    DASHBOARD_SECTIONS.EXECUTIVE_FEED,
    DASHBOARD_SECTIONS.AI_INSIGHTS,
    DASHBOARD_SECTIONS.SUMMARY_STATS,
    DASHBOARD_SECTIONS.RISK_CHART,
    DASHBOARD_SECTIONS.HISTORICAL_TRENDS,
    DASHBOARD_SECTIONS.SCENARIO_FORECAST,
    DASHBOARD_SECTIONS.METHODOLOGY,
  ],
  [ROLE_VIEW_IDS.ANALYST]: [
    DASHBOARD_SECTIONS.AI_INSIGHTS,
    DASHBOARD_SECTIONS.SUMMARY_STATS,
    DASHBOARD_SECTIONS.FILTERS,
    DASHBOARD_SECTIONS.RISK_CHART,
    DASHBOARD_SECTIONS.DETAILED_TABLE,
    DASHBOARD_SECTIONS.METHODOLOGY,
    DASHBOARD_SECTIONS.COPILOT,
  ],
  [ROLE_VIEW_IDS.OPERATIONS]: [
    DASHBOARD_SECTIONS.EXECUTIVE_FEED,
    DASHBOARD_SECTIONS.SUMMARY_STATS,
    DASHBOARD_SECTIONS.FILTERS,
    DASHBOARD_SECTIONS.SCENARIO_FORECAST,
    DASHBOARD_SECTIONS.DETAILED_TABLE,
    DASHBOARD_SECTIONS.COPILOT,
  ],
};

export const roleViewOptions = [
  {
    id: ROLE_VIEW_IDS.EXECUTIVE,
    label: "Executive View",
    shortLabel: "Executive",
    summary:
      "Leadership view focused on portfolio exposure, trends, and investment decisions.",
  },
  {
    id: ROLE_VIEW_IDS.ANALYST,
    label: "Compliance Analyst",
    shortLabel: "Analyst",
    summary:
      "Investigation view focused on filters, state-level evidence, methodology, and drilldowns.",
  },
  {
    id: ROLE_VIEW_IDS.OPERATIONS,
    label: "Operations View",
    shortLabel: "Operations",
    summary:
      "Action view focused on intervention impact, review queues, and execution follow-through.",
  },
];

export function getRoleView(roleId) {
  return (
    roleViewOptions.find((roleView) => roleView.id === roleId) ??
    roleViewOptions[0]
  );
}

export function getVisibleSections(roleId) {
  return roleSections[getRoleView(roleId).id];
}

export function shouldShowSection(roleId, sectionId) {
  return getVisibleSections(roleId).includes(sectionId);
}
