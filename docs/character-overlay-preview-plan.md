# PNG Overlay Character Preview Plan

Status: historical proposal; not the active implementation path
Last updated: 2026-06-19 Asia/Seoul

Note: The active runtime now uses a pure SVG anime companion. This PNG overlay preview plan is retained as historical design context only.

## Purpose

This document defines the required preview sequence before implementing the PNG-preserving anime character overlay rig. The previews are the approval gate between the current Mochi Sprout primitive SVG rig and any future overlay renderer work.

No existing transition engine wiring should change until the user approves this preview plan and the resulting preview artifacts.

## Preview Principles

Every preview must preserve the uploaded/generated character PNG as the immutable visual base. The preview may draw overlays above the PNG, but it must not alter source pixels, vector-trace the PNG, redraw the character, or create a new character image.

Each preview must show three panels:

1. `base PNG only`
   - Shows the approved immutable base asset without expression overlays.
   - If the user approves the 2-6 layer stack path, this panel shows the immutable composed base stack.

2. `overlay anchors visible`
   - Shows debug anchors for `faceBox`, eyes, brows, mouth, blush, tears, sweat, anger, question, zzz, heart, sparkle, and speech bubble.
   - Debug anchors must be visually distinct and must not be part of final runtime output unless a debug mode is approved.

3. `final overlay pose`
   - Shows the approved overlay asset mapping for the target emotion.
   - Shows whether mouth patching and eye patching are used.
   - Includes at least one blink/closed-frame check for eye seam review.

## Preview Asset Modes To Decide

Before rendering the final preview set, Gate X must decide the base asset mode:

| Mode | Description | Pros | Risks |
|---|---|---|---|
| single composed base | one `base-png` image using `assets/1.png` or `assets/rumimatepng.png` | simplest contract, literal immutable base layer | blink and mouth patches sit above all hair/lashes and can show seams |
| immutable layer stack | approved immutable stack from `assets/2.png`, `3.png`, `4.png`, `5.png`, and `6.png` | best control for blink, mouth, blush, and hair ordering | slightly more complex than one image; must still satisfy `base-png` approval language |

Current recommendation: use the immutable layer stack for final quality if the user approves that interpretation of `base-png`. It preserves source pixels while giving the rig enough depth for blink and mouth overlays.

## Shared Preview Checks

For every target emotion:

- Confirm `viewBox="0 0 100 100"`.
- Confirm base PNG placement is `x=0 y=0 width=100 height=100`.
- Confirm base pixels are never mutated.
- Confirm overlay assets come only from the approved taxonomy.
- Confirm the model has no role in choosing arbitrary overlays.
- Confirm ordinary blink is active as an app-owned timeline.
- Confirm persistent eye overlays are distinguishable from the ordinary blink occluder.
- Confirm mouth patch does not visibly smear the face.
- Confirm overlays do not cover hair ornaments, earrings, or other identity details unless approved.
- Confirm high-risk poses are reviewed at full intensity and at a mid intensity.

## Required Preview Set

The required preview set covers the original Stage 4 samples plus one high-risk negative emotion. The selected high-risk negative emotion is `angry` because it exercises eye narrowing, brow tension, mouth patching, and anger effect placement. `hurt` can be added later if the angry preview passes but tear/mouth risk remains unresolved.

## Preview 1: `neutral`

| Required view | Content |
|---|---|
| base PNG only | approved immutable base without dynamic overlays |
| overlay anchors visible | all anchor points, with `faceBox`, `eyeLeft`, `eyeRight`, `mouth`, and `blush` emphasized |
| final overlay pose | minimal expression overlays; open eyes preserved; ordinary blink check shown |

Overlay mapping:

- mouth overlay: `mouth-neutral`
- eye overlay: `eye-extra-highlight` or none if the base eyes already read cleanly
- brow overlay: `brow-flat`
- blush overlay: none or original blush only
- effect overlay: none
- base motion: `none`

Risk notes:

- Low expression risk.
- High anchor-accuracy importance because every other pose uses these anchors.
- If neutral looks altered, the overlay contract is already too invasive.

Patch usage:

- mouth patch: no by default
- eye patch: yes for ordinary blink only; no persistent eye masking

User approval focus:

- Are the anchors correct?
- Does the blink feel natural without changing the character identity?
- Does neutral still look like the uploaded PNG?

## Preview 2: `shy_love`

| Required view | Content |
|---|---|
| base PNG only | approved immutable base |
| overlay anchors visible | anchors around cheeks, eyes, brows, heart origin, and mouth |
| final overlay pose | shy smile, soft lids, blush lines, hearts, ordinary blink check |

Overlay mapping:

- mouth overlay: `mouth-small-smile`
- eye overlay: `eye-soft-lid`
- brow overlay: `brow-worried`
- blush overlay: `blush-shy-lines`
- effect overlay: `hearts`
- base motion: `sway` or restrained `tiny_bounce`

Risk notes:

- Medium risk because the mouth patch and blush overlay sit on a detailed painted face.
- Eye soft-lid overlay must not make the character look sleepy unless the intensity is intentionally low.
- Hearts must not collide with existing hair, ornaments, or the immutable heart if the composed PNG includes one.

Patch usage:

