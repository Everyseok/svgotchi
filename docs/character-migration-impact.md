# Character Migration Impact: Mochi Sprout SVG Rig to PNG Overlay Rig

Status: proposal for Gate X review
Last updated: 2026-06-17 14:57:56 Asia/Seoul

## Purpose

This document analyzes the impact of replacing the current Mochi Sprout primitive SVG character rig with a PNG-preserving anime character overlay rig. It is intentionally written before implementation. The current Stage 1-4 implementation, deterministic transition engine, `src/llm`, and `dist` must remain untouched until the user explicitly approves Gate X.

The core question is whether SVGotchi can preserve the uploaded/generated anime PNG as the visual base while still keeping deterministic, sanitized, enum-driven emotion transitions.

## Current Architecture Baseline

The current approved path is:

- Stage 1: Mochi Sprout neutral SVG and primitive rig contract.
- Stage 2: 30-emotion `POSE_MAP` built from primitive fields.
- Stage 3: pure SVG prompt input runtime.
- Stage 4: deterministic transition engine and primitive transition previews.
- Stage 7: local classifier maps text into sanitized app-owned `TransitionPlan`.

Important existing invariants:

- `viewBox="0 0 100 100"`.
- Model output is untrusted.
- Model output must be sanitized before use.
- The model must not output pet reply text.
- The model must not output raw SVG, selectors, path data, CSS, JavaScript, HTML, DOM patches, or animation code.
- The app owns all rendering and maps enums to deterministic visual behavior.

The proposed PNG overlay rig should preserve those security and determinism invariants while changing the character rendering substrate.

## Confirmed New Direction

The user clarified that the current PNG layer files are likely:

- `2`: base frame/body/face
- `3`: hair
- `4`: eyes
- `5`: mouth
- `6`: blush

The user also clarified that eye occlusion is not optional for the release. The character should blink like a person. Therefore:

- blink-oriented eye occlusion is required;
- ordinary blink is app-owned and deterministic;
- persistent strong eye masking still requires visual preview and user approval;
- base PNG pixels remain immutable.

The user also selected the full-feature distribution direction:

- full functionality should use `npm install` plus a model download/setup script;
- GitHub Pages should not be treated as the primary full-model path;
- a lightweight Pages demo may exist later without bundled model inference;
- the repository should avoid directly committing a model file that exceeds GitHub's normal 100 MiB per-file limit.

This is a documentation decision only. No setup script is implemented by this proposal.

## Existing Stage 1 Assumptions That Break

Stage 1 currently assumes a primitive SVG character contract. The following assumptions break under a PNG overlay rig:

| Existing Stage 1 assumption | Why it breaks | Replacement assumption |
|---|---|---|
| The character is a stable primitive SVG rig, not an opaque image. | The anime character is raster PNG art and must remain visually preserved. | The character base is an immutable PNG layer or approved immutable PNG layer stack. |
| Required IDs are primitive parts such as `body`, `face`, `eye-left`, `eye-right`, `mouth`, and effect slots. | PNG art does not expose editable SVG primitives for eyes, mouth, hair, skin, or blush. | Required IDs become overlay slots and debug anchors above `base-png`. |
| `body` is a rectangular primitive matching `bodyBox`. | The anime character silhouette is not a simple 40x44 box and occupies most of the 100x100 frame. | `faceBox` and expression anchors become more important than `bodyBox`; body motion applies to a whole image group. |
| Hidden effect layers are enough for expression changes. | Mouth, eye, brow, blush, and blink need overlay groups, not just effects. | Add stable expression overlay groups and occluder groups. |
| White-only monochrome visual marks are the character style. | The anime PNG is full-color, anti-aliased raster art. | Color is owned by the PNG and approved overlays; monochrome-only validation no longer applies to the character. |
| The validator can verify visual editability by checking primitive IDs. | IDs can exist while the underlying visual expression is hidden in pixels. | Validator must verify base image placement, overlay slots, anchor metadata, and no mutable base-pixel path. |
| The base character SVG itself is the character art source. | The source art is one or more PNG files. | SVG becomes a rig container that embeds immutable image assets and app-owned overlays. |

Stage 1 is therefore not a small polish change. The current `src/character` contract and validator would need a new branch or replacement contract after approval.

## Existing Stage 2 Pose Map Assumptions That Break

Stage 2 currently maps each emotion to primitive pose fields:

