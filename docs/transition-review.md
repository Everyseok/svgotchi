# SVGotchi Deterministic Transition Review

Status: Current deterministic transition preview for exact uploaded PNG character
Last updated: 2026-06-19 Asia/Seoul

## Scope

The transition renderer implements deterministic multi-frame emotion transitions for the image-backed uploaded character and the 30-emotion pose map. The visible character body is `assets/1.png`. The model/planner boundary remains narrow: model evidence is mapped into sanitized app-owned transition fields, and the model does not write SVG, selectors, path data, image paths, CSS, JavaScript, animation code, or pet reply text.

The visual direction remains:

- dark SVG background
- exact uploaded character pixels from `assets/1.png`
- SVG primitives only
- deterministic frames from typed pose parameters
- no LLM-generated SVG, selectors, path data, or animation code
- no LLM-generated pet reply text or reply style

Transition preview:

![5 sample transition previews](../assets/transition-previews/stage-04-sample-transitions.svg)

## Files

- `src/engine/easing.ts`
- `src/engine/frameScheduler.ts`
- `src/engine/interpolation.ts`
- `src/engine/poseResolver.ts`
- `src/engine/transitionEngine.ts`
- `src/engine/transitionSamples.ts`
- `src/render/animeRig.ts`
- `src/render/effects.ts`
- `src/render/bubble.ts`
- `src/render/renderer.ts`
- `assets/transition-previews/stage-04-sample-transitions.svg`
- `tests/transitionEngine.test.ts`

## Transition Model

The transition engine resolves a `from` emotion and a `to` emotion into primitive `Pose` values, interpolates numeric pose fields across a bounded frame schedule, applies a deterministic easing curve, and adds a named motion overlay. Discrete facial features switch at fixed progress thresholds so the preview remains deterministic instead of trying to morph arbitrary SVG path data.

The current transition configuration surface is intentionally narrow:

- `from`
- `to`
- `durationMs`
- `fps`
- `easing`
- `motion`
- `effect`
- `blush`

This is the later local planner boundary: a model may eventually choose a sanitized transition plan, but it will not be allowed to write raw SVG, animation code, or pet reply text. The preview speech bubble copy is owned by the app/sample fixture through `previewReply`; it is not part of `TransitionConfig` or future LLM output.

## Required Sample Transitions

| Sample | Duration | FPS | Easing | Motion | Effect | Preview Reply |
|---|---:|---:|---|---|---|---|
| `neutral -> shy_love` | 900ms | 6 | `ease_out` | `tiny_bounce` | `hearts` | `eep...` |
| `neutral -> hungry` | 800ms | 6 | `ease_in` | `sway` | `question` | `snack?` |
| `neutral -> sleepy` | 1000ms | 5 | `linear` | `none` | `zzz` | `zzz...` |
| `neutral -> hurt` | 850ms | 6 | `ease_out` | `shake` | `tears` | `ow...` |
| `neutral -> curious` | 750ms | 6 | `overshoot` | `sway` | `question` | `hmm?` |

The preview SVG samples five frames from each transition: start, 25%, 50%, 75%, and final. The generated preview therefore contains 25 visible transition frame groups.

## Validation Summary

Verification command:

```powershell
npm run verify
```

Current result:

- typecheck passed
- browser script syntax check passed
- 37 baseline tests passed
- required transition samples generate multiple frames
- transition endpoints include first and final progress states
- preview asset matches renderer output exactly
- preview includes all five required transitions
- preview uses `/assets/1.png` for every sampled transition frame
- preview has no remote image href, data URI image href, or `foreignObject`

Additional current checks:

- `data-transition` group count: 25
- unique transitions: `neutral->shy_love`, `neutral->hungry`, `neutral->sleepy`, `neutral->hurt`, `neutral->curious`
- served SVG demo/full probes passed for `you are cute -> shy_love`
- local browser-side classifier import probe passed
