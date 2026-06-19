# PNG-Preserving Anime Character Overlay Rig

Status: historical proposal; not the active implementation path
Last updated: 2026-06-19 Asia/Seoul

Note: The active runtime now uses `assets/1.png` as the exact visible character inside the SVG app shell. This PNG-preserving overlay rig for separate expression layers is retained as historical design context only.

## Purpose

This document defines a proposed replacement character rig contract for the current Mochi Sprout primitive SVG rig. The proposal preserves the uploaded/generated anime PNG as the visual base and applies expression changes only through approved overlay layers above that base.

This is not an implementation plan for the current Stage 1-4 code. It is a review contract. No existing Stage 1-4 implementation, transition engine, `src/llm`, or `dist` output should change until Gate X is explicitly approved by the user.

## Hard Contract

- Preserve the uploaded PNG character visually as the base image.
- Do not vector-trace, redraw, repaint, regenerate, or pixel-edit the uploaded PNG.
- Embed the PNG as an immutable base layer.
- Implement expression changes through overlay rig layers above the PNG.
- Keep the model boundary as `TransitionPlan` only.
- Do not let the model output reply text.
- Do not let the model output raw SVG, path data, JavaScript, CSS, DOM selectors, DOM patches, or arbitrary overlay definitions.
- Do not let the model choose arbitrary overlay assets.
- The app maps sanitized enum values to approved overlay assets.
- Complex emotion is represented as primary emotion plus optional accent emotion.

## Source Asset Assumption

The current workspace contains `assets/1.png`, `assets/2.png`, `assets/3.png`, `assets/4.png`, `assets/5.png`, `assets/6.png`, and `assets/rumimatepng.png`, all 1254 by 1254 pixels.

The user described the likely layer meaning as:

| Asset | User-described role | Proposed treatment |
|---|---|---|
| `assets/2.png` | base body/face frame | immutable source layer candidate |
| `assets/3.png` | hair | immutable source layer candidate |
| `assets/4.png` | eyes | immutable source layer candidate |
| `assets/5.png` | mouth | immutable source layer candidate |
| `assets/6.png` | blush | immutable source layer candidate |
| `assets/1.png` or `assets/rumimatepng.png` | composed character candidate | candidate for required `base-png` image |

Gate X must decide whether the release rig uses a single fully composed PNG as `base-png`, or a layer-preserving immutable base stack built from the original 2-6 PNG layers. The single-image path best matches the existing "one base PNG" rule. The layer-preserving path gives better blink and mouth results because the app can place eyelid and mouth overlays between face, eyes, mouth, blush, and hair without editing pixels. Either path must keep the original PNG pixels immutable.

## Base Layer Contract

Required base layer:

| Field | Value |
|---|---|
| id | `base-png` |
| source | uploaded/generated character PNG selected by user approval |
| placement | `x=0 y=0 width=100 height=100` in normalized SVG coordinates |
| viewBox | `0 0 100 100` |
| rule | immutable visual base; never mutate image pixels |

For strict single-image mode, `base-png` is one SVG `<image>` element. For layer-preserving mode, `base-png` may be a stable base container whose children are immutable original PNG layer images, but that is a Gate X decision because it changes the literal base-layer structure.

## Coordinate Contract

All coordinates are normalized to `viewBox="0 0 100 100"`. Estimates are derived from visual inspection of the current PNG assets and must be manually reviewed before implementation. A coordinate marked safe to animate means the overlay attached to that anchor may be animated; it does not permit moving or mutating the base PNG.

