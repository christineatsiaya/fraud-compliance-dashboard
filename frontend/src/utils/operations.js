export const workflowStatuses = [
  "PROPOSED",
  "IN_REVIEW",
  "APPROVED",
  "IMPLEMENTED",
];

export function getStatusLabel(status) {
  const labels = {
    PROPOSED: "Proposed",
    IN_REVIEW: "In Review",
    APPROVED: "Approved",
    IMPLEMENTED: "Implemented",
  };

  if (labels[status]) return labels[status];
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getDefaultStatus(priorityLevel) {
  if (priorityLevel === "HIGH") return "IN_REVIEW";
  if (priorityLevel === "MEDIUM") return "PROPOSED";
  return "APPROVED";
}

export function buildInterventionWorkflow(interventions, statusById = {}) {
  return interventions.map((intervention) => {
    const status =
      statusById[intervention.id] || getDefaultStatus(intervention.priority_level);

    return {
      ...intervention,
      status,
      statusLabel: getStatusLabel(status),
    };
  });
}

export function buildOperationalAlerts(workflowItems) {
  if (workflowItems.length === 0) return [];

  const highPriorityOpen = workflowItems.filter(
    (item) =>
      item.priority_level === "HIGH" && item.status !== "IMPLEMENTED",
  );
  const lowConfidence = workflowItems.filter(
    (item) => item.confidence_score < 0.8,
  );
  const proposed = workflowItems.filter((item) => item.status === "PROPOSED");

  return [
    {
      title: "High-priority review queue",
      detail: `${highPriorityOpen.length} high-priority interventions remain open.`,
      severity: highPriorityOpen.length > 0 ? "critical" : "stable",
    },
    {
      title: "Confidence watchlist",
      detail: `${lowConfidence.length} recommendations are below 80% confidence.`,
      severity: lowConfidence.length > 0 ? "warning" : "stable",
    },
    {
      title: "Proposed interventions",
      detail: `${proposed.length} interventions are waiting for analyst review.`,
      severity: proposed.length > 0 ? "action" : "stable",
    },
  ];
}

export function buildInitialAuditEvents(interventions) {
  return interventions.map((intervention, index) => ({
    id: `generated-${intervention.id}`,
    sequence: index + 1,
    stateCode: intervention.state_code,
    action: "Recommendation generated",
    detail: `${intervention.priority_level} priority intervention created for analyst review.`,
    actor: "System",
    timestamp: "Initial load",
  }));
}

export function buildStatusAuditEvent({
  intervention,
  fromStatus,
  toStatus,
  sequence,
}) {
  return {
    id: `status-${intervention.id}-${sequence}`,
    sequence,
    stateCode: intervention.state_code,
    action: "Status changed",
    detail: `${getStatusLabel(fromStatus)} to ${getStatusLabel(toStatus)}`,
    actor: "Analyst",
    timestamp: "Now",
  };
}
