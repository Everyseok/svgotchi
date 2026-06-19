# Pure SVG Anime Character Replacement Work Plan

Plan Type: work-plan
Workstream: pure-svg-anime-character-replacement
Version: v01
Status: Approved; implementation may proceed inside this scope only
Created: 2026-06-19 20:10:09 Asia/Seoul
Last Updated: 2026-06-19 22:41:13 Asia/Seoul
Supersedes or Related Plan: Related to `plan/current-next-steps.md`, `plan/svgotchi-active-plan.md`, `docs/character-overlay-rig.md`, and `plan/backlog-semantic-routing.md`
Current Completion State: Ready to commit and push
Completed So Far: The project has a verified MVP path using the pure SVG anime companion character, browser-local model mode, app-owned TransitionPlan mapping, deterministic SVG animation, and a public GitHub repository at `https://github.com/Everyseok/svgotchi`. The user approved replacing only the character with a new anime-inspired pure SVG character based on `assets/1.png` through `assets/6.png`. The current character surfaces were inspected. The base SVG, coordinate contract, pose sheet renderer, transition preview renderer, browser runtime face mutation code, generated SVG assets, tests, and current documentation have been updated to the pure SVG anime companion contract.
Remaining Work: Commit and push the verified change to GitHub.
Current Blockers: None. The user explicitly clarified that the desired direction is not PNG overlay rendering, but a pure SVG character built from scratch using the PNG assets as visual references.
Next Step: Commit with a focused message and push to `origin/main`.

## Scoreboard

Current Score: 50/100
Score Source: provisional
Last Updated: 2026-06-19 22:41:13 Asia/Seoul

Score Rationale: The user has not provided an explicit numeric score, so the workflow satisfaction score remains capped at 50. Separately, the final technical verification score is 96/100 because the pure SVG anime character replacement passes baseline verification, served SVG runtime verification, whitespace checks, and package dry-run. The remaining risk is visual polish because the in-app browser surface was unavailable for a human-visible screenshot in this session.

What Improved: The runtime character is now a pure SVG anime companion with lavender hair, purple eyes, blush, pastel styling, and runtime-toggleable heart eyes. TypeScript preview renderers share the new anime rig. The browser runtime mutates the new `ellipse` and `path` based face elements instead of old rectangle pixels. Generated assets have been synchronized with the source renderers. Current docs now distinguish the active pure SVG anime path from historical PNG overlay proposals.

What Remains Unsatisfactory: The browser script necessarily keeps a compact duplicated pose mapping, so future polish should consider sharing more rendering data if the project grows. The current SVG is MVP-level hand-authored art, not a pixel-perfect vector trace of the references.

Actions To Raise Or Maintain Score: Commit and push the verified change. Later visual polish can add richer hair/detail variants or stronger eye/mouth shape variants without changing the model/planner boundary.

Score History:
- 2026-06-19 20:10:09 Asia/Seoul: provisional 50/100. User approved pure SVG anime character replacement based on assets `1.png` through `6.png`; score remains capped because no explicit user score was provided.
- 2026-06-19 20:14:34 Asia/Seoul: provisional 42/100. Inspection completed and the exact old-contract coupling is known, but implementation has not yet replaced the character.
- 2026-06-19 20:20:38 Asia/Seoul: provisional 50/100. Implementation is in place and initial checks pass; technical verification score is 76/100 pending served runtime checks and final review.
- 2026-06-19 22:41:13 Asia/Seoul: provisional 50/100. Final technical verification score is 96/100. `npm run verify`, `npm run verify:runtime`, `git diff --check`, and `npm pack --dry-run` all pass. Remaining risk is visual polish, not runtime/package correctness.

## Objective

Replace the current SVGotchi visual character with the character the user referenced through `assets/1.png`, `assets/2.png`, `assets/3.png`, `assets/4.png`, `assets/5.png`, and `assets/6.png`, while keeping the project as an SVG-first MVP. The final runtime should still be SVGotchi: a served SVG app document with browser-local model mode, a pure SVG prompt surface, app-owned transition planning, deterministic animation, and no backend inference. The visual pet should no longer be the Mochi Sprout blob. It should instead be a simplified anime-style SVG character inspired by the provided reference assets.

This work is not a PNG overlay implementation. The reference assets are visual guidance. The final runtime character should be composed from SVG elements such as groups, paths, ellipses, circles, rects, gradients, masks, and clip paths as needed. The SVG should be editable and controllable by the existing emotion pose system. The model must not generate or mutate SVG. The planner must still output only bounded enum-like TransitionPlan values that the deterministic renderer applies.

The replacement should target MVP fidelity rather than trying to reproduce a full illustration. The user explicitly wants the character changed now; therefore the correct implementation should make the app visibly become the anime character even if some later polish remains possible. The design should capture the important visual identity from the references: pale face and torso, long white/lavender hair, purple eyes, small mouth, soft blush, and pastel decorative styling. The rig should expose stable IDs and emotion-controlled properties so existing tests and browser checks can prove behavior.