- `eyes`
- `mouth`
- `brows`
- `blushOpacity`
- `bodyOffsetY`
- `bodyOffsetX`
- `bodyScale`
- `bodyRotation`
- `effect`
- `effectOpacity`

Some parts remain useful, but several assumptions break:

| Existing Stage 2 assumption | Impact | Proposed adaptation |
|---|---|---|
| `eyes` enum maps directly to primitive SVG shapes. | Breaks. Eye visuals are PNG pixels plus overlay lids/glints/occluders. | Map `eyes` or a new overlay expression enum to approved eye overlay assets. |
| `mouth` enum maps directly to primitive mouth paths. | Breaks. Original mouth is raster and tiny. | Use mouth patch plus approved mouth overlay assets. |
| `brows` enum maps to primitive line paths. | Partially breaks. Brows may be obscured by hair/bangs. | Use subtle brow overlays anchored above the eyes; preview required. |
| `blushOpacity` is a numeric opacity over simple rectangles. | Partially breaks. Blush already exists in PNG layer 6 and may need style-matched overlays. | Map intensity to approved blush overlay opacity. |
| `effect` enum maps to simple primitive symbols. | Mostly reusable. | Extend effect catalog to include `sweat`, `food`, `dots`, and `music` if approved. |
| body motion transforms a small mochi body. | Partially reusable but visually different. | Apply motion to `base-character` group with smaller amplitude to avoid moving a full bust portrait unnaturally. |
| Every emotion can be shown by swapping primitive eye/mouth/brow states. | Breaks for anime art because eye masking and mouth patches can look unnatural if unreviewed. | Require preview approval for high-risk eye and mouth overlay combinations. |
| Pose sheet monochrome check proves style consistency. | Breaks. The character is full-color PNG. | Replace monochrome check with base-pixel immutability, asset reference, anchor, overlay enum, and visual preview checks. |

The 30-emotion catalog itself can remain. The pose map concept can remain. The concrete primitive rendering assumptions cannot remain unchanged.

## Existing Stage 4 Transition Preview Assumptions That Break

Stage 4 currently renders a static preview sheet from primitive SVG renderer output.

Broken assumptions:

- Preview frames can be generated as pure SVG primitives without raster image dependencies.
- Color literals should be only `#000` and `#fff`.
- The renderer can directly draw eyes, mouth, brows, and blush as primitive shapes.
- Discrete facial feature switches are visually safe because all shapes are simple.
- The five approved Stage 4 previews are representative of final character quality.

Partially reusable assumptions:

- Transitions are deterministic.
- `durationMs`, `fps`, easing, motion, effect, blush, and intensity are app-owned.
- The first and last frames should be testable.
- The model must not generate raw visuals.
- Preview generation is still valuable as a gate.

New preview obligations:

- Each preview must show base PNG only.
- Each preview must show overlay anchors.
- Each preview must show final overlay pose.
- Each preview must show blink/eye occlusion seams.
- Each preview must flag mouth patch and eye patch usage.
- High-risk emotions must be reviewed with persistent eye overlays, not just ordinary blink.

The existing Stage 4 transition preview artifact becomes historically valid for Mochi Sprout only. It does not prove the PNG overlay rig.

## Can The Deterministic Transition Engine Be Reused?

Yes, but only partially.

Reusable without changing the model boundary:

- frame schedule idea;
- easing functions;
- numeric interpolation for motion, opacity, scale, and rotation;
- app-owned `TransitionPlan`;
- sanitizer principle;
- effect enum sanitization principle;
- confidence/intensity separation;
- no model-generated rendering.

Requires adaptation:

- renderer output target changes from primitive SVG drawing to overlay slots;
- pose resolution must map emotion enums to overlay asset enums;
- mouth/eye occlusion must be represented as app-owned render state;
- blink requires a separate deterministic timeline that composes with transition frames;
- effect catalog likely grows to include `sweat`, `food`, `dots`, and `music`;
- preview renderer must support embedded PNG references or local preview composition;
- validation must prove base image immutability and overlay slot completeness.

Not recommended:

- letting the LLM choose overlay asset names;
- letting the LLM set coordinates;
- letting the LLM generate SVG snippets;
- trying to morph or vector-trace the PNG;
- forcing the current primitive renderer to impersonate anime art.

Conclusion: keep the engine's scheduling and planning boundary, but introduce a new PNG overlay renderer branch behind Gate X.

## Modules That Can Remain Unchanged

