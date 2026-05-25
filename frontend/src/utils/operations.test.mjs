import test from "node:test";
import assert from "node:assert/strict";
import {
  buildInitialAuditEvents,
  buildInterventionWorkflow,
  buildOperationalAlerts,
  buildStatusAuditEvent,
  getDefaultStatus,
  getStatusLabel,
} from "./operations.js";

const demoInterventions = [
  {
    id: "demo-ca",
    state_code: "CA",
    priority_level: "HIGH",
    recommendation: "Immediate review required.",
    confidence_score: 0.92,
  },
  {
    id: "demo-fl",
    state_code: "FL",
    priority_level: "MEDIUM",
    recommendation: "Monitor quarterly.",
    confidence_score: 0.77,
  },
  {
    id: "demo-wa",
    state_code: "WA",
    priority_level: "LOW",
    recommendation: "Maintain monitoring.",
    confidence_score: 0.68,
  },
];

test("getDefaultStatus maps priority into realistic workflow state", () => {
  assert.equal(getDefaultStatus("HIGH"), "IN_REVIEW");
  assert.equal(getDefaultStatus("MEDIUM"), "PROPOSED");
  assert.equal(getDefaultStatus("LOW"), "APPROVED");
});

test("buildInterventionWorkflow adds status labels and preserves interventions", () => {
  const workflow = buildInterventionWorkflow(demoInterventions, {
    "demo-ca": "APPROVED",
  });

  assert.equal(workflow[0].status, "APPROVED");
  assert.equal(workflow[0].statusLabel, "Approved");
  assert.equal(workflow[1].status, "PROPOSED");
  assert.equal(workflow[1].state_code, "FL");
});

test("buildOperationalAlerts summarizes review pressure and low confidence", () => {
  const workflow = buildInterventionWorkflow(demoInterventions, {});
  const alerts = buildOperationalAlerts(workflow);

  assert.equal(alerts.length, 3);
  assert.match(alerts[0].title, /High-priority review/i);
  assert.match(alerts[1].detail, /2 recommendations/i);
  assert.match(alerts[2].title, /Proposed interventions/i);
});

test("buildInitialAuditEvents creates generated events", () => {
  const events = buildInitialAuditEvents(demoInterventions);

  assert.equal(events.length, 3);
  assert.equal(events[0].stateCode, "CA");
  assert.equal(events[0].action, "Recommendation generated");
});

test("buildStatusAuditEvent records status transitions", () => {
  const event = buildStatusAuditEvent({
    intervention: demoInterventions[0],
    fromStatus: "IN_REVIEW",
    toStatus: "IMPLEMENTED",
    sequence: 4,
  });

  assert.equal(event.stateCode, "CA");
  assert.equal(event.action, "Status changed");
  assert.match(event.detail, /In Review to Implemented/);
});

test("getStatusLabel handles unknown status safely", () => {
  assert.equal(getStatusLabel("IMPLEMENTED"), "Implemented");
  assert.equal(getStatusLabel("SOMETHING_ELSE"), "Something Else");
});
