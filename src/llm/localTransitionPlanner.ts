import type { Emotion } from "../emotion/emotionCatalog.ts";
import type { EffectName } from "../emotion/poseMap.ts";
import type { EasingName } from "../engine/easing.ts";
import type { MotionName } from "../engine/transitionEngine.ts";
import { quantizeExpressionStrength, sanitizeTransitionPlan, type SanitizedTransitionPlan } from "./sanitizeTransitionPlan.ts";
import { TANAOS_LABELS, type ClassifierResult, type Intent, type TanaosEmotionLabel } from "./transitionPlanSchema.ts";

export type LocalTransitionPlannerInput = Readonly<{
  currentEmotion: Emotion;
  promptText: string;
  classifierResults: readonly ClassifierResult[];
}>;

export function createLocalTransitionPlan(input: LocalTransitionPlannerInput): SanitizedTransitionPlan {
  const top = selectTopResult(input.classifierResults);

  if (!top) {
    return { ok: false, reason: "classifier returned no labels" };
  }

  const label = normalizeTanaosLabel(top.label);

  if (!label) {
    return { ok: false, reason: `unsupported classifier label: ${top.label}` };
  }

  const intent = inferIntent(input.promptText);
  const intensity = deriveExpressionStrength(input.classifierResults);
  const to = mapLabelToEmotion(label, intent, intensity);

  return sanitizeTransitionPlan(
    {
      intent,
      from: input.currentEmotion,
      to,
      intensity,
      durationMs: 420 + intensity * 620,
      fps: intensity >= 0.7 ? 8 : 6,
      easing: chooseEasing(label, intensity),
      motion: chooseMotion(label, intensity),
      effect: chooseEffect(label, intensity),
      blush: shouldBlush(to, intensity),
      confidence: top.score
    },
    input.currentEmotion
  );
}

export function deriveExpressionStrength(results: readonly ClassifierResult[]): number {
  const sorted = [...results].filter((result) => Number.isFinite(result.score)).sort((a, b) => b.score - a.score);
  const top = sorted[0];

  if (!top) {
    return 0;
  }

  const score = clamp01(top.score);
  const secondScore = sorted[1] ? clamp01(sorted[1].score) : 0;
  const margin = Math.max(0, score - secondScore);
  let strength = sorted[1] ? (score * 0.65 + clamp01(margin * 2) * 0.35) : score;

  if (score < 0.35) {
    strength *= 0.5;
  } else if (score < 0.5) {
    strength *= 0.75;
  }

  if (sorted[1] && margin < 0.08) {
    strength *= 0.65;
  }

  if (normalizeTanaosLabel(top.label) === "neutral") {
    strength = Math.min(strength, 0.5);
  }

  return quantizeExpressionStrength(strength);
}

function inferIntent(promptText: string): Intent {
  const text = promptText.toLowerCase();

  if (/\b(hi|hello|hey|good morning|good evening)\b/.test(text)) return "greeting";
  if (/\b(comfort me|help me|hug me|cheer me up|hold me)\b/.test(text)) return "comfort_request";
  if (/\b(cute|sweet|nice|good|great|pretty|adorable|proud)\b/.test(text)) return "compliment";
  if (/\b(love|like you|miss you|hug|cuddle)\b/.test(text)) return "affection";
  if (/\b(feed|food|hungry|snack|eat)\b/.test(text)) return "feed";
  if (/\b(sleep|sleepy|tired|nap)\b/.test(text)) return "sleep";
  if (/\b(play|game|dance|jump)\b/.test(text)) return "play";
  if (/\b(stupid|hate|bad pet|ugly)\b/.test(text)) return "insult";
  if (/\b(sorry|apologize|my fault)\b/.test(text)) return "apology";
  if (/\b(bye|goodbye|see you)\b/.test(text)) return "goodbye";
  if (text.includes("?")) return "question";

  return "unknown";
}

function mapLabelToEmotion(label: TanaosEmotionLabel, intent: Intent, intensity: number): Emotion {
  if (intent === "comfort_request") return "comforted";
  if (intent === "feed") return "hungry";
  if (intent === "sleep") return "sleepy";
  if (intent === "apology") return "grateful";

  switch (label) {
    case "joy":
      if (intent === "affection") return intensity >= 0.7 ? "love" : "attached";
      if (intent === "compliment") return "shy_love";
      return "happy";
    case "excitement":
      return intent === "play" ? "playful" : "excited";
    case "surprise":
      return "surprised";
    case "sadness":
      return intensity >= 0.7 ? "sad" : "disappointed";
    case "fear":
      return intensity >= 0.7 ? "scared" : "nervous";
    case "anger":
      return intensity >= 0.7 ? "angry" : "annoyed";
    case "disgust":
      return intensity >= 0.7 ? "sulky" : "disappointed";
    case "neutral":
      return intent === "question" ? "curious" : "neutral";
  }
}

function chooseEffect(label: TanaosEmotionLabel, intensity: number): EffectName {
  if (intensity < 0.3) return "none";

  switch (label) {
    case "joy":
    case "excitement":
      return "sparkles";
    case "sadness":
    case "fear":
      return "tears";
    case "anger":
    case "disgust":
      return "anger";
    case "surprise":
    case "neutral":
      return intensity >= 0.5 ? "question" : "none";
  }
}

function chooseMotion(label: TanaosEmotionLabel, intensity: number): MotionName {
  if (intensity < 0.2) return "none";

  switch (label) {
    case "joy":
      return "tiny_bounce";
    case "excitement":
      return "hop";
    case "anger":
    case "disgust":
      return "shake";
    case "surprise":
    case "fear":
    case "neutral":
      return "sway";
    case "sadness":
      return "none";
  }
}

function chooseEasing(label: TanaosEmotionLabel, intensity: number): EasingName {
  if (label === "excitement" && intensity >= 0.7) return "bounce";
  if (label === "surprise") return "overshoot";
  if (label === "sadness" || label === "fear") return "ease_in";
  return "ease_out";
}

function shouldBlush(emotion: Emotion, intensity: number): boolean {
  return intensity >= 0.4 && (emotion === "shy_love" || emotion === "love" || emotion === "attached" || emotion === "grateful");
}

function selectTopResult(results: readonly ClassifierResult[]): ClassifierResult | null {
  return (
    [...results]
      .filter((result) => typeof result.label === "string" && Number.isFinite(result.score))
      .sort((a, b) => b.score - a.score)[0] ?? null
  );
}

function normalizeTanaosLabel(label: string): TanaosEmotionLabel | null {
  const normalized = label.toLowerCase().trim();
  return TANAOS_LABELS.includes(normalized as TanaosEmotionLabel) ? (normalized as TanaosEmotionLabel) : null;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