## Reference Interpretation

The reference assets have a useful layer-like structure:

- `assets/1.png` is a full composed reference illustration. It shows the desired character identity: white/lavender anime hair, purple eyes, gentle face, blush, ribbons, and pastel clothing.
- `assets/2.png` is a base head and upper body layer with no hair, eyes, or mouth. It informs the face shape, neck, shoulders, and skin tone.
- `assets/3.png` is a hair layer. It informs the long white/lavender hair mass, bangs, side locks, braid-like side details, and bow/flower accents.
- `assets/4.png` is an eye layer. It informs the purple eyes, eyelash direction, highlight style, and placement.
- `assets/5.png` is a small mouth layer. It informs the neutral small mouth and position.
- `assets/6.png` is a blush layer. It informs soft pink cheek placement and opacity.

These assets should not be rendered directly in the app if the user wants everything converted to SVG. They may remain in the repository as reference inputs. They should not become required runtime files. `package.json` does not need to include them for runtime if no code loads them, but they may already be committed as reference assets. The app should work from SVG code and existing JavaScript/TypeScript.

## Confirmed Constraints

The runtime must remain SVG-facing. The primary app route must still serve an SVG app document, not an HTML wrapper. The prompt input should remain pure SVG. No `foreignObject`, HTML input, HTML button, form, contenteditable surface, canvas, React, DOM framework, or backend prompt-processing route should be introduced.

The model/runtime boundary must not change. Browser-local Transformers.js and local ONNX assets remain the model path for full mode. The localhost server remains a static file server only. No hosted inference, external API, runtime model download, or backend model execution is allowed.

The model must not generate pet reply text, raw SVG, raw path data, CSS, JavaScript, DOM selectors, arbitrary animation code, overlay names, or frame SVG. It may only influence the app through the existing sanitized TransitionPlan boundary.

The existing emotion catalog can remain. The character replacement should reuse the current `Emotion` enum and pose mapping surface rather than introducing a new emotion schema. The pose parameters may be extended or reinterpreted only if needed to support the new anime rig. Any extension must remain deterministic, app-owned, and testable.

The work should not implement the deferred semantic routing pipeline. The user asked for the character only. Planner source-sharing and semantic nuance remain separate future work unless the character implementation directly requires a small rendering adjustment.

The work should not implement PNG-preserving overlay Gate X. This is a different direction. The correct output is a pure SVG anime-style character, not a base PNG plus overlay SVG.

## Safe Assumptions

The desired character does not need to be a pixel-perfect vector trace of the PNG references. Pixel-perfect tracing would be slow, brittle, and likely poor code health. The MVP target is a stylized SVG rig that clearly resembles the reference character and is good enough to replace the current Mochi Sprout character in the app.

The app can continue using the same 100x100 SVG coordinate system. The new anime character will be simplified to fit the existing compact app layout. The full reference image is a bust portrait; the SVG character should also be a bust portrait rather than a tiny full-body sprite. The prompt and status UI can remain in the lower area, but the character may need a slightly different bounding box from Mochi Sprout.

The current tests can be updated to enforce the new visual contract rather than the old black-and-white Mochi Sprout contract. For example, a test that required only black and white literals should be changed because the new anime character intentionally uses pale skin, lavender hair, purple eyes, and blush.

The browser runtime can initially use the same character shape definitions as the TypeScript base asset, even if that requires updating both `src/character/baseCharacter.ts` and `assets/svgotchi-browser.js`. This duplication already exists; the goal is to keep them consistent for this change, not to solve source-sharing in the same workstream.

## Work Sequence

### Phase 1: Inspect Current Character Surfaces

Read the character source files and tests that define the current rig contract. Identify which IDs are required and which renderer functions mutate them. Confirm how `assets/base-character.svg` is generated or compared in tests. Inspect `assets/svgotchi-browser.js` to see which DOM IDs it directly mutates when rendering poses.

The main files expected to matter are:

- `src/character/baseCharacter.ts`
- `src/character/characterContract.ts`
- `src/character/requiredRigIds.ts`
- `src/character/rig.ts`
- `src/character/validateCharacterRig.ts`
- `src/emotion/poseMap.ts`
- `src/render/renderer.ts`
- `assets/base-character.svg`
- `assets/svgotchi-browser.js`
- `tests/characterContract.test.ts`
- `tests/poseMap.test.ts`
- `tests/validateCharacterRig.test.ts`

### Phase 2: Define The New SVG Rig

Replace the old Mochi Sprout body with a new anime bust rig. The rig should include stable IDs for major animated layers:

- root group for the pet;
- hair group;
- body/shoulder group;
- face/head group;
- left and right eye groups;
- mouth group;
- brow or eyelid group if needed;
- blush group;
- effects group.

