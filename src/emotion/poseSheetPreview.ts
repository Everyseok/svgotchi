import { listPoseEntries, type BrowPose, type EffectName, type EyePose, type MouthPose, type Pose } from "./poseMap.ts";

const CELL_W = 72;
const CELL_H = 82;
const COLS = 5;
const ROWS = 6;

export function renderPoseSheetSvg(): string {
  const cells = listPoseEntries()
    .map(([emotion, pose], index) => renderCell(emotion, pose, index))
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COLS * CELL_W} ${ROWS * CELL_H}" role="img" aria-labelledby="title desc">
  <title id="title">SVGotchi 30-emotion monochrome pose sheet</title>
  <desc id="desc">Thirty black and white Mochi Sprout emotion poses using one shared rig structure.</desc>
  <style>
    .bg { fill: #000; }
    .line { fill: none; stroke: #fff; stroke-width: 1.6; shape-rendering: crispEdges; }
    .thin { fill: none; stroke: #fff; stroke-width: 1; shape-rendering: crispEdges; }
    .fill { fill: #fff; shape-rendering: crispEdges; }
    text { fill: #fff; font-family: monospace; font-size: 4px; }
    .label { font-size: 3.5px; }
    .muted { opacity: 0.55; }
  </style>
  <rect class="bg" width="${COLS * CELL_W}" height="${ROWS * CELL_H}"/>
${cells}
</svg>
`;
}

function renderCell(emotion: string, pose: Pose, index: number): string {
  const x = (index % COLS) * CELL_W;
  const y = Math.floor(index / COLS) * CELL_H;
  const tx = x + 11 + pose.bodyOffsetX;
  const ty = y + 9 + pose.bodyOffsetY;
  const transform = `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${pose.bodyRotation} 39 34) scale(${pose.bodyScale})`;

  return `  <g data-emotion="${emotion}" transform="translate(${x} ${y})">
    <rect x="1" y="1" width="${CELL_W - 2}" height="${CELL_H - 2}" class="thin muted"/>
    <text x="4" y="8">${index + 1}. ${emotion}</text>
    <g transform="${transform}">
      ${renderBody()}
      ${renderFace(pose)}
      ${renderEffect(pose.effect, pose.effectOpacity)}
    </g>
    <text x="4" y="${CELL_H - 12}" class="label">${pose.eyes}/${pose.mouth}</text>
    <text x="4" y="${CELL_H - 6}" class="label">${pose.brows}/${pose.effect}</text>
  </g>`;
}

function renderBody(): string {
  return `<rect x="19" y="16" width="40" height="44" rx="10" class="line"/>
      <rect x="31" y="11" width="8" height="6" class="thin"/>
      <rect x="40" y="9" width="8" height="6" class="thin"/>
      <rect x="37" y="15" width="4" height="6" class="fill"/>
      <rect x="26" y="59" width="8" height="5" class="thin"/>
      <rect x="44" y="59" width="8" height="5" class="thin"/>`;
}

function renderFace(pose: Pose): string {
  return `${renderBrows(pose.brows)}
      ${renderEyes(pose.eyes)}
      ${renderMouth(pose.mouth)}
      <rect x="25" y="44" width="6" height="3" class="fill" opacity="${pose.blushOpacity}"/>
      <rect x="47" y="44" width="6" height="3" class="fill" opacity="${pose.blushOpacity}"/>`;
}

function renderEyes(eyes: EyePose): string {
  switch (eyes) {
    case "dot":
      return `<rect x="29" y="34" width="5" height="5" class="fill"/><rect x="45" y="34" width="5" height="5" class="fill"/>`;
    case "happy_closed":
      return `<path d="M28 36h7M44 36h7" class="thin"/>`;
    case "half_closed":
      return `<rect x="29" y="36" width="6" height="2" class="fill"/><rect x="45" y="36" width="6" height="2" class="fill"/>`;
    case "sharp":
      return `<path d="M28 34h7v3h-5zM51 34h-7v3h5z" class="fill"/>`;
    case "wide":
      return `<rect x="28" y="32" width="7" height="7" class="thin"/><rect x="44" y="32" width="7" height="7" class="thin"/>`;
    case "sad":
      return `<path d="M28 36l7 3M44 39l7-3" class="thin"/>`;
    case "heart_like":
      return `<path d="M28 33h3v-2h3v2h2v3h-2v2h-4v-2h-2z" class="fill"/><path d="M44 33h3v-2h3v2h2v3h-2v2h-4v-2h-2z" class="fill"/>`;
  }
}

function renderMouth(mouth: MouthPose): string {
  switch (mouth) {
    case "flat":
      return `<rect x="36" y="48" width="8" height="2" class="fill"/>`;
    case "small_smile":
      return `<path d="M35 48h2v2h6v-2h2" class="thin"/>`;
    case "big_smile":
      return `<path d="M33 47h3v3h8v-3h3" class="thin"/>`;
    case "sad_curve":
      return `<path d="M34 51h3v-2h6v2h3" class="thin"/>`;
    case "zigzag":
      return `<path d="M34 49l3-2l3 2l3-2l3 2" class="thin"/>`;
    case "tiny_open":
      return `<rect x="38" y="47" width="4" height="4" class="thin"/>`;
    case "surprised_o":
      return `<rect x="36" y="46" width="7" height="7" rx="2" class="thin"/>`;
    case "pout":
      return `<rect x="35" y="48" width="10" height="3" class="thin"/>`;
  }
}

function renderBrows(brows: BrowPose): string {
  switch (brows) {
    case "none":
      return "";
    case "soft":
      return `<path d="M28 30h7M44 30h7" class="thin muted"/>`;
    case "angry":
      return `<path d="M28 30l7 3M51 30l-7 3" class="thin"/>`;
    case "worried":
      return `<path d="M28 33l7-3M44 30l7 3" class="thin"/>`;
    case "raised":
      return `<path d="M28 28h7M44 28h7" class="thin"/>`;
  }
}

function renderEffect(effect: EffectName, opacity: number): string {
  if (effect === "none" || opacity <= 0) {
    return "";
  }

  const prefix = `<g opacity="${opacity}">`;
  const suffix = "</g>";

  switch (effect) {
    case "hearts":
      return `${prefix}<path d="M52 20h2v-2h3v2h2v3h-2v2h-3v-2h-2z" class="fill"/>${suffix}`;
    case "sparkles":
      return `${prefix}<path d="M54 18v8M50 22h8" class="thin"/>${suffix}`;
    case "tears":
      return `${prefix}<rect x="28" y="40" width="2" height="5" class="fill"/><rect x="50" y="40" width="2" height="5" class="fill"/>${suffix}`;
    case "zzz":
      return `${prefix}<text x="54" y="19">Z</text>${suffix}`;
    case "question":
      return `${prefix}<text x="55" y="23">?</text>${suffix}`;
    case "anger":
      return `${prefix}<path d="M54 18l4 4M58 18l-4 4" class="thin"/>${suffix}`;
  }
}
