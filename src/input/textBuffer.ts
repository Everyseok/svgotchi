export type TextBufferSnapshot = Readonly<{
  value: string;
  codePointLength: number;
}>;

export class TextBuffer {
  #value: string;

  constructor(initialValue = "") {
    this.#value = initialValue;
  }

  get value(): string {
    return this.#value;
  }

  snapshot(): TextBufferSnapshot {
    return {
      value: this.#value,
      codePointLength: Array.from(this.#value).length
    };
  }

  append(text: string): void {
    this.#value += text;
  }

  backspaceCodePoint(): void {
    const codePoints = Array.from(this.#value);
    codePoints.pop();
    this.#value = codePoints.join("");
  }

  clear(): void {
    this.#value = "";
  }
}

export function clipTextToCodePoints(text: string, maxCodePoints: number): string {
  if (maxCodePoints < 0) {
    throw new RangeError("maxCodePoints must be non-negative");
  }

  return Array.from(text).slice(0, maxCodePoints).join("");
}
