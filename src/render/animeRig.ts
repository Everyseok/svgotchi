import type { BrowPose, EffectName, EyePose, MouthPose, Pose } from "../emotion/poseMap.ts";
import { CHARACTER_IMAGE_HREF } from "../character/baseCharacter.ts";

export const ANIME_PREVIEW_STYLE = `    .bg { fill: #140f1f; }
    .frame { fill: none; stroke: #5f4a7d; stroke-width: 1; }
    .character-image { image-rendering: auto; }
    .face-patch { fill: #fff1f0; stroke: #f0c9cf; stroke-width: 0.3; }
    .eye-fill { fill: #6f54b8; stroke: #3c286d; stroke-width: 0.55; }
    .eye-shine { fill: #fffaff; }
    .eye-heart { fill: #ff78ad; stroke: #963f72; stroke-width: 0.35; }
    .mouth-line, .eye-line, .brow-line { fill: none; stroke: #4b2a4d; stroke-width: 1.25; stroke-linecap: round; stroke-linejoin: round; }
    .blush-fill { fill: #ff9ab8; }
    .effect-fill { fill: #ff7dac; }
    .effect-tear { fill: #7ed8ff; }
    .effect-line { stroke: #ffe889; stroke-width: 1.2; stroke-linecap: round; fill: none; }
    .effect-symbol { fill: #ffe889; font-size: 8px; font-weight: 700; }
    .bubble { fill: #211832; stroke: #cbb5ea; stroke-width: 1; }
    .bubble-tail { fill: #cdb9ff; }
    text { fill: #f7eaff; font-family: monospace; font-size: 4px; }
    .label { font-size: 3.5px; }
    .muted { opacity: 0.65; }`;

export function renderAnimeCharacter(pose: Pose): string {
  return [
    renderAnimeBody(),
    renderAnimeFace(pose),
    renderAnimeEffect(pose.effect, pose.effectOpacity)
  ].filter(Boolean).join("\n      ");
}

export function renderAnimeBody(): string {
  return `<image href="${CHARACTER_IMAGE_HREF}" x="0" y="0" width="100" height="80" preserveAspectRatio="xMidYMid meet" class="character-image"/>`;
}

export function renderAnimeFace(pose: Pick<Pose, "eyes" | "mouth" | "brows" | "blushOpacity">): string {
  if (!isFaceOverlayActive(pose)) {
    return "";
  }

  const faceParts = [
    renderFaceCover(),
    renderAnimeBrows(pose.brows),
    renderAnimeEyes(pose.eyes),
    renderAnimeMouth(pose.mouth),
    `<ellipse cx="36.8" cy="38" rx="5.4" ry="2.1" class="blush-fill" opacity="${round(pose.blushOpacity)}"/>`,
    `<ellipse cx="63.2" cy="38" rx="5.4" ry="2.1" class="blush-fill" opacity="${round(pose.blushOpacity)}"/>`
  ].filter(Boolean).join("\n        ");

  return `<g class="anime-face" data-face-overlay="active">
        ${faceParts}
      </g>`;
}

export function isFaceOverlayActive(pose: Pick<Pose, "eyes" | "mouth" | "brows" | "blushOpacity">): boolean {
  return pose.eyes !== "dot"
    || pose.mouth !== "flat"
    || pose.brows !== "none"
    || pose.blushOpacity > 0.05;
}

function renderFaceCover(): string {
  return `<g class="face-cover">
          <ellipse cx="41.8" cy="31.6" rx="7.3" ry="4.9" class="face-patch"/>
          <ellipse cx="58.2" cy="31.6" rx="7.3" ry="4.9" class="face-patch"/>
          <ellipse cx="50" cy="39.9" rx="6" ry="3.3" class="face-patch"/>
        </g>`;
}

