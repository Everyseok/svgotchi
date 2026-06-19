import { CaretBlinker } from "./caret.ts";
import { CompositionController } from "./compositionController.ts";
import { handlePromptKey, type PromptKeyEvent, type PromptKeyResult } from "./keyboardController.ts";
import { clipTextToCodePoints, TextBuffer } from "./textBuffer.ts";

export type PixelPromptSnapshot = Readonly<{
  committedText: string;
  compositionText: string;
  displayText: string;
  clippedText: string;
  placeholderVisible: boolean;
  caretVisible: boolean;
  isFocused: boolean;
  isComposing: boolean;
}>;

export type PromptSubmitHandler = (value: string) => void;

export type PromptDomEvent = Readonly<{
  key?: string;
  isComposing?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  data?: string | null;
  preventDefault?: () => void;
}>;

export type PromptElementLike = {
  textContent: string | null;
  setAttribute(name: string, value: string): void;
  addEventListener(type: string, listener: (event: PromptDomEvent) => void): void;
};

export type PromptRootLike = PromptElementLike & {
  focus(): void;
  querySelector(selector: string): PromptElementLike | null;
};

export class PixelPrompt {
  readonly buffer: TextBuffer;
  readonly composition: CompositionController;
  readonly caret: CaretBlinker;
  readonly maxVisibleCodePoints: number;
  #isFocused = false;
  #onSubmit: PromptSubmitHandler;

  constructor(options: { maxVisibleCodePoints?: number; onSubmit?: PromptSubmitHandler } = {}) {
    this.buffer = new TextBuffer();
    this.composition = new CompositionController();
    this.caret = new CaretBlinker();
    this.maxVisibleCodePoints = options.maxVisibleCodePoints ?? 24;
    this.#onSubmit = options.onSubmit ?? (() => undefined);
  }

  focus(nowMs = 0): void {
    this.#isFocused = true;
    this.caret.reset(nowMs);
  }

  blur(): void {
    this.#isFocused = false;
    this.composition.cancel();
  }

  compositionStart(): void {
    this.composition.start();
  }

  compositionUpdate(text: string): void {
    this.composition.update(text);
  }

  compositionEnd(text: string): void {
    this.composition.end(text, this.buffer);
  }

  handleKey(event: PromptKeyEvent): PromptKeyResult {
    const result = handlePromptKey(event, this.buffer, this.composition);
    if (result.action === "submit") {
      this.#onSubmit(result.value);
    }
    return result;
  }

  snapshot(nowMs = 0): PixelPromptSnapshot {
    const displayText = this.buffer.value + this.composition.text;

    return {
      committedText: this.buffer.value,
      compositionText: this.composition.text,
      displayText,
      clippedText: clipTextToCodePoints(displayText, this.maxVisibleCodePoints),
      placeholderVisible: displayText.length === 0,
      caretVisible: this.#isFocused && this.caret.snapshot(nowMs).visible,
      isFocused: this.#isFocused,
      isComposing: this.composition.isComposing
    };
  }
}

export function attachPixelPrompt(root: PromptRootLike, prompt: PixelPrompt): () => void {
  const promptArea = requirePromptElement(root, "prompt-area");
  const sendZone = requirePromptElement(root, "send-zone");
  const promptText = requirePromptElement(root, "prompt-text");
  const placeholder = requirePromptElement(root, "prompt-placeholder");
  const caret = requirePromptElement(root, "prompt-caret");

  const render = (): void => {
    const snapshot = prompt.snapshot(Date.now());
    promptText.textContent = snapshot.clippedText;
    placeholder.setAttribute("opacity", snapshot.placeholderVisible ? "1" : "0");
    caret.setAttribute("opacity", snapshot.caretVisible ? "1" : "0");
  };

  const focusPrompt = (): void => {
    root.focus();
    prompt.focus(Date.now());
    render();
  };

  promptArea.addEventListener("click", focusPrompt);
  sendZone.addEventListener("click", () => {
    prompt.handleKey({ key: "Enter" });
    render();
  });
  root.addEventListener("keydown", (event) => {
    const key = event.key ?? "";
    const result = prompt.handleKey({
      key,
      isComposing: event.isComposing,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey
    });
    if (result.action !== "none") {
      event.preventDefault?.();
    }
    render();
  });
  root.addEventListener("compositionstart", () => {
    prompt.compositionStart();
    render();
  });
  root.addEventListener("compositionupdate", (event) => {
    prompt.compositionUpdate(event.data ?? "");
    render();
  });
  root.addEventListener("compositionend", (event) => {
    prompt.compositionEnd(event.data ?? "");
    render();
  });

  render();

  // Listener removal is intentionally deferred until a real DOM lifecycle exists.
  return render;
}

function requirePromptElement(root: PromptRootLike, id: string): PromptElementLike {
  const element = root.querySelector(`#${id}`);
  if (element === null) {
    throw new Error(`Missing SVG prompt element: ${id}`);
  }

  return element;
}
