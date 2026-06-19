import { TextBuffer } from "./textBuffer.ts";

export type CompositionSnapshot = Readonly<{
  isComposing: boolean;
  text: string;
}>;

export class CompositionController {
  #isComposing = false;
  #text = "";

  get isComposing(): boolean {
    return this.#isComposing;
  }

  get text(): string {
    return this.#text;
  }

  snapshot(): CompositionSnapshot {
    return {
      isComposing: this.#isComposing,
      text: this.#text
    };
  }

  start(): void {
    this.#isComposing = true;
    this.#text = "";
  }

  update(text: string): void {
    if (!this.#isComposing) {
      this.start();
    }
    this.#text = text;
  }

  end(text: string, buffer: TextBuffer): void {
    const committed = text || this.#text;
    if (committed.length > 0) {
      buffer.append(committed);
    }
    this.#isComposing = false;
    this.#text = "";
  }

  cancel(): void {
    this.#isComposing = false;
    this.#text = "";
  }
}
