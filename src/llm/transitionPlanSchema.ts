import type { Emotion } from "../emotion/emotionCatalog.ts";
import type { EffectName } from "../emotion/poseMap.ts";
import type { EasingName } from "../engine/easing.ts";
import type { MotionName } from "../engine/transitionEngine.ts";

export const INTENTS = [
  "greeting",
  "compliment",
  "affection",
  "feed",
  "sleep",
  "play",
  "tease",
  "insult",
  "apology",
  "comfort_request",
  "question",
  "goodbye",
  "unknown"
] as const;

export type Intent = (typeof INTENTS)[number];

export const TANAOS_LABELS = ["joy", "anger", "fear", "sadness", "surprise", "disgust", "excitement", "neutral"] as const;

export type TanaosEmotionLabel = (typeof TANAOS_LABELS)[number];

export type ClassifierResult = Readonly<{
  label: string;
  score: number;
}>;

export type TransitionPlan = Readonly<{
  intent: Intent;
  from: Emotion;
  to: Emotion;
  intensity: number;
  durationMs: number;
  fps: number;
  easing: EasingName;
  motion: MotionName;
  effect: EffectName;
  blush: boolean;
  confidence: number;
}>;

export const FORBIDDEN_MODEL_FIELDS = [
  "reply",
  "replyText",
  "replyStyle",
  "message",
  "speech",
  "svg",
  "path",
  "selector",
  "html",
  "css",
  "script",
  "url"
] as const;

