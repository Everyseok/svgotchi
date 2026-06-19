export type RectContract = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type PointContract = Readonly<{
  x: number;
  y: number;
}>;

export type CharacterContract = Readonly<{
  viewBox: RectContract;
  petArea: RectContract;
  promptArea: RectContract;
  bodyBox: RectContract;
  anchors: Readonly<{
    bodyCenter: PointContract;
    faceCenter: PointContract;
    eyeLeft: PointContract;
    eyeRight: PointContract;
    browLeft: PointContract;
    browRight: PointContract;
    mouth: PointContract;
    blushLeft: PointContract;
    blushRight: PointContract;
    heartOrigin: PointContract;
    tearLeft: PointContract;
    tearRight: PointContract;
    zzzOrigin: PointContract;
    questionOrigin: PointContract;
    angerOrigin: PointContract;
    sparkleOrigin: PointContract;
  }>;
}>;

export const CHARACTER_CONTRACT = {
  viewBox: { x: 0, y: 0, width: 100, height: 100 },
  petArea: { x: 0, y: 0, width: 100, height: 80 },
  promptArea: { x: 0, y: 81, width: 100, height: 19 },
  bodyBox: { x: 10, y: 0, width: 80, height: 80 },
  anchors: {
    bodyCenter: { x: 50, y: 40 },
    faceCenter: { x: 50, y: 34 },
    eyeLeft: { x: 42, y: 32 },
    eyeRight: { x: 58, y: 32 },
    browLeft: { x: 42, y: 26 },
    browRight: { x: 58, y: 26 },
    mouth: { x: 50, y: 40 },
    blushLeft: { x: 37, y: 38 },
    blushRight: { x: 63, y: 38 },
    heartOrigin: { x: 67, y: 26 },
    tearLeft: { x: 39, y: 36 },
    tearRight: { x: 60, y: 36 },
    zzzOrigin: { x: 66, y: 20 },
    questionOrigin: { x: 66, y: 24 },
    angerOrigin: { x: 66, y: 25 },
    sparkleOrigin: { x: 63, y: 26 }
  }
} as const satisfies CharacterContract;

export const CHARACTER_VIEW_BOX = "0 0 100 100";
