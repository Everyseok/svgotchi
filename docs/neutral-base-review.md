# SVGotchi Neutral Base Review

Status: Stage 1 neutral base SVG and rig contract for user review
Last updated: 2026-06-17 02:49:03 Asia/Seoul

## Approved Concept Applied

Selected concept: Mochi Sprout

User visual constraint:

- black canvas
- white-only visible character and UI marks
- no color palette beyond black and white

Revision note:

- The top sprout/head shape was adjusted after user feedback so it connects to the body instead of visually overlapping the face area.

Neutral base SVG:

![Neutral Mochi Sprout](../assets/base-character.svg)

## Files

- `assets/base-character.svg`
- `src/character/characterContract.ts`
- `src/character/requiredRigIds.ts`
- `src/character/baseCharacter.ts`
- `src/character/rig.ts`
- `src/character/validateCharacterRig.ts`
- `tests/characterContract.test.ts`
- `tests/validateCharacterRig.test.ts`

## Rig Contract Summary

The neutral base uses `viewBox="0 0 100 100"`.

Layout:

- pet area: `x=0 y=0 width=100 height=80`
- prompt area: `x=0 y=81 width=100 height=19`
- body box: `x=30 y=18 width=40 height=44`

The SVG includes every required rig ID:

- `svgotchi-root`
- `pet-area`
- `prompt-area`
- `pet`
- `body`
- `face`
- `eye-left`
- `eye-right`
- `brow-left`
- `brow-right`
- `mouth`
- `blush-left`
- `blush-right`
- `effect-hearts`
- `effect-tears`
- `effect-zzz`
- `effect-sparkles`
- `effect-question`
- `effect-anger`
- `speech-bubble`
- `prompt-bg`
- `prompt-placeholder`
- `prompt-text`
- `prompt-caret`
- `send-zone`
- `send-label`

All optional emotion/effect layers exist in the base SVG and are hidden by default where appropriate.

## Validation Summary

Validation implemented:

- required `viewBox`
- required rig ID presence
- duplicate SVG ID rejection
- pet area coordinate contract
- prompt area coordinate contract
- body box coordinate contract
- black/white-only color literal test

Verification command:

```powershell
npm run verify
```

Result:

- typecheck passed
- 10 tests passed
- base SVG XML parse passed
- black/white-only color literal check passed

## User Decision Required

Approve or reject the neutral base SVG and rig contract before Stage 2 begins.

No 30-emotion pose sheet work should begin until this neutral base and rig contract are explicitly approved.
