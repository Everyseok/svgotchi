# SVGotchi Neutral Base Review

Status: Current exact uploaded PNG character base
Last updated: 2026-06-19 Asia/Seoul

## Current Concept Applied

Selected concept: exact uploaded PNG character inside an SVG app shell

Reference inputs:

- `assets/1.png` is the active composed character image.
- `assets/2.png` through `assets/6.png` remain reference layers and are not runtime dependencies.
- The shipped character body is rendered by an SVG `<image>` element that points at `/assets/1.png`.

Runtime visual direction:

- dark SVG canvas
- exact uploaded character pixels from `assets/1.png`
- pure SVG prompt area

Neutral base SVG:

![Neutral uploaded character](../assets/base-character.svg)

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
- body box: `x=10 y=0 width=80 height=80`

The SVG includes every required rig ID:

- `svgotchi-root`
- `pet-area`
- `prompt-area`
- `pet`
- `character-image`
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
- exactly one approved runtime `<image>` for `/assets/1.png`
- no `foreignObject`
- no remote or data URI image href

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