| Anchor | Initial x/y estimate | Visual feature target | Confidence | Manual user review | Safely animated |
|---|---:|---|---|---|---|
| `faceBox` | `x=31 y=28 w=38 h=26` | visible face area under bangs, around both eyes, cheeks, and mouth | medium | yes | yes, as debug box only |
| `eyeLeft` | `x=39 y=40` | viewer-left iris center | high | yes | yes, overlay only |
| `eyeRight` | `x=59 y=40` | viewer-right iris center | high | yes | yes, overlay only |
| `browLeft` | `x=39 y=31` | viewer-left brow/upper eyelid region, partly hidden by bangs | medium | yes | yes, small overlay only |
| `browRight` | `x=59 y=31` | viewer-right brow/upper eyelid region, partly hidden by bangs | medium | yes | yes, small overlay only |
| `mouth` | `x=50 y=49` | tiny original mouth near lower face center | high | yes | yes, primary expression overlay |
| `blushLeft` | `x=38 y=45` | viewer-left cheek blush area | high | yes | yes |
| `blushRight` | `x=61 y=45` | viewer-right cheek blush area | high | yes | yes |
| `tearLeft` | `x=36 y=43` | lower outer edge of viewer-left eye | medium | yes | yes |
| `tearRight` | `x=63 y=43` | lower outer edge of viewer-right eye | medium | yes | yes |
| `sweat` | `x=67 y=35` | upper-right face or hair-adjacent stress marker | medium-low | yes | yes |
| `anger` | `x=66 y=33` | upper-right face/hair side anger mark | medium-low | yes | yes |
| `question` | `x=70 y=28` | upper-right head-space question mark | medium | yes | yes |
| `zzz` | `x=72 y=22` | upper-right outside head for sleep marker | medium | yes | yes |
| `heartOrigin` | `x=72 y=37` | right-side open visual space near face, avoiding existing hair detail | medium-low | yes | yes |
| `sparkleOrigin` | `x=67 y=27` | upper-right hair/face edge sparkle origin | medium | yes | yes |
| `speechBubble` | `x=50 y=86` | lower overlay region above prompt/runtime UI, if used | low | yes | yes |

The existing `assets/rumimatepng.png` includes a visible heart on the viewer-left side. That heart must be treated as part of the immutable base if this file is chosen as `base-png`. New dynamic heart effects should use `heartOrigin` unless the user approves reusing the left-side open space.

## Required Overlay Groups

The normalized rig must expose these stable IDs. They are not model-controlled names; they are app-owned slots.

| Group id | Role | Layer order |
|---|---|---:|
| `base-character` | root character visual group inside the pet area | 0 |
| `base-png` | immutable uploaded/generated PNG base image or approved immutable base container | 1 |
| `face-occluders` | skin-toned or style-matched masks used above the base for mouth patches and blink eyelids | 2 |
| `mouth-overlays` | approved mouth expression overlays | 3 |
| `eye-overlays` | approved eye expression overlays, including blink eyelids | 4 |
| `brow-overlays` | approved brow overlays | 5 |
| `blush-overlays` | approved blush overlays | 6 |
| `expression-overlays` | parent group for mouth, eye, brow, and blush overlay groups | 7 |
| `effect-overlays` | parent group for transient emotion effects | 8 |
| `effect-hearts` | heart effects | 9 |
| `effect-sparkles` | sparkle effects | 10 |
| `effect-tears` | tear effects | 11 |
| `effect-zzz` | sleep effects | 12 |
| `effect-question` | question/confusion effects | 13 |
| `effect-anger` | anger/frustration effects | 14 |
| `effect-sweat` | sweat/stress effects | 15 |
| `effect-food` | hunger/food effects | 16 |
| `speech-bubble` | app-owned bubble slot, still not model-generated reply text | 17 |
| `debug-anchors` | development-only anchor visualization, hidden in final unless debug mode is approved | 99 |

The group structure should remain stable across emotions. Overlays may change visibility, opacity, transform, and app-owned enum-selected asset references, but the model must never create, remove, or name DOM nodes.

## Occlusion Strategy

Mouth:

- Mouth patching is allowed and expected for the first release because the original mouth is tiny and emotion readability depends on it.
- Mouth occlusion must be localized around the mouth anchor.
- Mouth patches must visually match nearby skin tone and be approved in preview before full release.
- The base PNG pixels must not be edited; the patch is an overlay above the PNG.

Eyes:

- The user's latest direction requires continuous human-like blinking. Therefore blink-oriented eye occlusion is a release requirement, not an optional MVP feature.
- Blink must be implemented as a deterministic overlay timeline controlled by the app, not by the model.
- Blink overlays should use eyelid/skin-toned occluders and optionally a closed-lid stroke above each eye.
- The original PNG eye pixels remain immutable. The blink covers them temporarily and then reveals them again.
- Strong emotional eye changes, such as persistent closed eyes, heart eyes, or fully masked angry/sad eye shapes, remain visually risky and must be previewed before approval.
- Existing PNG eyes should remain visible for neutral/open states. Eye masking should not replace the whole eye by default except during blink frames or explicitly approved emotion overlays.

