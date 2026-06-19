import test from "node:test";
import assert from "node:assert/strict";

import { clipTextToCodePoints, TextBuffer } from "../src/input/textBuffer.ts";

test("TextBuffer appends and deletes one Unicode code point at a time", () => {
  const buffer = new TextBuffer("hi🙂");

  buffer.backspaceCodePoint();
  assert.equal(buffer.value, "hi");

  buffer.backspaceCodePoint();
  assert.equal(buffer.value, "h");

  buffer.append(" cute");
  assert.equal(buffer.value, "h cute");
});

test("clipTextToCodePoints clips by code point, not UTF-16 code unit", () => {
  assert.equal(clipTextToCodePoints("a🙂b", 2), "a🙂");
});

test("clipTextToCodePoints rejects negative limits", () => {
  assert.throws(() => clipTextToCodePoints("abc", -1), /non-negative/);
});
