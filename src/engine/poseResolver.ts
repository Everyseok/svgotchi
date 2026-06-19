import type { Emotion } from "../emotion/emotionCatalog.ts";
import { getPose, type Pose } from "../emotion/poseMap.ts";

export function resolveEmotionPose(emotion: Emotion): Pose {
  return getPose(emotion);
}
