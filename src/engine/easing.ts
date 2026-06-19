export type EasingName = "linear" | "ease_in" | "ease_out" | "bounce" | "overshoot";

export function applyEasing(name: EasingName, t: number): number {
  const clamped = clamp01(t);

  switch (name) {
    case "linear":
      return clamped;
    case "ease_in":
      return clamped * clamped;
    case "ease_out":
      return 1 - (1 - clamped) * (1 - clamped);
    case "bounce":
      return clamped < 0.5 ? 2 * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
    case "overshoot":
      return clamp01(1 + 0.12 * Math.sin(clamped * Math.PI) - Math.pow(1 - clamped, 3));
  }
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
