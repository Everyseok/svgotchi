import type { TransitionConfig } from "./transitionEngine.ts";

export type TransitionPreviewSample = TransitionConfig &
  Readonly<{
    previewReply: string;
  }>;

export const REQUIRED_TRANSITION_SAMPLES = [
  {
    from: "neutral",
    to: "shy_love",
    durationMs: 900,
    fps: 6,
    intensity: 1,
    easing: "ease_out",
    motion: "tiny_bounce",
    effect: "hearts",
    blush: true,
    previewReply: "eep..."
  },
  {
    from: "neutral",
    to: "hungry",
    durationMs: 800,
    fps: 6,
    intensity: 1,
    easing: "ease_in",
    motion: "sway",
    effect: "question",
    blush: false,
    previewReply: "snack?"
  },
  {
    from: "neutral",
    to: "sleepy",
    durationMs: 1000,
    fps: 5,
    intensity: 1,
    easing: "linear",
    motion: "none",
    effect: "zzz",
    blush: false,
    previewReply: "zzz..."
  },
  {
    from: "neutral",
    to: "hurt",
    durationMs: 850,
    fps: 6,
    intensity: 1,
    easing: "ease_out",
    motion: "shake",
    effect: "tears",
    blush: false,
    previewReply: "ow..."
  },
  {
    from: "neutral",
    to: "curious",
    durationMs: 750,
    fps: 6,
    intensity: 1,
    easing: "overshoot",
    motion: "sway",
    effect: "question",
    blush: false,
    previewReply: "hmm?"
  }
] as const satisfies readonly TransitionPreviewSample[];