- mouth patch: yes
- eye patch: yes for blink; persistent soft-lid overlay yes, but not full eye replacement

User approval focus:

- Is the smile readable?
- Is the blush cute without overpainting the original face?
- Does the eye softening improve the smile as requested?

## Preview 3: `hungry`

| Required view | Content |
|---|---|
| base PNG only | approved immutable base |
| overlay anchors visible | mouth, question/food origin, brow, and eye anchors |
| final overlay pose | tiny open mouth, dim or expectant eyes, food marker, ordinary blink check |

Overlay mapping:

- mouth overlay: `mouth-tiny-open`
- eye overlay: `eye-dim`
- brow overlay: `brow-worried`
- blush overlay: none
- effect overlay: `food`
- base motion: restrained `sway`

Risk notes:

- Medium risk because the mouth is tiny and food effects can look like stickers if not style-matched.
- `food` effect needs an approved tiny icon style before release.
- The face should read hungry, not sick or surprised.

Patch usage:

- mouth patch: yes
- eye patch: yes for blink; persistent eye dim overlay allowed at low opacity

User approval focus:

- Is the open mouth visible at the final display size?
- Does the food cue feel like SVGotchi behavior rather than random decoration?
- Does the expression avoid looking ill?

## Preview 4: `sleepy`

| Required view | Content |
|---|---|
| base PNG only | approved immutable base |
| overlay anchors visible | eyes, zzz origin, mouth, and brow anchors |
| final overlay pose | sleepy lid or closed-arc pose, zzz effect, ordinary blink/closed-eye comparison |

Overlay mapping:

- mouth overlay: `mouth-neutral`
- eye overlay: `eye-closed-arc`
- brow overlay: `brow-flat`
- blush overlay: none
- effect overlay: `zzz`
- base motion: `none`

Risk notes:

- High risk because `eye-closed-arc` can require persistent eye occlusion, not just a blink frame.
- If the single composed PNG is used, closed eyes may cover lashes or hair strands unnaturally.
- The preview must separate ordinary blink from the longer sleepy-eye pose.

Patch usage:

- mouth patch: no by default
- eye patch: yes for blink and yes for persistent sleepy-eye overlay; requires explicit approval

User approval focus:

- Does the closed-eye pose look natural?
- Are the original eyes preserved when the character returns to neutral/open state?
- Does the zzz effect stay out of the hair and face?

## Preview 5: `angry`

| Required view | Content |
|---|---|
| base PNG only | approved immutable base |
| overlay anchors visible | eyes, brows, mouth, anger origin, sweat origin |
| final overlay pose | zigzag mouth, angry lids, angry brows, anger mark, ordinary blink check |

Overlay mapping:

- mouth overlay: `mouth-zigzag`
- eye overlay: `eye-angry-lid`
- brow overlay: `brow-angry`
- blush overlay: none
- effect overlay: `anger`
- base motion: restrained `shake`

Risk notes:

- High risk because anime eye changes are identity-sensitive.
- Angry brow/lid overlays can conflict with bangs and existing lash shape.
- The expression must read angry without turning into a different character.
- Shake motion should be subtle because the base is a full bust image, not a small mochi body.

Patch usage:

- mouth patch: yes
- eye patch: yes for blink; persistent angry-lid overlay yes, reviewed at full and mid intensity

User approval focus:

- Does the angry face remain cute?
- Is the eye narrowing acceptable?
- Does the anger mark placement avoid hair ornaments and side decorations?

## Preview 6: `curious`

| Required view | Content |
|---|---|
| base PNG only | approved immutable base |
| overlay anchors visible | eye, brow, mouth, question, and sparkle anchors |
| final overlay pose | small smile, raised brow, attentive eyes, question effect, ordinary blink check |

Overlay mapping:

- mouth overlay: `mouth-small-smile`
- eye overlay: `eye-extra-highlight`
- brow overlay: `brow-raised`
- blush overlay: none
- effect overlay: `question`
- base motion: restrained `sway`

Risk notes:

- Low-medium risk.
- Brow overlays may be partly hidden by hair and require manual adjustment.
- Question effect should feel integrated and not like UI text floating over the illustration.

Patch usage:

- mouth patch: yes
- eye patch: yes for blink; no persistent eye masking beyond extra highlight

User approval focus:

- Does the curious expression read at small size?
- Is the raised brow visible under the hair?
- Is the question marker in the right place?

## Preview Acceptance Criteria

The preview plan is approved only if:

- all six required emotions are reviewed;
- each emotion shows base PNG only, debug anchors, and final overlay pose;
- every preview records mouth patch and eye patch usage;
- every preview includes risk notes;
- ordinary blink is accepted as a required app-owned behavior;
- persistent eye masking is approved or rejected per emotion;
- no preview redraws, vector-traces, or edits the PNG base;
- no preview relies on LLM-generated visuals;
- the user explicitly approves the selected base asset mode.

## Implementation Stop Rule

Do not wire this into the transition engine until the user approves:

- `docs/character-overlay-rig.md`;
- `docs/character-migration-impact.md`;
- this preview plan;
- the actual preview artifacts produced in a later approved step.

Until then, Stage 1-4 implementation and transition engine code remain unchanged.
