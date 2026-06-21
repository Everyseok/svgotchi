import type { Emotion } from "../emotion/emotionCatalog.ts";
import type { EffectName, Pose } from "../emotion/poseMap.ts";
import { clamp01, type EasingName } from "./easing.ts";
import { createFrameSchedule } from "./frameScheduler.ts";
import { interpolatePose } from "./interpolation.ts";
import { resolveEmotionPose } from "./poseResolver.ts";

export type MotionName = "none" | "tiny_bounce" | "shake" | "sway" | "hop";

export type TransitionConfig = Readonly<{
  from: Emotion;
  to: Emotion;
  durationMs: number;
  fps: number;
  intensity: number;
  easing: EasingName;
  motion: MotionName;
  effect: EffectName;
  blush: boolean;
}>;

export type TransitionFrame = Readonly<{
  index: number;
  timeMs: number;
  progress: number;
  pose: Pose;
}>;

export function createTransitionFrames(config: TransitionConfig): TransitionFrame[] {
  const schedule = createFrameSchedule(config.durationMs, config.fps);
  const fromPose = resolveEmotionPose(config.from);
  const fullTargetPose = withPlanOverrides(resolveEmotionPose(config.to), config);
  const intensity = clamp01(config.intensity);
  const targetPose = interpolatePose(fromPose, fullTargetPose, intensity, "linear");

  return schedule.frameTimesMs.map((timeMs, index) => {
    const progress = index / (schedule.frameCount - 1);
    const pose = applyMotion(interpolatePose(fromPose, targetPose, progress, config.easing), config.motion, progress, intensity);

    return {
      index,
      timeMs,
      progress,
      pose
    };
  });
}

function withPlanOverrides(pose: Pose, config: TransitionConfig): Pose {
  return {
    ...pose,
    effect: config.effect,
    effectOpacity: config.effect === "none" ? 0 : Math.max(pose.effectOpacity, 0.75),
    blushOpacity: config.blush ? Math.max(pose.blushOpacity, 0.6) : pose.blushOpacity
  };
}

function applyMotion(pose: Pose, motion: MotionName, progress: number, intensity: number): Pose {
  const wave = Math.sin(progress * Math.PI * 2);
  const amount = clamp01(intensity);

  switch (motion) {
    case "none":
      return pose;
    case "tiny_bounce":
      return { ...pose, bodyOffsetY: pose.bodyOffsetY - Math.abs(wave) * 0.8 * amount };
    case "shake":
      return { ...pose, bodyOffsetX: pose.bodyOffsetX + Math.sign(wave || 1) * 1.2 * amount };
    case "sway":
      return { ...pose, bodyRotation: pose.bodyRotation + wave * 3 * amount };
    case "hop":
      return { ...pose, bodyOffsetY: pose.bodyOffsetY - Math.sin(progress * Math.PI) * 2.5 * amount };
  }
}