Layered source note:

- If the 2-6 source PNGs are approved as an immutable base stack, the preferred blink order is body/face, blink occluder, eye overlay or original eye layer, hair/front bang layer as needed.
- If only a single composed PNG is approved, blink still works but eyelid patches may appear above hair strands or lashes unless carefully shaped.

## Blink Contract

Blink is a separate physiological overlay timeline from emotion transitions.

Required behavior:

- Blink is deterministic and app-owned.
- Blink cadence should feel human-like, with a closed state lasting only a short part of the cycle.
- Blink must run for neutral and every emotion unless a later accessibility or reduced-motion option disables it.
- Blink must not be selected or parameterized by the model.
- Blink must not change `TransitionPlan`.
- Blink should compose with emotion overlays. For example, `shy_love` can use `eye-soft-lid` as the emotional overlay while the blink occluder still briefly closes the eyes.

Preview requirement:

- Every Gate X preview should include at least one static open-eye frame and one blink/closed-frame check for visual seams.
- Strong eye overlays should be reviewed separately from ordinary blink frames.

## Overlay Asset Taxonomy

The approved asset taxonomy is closed. The model may only select enum values that the app maps to these assets. The app may also ignore or downgrade enum values when confidence is low or when an overlay has not been approved.

### Mouth Overlays

- `mouth-neutral`
- `mouth-small-smile`
- `mouth-big-smile`
- `mouth-pout`
- `mouth-tiny-open`
- `mouth-surprised-o`
- `mouth-sad-curve`
- `mouth-zigzag`
- `mouth-wavy`

### Eye Overlays

- `eye-extra-highlight`
- `eye-sparkle`
- `eye-soft-lid`
- `eye-sad-lid`
- `eye-angry-lid`
- `eye-heart-glint`
- `eye-dim`
- `eye-closed-arc`, risky for persistent emotion poses; allowed only as a reviewed blink/closed-eye asset

### Brow Overlays

- `brow-soft`
- `brow-worried`
- `brow-angry`
- `brow-raised`
- `brow-flat`

### Blush Overlays

- `blush-soft`
- `blush-strong`
- `blush-shy-lines`
- `blush-hot`

### Effect Overlays

- `hearts`
- `sparkles`
- `tears`
- `zzz`
- `question`
- `anger`
- `sweat`
- `food`
- `dots`
- `music`
- `none`, app-owned no-effect sentinel

## Emotion Overlay Mapping

Table notes:

- `occludeEyes=yes` means the mandatory blink occluder is active for that emotion. Rows with a high eye risk also need emotion-specific eye preview beyond ordinary blink.
- `occludeMouth=yes` means the original mouth is covered by a local mouth patch before the mouth overlay is drawn.
- `accent behavior` is limited to effect, blush, and minor intensity changes. It must not replace the primary face.

