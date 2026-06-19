import { ANIME_PREVIEW_STYLE, renderAnimeCharacter } from "../render/animeRig.ts";
import { listPoseEntries, type Pose } from "./poseMap.ts";

const CELL_W = 72;
const CELL_H = 82;
const COLS = 5;
const ROWS = 6;

export function renderPoseSheetSvg(): string {
  const cells = listPoseEntries()
    .map(([emotion, pose], index) => renderCell(emotion, pose, index))
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COLS * CELL_W} ${ROWS * CELL_H}" role="img" aria-labelledby="title desc">
  <title id="title">SVGotchi 30-emotion anime pose sheet</title>
  <desc id="desc">Thirty pure SVG anime companion emotion poses using one shared rig structure.</desc>
  <style>
${ANIME_PREVIEW_STYLE}
  </style>
  <rect class="bg" width="${COLS * CELL_W}" height="${ROWS * CELL_H}"/>
${cells}
</svg>
`;
}

function renderCell(emotion: string, pose: Pose, index: number): string {
  const x = (index % COLS) * CELL_W;
  const y = Math.floor(index / COLS) * CELL_H;
  const scale = round(0.62 * pose.bodyScale);
  const tx = x + 5 + pose.bodyOffsetX;
  const ty = y + 8 + pose.bodyOffsetY;
  const transform = `translate(${round(tx)} ${round(ty)}) rotate(${round(pose.bodyRotation)} 50 43) scale(${scale})`;

  return `  <g data-emotion="${emotion}" transform="translate(${x} ${y})">
    <rect x="1" y="1" width="${CELL_W - 2}" height="${CELL_H - 2}" class="frame muted"/>
    <text x="4" y="8">${index + 1}. ${emotion}</text>
    <g transform="${transform}">
      ${renderAnimeCharacter(pose)}
    </g>
    <text x="4" y="${CELL_H - 12}" class="label">${pose.eyes}/${pose.mouth}</text>
    <text x="4" y="${CELL_H - 6}" class="label">${pose.brows}/${pose.effect}</text>
  </g>`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
