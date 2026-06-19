import test from "node:test";
import assert from "node:assert/strict";

import { createLocalTransitionPlan, deriveExpressionStrength } from "../src/llm/localTransitionPlanner.ts";
import {
  DEFAULT_TANAOS_LOCAL_MODEL_PATH,
  DEFAULT_TANAOS_WASM_PATH,
  normalizeClassifierOutput,
  resolveTanaosRuntimeOptions
} from "../src/llm/modelRuntime.ts";
import { sanitizeTransitionPlan } from "../src/llm/sanitizeTransitionPlan.ts";
import type { ClassifierResult } from "../src/llm/transitionPlanSchema.ts";

test("deriveExpressionStrength quantizes confidence evidence without treating score as intensity", () => {
  assert.equal(deriveExpressionStrength([{ label: "joy", score: 0.62 }]), 0.6);
  assert.equal(
    deriveExpressionStrength([
      { label: "joy", score: 0.62 },
      { label: "neutral", score: 0.59 }
    ]),
    0.3
  );
  assert.equal(deriveExpressionStrength([{ label: "neutral", score: 0.97 }]), 0.5);
});

test("Tanaos runtime defaults to the two-tier distribution asset roots", () => {
  assert.deepEqual(resolveTanaosRuntimeOptions(), {
    localModelPath: DEFAULT_TANAOS_LOCAL_MODEL_PATH,
    wasmPath: DEFAULT_TANAOS_WASM_PATH,
    modelId: "onnx-community/tanaos-emotion-detection-v1-ONNX"
  });

  assert.deepEqual(resolveTanaosRuntimeOptions({ localModelPath: "custom/model", wasmPath: "custom/runtime", modelId: "custom-model" }), {
    localModelPath: "custom/model/",
    wasmPath: "custom/runtime/",
    modelId: "custom-model"
  });
});

test("planner maps model sadness to sad expression instead of comforted unless support is explicit", () => {
  const sadnessResults = [
    { label: "sadness", score: 0.925 },
    { label: "surprise", score: 0.021 },
    { label: "fear", score: 0.015 }
  ];

  assertPlanTo("I'm sad but you are comfortable?", sadnessResults, "sad", 1);
  assertPlanTo("I'm sad", sadnessResults, "sad", 1);
  assertPlanTo("I feel sad", sadnessResults, "sad", 1);
  assertPlanTo("I'm sad, comfort me", sadnessResults, "comforted", 1);
  assertPlanTo("comfort me", sadnessResults, "comforted", 1);
});

test("planner keeps explicit app-owned request exceptions while using model score as expression strength", () => {
  assertPlanTo(
    "you are cute",
    [
      { label: "joy", score: 0.86 },
      { label: "neutral", score: 0.08 }
    ],
    "shy_love",
    0.9
  );
  assertPlanTo(
    "I love you",
    [
      { label: "joy", score: 0.92 },
      { label: "neutral", score: 0.04 }
    ],
    "love",
    0.9
  );
  assertPlanTo(
    "are you hungry?",
    [
      { label: "neutral", score: 0.8 },
      { label: "surprise", score: 0.12 }
    ],
    "hungry",
    0.5
  );
  assertPlanTo(
    "go to sleep",
    [
      { label: "neutral", score: 0.76 },
      { label: "sadness", score: 0.1 }
    ],
    "sleepy",
    0.5
  );
});

test("sanitizeTransitionPlan rejects forbidden model-owned fields", () => {
  const result = sanitizeTransitionPlan(
    {
      intent: "compliment",
      from: "neutral",
      to: "happy",
      intensity: 1,
      durationMs: 600,
      fps: 6,
      easing: "ease_out",
      motion: "tiny_bounce",
      effect: "sparkles",
      blush: false,
      confidence: 0.9,
      replyText: "nope"
    },
    "neutral"
  );

  assert.equal(result.ok, false);
});

test("sanitizeTransitionPlan clamps and quantizes planner-owned values", () => {
  const result = sanitizeTransitionPlan(
    {
      intent: "compliment",
      from: "angry",
      to: "love",
      intensity: 0.44,
      durationMs: 9999,
      fps: 99,
      easing: "ease_out",
      motion: "tiny_bounce",
      effect: "hearts",
      blush: true,
      confidence: 2
    },
    "neutral"
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.plan.from, "neutral");
  assert.equal(result.plan.intensity, 0.4);
  assert.equal(result.plan.durationMs, 1200);
  assert.equal(result.plan.fps, 12);
  assert.equal(result.plan.confidence, 1);
});

test("normalizeClassifierOutput accepts flat and nested Transformers.js outputs", () => {
  assert.deepEqual(normalizeClassifierOutput({ label: "joy", score: 0.9 }), [{ label: "joy", score: 0.9 }]);
  assert.deepEqual(normalizeClassifierOutput([{ label: "joy", score: 0.9 }]), [{ label: "joy", score: 0.9 }]);
  assert.deepEqual(normalizeClassifierOutput([[{ label: "sadness", score: 0.8 }]]), [{ label: "sadness", score: 0.8 }]);
});

function assertPlanTo(promptText: string, classifierResults: readonly ClassifierResult[], expectedEmotion: string, expectedIntensity: number): void {
  const result = createLocalTransitionPlan({
    currentEmotion: "neutral",
    promptText,
    classifierResults
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.plan.to, expectedEmotion);
  assert.equal(result.plan.intensity, expectedIntensity);
}
