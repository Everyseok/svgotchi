# SVGotchi Neutral Base Review

Status: Current pure SVG anime companion base
Last updated: 2026-06-19 Asia/Seoul

## Current Concept Applied

Selected concept: pure SVG anime companion

Reference inputs:

- `assets/1.png` through `assets/6.png` informed the visual identity.
- The runtime does not load those PNG files.
- The shipped character is composed from inline SVG paths, ellipses, groups, text, and style rules.

Runtime visual direction:

- dark SVG canvas
- pale lavender/white hair
- purple eyes
- soft blush
- pastel outfit/accent marks
- pure SVG prompt area

Neutral base SVG:

![Neutral anime companion](../assets/base-character.svg)

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
- body box: `x=18 y=9 width=64 height=68`

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
- no runtime `<image>`
- no `foreignObject`
- no `href`-loaded external asset
- expected anime palette tokens

Verification command:

```powershell
npm run verify
npm run verify:runtime
```

Current result:

- typecheck passed
- browser script syntax check passed
- 37 baseline tests passed
- served SVG demo/full probes passed
- local browser-side classifier import probe passed
