import type { Pose } from "../emotion/poseMap.ts";
import type { TransitionPreviewSample } from "../engine/transitionSamples.ts";
import type { TransitionFrame } from "../engine/transitionEngine.ts";
import { createTransitionFrames } from "../engine/transitionEngine.ts";
import { renderSpeechBubble } from "./bubble.ts";
import { renderEffect } from "./effects.ts";

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
  <desc id="desc">Five multi-frame monochrome emotion transition previews.</desc>
  <style>
    .bg { fill: #000; }
    .line { fill: none; stroke: #fff; stroke-width: 1.6; shape-rendering: crispEdges; }
    .thin { fill: none; stroke: #fff; stroke-width: 1; shape-rendering: crispEdges; }
    .fill { fill: #fff; shape-rendering: crispEdges; }
    text { fill: #fff; font-family: monospace; font-size: 4px; }
    .label { font-size: 3.5px; }
    .bubble text { font-size: 3px; }
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
    <rect x="1" y="1" width="${FRAME_W - 2}" height="${FRAME_H - 2}" class="thin"/>
    <text x="4" y="8">${sample.from}->${sample.to}</text>
    <text x="4" y="14" class="label">f${frame.index} ${Math.round(frame.progress * 100)}%</text>
    ${renderFramePose(frame.pose, sample.previewReply)}
  </g>`;
    })
    .join("\n");
}

function renderFramePose(pose: Pose, reply: string): string {
  const transform = `translate(${11 + pose.bodyOffsetX} ${16 + pose.bodyOffsetY}) rotate(${round(pose.bodyRotation)} 39 34) scale(${round(pose.bodyScale)})`;

  return `<g transform="${transform}">
      ${renderBody()}
      ${renderFace(pose)}
      ${renderEffect(pose.effect, pose.effectOpacity)}
      ${renderSpeechBubble(reply)}
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
  return `${renderBrows(pose)}
      ${renderEyes(pose)}
      ${renderMouth(pose)}
      <rect x="25" y="44" width="6" height="3" class="fill" opacity="${round(pose.blushOpacity)}"/>
      <rect x="47" y="44" width="6" height="3" class="fill" opacity="${round(pose.blushOpacity)}"/>`;
}

function renderEyes(pose: Pose): string {
  switch (pose.eyes) {
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

function renderMouth(pose: Pose): string {
  switch (pose.mouth) {
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

function renderBrows(pose: Pose): string {
  switch (pose.brows) {
    case "none":
      return "";
    case "soft":
      return `<path d="M28 30h7M44 30h7" class="thin" opacity="0.55"/>`;
    case "angry":
      return `<path d="M28 30l7 3M51 30l-7 3" class="thin"/>`;
    case "worried":
      return `<path d="M28 33l7-3M44 30l7 3" class="thin"/>`;
    case "raised":
      return `<path d="M28 28h7M44 28h7" class="thin"/>`;
  }
}

function pickFiveFrames(frames: readonly TransitionFrame[]): TransitionFrame[] {
  const indexes = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(ratio * (frames.length - 1)));
  return indexes.map((index) => frames[index] ?? frames[frames.length - 1]!);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
