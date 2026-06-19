import test from "node:test";
import assert from "node:assert/strict";

import { attachPixelPrompt, PixelPrompt, type PromptDomEvent, type PromptElementLike, type PromptRootLike } from "../src/input/pixelPrompt.ts";

test("PixelPrompt focuses, hides placeholder after input, and submits committed text", () => {
  const submissions: string[] = [];
  const prompt = new PixelPrompt({ onSubmit: (value) => submissions.push(value) });

  prompt.focus(100);
  assert.equal(prompt.snapshot(100).caretVisible, true);
  assert.equal(prompt.snapshot(100).placeholderVisible, true);

  prompt.handleKey({ key: "h" });
  prompt.handleKey({ key: "i" });

  assert.equal(prompt.snapshot().committedText, "hi");
  assert.equal(prompt.snapshot().placeholderVisible, false);

  const result = prompt.handleKey({ key: "Enter" });
  assert.deepEqual(result, { action: "submit", value: "hi" });
  assert.deepEqual(submissions, ["hi"]);
});

test("PixelPrompt supports IME composition without premature key handling", () => {
  const submissions: string[] = [];
  const prompt = new PixelPrompt({ onSubmit: (value) => submissions.push(value) });

  prompt.focus();
  prompt.compositionStart();
  prompt.compositionUpdate("mo");

  assert.equal(prompt.snapshot().displayText, "mo");
  assert.equal(prompt.handleKey({ key: "Enter", isComposing: true }).action, "none");
  assert.deepEqual(submissions, []);

  prompt.compositionUpdate("mochi");
  prompt.compositionEnd("mochi");

  assert.equal(prompt.snapshot().committedText, "mochi");
  assert.equal(prompt.snapshot().compositionText, "");
  assert.equal(prompt.snapshot().isComposing, false);

  prompt.handleKey({ key: " " });
  prompt.compositionStart();
  prompt.compositionUpdate("sp");
  prompt.compositionEnd("sprout");

  assert.equal(prompt.snapshot().committedText, "mochi sprout");
});

test("PixelPrompt handles Backspace outside composition and ignores modified keys", () => {
  const prompt = new PixelPrompt();

  prompt.handleKey({ key: "m" });
  prompt.handleKey({ key: "🙂" });
  prompt.handleKey({ key: "Backspace" });
  prompt.handleKey({ key: "x", ctrlKey: true });

  assert.equal(prompt.snapshot().committedText, "m");
});

test("PixelPrompt clips visible text safely", () => {
  const prompt = new PixelPrompt({ maxVisibleCodePoints: 4 });

  for (const key of ["m", "o", "c", "h", "i"]) {
    prompt.handleKey({ key });
  }

  assert.equal(prompt.snapshot().displayText, "mochi");
  assert.equal(prompt.snapshot().clippedText, "moch");
});

test("PixelPrompt caret blinks on a fixed interval while focused", () => {
  const prompt = new PixelPrompt();

  prompt.focus(1000);

  assert.equal(prompt.snapshot(1000).caretVisible, true);
  assert.equal(prompt.snapshot(1499).caretVisible, true);
  assert.equal(prompt.snapshot(1500).caretVisible, false);
  assert.equal(prompt.snapshot(2000).caretVisible, true);
});

test("attachPixelPrompt wires pure SVG prompt elements without HTML controls", () => {
  const root = new TestRoot(["prompt-area", "send-zone", "prompt-text", "prompt-placeholder", "prompt-caret"]);
  const submissions: string[] = [];
  const prompt = new PixelPrompt({ onSubmit: (value) => submissions.push(value) });

  attachPixelPrompt(root, prompt);

  root.emitTo("prompt-area", "click", {});
  assert.equal(root.focusCount, 1);

  root.emit("keydown", { key: "m" });
  assert.equal(root.require("prompt-text").textContent, "m");
  assert.equal(root.require("prompt-placeholder").attributes.get("opacity"), "0");

  root.emit("compositionstart", {});
  root.emit("compositionupdate", { data: "ochi" });
  assert.equal(root.require("prompt-text").textContent, "mochi");

  root.emit("compositionend", { data: "ochi" });
  root.emitTo("send-zone", "click", {});

  assert.deepEqual(submissions, ["mochi"]);
});

class TestElement implements PromptElementLike {
  textContent: string | null = null;
  readonly attributes = new Map<string, string>();
  readonly listeners = new Map<string, Array<(event: PromptDomEvent) => void>>();

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  addEventListener(type: string, listener: (event: PromptDomEvent) => void): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  emit(type: string, event: PromptDomEvent): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event);
    }
  }
}

class TestRoot extends TestElement implements PromptRootLike {
  readonly elements = new Map<string, TestElement>();
  focusCount = 0;

  constructor(ids: string[]) {
    super();
    for (const id of ids) {
      this.elements.set(id, new TestElement());
    }
  }

  focus(): void {
    this.focusCount += 1;
  }

  querySelector(selector: string): PromptElementLike | null {
    return this.elements.get(selector.replace(/^#/, "")) ?? null;
  }

  require(id: string): TestElement {
    const element = this.elements.get(id);
    assert.ok(element, `missing test element ${id}`);
    return element;
  }

  emitTo(id: string, type: string, event: PromptDomEvent): void {
    this.require(id).emit(type, event);
  }
}