| Emotion | Mouth overlay | Eye overlay | Brow overlay | Blush overlay | Effect overlay | occludeMouth | occludeEyes | baseMotion | intensity range | Primary emotion behavior | Allowed accent emotion behavior | Visual risk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `neutral` | `mouth-neutral` | `eye-extra-highlight` | `brow-flat` | `none` | `none` | no | yes | `none` | `0.0-0.2` | preserve original calm face with only blink active | tiny sparkle or soft blush at very low opacity | low |
| `happy` | `mouth-big-smile` | `eye-soft-lid` | `brow-soft` | `blush-soft` | `sparkles` | yes | yes | `tiny_bounce` | `0.4-0.8` | readable smile plus softened eyes | sparkles, soft blush, or tiny hearts | medium |
| `excited` | `mouth-big-smile` | `eye-sparkle` | `brow-raised` | `blush-soft` | `sparkles` | yes | yes | `hop` | `0.7-1.0` | energetic smile, raised brows, brighter eyes | music or extra sparkles only | medium |
| `proud` | `mouth-small-smile` | `eye-soft-lid` | `brow-raised` | `blush-soft` | `sparkles` | yes | yes | `tiny_bounce` | `0.4-0.8` | composed smile with lifted brow | small sparkle or soft blush | medium |
| `playful` | `mouth-zigzag` | `eye-sparkle` | `brow-soft` | `blush-soft` | `dots` | yes | yes | `sway` | `0.4-0.9` | cheeky mouth and side energy | music or sparkles at low opacity | medium |
| `love` | `mouth-big-smile` | `eye-heart-glint` | `brow-soft` | `blush-strong` | `hearts` | yes | yes | `tiny_bounce` | `0.7-1.0` | strong affection without replacing full eyes | stronger hearts or blush only | medium-high |
| `shy_love` | `mouth-small-smile` | `eye-soft-lid` | `brow-worried` | `blush-shy-lines` | `hearts` | yes | yes | `sway` | `0.5-0.9` | shy smile, softened eyes, heavy blush | hearts or blush intensity only | medium |
| `comforted` | `mouth-small-smile` | `eye-soft-lid` | `brow-soft` | `blush-soft` | `sparkles` | yes | yes | `none` | `0.3-0.7` | relaxed warm expression | soft sparkles or blush | low-medium |
| `attached` | `mouth-small-smile` | `eye-extra-highlight` | `brow-soft` | `blush-strong` | `hearts` | yes | yes | `tiny_bounce` | `0.4-0.8` | calm affection while preserving eyes | small hearts or blush | medium |
| `sad` | `mouth-sad-curve` | `eye-sad-lid` | `brow-worried` | `none` | `tears` | yes | yes | `none` | `0.4-0.9` | downturned mouth and wet eyes | low tears or dimming only | medium |
| `lonely` | `mouth-neutral` | `eye-dim` | `brow-worried` | `none` | `tears` | no | yes | `sway` | `0.3-0.8` | quiet dimmed expression | dots or low tears | medium |
| `disappointed` | `mouth-sad-curve` | `eye-dim` | `brow-worried` | `none` | `dots` | yes | yes | `none` | `0.3-0.7` | small downturn, dim eyes | low dots only | low-medium |
| `hurt` | `mouth-zigzag` | `eye-sad-lid` | `brow-worried` | `none` | `tears` | yes | yes | `shake` | `0.5-1.0` | pained mouth, worried brow, tears | tears or sweat only | high |
| `angry` | `mouth-zigzag` | `eye-angry-lid` | `brow-angry` | `none` | `anger` | yes | yes | `shake` | `0.6-1.0` | tense face with angry brow and lid | anger mark or sweat only | high |
| `annoyed` | `mouth-neutral` | `eye-angry-lid` | `brow-angry` | `none` | `anger` | no | yes | `sway` | `0.3-0.7` | mild narrowed-eye irritation | dots or small anger mark | medium-high |
| `jealous` | `mouth-pout` | `eye-angry-lid` | `brow-worried` | `blush-soft` | `anger` | yes | yes | `sway` | `0.4-0.8` | pout with side tension | small hearts or anger mark, not both at full intensity | high |
| `scared` | `mouth-tiny-open` | `eye-extra-highlight` | `brow-worried` | `none` | `sweat` | yes | yes | `sway` | `0.5-1.0` | small open mouth and stress markers | sweat or tears only | medium |
| `nervous` | `mouth-zigzag` | `eye-soft-lid` | `brow-worried` | `blush-soft` | `sweat` | yes | yes | `shake` | `0.3-0.8` | trembling mouth with worried brow | question or sweat at low opacity | medium |
| `surprised` | `mouth-surprised-o` | `eye-extra-highlight` | `brow-raised` | `none` | `question` | yes | yes | `hop` | `0.5-1.0` | open mouth and raised brow | sweat or sparkles only | medium |
| `confused` | `mouth-tiny-open` | `eye-soft-lid` | `brow-raised` | `none` | `question` | yes | yes | `sway` | `0.3-0.8` | questioning expression with small mouth | dots or question intensity | low-medium |
| `sleepy` | `mouth-neutral` | `eye-closed-arc` | `brow-flat` | `none` | `zzz` | no | yes | `none` | `0.4-1.0` | droopy/closed-eye sleep signal plus blink cadence | zzz intensity only | high |
| `hungry` | `mouth-tiny-open` | `eye-dim` | `brow-worried` | `none` | `food` | yes | yes | `sway` | `0.4-0.9` | small open mouth and food cue | question or food only | medium |
| `tired` | `mouth-sad-curve` | `eye-dim` | `brow-flat` | `none` | `zzz` | yes | yes | `none` | `0.3-0.8` | dim eyes and low energy | dots or zzz at low opacity | medium |
| `sick` | `mouth-wavy` | `eye-dim` | `brow-worried` | `blush-hot` | `sweat` | yes | yes | `sway` | `0.4-0.9` | wavy mouth, hot blush, stress marker | sweat or dots only | medium-high |
| `curious` | `mouth-small-smile` | `eye-extra-highlight` | `brow-raised` | `none` | `question` | yes | yes | `sway` | `0.3-0.8` | attentive eyes and small smile | sparkles or question at low opacity | low-medium |
| `thinking` | `mouth-tiny-open` | `eye-soft-lid` | `brow-raised` | `none` | `dots` | yes | yes | `sway` | `0.3-0.7` | thoughtful small mouth and soft lid | question or dots only | low-medium |
| `bored` | `mouth-neutral` | `eye-dim` | `brow-flat` | `none` | `dots` | no | yes | `none` | `0.2-0.6` | low-energy dim expression | zzz or dots only | low |
| `grateful` | `mouth-small-smile` | `eye-soft-lid` | `brow-soft` | `blush-soft` | `sparkles` | yes | yes | `tiny_bounce` | `0.4-0.8` | gentle smile and warm blush | sparkles or hearts at low opacity | low-medium |
| `apologetic` | `mouth-small-smile` | `eye-sad-lid` | `brow-worried` | `blush-soft` | `tears` | yes | yes | `none` | `0.3-0.8` | small uneasy smile with worried brow | tears or blush only | medium |
| `sulky` | `mouth-pout` | `eye-angry-lid` | `brow-angry` | `blush-soft` | `anger` | yes | yes | `sway` | `0.3-0.8` | pout and mild anger | dots or anger mark only | high |

