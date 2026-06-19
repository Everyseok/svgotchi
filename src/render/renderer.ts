import type { Pose } from "../emotion/poseMap.ts";
import type { TransitionPreviewSample } from "../engine/transitionSamples.ts";
import type { TransitionFrame } from "../engine/transitionEngine.ts";
import { createTransitionFrames } from "../engine/transitionEngine.ts";
import { ANIME_PREVIEW_STYLE, renderAnimeCharacter, renderAnimeSpeechBubble } from "./animeRig.ts";

const FRAME_W = 72;
const FRAME_H = 88;

export function renderTransitionPreviewSvg(samples: readonly TransitionPreviewSample[]): string {
  const sampleSvgs = samples
    .map((sample, sampleIndex) => renderSample(sample, sampleIndex))
    .join("\n");
  const width = 5 * FRAME_W;
  const height = samples.length * FRAME_H;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">SVGotchi deterministic transition previews</title>
  <desc id="desc">Five multi-frame pure SVG anime companion emotion transition previews.</desc>
  <style>
${ANIME_PREVIEW_STYLE}
    .bubble-group text { font-size: 3px; }
  </style>
  <rect class="bg" width="${width}" height="${height}"/>
${sampleSvgs}
</svg>
`;
}

function renderSample(sample: TransitionPreviewSample, sampleIndex: number): string {
  const frames = createTransitionFrames(sample);
  const picked = pickFiveFrames(frames);
  const y = sampleIndex * FRAME_H;

  return picked
    .map((frame, frameIndex) => {
      const x = frameIndex * FRAME_W;
      return `  <g data-transition="${sample.from}->${sample.to}" data-frame-index="${frame.index}" transform="translate(${x} ${y})">
    <rect x="1" y="1" width="${FRAME_W - 2}" height="${FRAME_H - 2}" class="frame"/>
    <text x="4" y="8">${sample.from}->${sample.to}</text>
    <text x="4" y="14" class="label">f${frame.index} ${Math.round(frame.progress * 100)}%</text>
    ${renderFramePose(frame.pose, sample.previewReply)}
  </g>`;
    })
    .join("\n");
}

function renderFramePose(pose: Pose, reply: string): string {
  const scale = round(0.62 * pose.bodyScale);
  const transform = `translate(${round(5 + pose.bodyOffsetX)} ${round(18 + pose.bodyOffsetY)}) rotate(${round(pose.bodyRotation)} 50 43) scale(${scale})`;

  return `<g transform="${transform}">
      ${renderAnimeCharacter(pose)}
      ${renderAnimeSpeechBubble(reply)}
    </g>`;
}

function pickFiveFrames(frames: readonly TransitionFrame[]): TransitionFrame[] {
  const indexes = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(ratio * (frames.length - 1)));
  return indexes.map((index) => frames[index] ?? frames[frames.length - 1]!);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
