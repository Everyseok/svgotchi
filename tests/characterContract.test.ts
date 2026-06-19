import test from "node:test";
import assert from "node:assert/strict";

import { CHARACTER_CONTRACT, CHARACTER_VIEW_BOX } from "../src/character/characterContract.ts";
import { REQUIRED_RIG_IDS } from "../src/character/requiredRigIds.ts";

test("character contract uses the required 100x100 SVG layout", () => {
  assert.equal(CHARACTER_VIEW_BOX, "0 0 100 100");
  assert.deepEqual(CHARACTER_CONTRACT.viewBox, { x: 0, y: 0, width: 100, height: 100 });
  assert.deepEqual(CHARACTER_CONTRACT.petArea, { x: 0, y: 0, width: 100, height: 80 });
  assert.deepEqual(CHARACTER_CONTRACT.promptArea, { x: 0, y: 81, width: 100, height: 19 });
  assert.deepEqual(CHARACTER_CONTRACT.bodyBox, { x: 10, y: 0, width: 80, height: 80 });
});

test("required rig ids are unique and include every prompt and effect slot", () => {
  assert.equal(new Set(REQUIRED_RIG_IDS).size, REQUIRED_RIG_IDS.length);
  assert.ok(REQUIRED_RIG_IDS.includes("character-image"));
  assert.ok(REQUIRED_RIG_IDS.includes("face-cover"));
  assert.ok(REQUIRED_RIG_IDS.includes("face-features"));
  assert.ok(REQUIRED_RIG_IDS.includes("eye-left-shine"));
  assert.ok(REQUIRED_RIG_IDS.includes("eye-right-shine"));
  assert.ok(REQUIRED_RIG_IDS.includes("eye-left-heart"));
  assert.ok(REQUIRED_RIG_IDS.includes("eye-right-heart"));
  assert.ok(REQUIRED_RIG_IDS.includes("effect-hearts"));
  assert.ok(REQUIRED_RIG_IDS.includes("effect-tears"));
  assert.ok(REQUIRED_RIG_IDS.includes("effect-zzz"));
  assert.ok(REQUIRED_RIG_IDS.includes("effect-sparkles"));
  assert.ok(REQUIRED_RIG_IDS.includes("effect-question"));
  assert.ok(REQUIRED_RIG_IDS.includes("effect-anger"));
  assert.ok(REQUIRED_RIG_IDS.includes("prompt-bg"));
  assert.ok(REQUIRED_RIG_IDS.includes("prompt-text"));
  assert.ok(REQUIRED_RIG_IDS.includes("send-zone"));
});
