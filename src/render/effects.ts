import type { EffectName } from "../emotion/poseMap.ts";

export function renderEffect(effect: EffectName, opacity: number): string {
  if (effect === "none" || opacity <= 0) {
    return "";
  }

  const open = `<g opacity="${round(opacity)}">`;
  const close = "</g>";

  switch (effect) {
    case "hearts":
      return `${open}<path d="M52 20h2v-2h3v2h2v3h-2v2h-3v-2h-2z" class="fill"/>${close}`;
    case "sparkles":
      return `${open}<path d="M54 18v8M50 22h8" class="thin"/>${close}`;
    case "tears":
      return `${open}<rect x="28" y="40" width="2" height="5" class="fill"/><rect x="50" y="40" width="2" height="5" class="fill"/>${close}`;
    case "zzz":
      return `${open}<text x="54" y="19">Z</text>${close}`;
    case "question":
      return `${open}<text x="55" y="23">?</text>${close}`;
    case "anger":
      return `${open}<path d="M54 18l4 4M58 18l-4 4" class="thin"/>${close}`;
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
