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
  bodyBox: { x: 30, y: 18, width: 40, height: 44 },
  anchors: {
    bodyCenter: { x: 50, y: 42 },
    faceCenter: { x: 50, y: 41 },
    eyeLeft: { x: 42, y: 38 },
    eyeRight: { x: 58, y: 38 },
    browLeft: { x: 42, y: 33 },
    browRight: { x: 58, y: 33 },
    mouth: { x: 50, y: 50 },
    blushLeft: { x: 38, y: 46 },
    blushRight: { x: 62, y: 46 },
    heartOrigin: { x: 64, y: 26 },
    tearLeft: { x: 39, y: 43 },
    tearRight: { x: 61, y: 43 },
    zzzOrigin: { x: 66, y: 20 },
    questionOrigin: { x: 66, y: 24 },
    angerOrigin: { x: 66, y: 25 },
    sparkleOrigin: { x: 63, y: 26 }
  }
} as const satisfies CharacterContract;

export const CHARACTER_VIEW_BOX = "0 0 100 100";
