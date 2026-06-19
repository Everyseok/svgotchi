export type FrameSchedule = Readonly<{
  durationMs: number;
  fps: number;
  frameCount: number;
  frameTimesMs: readonly number[];
}>;

export function createFrameSchedule(durationMs: number, fps: number): FrameSchedule {
  const safeDuration = Math.min(1200, Math.max(300, Math.round(durationMs)));
  const safeFps = Math.min(12, Math.max(4, Math.round(fps)));
  const frameCount = Math.max(2, Math.round((safeDuration / 1000) * safeFps) + 1);
  const stepMs = safeDuration / (frameCount - 1);

  return {
    durationMs: safeDuration,
    fps: safeFps,
    frameCount,
    frameTimesMs: Array.from({ length: frameCount }, (_, index) => Math.round(index * stepMs))
  };
}
