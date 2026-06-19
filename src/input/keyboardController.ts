import { CompositionController } from "./compositionController.ts";
import { TextBuffer } from "./textBuffer.ts";

export type PromptKeyEvent = Readonly<{
  key: string;
  isComposing?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
}>;

export type PromptKeyResult = Readonly<
  | { action: "none" }
  | { action: "append"; text: string }
  | { action: "backspace" }
  | { action: "submit"; value: string }
>;

export function handlePromptKey(
  event: PromptKeyEvent,
  buffer: TextBuffer,
  composition: CompositionController
): PromptKeyResult {
  if (event.isComposing || composition.isComposing) {
    return { action: "none" };
  }

  if (event.key === "Enter") {
    return { action: "submit", value: buffer.value };
  }

  if (event.key === "Backspace") {
    buffer.backspaceCodePoint();
    return { action: "backspace" };
  }

  if (isPlainPrintableKey(event)) {
    buffer.append(event.key);
    return { action: "append", text: event.key };
  }

  return { action: "none" };
}

function isPlainPrintableKey(event: PromptKeyEvent): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  return Array.from(event.key).length === 1;
}
