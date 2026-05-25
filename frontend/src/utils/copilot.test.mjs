import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAiInsightCards,
  buildCopilotAnswer,
  suggestedCopilotQuestions,
} from "./copilot.js";

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
];

test("buildAiInsightCards summarizes exposure and high-risk concentration", () => {
  const cards = buildAiInsightCards(demoStates);

  assert.equal(cards.length, 3);
  assert.equal(cards[0].title, "High-risk concentration");
  assert.match(cards[0].detail, /CA and NY/);
  assert.match(cards[1].detail, /\$46.7M/);
});

test("buildCopilotAnswer explains selected state risk", () => {
  const answer = buildCopilotAnswer({
    questionId: "why-state-risk",
    states: demoStates,
    selectedState: demoStates[0],
  });

  assert.match(answer, /CA is classified as high risk/i);
  assert.match(answer, /\$18.4M/);
  assert.match(answer, /Immediate review/i);
});

test("buildCopilotAnswer summarizes leadership action without selected state", () => {
  const answer = buildCopilotAnswer({
    questionId: "leadership-next",
    states: demoStates,
    selectedState: null,
  });

  assert.match(answer, /prioritize CA/i);
  assert.match(answer, /NY/);
});

test("suggestedCopilotQuestions exposes recruiter-friendly prompts", () => {
  assert.deepEqual(
    suggestedCopilotQuestions.map((question) => question.id),
    [
      "why-state-risk",
      "leadership-next",
      "highest-review",
      "exposure-summary",
    ],
  );
});
