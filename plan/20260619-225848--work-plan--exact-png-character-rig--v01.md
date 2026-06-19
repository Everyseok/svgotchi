# Exact PNG Character Rig Work Plan

Plan Type: work-plan
Workstream: exact-png-character-rig
Version: v01
Status: Approved by user command `시작`; implementation may proceed inside this scope only
Created: 2026-06-19 22:58:48 Asia/Seoul
Last Updated: 2026-06-19 22:58:48 Asia/Seoul
Supersedes or Related Plan: Supersedes the visual direction of `plan/20260619-201009--work-plan--pure-svg-anime-character-replacement--v01.md` while preserving its verified model, prompt, server, and transition boundaries. Related to the historical PNG overlay documents under `docs/character-overlay-rig.md`, `docs/character-overlay-preview-plan.md`, and `docs/character-migration-impact.md`.
Current Completion State: Approved and ready for implementation
Completed So Far: The repository currently has a pushed pure SVG anime companion implementation in commit `8e42b5f`, but the user rejected it because the character is not identical to the uploaded reference asset. The user explicitly clarified that "close" is not acceptable and that the character must be the same as the asset. The current workspace is otherwise clean against `origin/main` except for an existing modified `package-lock.json`, which should be treated as pre-existing user or environment state unless this task clearly requires touching it.
Remaining Work: Replace the runtime character body with the exact uploaded PNG asset, preserve the SVG app shell and local model path, update tests and packaging to reflect the new image-based character contract, verify served SVG behavior, then commit and push only the intended changes.
Current Blockers: None. The main tradeoff is now accepted: exact visual fidelity requires embedding or serving the PNG through an SVG `<image>` element, so the earlier "pure vector character" constraint must be dropped for the character body.
Next Step: Inspect current base SVG and runtime renderer entry points, then implement the smallest image-backed rig that makes the character visually identical to `assets/1.png`.

## Scoreboard

Current Score: 30/100
Score Source: provisional
Last Updated: 2026-06-19 22:58:48 Asia/Seoul

Score Rationale: The user has not provided a numeric score, so this is a conservative provisional score. The prior result failed the user's core acceptance criterion because it was only inspired by the asset rather than identical to it. The new plan is aligned with the corrected requirement, but no new implementation has landed yet.

What Improved: The requirement is now precise. The character must match the uploaded asset exactly, which means the implementation should use the real PNG asset instead of attempting hand-authored vector approximation.

What Remains Unsatisfactory: The current runtime still uses a hand-authored SVG anime companion and therefore does not match the original asset. Tests and documentation still reflect a pure SVG anime character path, and package files do not yet include the PNG runtime asset.

Actions To Raise Or Maintain Score: Use the uploaded PNG as the rendered character body, keep the app as an SVG document, keep model/planner/server boundaries unchanged, add tests that prove the runtime references or embeds the exact asset, run served SVG verification, and push a focused corrective commit.

Score History:
- 2026-06-19 22:58:48 Asia/Seoul: provisional 30/100. User rejected approximate SVG character and approved starting the exact PNG-backed replacement path.

## Objective

Replace the current hand-authored pure SVG anime companion with an image-backed character that is visually identical to the user's uploaded asset. The correct reference for "same character" is `assets/1.png`, the composed PNG. The user did not ask for another approximation, a stylized reinterpretation, a simplified vector trace, or a "close enough" mascot. The final runtime should show the same character pixels from the uploaded asset as the main character.

The app should remain an SVG-first app document. The browser should still open an SVG document served by the local static server. The prompt surface should remain pure SVG text and rect elements. Browser-local Transformers.js model mode, deterministic transition planning, and sanitized app-owned `TransitionPlan` boundaries should remain intact. The change should be focused on the visual character body and any renderer/test/package contracts that need to reflect the exact-image requirement.

This plan deliberately changes the prior character-art constraint. The previous pure SVG hand-authored character was appropriate only if the acceptance criterion was "inspired by the reference." It is not appropriate for "the same as the asset." Exact visual identity cannot be achieved through a small hand-authored vector approximation. The smallest complete design is to render the exact PNG inside the SVG app shell.

## Confirmed User Requirement

The user explicitly said the current character is different from the uploaded asset and then clarified: "가깝게 말고 똑같게" meaning "not close, exactly the same." That requirement overrides the earlier assumption that reference assets could be interpreted into a simplified pure SVG character.

