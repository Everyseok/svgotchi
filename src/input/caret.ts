export type CaretSnapshot = Readonly<{
  visible: boolean;
  elapsedMs: number;
}>;

export class CaretBlinker {
  readonly intervalMs: number;
  #startedAtMs: number;

  constructor(startedAtMs = 0, intervalMs = 500) {
    if (intervalMs <= 0) {
      throw new RangeError("intervalMs must be positive");
    }
    this.intervalMs = intervalMs;
    this.#startedAtMs = startedAtMs;
  }

  reset(nowMs: number): void {
    this.#startedAtMs = nowMs;
  }

  snapshot(nowMs: number): CaretSnapshot {
    const elapsedMs = Math.max(0, nowMs - this.#startedAtMs);
    const visible = Math.floor(elapsedMs / this.intervalMs) % 2 === 0;

    return { visible, elapsedMs };
  }
}
