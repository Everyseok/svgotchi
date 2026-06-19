import type { Pose } from "../emotion/poseMap.ts";
import { applyEasing, type EasingName } from "./easing.ts";

export function interpolatePose(from: Pose, to: Pose, progress: number, easing: EasingName): Pose {
  const t = applyEasing(easing, progress);

  return {
    eyes: t < 0.45 ? from.eyes : to.eyes,
    mouth: t < 0.35 ? from.mouth : to.mouth,
    brows: t < 0.5 ? from.brows : to.brows,
    blushOpacity: lerp(from.blushOpacity, to.blushOpacity, t),
    bodyOffsetY: lerp(from.bodyOffsetY, to.bodyOffsetY, t),
    bodyOffsetX: lerp(from.bodyOffsetX, to.bodyOffsetX, t),
    bodyScale: lerp(from.bodyScale, to.bodyScale, t),
    bodyRotation: lerp(from.bodyRotation, to.bodyRotation, t),
    effect: t < 0.65 ? from.effect : to.effect,
    effectOpacity: lerp(from.effectOpacity, to.effectOpacity, t)
  };
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}
