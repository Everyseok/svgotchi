import { EMOTIONS, type Emotion } from "./emotionCatalog.ts";

export type EyePose = "dot" | "happy_closed" | "half_closed" | "sharp" | "wide" | "sad" | "heart_like";
export type MouthPose =
  | "flat"
  | "small_smile"
  | "big_smile"
  | "sad_curve"
  | "zigzag"
  | "tiny_open"
  | "surprised_o"
  | "pout";
export type BrowPose = "none" | "soft" | "angry" | "worried" | "raised";
export type EffectName = "none" | "hearts" | "sparkles" | "tears" | "zzz" | "question" | "anger";

export type Pose = Readonly<{
  eyes: EyePose;
  mouth: MouthPose;
  brows: BrowPose;
  blushOpacity: number;
  bodyOffsetY: number;
  bodyOffsetX: number;
  bodyScale: number;
  bodyRotation: number;
  effect: EffectName;
  effectOpacity: number;
}>;

export const POSE_MAP = {
  neutral: pose("dot", "flat", "none", 0, 0, 0, 1, 0, "none", 0),
  happy: pose("happy_closed", "big_smile", "soft", 0.25, -1, 0, 1, 0, "sparkles", 0.7),
  excited: pose("wide", "big_smile", "raised", 0.35, -2, 0, 1, 0, "sparkles", 1),
  proud: pose("half_closed", "small_smile", "raised", 0.1, -0.5, 0, 1, 0, "sparkles", 0.55),
  playful: pose("happy_closed", "zigzag", "soft", 0.2, -1, 1, 1, 0, "sparkles", 0.5),
  love: pose("heart_like", "big_smile", "soft", 0.8, -1, 0, 1, 0, "hearts", 1),
  shy_love: pose("happy_closed", "small_smile", "worried", 1, 0.5, -1, 1, 0, "hearts", 0.9),
  comforted: pose("happy_closed", "small_smile", "soft", 0.35, 0, 0, 1, 0, "sparkles", 0.35),
  attached: pose("dot", "small_smile", "soft", 0.55, -0.5, 0, 1, 0, "hearts", 0.65),
  sad: pose("sad", "sad_curve", "worried", 0, 1, 0, 1, 0, "tears", 0.45),
  lonely: pose("sad", "flat", "worried", 0, 1.5, -1, 1, 0, "tears", 0.35),
  disappointed: pose("half_closed", "sad_curve", "worried", 0, 1, 0, 1, 0, "none", 0),
  hurt: pose("sad", "zigzag", "worried", 0, 1, 1, 1, 0, "tears", 0.75),
  angry: pose("sharp", "zigzag", "angry", 0, 0, 1, 1, 0, "anger", 1),
  annoyed: pose("half_closed", "flat", "angry", 0, 0, 0.5, 1, 0, "anger", 0.45),
  jealous: pose("sharp", "pout", "worried", 0.2, 0, -1, 1, 0, "anger", 0.35),
  scared: pose("wide", "tiny_open", "worried", 0, -0.5, 0, 1, 0, "tears", 0.3),
  nervous: pose("wide", "zigzag", "worried", 0.25, 0.5, -0.5, 1, 0, "question", 0.35),
  surprised: pose("wide", "surprised_o", "raised", 0, -1, 0, 1, 0, "question", 0.85),
  confused: pose("dot", "tiny_open", "raised", 0, 0, 0, 1, 0, "question", 1),
  sleepy: pose("half_closed", "flat", "none", 0, 1.5, 0, 1, 0, "zzz", 1),
  hungry: pose("dot", "tiny_open", "worried", 0, 0.5, 0, 1, 0, "question", 0.4),
  tired: pose("half_closed", "sad_curve", "none", 0, 2, 0, 1, 0, "zzz", 0.45),
  sick: pose("sad", "zigzag", "worried", 0, 1.5, 0, 1, 0, "none", 0),
  curious: pose("wide", "small_smile", "raised", 0, -0.5, 0, 1, 0, "question", 0.75),
  thinking: pose("half_closed", "tiny_open", "raised", 0, 0, 0, 1, 0, "question", 0.55),
  bored: pose("half_closed", "flat", "none", 0, 1, 0, 1, 0, "zzz", 0.2),
  grateful: pose("happy_closed", "small_smile", "soft", 0.45, -0.5, 0, 1, 0, "sparkles", 0.75),
  apologetic: pose("sad", "small_smile", "worried", 0.25, 1, 0, 1, 0, "tears", 0.25),
  sulky: pose("half_closed", "pout", "angry", 0.1, 1, -1, 1, 0, "anger", 0.2)
} as const satisfies Record<Emotion, Pose>;

export function getPose(emotion: Emotion): Pose {
  return POSE_MAP[emotion];
}

export function listPoseEntries(): ReadonlyArray<readonly [Emotion, Pose]> {
  return EMOTIONS.map((emotion) => [emotion, POSE_MAP[emotion]] as const);
}

function pose(
  eyes: EyePose,
  mouth: MouthPose,
  brows: BrowPose,
  blushOpacity: number,
  bodyOffsetY: number,
  bodyOffsetX: number,
  bodyScale: number,
  bodyRotation: number,
  effect: EffectName,
  effectOpacity: number
): Pose {
  return {
    eyes,
    mouth,
    brows,
    blushOpacity,
    bodyOffsetY,
    bodyOffsetX,
    bodyScale,
    bodyRotation,
    effect,
    effectOpacity
  };
}