These should remain unchanged during Gate X proposal work and may remain mostly unchanged after implementation approval:

| Module/file | Why it can remain unchanged |
|---|---|
| `src/input/*` | Prompt input behavior is independent of character substrate. |
| `src/llm/modelRuntime.ts` | Classifier runtime only returns labels/scores and should not know rendering details. |
| `src/llm/localTransitionPlanner.ts` | The planner maps text to app-owned plan fields, not raw visuals. It may later add accent emotion only after explicit schema approval. |
| `src/llm/sanitizeTransitionPlan.ts` | Sanitization principles remain. Only schema enums may expand later. |
| `src/llm/transitionPlanSchema.ts` | Must not change during this proposal. Later change only if `primaryEmotion`/`accentEmotion` is approved. |
| `src/engine/easing.ts` | Easing remains generic. |
| `src/engine/frameScheduler.ts` | Frame scheduling remains generic. |
| `src/engine/interpolation.ts` | Numeric interpolation remains useful, though discrete overlay mapping may need adaptation. |
| `src/emotion/emotionCatalog.ts` | The approved 30-emotion list remains the correct catalog. |
| model assets and runtime assets | Character overlay does not require changing the classifier model. |

## Modules That Require Adaptation Later

These should not change yet, but would likely need adaptation after Gate X approval:

| Module/file | Later adaptation |
|---|---|
| `assets/base-character.svg` | Replace or branch with an overlay-rig SVG container embedding `base-png`. |
| `assets/pose-previews/stage-02-30-emotion-pose-sheet.svg` | Supersede with overlay pose preview artifacts. |
| `assets/transition-previews/stage-04-sample-transitions.svg` | Supersede with overlay transition previews. |
| `src/character/characterContract.ts` | Add or branch to `OverlayCharacterContract` with `faceBox`, anchors, base image, and overlay slots. |
| `src/character/requiredRigIds.ts` | Add overlay IDs such as `base-png`, `face-occluders`, `eye-overlays`, `mouth-overlays`, and extended effects. |
| `src/character/rig.ts` | Validate image placement, anchor metadata, duplicate IDs, and overlay groups. |
| `src/character/baseCharacter.ts` | Load or generate the overlay base container instead of primitive Mochi Sprout. |
| `src/emotion/poseMap.ts` | Add overlay asset mapping or branch pose model from primitive fields to approved overlay enums. |
| `src/emotion/poseSheetPreview.ts` | Generate overlay pose review sheets with base image, anchors, final overlays, and risk labels. |
| `src/render/renderer.ts` | Render approved overlay assets and occluders instead of primitive face shapes. |
| `src/render/effects.ts` | Extend effect renderer for `sweat`, `food`, `dots`, and `music`. |
| `src/engine/poseResolver.ts` | Resolve primary and accent emotion into overlay pose state if composite emotion is approved. |
| `src/engine/transitionEngine.ts` | May remain mostly intact, but needs composition with blink timeline and overlay render state. |
| `tests/characterContract.test.ts` | New overlay rig ID and anchor tests. |
| `tests/poseMap.test.ts` | Overlay asset completeness and risk policy tests. |
| `tests/transitionEngine.test.ts` | Overlay frame and blink composition tests. |

## Files That Must Not Change During This Proposal

The following must remain unchanged until explicit implementation approval:

- current Stage 1-4 implementation files under `src/character`, `src/emotion`, `src/engine`, and `src/render`;
- current transition engine implementation;
- `src/llm`;
- current model runtime and classifier mapping;
- `dist`;
- generated final artifacts;
- base PNG pixels.

This proposal may only create/update documentation and planning/review artifacts.

## Restart Stage 0-4 Or Branch Behind A New Gate?

The safest path is a new branch/gate, not a full restart.

Recommended decision:

- Add Gate X: PNG-preserving anime character overlay rig review.
- Treat Mochi Sprout Stage 1-4 artifacts as historical and still valid for the primitive rig.
- Do not delete or silently replace Mochi Sprout.
- Do not restart model selection, prompt input, local runtime, or TransitionPlan architecture.
- Re-run only the character-facing gates under the new overlay branch:
  - overlay character contract review;
  - anchor review;
  - 30-emotion overlay pose review;
  - overlay transition preview review.

This is effectively a character-rendering branch that reuses the model/planner boundary and deterministic engine ideas.

Why not restart everything:

