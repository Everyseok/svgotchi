import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { BASE_CHARACTER_SVG } from "../src/character/baseCharacter.ts";
import { REQUIRED_RIG_IDS } from "../src/character/requiredRigIds.ts";
import { assertRigSlotExists, loadCharacterRig } from "../src/character/rig.ts";
import { validateCharacterRig } from "../src/character/validateCharacterRig.ts";

const assetSvg = readFileSync("assets/base-character.svg", "utf8");

test("base character asset matches the exported SVG source", () => {
  assert.equal(assetSvg.trim(), BASE_CHARACTER_SVG.trim());
});

test("base character validates and exposes every required rig slot", () => {
  const result = validateCharacterRig(assetSvg);

  assert.deepEqual(result, { ok: true, errors: [] });
  for (const id of REQUIRED_RIG_IDS) {
    assert.doesNotThrow(() => assertRigSlotExists(assetSvg, id));
  }
});

test("loadCharacterRig returns the canonical viewBox and required id set", () => {
  const rig = loadCharacterRig(assetSvg);

  assert.equal(rig.viewBox, "0 0 100 100");
  assert.equal(rig.ids.size, REQUIRED_RIG_IDS.length);
});

test("validator rejects a missing required rig id", () => {
  const withoutMouth = assetSvg.replace('id="mouth"', 'data-old-id="mouth"');
  const result = validateCharacterRig(withoutMouth);

  assert.equal(result.ok, false);
  assert.match(result.errors[0] ?? "", /mouth/);
});

test("validator rejects a non-canonical viewBox", () => {
  const wrongViewBox = assetSvg.replace('viewBox="0 0 100 100"', 'viewBox="0 0 99 100"');
  const result = validateCharacterRig(wrongViewBox);

  assert.equal(result.ok, false);
  assert.match(result.errors[0] ?? "", /viewBox/);
});

test("validator rejects a body box that does not match the coordinate contract", () => {
  const wrongBodyBox = assetSvg.replace('id="body" x="10" y="0" width="80" height="80"', 'id="body" x="11" y="0" width="80" height="80"');
  const result = validateCharacterRig(wrongBodyBox);

  assert.equal(result.ok, false);
  assert.match(result.errors[0] ?? "", /body/);
});

test("validator rejects duplicate ids", () => {
  const duplicateEye = assetSvg.replace('id="eye-right"', 'id="eye-left"');
  const result = validateCharacterRig(duplicateEye);

  assert.equal(result.ok, false);
  assert.match(result.errors[0] ?? "", /Duplicate SVG ids/);
});

test("base character uses only the approved uploaded PNG image asset", () => {
  const imageTags = assetSvg.match(/<image\b/gi) ?? [];
  const imageHrefs = [...assetSvg.matchAll(/<image\b[^>]*\bhref="([^"]+)"/gi)].map((match) => match[1]);

  assert.equal(imageTags.length, 1);
  assert.deepEqual(imageHrefs, ["/assets/1.png"]);
  assert.ok(assetSvg.includes('id="character-image"'));
  assert.doesNotMatch(assetSvg, /<foreignObject\b/i);
  assert.doesNotMatch(assetSvg, /\bhref="https?:\/\//i);
  assert.doesNotMatch(assetSvg, /\bhref="data:/i);
});

test("base character exposes a visible-capable expression overlay rig", () => {
  assert.ok(assetSvg.includes('id="face-cover"'));
  assert.ok(assetSvg.includes('id="face-features"'));
  assert.ok(assetSvg.includes('id="eye-left-shine"'));
  assert.ok(assetSvg.includes('id="eye-right-shine"'));
  assert.ok(assetSvg.includes('id="eye-left-heart"'));
  assert.ok(assetSvg.includes('id="eye-right-heart"'));
  assert.ok(assetSvg.includes('class="face-patch"'));
  assert.ok(assetSvg.includes('class="mouth-line"'));
  assert.doesNotMatch(assetSvg, /\.face-slot\s*\{[^}]*opacity:\s*0/i);
});
