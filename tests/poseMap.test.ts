import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { EMOTIONS } from "../src/emotion/emotionCatalog.ts";
import { listPoseEntries, POSE_MAP, type Pose } from "../src/emotion/poseMap.ts";
import { renderPoseSheetSvg } from "../src/emotion/poseSheetPreview.ts";
import { isFaceOverlayActive, renderAnimeCharacter } from "../src/render/animeRig.ts";

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

test("pose sheet preview includes every emotion and uses the approved uploaded PNG image asset", () => {
  const svg = renderPoseSheetSvg();
  const imageHrefs = [...svg.matchAll(/<image\b[^>]*\bhref="([^"]+)"/gi)].map((match) => match[1]);
  const activeFaceOverlays = svg.match(/data-face-overlay="active"/g) ?? [];

  for (const emotion of EXPECTED_EMOTIONS) {
    assert.match(svg, new RegExp(`data-emotion="${emotion}"`));
  }

  assert.equal(imageHrefs.length, EXPECTED_EMOTIONS.length);
  assert.equal(activeFaceOverlays.length, EXPECTED_EMOTIONS.length - 1);
  assert.deepEqual([...new Set(imageHrefs)], ["/assets/1.png"]);
  assert.doesNotMatch(svg, /<foreignObject\b/i);
  assert.doesNotMatch(svg, /\bhref="https?:\/\//i);
  assert.doesNotMatch(svg, /\bhref="data:/i);
});

test("pose sheet positions each character inside its own cell", () => {
  const svg = renderPoseSheetSvg();
  const happyCell = svg.match(/<g data-emotion="happy"[\s\S]*?<\/g>\n    <text x="4" y="70"/)?.[0] ?? "";

  assert.match(happyCell, /<g transform="translate\(5 7\) rotate\(0 50 40\) scale\(0\.62\)">/);
  assert.doesNotMatch(happyCell, /translate\(77 7\)/);
});

test("poses do not rotate or resize the uploaded PNG card", () => {
  for (const [emotion, pose] of listPoseEntries()) {
    assert.equal(pose.bodyRotation, 0, `${emotion} should not rotate the flattened PNG image`);
    assert.equal(pose.bodyScale, 1, `${emotion} should keep the flattened PNG image at a stable scale`);
  }
});

test("non-neutral emotion previews render real face overlays instead of transform-only poses", () => {
  assert.equal(isFaceOverlayActive(POSE_MAP.neutral), false);
  assert.doesNotMatch(renderAnimeCharacter(POSE_MAP.neutral), /data-face-overlay="active"/);

  for (const emotion of EXPECTED_EMOTIONS.filter((emotion) => emotion !== "neutral")) {
    const rendered = renderAnimeCharacter(POSE_MAP[emotion]);
    assert.equal(isFaceOverlayActive(POSE_MAP[emotion]), true, `${emotion} should activate face overlay`);
    assert.match(rendered, /data-face-overlay="active"/, `${emotion} should render visible face overlay`);
    assert.match(rendered, /class="face-patch"/, `${emotion} should cover flattened PNG facial pixels`);
  }

  assert.match(renderAnimeCharacter(POSE_MAP.love), /class="eye-heart"/);
  assert.match(renderAnimeCharacter(POSE_MAP.sad), /class="effect-tear"/);
  assert.match(renderAnimeCharacter(POSE_MAP.angry), /class="brow-line"/);
  assert.match(renderAnimeCharacter(POSE_MAP.surprised), /a3 4 0 1 0/);
  assert.match(renderAnimeCharacter(POSE_MAP.sleepy), /class="eye-fill"/);
  assert.match(renderAnimeCharacter(POSE_MAP.curious), /data-face-overlay="active"/);
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
