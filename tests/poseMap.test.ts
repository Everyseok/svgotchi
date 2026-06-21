import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { EMOTIONS } from "../src/emotion/emotionCatalog.ts";
import { listPoseEntries, POSE_MAP, type Pose } from "../src/emotion/poseMap.ts";
import { renderPoseSheetSvg } from "../src/emotion/poseSheetPreview.ts";

const EXPECTED_EMOTIONS = [
  "neutral",
  "happy",
  "excited",
  "proud",
  "playful",
  "love",
  "shy_love",
  "comforted",
  "attached",
  "sad",
  "lonely",
  "disappointed",
  "hurt",
  "angry",
  "annoyed",
  "jealous",
  "scared",
  "nervous",
  "surprised",
  "confused",
  "sleepy",
  "hungry",
  "tired",
  "sick",
  "curious",
  "thinking",
  "bored",
  "grateful",
  "apologetic",
  "sulky"
] as const;

test("emotion catalog contains exactly the required 30 emotions in order", () => {
  assert.deepEqual(EMOTIONS, EXPECTED_EMOTIONS);
  assert.equal(new Set(EMOTIONS).size, 30);
});

test("POSE_MAP has one pose for every emotion and no extras", () => {
  assert.deepEqual(Object.keys(POSE_MAP), [...EXPECTED_EMOTIONS]);
  assert.equal(listPoseEntries().length, 30);
});

test("each pose uses bounded primitive pose parameters", () => {
  for (const [emotion, pose] of listPoseEntries()) {
    assertPoseIsBounded(emotion, pose);
  }
});

test("pose sheet preview includes every emotion and stays monochrome", () => {
  const svg = renderPoseSheetSvg();
  const colorLiterals = [...svg.matchAll(/#[0-9a-fA-F]{3,6}\b/g)].map((match) => match[0]?.toLowerCase());

  for (const emotion of EXPECTED_EMOTIONS) {
    assert.match(svg, new RegExp(`data-emotion="${emotion}"`));
  }

  assert.deepEqual([...new Set(colorLiterals)].sort(), ["#000", "#fff"]);
});

test("generated pose sheet asset matches the preview renderer output", () => {
  const assetSvg = readFileSync("assets/pose-previews/stage-02-30-emotion-pose-sheet.svg", "utf8");

  assert.equal(assetSvg, renderPoseSheetSvg());
});

function assertPoseIsBounded(emotion: string, pose: Pose): void {
  assert.ok(pose.blushOpacity >= 0 && pose.blushOpacity <= 1, `${emotion} blushOpacity out of bounds`);
  assert.ok(pose.effectOpacity >= 0 && pose.effectOpacity <= 1, `${emotion} effectOpacity out of bounds`);
  assert.ok(pose.bodyScale >= 0.9 && pose.bodyScale <= 1.1, `${emotion} bodyScale out of bounds`);
  assert.ok(pose.bodyOffsetX >= -3 && pose.bodyOffsetX <= 3, `${emotion} bodyOffsetX out of bounds`);
  assert.ok(pose.bodyOffsetY >= -3 && pose.bodyOffsetY <= 3, `${emotion} bodyOffsetY out of bounds`);
  assert.ok(pose.bodyRotation >= -8 && pose.bodyRotation <= 8, `${emotion} bodyRotation out of bounds`);
}