- The prompt input and local classifier architecture remain relevant.
- The TransitionPlan-only contract remains relevant.
- The no raw SVG/model-rendering security boundary remains relevant.
- The 30-emotion catalog remains relevant.

Why not silently continue without a new gate:

- User-visible character identity changes completely.
- Existing Stage 1-4 approvals were granted for Mochi Sprout, not the anime PNG overlay rig.
- Eye occlusion/blink introduces new visual and timing risks.
- The full-color PNG invalidates monochrome preview validation.

## Exact Risks Compared With Primitive SVG Rig

| Risk | PNG overlay rig impact | Primitive SVG rig impact | Mitigation |
|---|---|---|---|
| Visual seams | High around mouth and blink occluders. | Low because all parts are native primitives. | Preview mouth and blink patches before implementation. |
| Eye expression quality | High risk if masking covers lashes, hair, or highlights poorly. | Low-medium; primitive eyes are easy to replace. | Use original eyes for open states; use approved eyelid occluders for blink. |
| Coordinate precision | Medium-high because anchors are estimated from raster art. | Low because anchors were designed in SVG. | Debug-anchor preview and manual user review. |
| File size | Higher because PNG layers add several MiB. | Very low. | Keep PNG assets optimized and avoid embedding the large model into Git repo. |
| Runtime performance | More image layers and overlays; still likely acceptable. | Very low cost. | Use fixed layers, avoid filters, cap animation frame work. |
| GitHub distribution | Model file exceeds normal GitHub per-file push limit if committed directly. | Primitive-only demo is tiny. | Use `npm install` plus model download/setup script for full functionality. |
| Offline behavior | Requires local model assets after setup. | Primitive transitions can run without model. | Setup script should download, verify checksum, and fail clearly when missing. |
| Test determinism | Raster visual correctness is harder to assert textually. | SVG primitive output is easy to string-compare. | Use contract tests plus image/preview review artifacts. |
| Accessibility/reduced motion | Blink and effects may need reduction. | Simpler motion set. | Later add app-owned reduced-motion mode if required. |
| Rollback | More files and assets to revert. | Simple to roll back. | Keep overlay branch gated and preserve Mochi Sprout artifacts. |
| Trust boundary | Risk if model could pick arbitrary overlays. | Existing enum fields are narrow. | Keep enum-only mapping and reject arbitrary visual fields. |

## Distribution Impact

Current local asset sizes observed during proposal work:

- all PNG character assets: about `7.6 MiB`;
- Tanaos model folder: about `129.26 MiB`;
- ONNX Runtime WASM folder: about `12.37 MiB`;
- total `assets/` folder: about `149.31 MiB`;
- largest single file: `assets/model/onnx-community/tanaos-emotion-detection-v1-ONNX/onnx/model_int8.onnx`, about `112.97 MiB`.

Distribution conclusion:

- A lightweight GitHub Pages demo can show the character rig, blink, overlay poses, prompt UI, and deterministic non-model preview behavior.
- Full functionality should use `npm install` plus an explicit setup/model-download script.
- The setup script should download approved model/runtime assets from an approved source, verify expected file size and checksum, and fail with a clear message if assets are missing.
- The setup script should not be implemented until the packaging/download plan is separately approved.
- The repository should avoid requiring a normal Git push of files above GitHub's 100 MiB per-file limit.

## Recommended Future Implementation Branch

After Gate X approval, the implementation branch should be scoped as:

1. Add overlay rig contract and validator while keeping the old Mochi Sprout contract available.
2. Create a preview-only overlay renderer for the six required poses.
3. Review anchors, mouth patch, blink patch, and eye overlay risk.
4. Only after visual approval, adapt the transition renderer to overlay slots.
5. Only after that, consider schema changes for `primaryEmotion` and `accentEmotion`.
6. Separately plan `npm run setup` or equivalent model download command for full-feature local usage.

## Current Recommendation

The PNG-preserving overlay rig is compatible with the broader SVGotchi architecture if introduced behind Gate X. It is not compatible with the existing Stage 1-4 character rendering assumptions without adaptation.

The safest path is:

- keep the model/planner boundary;
- keep the 30-emotion catalog;
- keep deterministic transition scheduling;
- replace only the character rendering branch after visual approval;
- require blink as an app-owned overlay timeline;
- use `npm install` plus a model download/setup script for full-feature distribution later;
- stop implementation until the user approves the overlay rig and preview plan.
