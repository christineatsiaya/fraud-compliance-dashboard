import test from "node:test";
import assert from "node:assert/strict";
import {
  DASHBOARD_SECTIONS,
  ROLE_VIEW_IDS,
  getRoleView,
  getVisibleSections,
  roleViewOptions,
  shouldShowSection,
} from "./roleViews.js";

test("roleViewOptions exposes the three portfolio roles in display order", () => {
  assert.deepEqual(
    roleViewOptions.map((role) => role.id),
    ["executive", "analyst", "operations"],
  );
  assert.equal(roleViewOptions[0].label, "Executive View");
  assert.match(roleViewOptions[1].summary, /investigation/i);
  assert.match(roleViewOptions[2].summary, /action/i);
});

test("getRoleView falls back to executive view for unknown roles", () => {
  assert.equal(getRoleView(ROLE_VIEW_IDS.ANALYST).label, "Compliance Analyst");
  assert.equal(getRoleView("something-else").id, ROLE_VIEW_IDS.EXECUTIVE);
});

test("executive view prioritizes portfolio intelligence sections", () => {
  const visibleSections = getVisibleSections(ROLE_VIEW_IDS.EXECUTIVE);

  assert.equal(visibleSections.includes(DASHBOARD_SECTIONS.EXECUTIVE_FEED), true);
  assert.equal(visibleSections.includes(DASHBOARD_SECTIONS.HISTORICAL_TRENDS), true);
  assert.equal(visibleSections.includes(DASHBOARD_SECTIONS.SCENARIO_FORECAST), true);
  assert.equal(visibleSections.includes(DASHBOARD_SECTIONS.DETAILED_TABLE), false);
});

test("analyst view prioritizes investigation sections", () => {
  assert.equal(
    shouldShowSection(ROLE_VIEW_IDS.ANALYST, DASHBOARD_SECTIONS.FILTERS),
    true,
  );
  assert.equal(
    shouldShowSection(ROLE_VIEW_IDS.ANALYST, DASHBOARD_SECTIONS.DETAILED_TABLE),
    true,
  );
  assert.equal(
    shouldShowSection(ROLE_VIEW_IDS.ANALYST, DASHBOARD_SECTIONS.SCENARIO_FORECAST),
    false,
  );
});

test("operations view keeps action and execution sections visible", () => {
  const visibleSections = getVisibleSections(ROLE_VIEW_IDS.OPERATIONS);

  assert.equal(visibleSections.includes(DASHBOARD_SECTIONS.EXECUTIVE_FEED), true);
  assert.equal(visibleSections.includes(DASHBOARD_SECTIONS.SCENARIO_FORECAST), true);
  assert.equal(visibleSections.includes(DASHBOARD_SECTIONS.DETAILED_TABLE), true);
  assert.equal(visibleSections.includes(DASHBOARD_SECTIONS.HISTORICAL_TRENDS), false);
});
