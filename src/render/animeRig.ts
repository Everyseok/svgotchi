import type { BrowPose, EffectName, EyePose, MouthPose, Pose } from "../emotion/poseMap.ts";

export const ANIME_PREVIEW_STYLE = `    .bg { fill: #140f1f; }
    .frame { fill: none; stroke: #5f4a7d; stroke-width: 1; }
    .hair-back { fill: #e5dcfb; stroke: #b89bd3; stroke-width: 1.3; }
    .hair-shadow { fill: #cbb5ea; opacity: 0.78; }
    .hair-front { fill: #f8f3ff; stroke: #b89bd3; stroke-width: 1.1; }
    .skin { fill: #ffe1df; stroke: #d69aa5; stroke-width: 1.1; }
    .skin-soft { fill: #f4bec8; opacity: 0.42; }
    .outfit { fill: #6f54a8; stroke: #3b285a; stroke-width: 1.1; }
    .outfit-light { fill: #cdb9ff; stroke: #6f54a8; stroke-width: 0.8; }
    .accent { fill: #ff9fc1; stroke: #9a5f83; stroke-width: 0.8; }
    .eye-fill { fill: #7d4fc3; stroke: #34204d; stroke-width: 0.9; }
    .eye-line { stroke: #7d4fc3; stroke-width: 1.6; stroke-linecap: round; fill: none; }
    .eye-shine { fill: #fffaf8; opacity: 0.88; }
    .brow-line { stroke: #65426d; stroke-width: 1.2; stroke-linecap: round; fill: none; }
    .mouth-line { stroke: #8f4d67; stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; fill: none; }
    .blush-fill { fill: #f59ab1; }
    .effect-fill { fill: #ff7dac; }
    .effect-tear { fill: #7ed8ff; }
    .effect-line { stroke: #ffe889; stroke-width: 1.2; stroke-linecap: round; fill: none; }
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
  return `<g class="anime-body">
        <g>
          <path d="M24 32c1-16 12-26 26-26s25 10 26 26c2 12 4 28 1 42c-8 5-17 5-27 5s-19 0-27-5c-3-14-1-30 1-42z" class="hair-back"/>
          <path d="M20 42c0-12 7-23 17-30c-5 17-5 40-2 64c-8-5-13-17-15-34z" class="hair-shadow"/>
          <path d="M80 42c0-12-7-23-17-30c5 17 5 40 2 64c8-5 13-17 15-34z" class="hair-shadow"/>
        </g>
        <g>
          <path d="M34 66c2-7 8-11 16-11s14 4 16 11l7 13H27z" class="outfit"/>
          <path d="M42 59h16l-4 14h-8z" class="outfit-light"/>
          <path d="M43 61l7 5l7-5" class="mouth-line"/>
          <circle cx="50" cy="68" r="2.4" class="accent"/>
        </g>
        <g>
          <path d="M31 31c0-14 8-23 19-23s19 9 19 23v12c0 14-8 22-19 22s-19-8-19-22z" class="skin"/>
          <path d="M42 60c3 2 13 2 16 0v9c-5 3-11 3-16 0z" class="skin"/>
          <ellipse cx="50" cy="48" rx="14" ry="8" class="skin-soft"/>
        </g>
        <g>
          <path d="M26 33c2-15 12-27 25-27c12 0 22 11 24 27c-5-6-10-10-16-12c-3 9-11 14-22 17c1-5 0-10-1-14c-4 4-7 7-10 9z" class="hair-front"/>
          <path d="M30 31c-5 8-5 26 1 41c2-13 4-25 9-37z" class="hair-front"/>
          <path d="M70 31c5 8 5 26-1 41c-2-13-4-25-9-37z" class="hair-front"/>
          <path d="M43 10c-2 10-7 17-15 21c5-11 10-18 15-21z" class="hair-front"/>
          <path d="M55 10c1 10 6 17 15 21c-5-11-10-18-15-21z" class="hair-front"/>
          <path d="M68 20l5-5l3 6l-6 3z" class="accent"/>
          <circle cx="69" cy="24" r="2" class="outfit-light"/>
        </g>
      </g>`;
}

export function renderAnimeFace(pose: Pick<Pose, "eyes" | "mouth" | "brows" | "blushOpacity">): string {
  const faceParts = [
    renderAnimeBrows(pose.brows),
    renderAnimeEyes(pose.eyes),
    renderAnimeMouth(pose.mouth),
    `<ellipse cx="37.5" cy="49" rx="5.3" ry="2.5" class="blush-fill" opacity="${round(pose.blushOpacity)}"/>`,
    `<ellipse cx="62.5" cy="49" rx="5.3" ry="2.5" class="blush-fill" opacity="${round(pose.blushOpacity)}"/>`
  ].filter(Boolean).join("\n        ");

  return `<g class="anime-face">
        ${faceParts}
      </g>`;
}

export function renderAnimeEyes(eyes: EyePose): string {
  switch (eyes) {
    case "dot":
      return `<ellipse cx="42" cy="39" rx="4.6" ry="6" class="eye-fill"/><ellipse cx="58" cy="39" rx="4.6" ry="6" class="eye-fill"/><circle cx="40.4" cy="36.7" r="1.4" class="eye-shine"/><circle cx="56.4" cy="36.7" r="1.4" class="eye-shine"/>`;
    case "happy_closed":
      return `<path d="M37 39q5 4 10 0M53 39q5 4 10 0" class="eye-line"/>`;
    case "half_closed":
      return `<ellipse cx="42" cy="40" rx="4.8" ry="1.4" class="eye-fill"/><ellipse cx="58" cy="40" rx="4.8" ry="1.4" class="eye-fill"/>`;
    case "sharp":
      return `<ellipse cx="42" cy="39" rx="4.9" ry="3.2" class="eye-fill" transform="rotate(12 42 39)"/><ellipse cx="58" cy="39" rx="4.9" ry="3.2" class="eye-fill" transform="rotate(-12 58 39)"/>`;
    case "wide":
      return `<ellipse cx="42" cy="39" rx="5.2" ry="7" class="eye-fill"/><ellipse cx="58" cy="39" rx="5.2" ry="7" class="eye-fill"/><circle cx="40.1" cy="36.1" r="1.5" class="eye-shine"/><circle cx="56.1" cy="36.1" r="1.5" class="eye-shine"/>`;
    case "sad":
      return `<ellipse cx="42" cy="40" rx="4.7" ry="3" class="eye-fill" transform="rotate(-12 42 40)"/><ellipse cx="58" cy="40" rx="4.7" ry="3" class="eye-fill" transform="rotate(12 58 40)"/>`;
    case "heart_like":
      return `<path d="M42 37c-2-4-7-2-6 2c1 4 6 7 6 7s5-3 6-7c1-4-4-6-6-2z" class="effect-fill"/><path d="M58 37c-2-4-7-2-6 2c1 4 6 7 6 7s5-3 6-7c1-4-4-6-6-2z" class="effect-fill"/>`;
  }
}

export function renderAnimeMouth(mouth: MouthPose): string {
  switch (mouth) {
    case "flat":
      return `<path d="M46 53h8" class="mouth-line"/>`;
    case "small_smile":
      return `<path d="M45 52q5 4 10 0" class="mouth-line"/>`;
    case "big_smile":
      return `<path d="M43 51q7 7 14 0" class="mouth-line"/>`;
    case "sad_curve":
      return `<path d="M45 55q5-4 10 0" class="mouth-line"/>`;
    case "zigzag":
      return `<path d="M44 53l3-2l3 2l3-2l3 2" class="mouth-line"/>`;
    case "tiny_open":
      return `<path d="M49 51q1-1 2 0q1 2 0 4q-1 1-2 0q-1-2 0-4z" class="mouth-line"/>`;
    case "surprised_o":
      return `<path d="M50 50a3 4 0 1 0 0.1 0" class="mouth-line"/>`;
    case "pout":
      return `<path d="M45 53q5-2 10 0" class="mouth-line"/>`;
  }
}

export function renderAnimeBrows(brows: BrowPose): string {
  switch (brows) {
    case "none":
      return "";
    case "soft":
      return `<path d="M38 33q4-2 8 0M54 33q4-2 8 0" class="brow-line" opacity="0.55"/>`;
    case "angry":
      return `<path d="M37 32l9 3M63 32l-9 3" class="brow-line"/>`;
    case "worried":
      return `<path d="M37 35l9-3M54 32l9 3" class="brow-line"/>`;
    case "raised":
      return `<path d="M38 30q4-2 8 0M54 30q4-2 8 0" class="brow-line"/>`;
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
      return `${prefix}<path d="M38 44c-3 5-2 8 1 8s4-3-1-8z" class="effect-tear"/><path d="M61 44c-3 5-2 8 1 8s4-3-1-8z" class="effect-tear"/>${suffix}`;
    case "zzz":
      return `${prefix}<text x="66" y="20">Z</text>${suffix}`;
    case "question":
      return `${prefix}<text x="66" y="26">?</text>${suffix}`;
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