The implementation must therefore use a raster image representation for the character body. It may use an SVG `<image>` element that points at a packaged asset such as `assets/1.png`, or it may embed the PNG as a data URI in the SVG. The direct file reference is preferred for maintainability, package size control, and source readability. Data URI embedding is less desirable because it makes the SVG source huge, hard to diff, and harder to review.

The default exact character should be `assets/1.png` because it is the composed character reference. `assets/2.png` through `assets/6.png` are useful layer references, but using them as separate visible layers risks composition drift unless the original layer stacking, opacity, and alignment are known exactly. For the user's "same" requirement, one composed image is the safest visual baseline.

## Design Decision

Use `assets/1.png` as the visible character image in the base rig. Keep the surrounding SVG app, prompt region, effects, and browser-local model code. Do not try to redraw the character. Do not use the hand-authored anime SVG as the visible character body. The character identity comes from the PNG pixels.

The SVG document will include an image slot that renders `assets/1.png` within the `0 0 100 100` coordinate system. The exact mapping should preserve the character's aspect ratio. Because the app has an existing pet area from `y=0` to `y=80` and prompt area from `y=81` to `y=100`, the image should be scaled and positioned to make the character visible above the prompt without clipping important details. If fitting the full square PNG into the pet area leaves the character too small, the implementation may crop using `preserveAspectRatio="xMidYMid meet"` or choose a controlled viewport box, but it must not distort the image.

The existing required rig IDs should remain where practical so validators and runtime code continue to have stable anchors. The old visible vector face/body can be replaced by transparent or hidden rig slots that keep the contract. Existing emotion effects such as hearts, tears, question marks, and sparkles may still overlay above the PNG. The facial expression system should not pretend to fully change the original PNG face unless the correct layer images and masks are implemented. For this immediate corrective work, exact base visual identity is more important than thirty perfect expression overlays.

## Scope

In scope:

- Replace the visible base character with `assets/1.png`.
- Keep the app served as an SVG document.
- Keep prompt input and send zone as SVG elements.
- Keep local static server behavior.
- Keep browser-local model inference and deterministic transition planning.
- Keep sanitized model boundary unchanged.
- Add `assets/1.png` to package files because it becomes a runtime dependency.
- Update tests that previously rejected `<image>` in the base character.
- Add tests proving the base character references the exact runtime PNG asset.
- Update docs so they do not claim the active runtime is pure vector character art.
- Verify demo and full served SVG behavior.
- Commit and push the corrective change.

Out of scope:

- Pixel-perfect vector tracing.
- New AI-generated art.
- Creating thirty complete expression PNGs.
- Rebuilding the model or emotion classifier.
- Changing prompt handling.
- Introducing HTML input, form controls, React, canvas, or backend inference.
- Adding hosted inference or runtime model downloads.
- Rewriting the server as anything other than the existing static file server.
- Solving a complete layer-based face/mouth/eye rig unless the minimal exact base image path requires it.

## Runtime Contract

The user-facing app remains an SVG document. The character image may be an `<image>` inside SVG. This means "pure SVG app shell" remains true, but "pure vector character" no longer does. Tests and docs must state that distinction clearly so the project is honest.

The model still must not output raw SVG, path data, CSS, JavaScript, DOM selectors, image paths, overlay definitions, or reply text. The model may only influence bounded emotion and transition values through the existing sanitized app-owned planner path.

The browser runtime can still animate the pet group using transforms. The visible PNG can move, scale, rotate, bounce, shake, and sway with the same pose interpolation. Effects can remain deterministic SVG overlays. This preserves the main interactive feel while making the character visually identical in its base state.

## Package Contract

Because `assets/1.png` becomes a runtime dependency, `package.json` must include it in `files`. It should include only the exact runtime PNG that is needed. It should not blindly include all `assets/*.png` unless the implementation actually loads them. Including all six reference PNGs would unnecessarily increase the npm tarball by several megabytes. If the runtime only loads `assets/1.png`, the package should list exactly `assets/1.png` plus existing SVG and JS assets.

Package dry-run must be checked after the change. The expected tarball will grow by about 1.7 MB because `assets/1.png` is 1,695,825 bytes. That is acceptable for exact fidelity. The model and runtime ONNX payloads must still not be included.

## Testing Strategy

Tests should change from "no image tags anywhere" to a more precise boundary:

