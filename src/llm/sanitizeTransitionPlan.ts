import { EMOTIONS, type Emotion } from "../emotion/emotionCatalog.ts";
import type { EffectName } from "../emotion/poseMap.ts";
import { clamp01, type EasingName } from "../engine/easing.ts";
import type { MotionName } from "../engine/transitionEngine.ts";
import { FORBIDDEN_MODEL_FIELDS, INTENTS, type Intent, type TransitionPlan } from "./transitionPlanSchema.ts";

const EASINGS = ["linear", "ease_in", "ease_out", "bounce", "overshoot"] as const satisfies readonly EasingName[];
const MOTIONS = ["none", "tiny_bounce", "shake", "sway", "hop"] as const satisfies readonly MotionName[];
const EFFECTS = ["none", "hearts", "sparkles", "tears", "zzz", "question", "anger"] as const satisfies readonly EffectName[];

export type SanitizedTransitionPlan =
  | Readonly<{ ok: true; plan: TransitionPlan }>
  | Readonly<{ ok: false; reason: string }>;

export function sanitizeTransitionPlan(candidate: unknown, currentEmotion: Emotion): SanitizedTransitionPlan {
  if (!isRecord(candidate)) {
    return { ok: false, reason: "plan must be an object" };
  }

  for (const field of FORBIDDEN_MODEL_FIELDS) {
    if (Object.hasOwn(candidate, field)) {
      return { ok: false, reason: `forbidden model field: ${field}` };
    }
  }

  return {
    ok: true,
    plan: {
      intent: readEnum(candidate.intent, INTENTS, "unknown"),
      from: currentEmotion,
      to: readEnum(candidate.to, EMOTIONS, currentEmotion),
      intensity: quantizeExpressionStrength(readNumber(candidate.intensity, 0)),
      durationMs: clampInteger(readNumber(candidate.durationMs, 650), 300, 1200),
      fps: clampInteger(readNumber(candidate.fps, 6), 4, 12),
      easing: readEnum(candidate.easing, EASINGS, "ease_out"),
      motion: readEnum(candidate.motion, MOTIONS, "none"),
      effect: readEnum(candidate.effect, EFFECTS, "none"),
      blush: typeof candidate.blush === "boolean" ? candidate.blush : false,
      confidence: clamp01(readNumber(candidate.confidence, 0))
    }
  };
}

export function quantizeExpressionStrength(value: number): number {
  return Math.round(clamp01(value) * 10) / 10;
}

function readEnum<const T extends readonly string[]>(value: unknown, allowed: T, defaultValue: T[number]): T[number] {
  return typeof value === "string" && allowed.includes(value) ? value : defaultValue;
}

function readNumber(value: unknown, defaultValue: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : defaultValue;
}

function clampInteger(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
