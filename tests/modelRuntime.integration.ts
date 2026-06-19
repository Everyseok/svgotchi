import test from "node:test";
import assert from "node:assert/strict";

import { createLocalTransitionPlan, deriveExpressionStrength } from "../src/llm/localTransitionPlanner.ts";
import { createTanaosEmotionClassifierRuntime } from "../src/llm/modelRuntime.ts";
import { TANAOS_LABELS, type ClassifierResult } from "../src/llm/transitionPlanSchema.ts";

test("Tanaos runtime calls the actual local model and maps output into a sanitized TransitionPlan", async () => {
  const runtime = await createTanaosEmotionClassifierRuntime();
  const sampleExpectations = [
    { promptText: "you are cute", expectedLabel: "joy", expectedEmotion: "shy_love", minIntensity: 0.8 },
    { promptText: "I am scared", expectedLabel: "fear", expectedEmotion: "scared", minIntensity: 0.9 },
    { promptText: "I feel sad", expectedLabel: "sadness", expectedEmotion: "sad", minIntensity: 0.8 },
    { promptText: "wow that's surprising", expectedLabel: "surprise", expectedEmotion: "surprised", minIntensity: 0.8 }
  ] as const;

  const classifierResults = await runtime.classify(sampleExpectations[0].promptText);
  const top = topResult(classifierResults);

  assert.equal(runtime.status, "ready");
  assert.ok(top, "actual model should return at least one label");
  assert.ok((TANAOS_LABELS as readonly string[]).includes(top.label.toLowerCase()), `unexpected actual label: ${top.label}`);

  const result = createLocalTransitionPlan({
    currentEmotion: "neutral",
    promptText: "you are cute",
    classifierResults
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.plan.intent, "compliment");
  assert.equal(result.plan.from, "neutral");
  assert.equal(Object.hasOwn(result.plan, "reply"), false);
  assert.ok(result.plan.confidence > 0);
  assert.equal(result.plan.confidence, top.score);
  assert.equal(result.plan.intensity, deriveExpressionStrength(classifierResults));
  assert.ok(result.plan.intensity >= 0 && result.plan.intensity <= 1);
  assert.equal(Math.round(result.plan.intensity * 10), result.plan.intensity * 10);
  assert.equal(Object.hasOwn(result.plan, "reply"), false);

  for (const sample of sampleExpectations) {
    const sampleResults = await runtime.classify(sample.promptText);
    const sampleTop = topResult(sampleResults);
    assert.ok(sampleTop, `actual model should classify: ${sample.promptText}`);
    assert.equal(sampleTop.label.toLowerCase(), sample.expectedLabel);

    const samplePlan = createLocalTransitionPlan({
      currentEmotion: "neutral",
      promptText: sample.promptText,
      classifierResults: sampleResults
    });

    assert.equal(samplePlan.ok, true);
    if (!samplePlan.ok) continue;
    assert.equal(samplePlan.plan.to, sample.expectedEmotion);
    assert.ok(samplePlan.plan.intensity >= sample.minIntensity);
  }
});

function topResult(results: readonly ClassifierResult[]): ClassifierResult | null {
  return [...results].sort((a, b) => b.score - a.score)[0] ?? null;
}