## Composite Emotion Handling

Future `TransitionPlan` may include:

- `primaryEmotion`: enum from the approved 30-emotion catalog
- `accentEmotion`: optional enum from the same catalog

Compatibility note:

- The current planner-facing shape already has `from` and `to`. A later approved schema revision can treat `to` as the primary emotion, or add `primaryEmotion` while preserving `to` for backward compatibility.
- This proposal does not change `src/llm` yet.

Rules:

- `primaryEmotion` controls the main pose, mouth overlay, eye overlay, brow overlay, base motion, and target intensity.
- `accentEmotion` may only modify effect overlay, blush overlay, or minor overlay intensity.
- `accentEmotion` must not override the whole face.
- Top-1 primary emotion plus top-2 accent emotion is allowed.
- If confidence is low, ignore `accentEmotion`.
- If top-1 and top-2 conflict in a way that would create visual noise, keep the primary and drop the accent.
- The model or classifier path may only output enum-like data that is sanitized before use.
- The app maps the sanitized enum values to approved overlay assets.

Examples:

| Primary | Accent | Allowed result |
|---|---|---|
| `happy` | `love` | happy smile with small hearts or stronger blush |
| `sad` | `apologetic` | sad mouth with small blush or low tears |
| `angry` | `hurt` | angry primary face with sweat or small tear only if approved |
| `sleepy` | `hungry` | sleepy face with small food thought marker, not hungry mouth |

## Release Approval Requirements

Before implementation:

- User must approve the base asset mode: single composed `base-png` or immutable 2-6 layer stack.
- User must approve the anchor positions after debug-anchor preview.
- User must approve mouth patch style.
- User must approve mandatory blink overlay style and cadence.
- User must approve any persistent strong eye masking beyond ordinary blink.
- User must approve the six preview poses listed in `docs/character-overlay-preview-plan.md`.
- User must approve whether the current Mochi Sprout rig is kept as historical/default, replaced behind a gate, or moved to a legacy branch.

## Distribution Boundary

The full-feature local model experience should be distributed later as an `npm install` flow plus an explicit model download/setup script. The overlay rig proposal must not assume that the full model is committed directly into the Git repository or served through GitHub Pages.

Recommended later shape, after separate approval:

```text
git clone <repo>
cd svgotchi
npm install
npm run setup
npm run dev
```

The setup step should download the approved model/runtime assets, verify expected size and checksum, and fail clearly when assets are missing. A lightweight GitHub Pages demo may still be useful for character overlay previews, blink, and deterministic non-model animation, but it should not be treated as the primary full-function distribution path.