Where possible, preserve existing required IDs if tests and renderer expect them. If the existing IDs are generic enough, such as `pet-body`, `pet-left-eye`, `pet-mouth`, `pet-blush`, and `pet-effect`, reuse them so the renderer stays simple. If new IDs are necessary, update the required ID contract and all validators consistently.

The visual design should use pure SVG primitives and paths. Use gradients only if they remain inline SVG and do not load external resources. Keep the design readable and maintainable. Do not paste generated massive path dumps unless unavoidable. Prefer a few hand-authored shapes that communicate the character.

### Phase 3: Adapt Pose Rendering

Map the existing pose parameters onto the new character. The renderer should continue using emotion-driven pose values to change eye shape, mouth shape, brow/eyelid expression, blush opacity, body transform, and effect visibility. The new character should visibly react to happy, shy/love, sad, angry, scared, surprised, sleepy, hungry, curious, grateful, and neutral states at minimum. It does not need thirty bespoke illustrations; it does need enough visual difference that the app no longer feels like a static portrait.

Blink support should be included at least as a controllable eye/eyelid state if the current runtime path can support it without large architecture changes. If full automatic blink timing is too broad for this slice, the renderer should at least have an eye preset that makes blink or closed-eye states possible for sleepy, shy, and love poses.

The browser runtime must be updated together with the TypeScript renderer. The served SVG proof should show the new character and still animate the selected emotion.

### Phase 4: Update Tests And Generated Assets

Update tests that enforce the old visual identity. Replace black-and-white-only checks with checks that match the new contract: no external image references in runtime SVG, no `foreignObject`, no HTML controls, required anime rig IDs are present, color palette includes expected pastel/lavender/purple/blush tokens, and base asset matches the exported SVG source.

Update `assets/base-character.svg` to match the new `BASE_CHARACTER_SVG`. If it is generated manually in this project, update it directly from the source string. If a helper exists, use the local pattern already present in tests.

Do not add the PNG assets to `package.json` runtime files unless runtime code loads them. Since this task converts the character to pure SVG, the PNGs should remain reference assets, not required package files.

### Phase 5: Verify Runtime And Package Boundaries

Run focused tests first, then the broader verification. At minimum:

- `cmd /c npm test`
- `cmd /c npm run verify`
- `cmd /c npm run verify:served-svg`

If full model assets are present, run:

- `cmd /c npm run test:model`
- `cmd /c npm run verify:release`

Run package dry-run if `package.json` or package assets changed. Confirm that no large model/runtime payloads are included. Confirm that no PNG runtime dependency is accidentally introduced.

### Phase 6: Commit And Push

After verification passes, commit the character replacement separately from the initial MVP commit. Use a terse commit message such as `Replace character with SVG anime rig`. Push to `origin/main`, since the repository has already been created and the current local branch tracks `origin/main`.

## Acceptance Criteria

The served SVGotchi character must visibly no longer be Mochi Sprout. It must be an anime-style SVG character inspired by the provided assets, with white/lavender hair, purple eyes, pale face/body, small mouth, and blush.

The app must remain SVG-first. No runtime image tags pointing at the PNG references should be required for the character. No canvas or HTML wrapper should be introduced.

The existing local model and deterministic transition pipeline must continue to work. The prompt `you are cute` should still transition to a shy/love/happy type state, but it should now animate the new anime character.

Tests must reflect the new character contract. Old monochrome-only assertions must not remain as false constraints. New assertions should prove the new rig is valid, bounded, and rendered from code.

The package and Git boundaries must remain safe. Model/runtime payloads remain ignored. Reference PNGs can remain in Git, but the runtime should not require them. If no runtime code loads `assets/1.png` through `assets/6.png`, package `files` does not need to include them.

The work must end with a clean git state after commit and push, unless an environmental blocker prevents pushing. If pushing is blocked, the local commit should still exist and the blocker should be stated.

## Risks And Mitigations

The largest visual risk is under-delivering the character identity. A too-simple set of ellipses might pass tests but not satisfy the user's actual request. Mitigation: use the reference assets to include the important identity markers: long pale hair, purple eyes, small mouth, blush, and soft pastel anime styling.

The largest architectural risk is widening the work into a full renderer rewrite. Mitigation: keep the current emotion and pose architecture, and only change the character shapes and renderer mappings needed to animate the new rig.

The largest verification risk is browser runtime divergence. The TypeScript renderer and browser runtime both contain rendering logic. Mitigation: update both and run served SVG verification.

The largest package risk is accidentally depending on PNG runtime assets. Mitigation: use pure SVG and keep PNGs as references only.

## Definition Of Done

The goal is done when the current app source and served SVG runtime use a pure SVG anime character based on the user's referenced assets, the previous Mochi Sprout visual is no longer the runtime character, tests and served SVG verification pass, the work is committed and pushed to GitHub, and current evidence proves no runtime model/server/security boundary regressed.
