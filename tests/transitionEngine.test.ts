import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createFrameSchedule } from "../src/engine/frameScheduler.ts";
import { interpolatePose } from "../src/engine/interpolation.ts";
import { REQUIRED_TRANSITION_SAMPLES } from "../src/engine/transitionSamples.ts";
import { createTransitionFrames } from "../src/engine/transitionEngine.ts";
import { POSE_MAP } from "../src/emotion/poseMap.ts";
import { renderTransitionPreviewSvg } from "../src/render/renderer.ts";

test("frame scheduler clamps duration and fps into the allowed range", () => {
  const schedule = createFrameSchedule(9999, 99);

  assert.equal(schedule.durationMs, 1200);
  assert.equal(schedule.fps, 12);
  assert.ok(schedule.frameCount > 2);
  assert.equal(schedule.frameTimesMs[0], 0);
  assert.equal(schedule.frameTimesMs.at(-1), 1200);
});

test("interpolatePose keeps first and last frame equal to endpoint poses for numeric fields", () => {
  const from = POSE_MAP.neutral;
  const to = POSE_MAP.shy_love;

  assert.equal(interpolatePose(from, to, 0, "linear").bodyScale, from.bodyScale);
  assert.equal(interpolatePose(from, to, 1, "linear").bodyScale, to.bodyScale);
  assert.equal(interpolatePose(from, to, 1, "linear").mouth, to.mouth);
});

test("required transition samples generate multi-frame deterministic transitions", () => {
  for (const sample of REQUIRED_TRANSITION_SAMPLES) {
    const frames = createTransitionFrames(sample);

    assert.ok(frames.length >= 4, `${sample.to} should have multiple frames`);
    assert.equal(frames[0]?.progress, 0);
    assert.equal(frames.at(-1)?.progress, 1);
    assert.equal(frames.at(-1)?.pose.effect, sample.effect);
    assert.equal(Object.hasOwn(frames[0] ?? {}, "reply"), false);
  }
});

test("transition intensity can stop before the full target pose", () => {
  const frames = createTransitionFrames({
    from: "neutral",
    to: "shy_love",
    durationMs: 600,
    fps: 6,
    intensity: 0.4,
    easing: "linear",
    motion: "none",
    effect: "hearts",
    blush: true
  });

  const finalPose = frames.at(-1)?.pose;

  assert.ok(finalPose);
  assert.equal(finalPose.bodyOffsetY, 0.2);
  assert.equal(finalPose.bodyOffsetX, -0.4);
  assert.equal(finalPose.bodyScale, 0.992);
  assert.equal(finalPose.blushOpacity, 0.4);
  assert.equal(finalPose.effect, "none");
});

test("planner-facing transition config keeps reply text outside the engine contract", () => {
  const { previewReply, ...plannerConfig } = REQUIRED_TRANSITION_SAMPLES[0];
  const frames = createTransitionFrames(plannerConfig);

  assert.equal(typeof previewReply, "string");
  assert.equal(Object.hasOwn(plannerConfig, "previewReply"), false);
  assert.equal(Object.hasOwn(plannerConfig, "reply"), false);
  assert.equal(Object.hasOwn(frames[0] ?? {}, "reply"), false);
});

test("transition preview asset contains all five required transitions and uses the pure SVG anime palette", () => {
  const assetSvg = readFileSync("assets/transition-previews/stage-04-sample-transitions.svg", "utf8");
  const renderedSvg = renderTransitionPreviewSvg(REQUIRED_TRANSITION_SAMPLES);
  const colorLiterals = [...assetSvg.matchAll(/#[0-9a-fA-F]{3,6}\b/g)].map((match) => match[0]?.toLowerCase());
  const palette = new Set(colorLiterals);

  assert.equal(assetSvg, renderedSvg);
  for (const sample of REQUIRED_TRANSITION_SAMPLES) {
    assert.match(assetSvg, new RegExp(`data-transition="${sample.from}->${sample.to}"`));
  }
  assert.doesNotMatch(assetSvg, /<image\b/i);
  assert.doesNotMatch(assetSvg, /<foreignObject\b/i);
  assert.doesNotMatch(assetSvg, /\bhref\s*=/i);
  assert.ok(palette.has("#140f1f"));
  assert.ok(palette.has("#e5dcfb"));
  assert.ok(palette.has("#7d4fc3"));
  assert.ok(palette.has("#f59ab1"));
});