- The base character may include one explicit `<image>` for the exact PNG character.
- The image must reference `assets/1.png` or the server-relative path that resolves to that file.
- The base character must not reference external URLs.
- The base character must not use `foreignObject`.
- The base character must not include HTML controls.
- Required rig IDs must still exist.
- The base asset must still match the exported source.
- The character contract must still validate the canonical viewBox, pet area, prompt area, and body/image slot.
- Pose sheet and transition preview tests should either render the image-backed character or explicitly verify the renderer's image-backed contract.

Served SVG verification should still confirm:

- document root is SVG, not HTML;
- app loader starts;
- app ready flag is set;
- mode is correct;
- no browser console errors;
- `you are cute` maps to a shy/love/happy state in demo and full modes.

Package verification should confirm:

- `assets/1.png` is included;
- unnecessary PNG reference layers are not included unless used;
- large model/runtime payloads remain excluded;
- tarball size increase is explained by the runtime image asset.

## Implementation Sequence

### Phase 1: Inspect Current Runtime Image Serving

Confirm how the local static server maps asset paths from an SVG document. Check whether a root-relative `/assets/1.png` URL is served correctly. The existing `scripts/serve.ts` likely serves assets from the repo root or package root. If the browser serves the SVG at `/`, root-relative `/assets/1.png` should be the simplest reference.

Check whether direct-open SVG is expected to work with local image references. If direct-open verification matters, browser file-security behavior may block local asset loading depending on the browser. The primary accepted runtime is currently served SVG via localhost, so direct-open behavior should not block this corrective task unless existing tests require it.

### Phase 2: Replace Visible Character Body

Update `src/character/baseCharacter.ts` so the visible pet body contains an SVG `<image>` for `assets/1.png`. Preserve the required IDs by keeping transparent slots or groups. The visible hand-authored hair, head, eye, mouth, and outfit shapes should be removed or hidden if they conflict with the PNG. The result should be visually dominated by the original PNG, not a mixed hybrid.

The `body` slot may become a transparent validation rect around the image area if `rig.ts` still expects a rect. That keeps the validator simple and avoids a broader contract rewrite. If an explicit image ID is added, tests can check it. Required IDs do not necessarily need to include the image ID unless the app runtime must mutate it directly.

### Phase 3: Align Browser Runtime Mutation

The browser runtime currently mutates SVG eye ellipses, mouth paths, brow paths, blush ellipses, and effect groups. With the PNG base visible, these face mutations may no longer align with the original face. For the exact-base correction, there are two safe options:

- Keep those mutated SVG face slots hidden or nearly transparent so they do not alter the exact base face, while preserving effects and pet transforms.
- Keep only non-invasive overlays such as hearts/sparkles/question/tears that do not replace the character's original face.

The safest immediate choice is to hide expression facial slots by default when exact PNG mode is active and keep motion/effects. This prevents the old SVG face from making the original asset look wrong. Later, if exact expression changes are required, they should be built from approved PNG layer overlays or carefully aligned masks.

### Phase 4: Update Preview Renderers

The pose sheet and transition preview should reflect the exact-image character contract. They can render the same image element in each cell/frame and apply the deterministic transform. This will make previews visually match the runtime and avoid misleading users into thinking the active character is a vector redraw.

The preview renderers should still show emotion names, pose labels, and effects. The face overlay may be intentionally limited or disabled until exact expression layer work is approved. The transition engine can still be verified because the body transform and effect opacity remain deterministic.

### Phase 5: Update Tests And Docs

Update tests to allow the one approved local image reference. Remove or rewrite assertions that forbid `<image>` in the base character and previews. Replace them with assertions forbidding remote images, `foreignObject`, HTML controls, and unapproved image paths.

Update README and current review docs so they say the active character uses the exact uploaded PNG inside an SVG app shell. Historical pure vector notes should be clearly superseded by the exact-image requirement.

### Phase 6: Verify

Run focused and broad checks:

- `npm run verify`
- `npm run verify:runtime`
- `git diff --check`
- `npm pack --dry-run`

If `npm pack --dry-run` needs npm cache access outside the sandbox, run it with escalation as before. Confirm `assets/1.png` appears in the tarball and that the total package size is expected.

### Phase 7: Commit And Push

After verification, commit the correction with a message such as `Use uploaded PNG as character base`. Push to `origin/main`. Do not include unrelated `package-lock.json` changes unless this implementation truly modifies dependencies or npm changes it as part of this task. If `package-lock.json` remains modified but unrelated, leave it unstaged and report it.