export function renderAnimeEyes(eyes: EyePose): string {
  switch (eyes) {
    case "dot":
      return `<ellipse cx="41.8" cy="31.6" rx="4.9" ry="5.8" class="eye-fill"/><ellipse cx="58.2" cy="31.6" rx="4.9" ry="5.8" class="eye-fill"/><circle cx="40.2" cy="29.2" r="1.1" class="eye-shine"/><circle cx="56.6" cy="29.2" r="1.1" class="eye-shine"/>`;
    case "happy_closed":
      return `<path d="M36.8 32.4q5 3.5 10 0M53.2 32.4q5 3.5 10 0" class="eye-line"/>`;
    case "half_closed":
      return `<ellipse cx="41.8" cy="32" rx="5" ry="1.35" class="eye-fill"/><ellipse cx="58.2" cy="32" rx="5" ry="1.35" class="eye-fill"/>`;
    case "sharp":
      return `<ellipse cx="41.8" cy="31.7" rx="5" ry="3" class="eye-fill" transform="rotate(12 41.8 31.7)"/><ellipse cx="58.2" cy="31.7" rx="5" ry="3" class="eye-fill" transform="rotate(-12 58.2 31.7)"/>`;
    case "wide":
      return `<ellipse cx="41.8" cy="31.4" rx="5.3" ry="6.5" class="eye-fill"/><ellipse cx="58.2" cy="31.4" rx="5.3" ry="6.5" class="eye-fill"/><circle cx="40.1" cy="28.7" r="1.25" class="eye-shine"/><circle cx="56.5" cy="28.7" r="1.25" class="eye-shine"/>`;
    case "sad":
      return `<ellipse cx="41.8" cy="32.2" rx="4.8" ry="3" class="eye-fill" transform="rotate(-12 41.8 32.2)"/><ellipse cx="58.2" cy="32.2" rx="4.8" ry="3" class="eye-fill" transform="rotate(12 58.2 32.2)"/>`;
    case "heart_like":
      return `<path d="M41.8 29.6c-1.8-3.2-5.8-1.6-5 1.7c.8 3 5 5.5 5 5.5s4.2-2.5 5-5.5c.8-3.3-3.2-4.9-5-1.7z" class="eye-heart"/><path d="M58.2 29.6c-1.8-3.2-5.8-1.6-5 1.7c.8 3 5 5.5 5 5.5s4.2-2.5 5-5.5c.8-3.3-3.2-4.9-5-1.7z" class="eye-heart"/>`;
  }
}

export function renderAnimeMouth(mouth: MouthPose): string {
  switch (mouth) {
    case "flat":
      return `<path d="M46 40.6h8" class="mouth-line"/>`;
    case "small_smile":
      return `<path d="M45 39.8q5 4 10 0" class="mouth-line"/>`;
    case "big_smile":
      return `<path d="M43 38.8q7 7 14 0" class="mouth-line"/>`;
    case "sad_curve":
      return `<path d="M45 42.2q5-4 10 0" class="mouth-line"/>`;
    case "zigzag":
      return `<path d="M44 40.7l3-2l3 2l3-2l3 2" class="mouth-line"/>`;
    case "tiny_open":
      return `<path d="M49 38.7q1-1 2 0q1 2 0 4q-1 1-2 0q-1-2 0-4z" class="mouth-line"/>`;
    case "surprised_o":
      return `<path d="M50 38.2a3 4 0 1 0 0.1 0" class="mouth-line"/>`;
    case "pout":
      return `<path d="M45 40.8q5-2 10 0" class="mouth-line"/>`;
  }
}

export function renderAnimeBrows(brows: BrowPose): string {
  switch (brows) {
    case "none":
      return "";
    case "soft":
      return `<path d="M37.2 25.7q4.6-2 9.2 0M53.6 25.7q4.6-2 9.2 0" class="brow-line" opacity="0.55"/>`;
    case "angry":
      return `<path d="M36.8 25l9.4 3M63.2 25l-9.4 3" class="brow-line"/>`;
    case "worried":
      return `<path d="M36.8 28.4l9.4-3M53.8 25.4l9.4 3" class="brow-line"/>`;
    case "raised":
      return `<path d="M37.2 23.5q4.6-2 9.2 0M53.6 23.5q4.6-2 9.2 0" class="brow-line"/>`;
  }
}

export function renderAnimeEffect(effect: EffectName, opacity: number): string {
  if (effect === "none" || opacity <= 0) {
    return "";
  }

  const prefix = `<g opacity="${round(opacity)}">`;
  const suffix = "</g>";

  switch (effect) {
    case "hearts":
      return `${prefix}<path d="M67 22c-2-4-8-2-6 3c1 3 6 6 6 6s5-3 6-6c2-5-4-7-6-3z" class="effect-fill"/>${suffix}`;
    case "sparkles":
      return `${prefix}<path d="M64 19v10M59 24h10M69 16v6M66 19h6" class="effect-line"/>${suffix}`;
    case "tears":
      return `${prefix}<path d="M39 35c-2.8 4.8-1.8 7.5 1 7.5s3.6-2.7-1-7.5z" class="effect-tear"/><path d="M60 35c-2.8 4.8-1.8 7.5 1 7.5s3.6-2.7-1-7.5z" class="effect-tear"/>${suffix}`;
    case "zzz":
      return `${prefix}<text x="66" y="20" class="effect-symbol">Zz</text>${suffix}`;
    case "question":
      return `${prefix}<text x="67" y="26" class="effect-symbol">?</text>${suffix}`;
    case "anger":
      return `${prefix}<path d="M65 20l4 5M70 20l-4 5" class="effect-line"/>${suffix}`;
  }
}

export function renderAnimeSpeechBubble(reply: string): string {
  const clippedReply = [...reply].slice(0, 18).join("");

  return `<g class="bubble-group">
        <rect x="20" y="4" width="60" height="13" rx="4" class="bubble"/>
        <path d="M45 17l5 4l3-4" class="bubble-tail"/>
        <text x="24" y="13">${escapeSvgText(clippedReply)}</text>
      </g>`;
}

function escapeSvgText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