## Acceptance Criteria

The visible character must come from `assets/1.png`. The app should not show the hand-authored SVG anime companion as the main character. The character should look identical to the uploaded composed PNG, subject only to scaling inside the existing app layout.

The app must still be an SVG document. The prompt must still be SVG-only. There must still be no HTML form, no `foreignObject`, no canvas, no React wrapper, and no backend inference route.

The model and planner boundary must remain unchanged. The model still cannot generate raw SVG, image paths, overlays, reply text, or animation code.

The package must include the runtime image asset needed for npm/npx use. It must not include the entire model payload or unrelated PNG layers unless they are actually used.

Verification must pass. The served SVG demo and full probes must still work. The final GitHub commit must make the corrected behavior available on `main`.

## Risks And Mitigations

The main risk is confusing "exact character" with "exact every emotion expression." This task should solve exact base visual identity first. Full exact expression changes need additional approved assets or carefully built overlays. To avoid overclaiming, documentation and tests should say the active base character is exact PNG-backed and that expression overlays are deterministic app-owned effects unless expanded later.

Another risk is package bloat. Including `assets/1.png` is necessary. Including all six PNG references is not necessary unless the runtime uses them. Mitigation: include only `assets/1.png` in `package.json` files for this correction.

Another risk is direct-open SVG behavior. SVG image references can behave differently under `file://` depending on browser security. The primary supported runtime is currently served localhost. If direct-open verification fails solely because the browser blocks local linked images, that should be documented as a direct-open limitation rather than solved by embedding a huge data URI by default.

Another risk is validator churn. The existing validator expects `body` to be a rect with a coordinate contract. Preserve that slot as a transparent rect so exact-image work does not require rewriting validator logic.

## Definition Of Done

This work is done when the runtime SVG character visibly uses `assets/1.png`, tests prove the exact local image reference is present and bounded, no unapproved external or HTML runtime surface is introduced, served SVG demo/full verification passes, package dry-run includes the required image and excludes large model payloads, documentation accurately states the exact PNG-backed character contract, and the corrective commit is pushed to GitHub.

## Status Update: 2026-06-19 23:08:16 Asia/Seoul

Current Completion State: Implemented and verified locally; commit and push remain.

Completed So Far: The runtime character body now renders the exact uploaded composed asset through `assets/1.png` in the SVG app shell. The prior hand-authored visible SVG character has been replaced by an approved local `<image>` slot, while the legacy face rig anchors are hidden to avoid changing the uploaded face. The package manifest includes `assets/1.png`, docs now describe the exact PNG-backed character contract, and tests assert that only the approved local PNG is used. Verification passed for `npm run verify`, `npm run verify:runtime`, `git diff --check`, and `npm pack --dry-run`. The existing modified `package-lock.json` remains unrelated and should stay unstaged unless separately approved.

Remaining Work: Commit and push only the intended exact-PNG character changes. Leave the pre-existing `package-lock.json` modification out of the commit.

Score Update: provisional 50/100. The user has not provided a numeric score, so the local workflow caps this provisional score at 50 even though the technical acceptance evidence is strong. The core rejected issue has been corrected: the visible character now comes from the exact uploaded `assets/1.png` rather than an approximation. Technical verification confidence is 98/100 because the code, tests, served runtime probes, and package dry-run all confirm the intended contract.

What Remains Unsatisfactory: The base character is exact, but thirty fully distinct exact expression PNG variants are still not available. The uploaded PNG also contains its own baked visual background pixels, so exact rendering preserves those pixels. Final subjective visual acceptance still depends on the user's browser check.

Score History Addition: 2026-06-19 23:08:16 Asia/Seoul: provisional 50/100. Exact PNG-backed implementation is complete and locally verified, but user has not provided a new explicit score and the workflow caps provisional scoring at 50.

## Superseded Status Update: 2026-06-19 23:33:43 Asia/Seoul

Status: Superseded for active visual work by `plan/20260619-233343--work-plan--completion-grade-expression-rig--v01.md`.

Reason: The exact PNG base correction is still valid and remains part of the project, but user feedback after runtime inspection showed that a transform-only PNG character is not acceptable as a completed character experience. The new active plan keeps the exact `assets/1.png` base and adds a visible expression overlay rig so emotion prompts change the face, not only the whole image transform.
