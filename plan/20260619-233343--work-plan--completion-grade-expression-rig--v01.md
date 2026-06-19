# Completion Grade Expression Rig Work Plan

Plan Type: work-plan
Workstream: completion-grade-expression-rig
Version: v01
Status: Verified; commit and push remain
Created: 2026-06-19 23:33:43 Asia/Seoul
Last Updated: 2026-06-20 00:26:36 Asia/Seoul
Supersedes or Related Plan: Supersedes the active visual scope of `plan/20260619-225848--work-plan--exact-png-character-rig--v01.md`. That prior plan corrected the base character identity by rendering `assets/1.png`, but it intentionally hid the face rig and left the visible interaction dominated by transform motion. This new plan keeps the exact uploaded PNG as the base identity and adds a real visible expression layer so the app can feel complete rather than like a tilted static picture.
Current Completion State: Verified locally; commit and push remain.
Completed So Far: The repository is on `main` and aligned with `origin/main` at commit `36b03f3`, which uses `assets/1.png` as the visible character base. This plan has now added a visible SVG expression overlay rig with face-cover patches, eyes, eye shines, heart eyes, brows, mouth, blush, stronger effects, preview rendering, strengthened tests, and served DOM verification evidence. The pose sheet was screenshot-reviewed after fixing a double-translate preview bug, and all 30 cells now show the character in-cell with visible non-neutral expressions. `npm run verify`, `npm run verify:runtime`, `git diff --check`, and `npm pack --dry-run` passed. The test suite now has 40 tests. Served demo probes passed for `you are cute -> shy_love`, `i am sad -> sad`, `i hate this -> angry`, `are you there? -> surprised`, and `sleep now -> sleepy`, each with active face overlay evidence. Full mode also passed for `you are cute -> shy_love`. The current local worktree still has one pre-existing unstaged `package-lock.json` modification that is unrelated and should remain excluded unless separately approved.
Remaining Work: Stage only intended files, commit, push, and report the focused result.
Current Blockers: None. The main constraint is visual: the uploaded PNG is a flattened image, so emotion states cannot literally move the original pixels of the eyes and mouth. The safest completion-grade path with current assets is to preserve the exact PNG for neutral/base identity and place app-owned SVG expression patches and features over the face during emotion states.
Next Step: Stage only intended files, commit, push, and report the visual/technical verification result.

## Scoreboard

Current Score: 50/100
Score Source: provisional
Last Updated: 2026-06-20 00:26:36 Asia/Seoul

Score Rationale: The user has not provided a numeric score, so this remains capped at 50 by the local provisional-score rule. Technical and visual confidence is materially higher than before because the character now has visible SVG expression overlays, strengthened expression tests, a corrected pose sheet layout, screenshot inspection, and served prompt probes that prove face overlay state and geometry changes. The score is not marked complete because the user has not yet accepted the result as "finished."

What Improved: The exact PNG base remains, but non-neutral emotions now visibly change eyes, mouth, brows, blush, and effects. Runtime verification now inspects `data-face-overlay`, cover opacity, mouth path, and eye geometry instead of only checking final emotion labels.

What Remains Unsatisfactory: The expression system is still an SVG overlay on a flattened PNG, not true raster facial animation from separate approved eye/mouth assets. Some overlays are intentionally stylized and may still need subjective tuning after user inspection.

Actions To Raise Or Maintain Score: Finish broad verification, commit and push the focused result, keep the local demo running for user inspection, and continue visual tuning if user feedback identifies a specific expression or alignment issue.

Score History:
- 2026-06-19 23:33:43 Asia/Seoul: provisional 35/100. User approved the completion-grade expression work after rejecting transform-only behavior.
- 2026-06-20 00:21:58 Asia/Seoul: provisional 50/100. Visible expression overlay rig is implemented and partially verified; provisional score is capped by workflow until user gives an explicit score.
- 2026-06-20 00:26:36 Asia/Seoul: provisional 50/100. Broad verification, runtime verification, package dry-run, and representative prompt probes passed; provisional score remains capped pending explicit user acceptance.

## Objective

Make SVGotchi feel like a finished character app rather than a static image with motion. The visible character must still use the user's uploaded `assets/1.png` as the base identity, because the user previously rejected approximate redraws and asked for the character to match the uploaded asset exactly. However, the character must also visibly react with real expression changes. A completed result should show meaningful differences in eyes, mouth, brows, blush, and emotion effects when the user prompts happy, love, sad, angry, scared, surprised, sleepy, curious, and other supported emotion states.

The project does not currently have separate clean eye, mouth, or face layer assets. The uploaded base PNG is a flattened raster image. Therefore, the practical requirement is not to magically edit the original facial pixels; it is to build a convincing SVG expression overlay on top of the exact PNG base. The neutral state should preserve the uploaded image as closely as possible. Non-neutral states may intentionally cover the original eye and mouth areas with face-colored mask patches before drawing new expression features. That creates visible expression changes without replacing the character identity or returning to the rejected hand-authored full-character approximation.

The app must remain an SVG document served by the existing local static server. The prompt input must remain SVG-owned. Browser-local model mode and deterministic demo mode must continue to work. The model still must not generate SVG, DOM selectors, CSS, paths, image URLs, or reply text. Expression rendering must be app-owned and bounded by existing sanitized `TransitionPlan` and `Pose` data.

## Confirmed Problem

The current implementation after commit `36b03f3` renders `assets/1.png` exactly, but it hides the expression layer. That was a deliberate tradeoff for the exact asset requirement, but it now fails the user's broader quality expectation. The pose data still contains eye and mouth variants such as `happy_closed`, `wide`, `sharp`, `sad`, `heart_like`, `big_smile`, `sad_curve`, `surprised_o`, and `pout`. The browser runtime still calls `setEyes`, `setMouth`, `setBrows`, and blush/effect updates. Those calls currently do not create visible facial expression changes because the base SVG's `face` group has opacity zero and the preview renderer omits `renderAnimeFace` from `renderAnimeCharacter`.

The failure is therefore structural, not just tuning. The project has expression semantics but no visible expression layer. Fixing it requires reintroducing the face layer in a way that does not make the character look like two faces stacked on top of each other. Simply setting `.face-slot { opacity: 1 }` would be too crude because the original PNG eyes and mouth would remain visible underneath. A completion-grade MVP needs a facial patch layer that covers the flattened face details when the overlay expression is active.

## Design Intent

The smallest complete design is a reusable SVG expression overlay rig. It should sit inside the existing `pet` group above `character-image`. It should keep required rig IDs stable so validators and runtime code continue to work. It should add new face mask or patch elements that are visible only when an overlay expression is active. It should draw eyes, eye shines, heart eyes, brows, mouth, blush, and effects with consistent styling. It should expose enough DOM IDs for the existing browser runtime to mutate state without regenerating raw SVG strings.

The base state should be honest:

- Neutral can keep the overlay mostly hidden so the uploaded PNG remains exact.
- Non-neutral can show face patches and SVG expression features because the user explicitly wants visible expression changes.
- The result should not claim full pixel-perfect facial animation. It should claim a visible SVG expression overlay on top of the exact uploaded character base.

The visual style should respect the uploaded anime asset. The overlay should use dark facial strokes, white/bright highlights, soft blush, pink hearts, blue tears, yellow sparkles, and red anger marks. It should avoid oversized cartoon marks that look disconnected from the original face. Coordinates should be tuned for the rendered character inside the current `0 0 100 80` pet region.

## Scope

In scope:

- Preserve `assets/1.png` as the base character image.
- Add a visible SVG face overlay above the base image.
- Add expression mask patches so non-neutral eyes and mouth do not double with the flattened PNG face.
- Use the existing 30-emotion `POSE_MAP` to drive visibly different eyes, mouth, brows, blush, body motion, and effects.
- Update `assets/svgotchi-browser.js` so the overlay has a clear enabled or disabled state per pose.
- Update `src/render/animeRig.ts` so pose sheet and transition previews render the same expression overlay seen at runtime.
- Update `src/character/baseCharacter.ts` and generated `assets/base-character.svg` so the base document contains all required visible overlay nodes.
- Update tests to prove expression geometry and overlay visibility change by emotion.
- Add or strengthen runtime tests so demo prompt examples result in different visible facial states, not only different `data-current-emotion`.
- Update docs and plan score status to make the expression contract clear.
- Run `npm run verify`, `npm run verify:runtime`, `git diff --check`, and a packaging check if package surfaces changed.
- Commit and push a focused change.

Out of scope:

- Creating new raster expression assets with an AI generator.
- Pixel-perfect segmentation of the uploaded PNG.
- Manual professional illustration of 30 fully unique raster faces.
- Replacing the local model.
- Sending prompts to a backend.
- Introducing React, canvas, HTML forms, or a non-SVG UI.
- Including all reference PNGs in the npm package unless a later implementation actually uses them.
- Touching unrelated `package-lock.json` modifications.

## Expression Overlay Contract

The overlay should have three visible layers:

1. A patch layer for non-neutral expression states. This layer covers the original flattened eyes and mouth with small face-colored shapes. It must be subtle and placed only over the face. It should not cover hair, clothing, or the overall body. It should have a controlled opacity so it blends into the existing face area instead of becoming an obvious sticker.
2. A feature layer for eyes, mouth, brows, highlights, heart eyes, and blush. Existing IDs such as `eye-left`, `eye-right`, `mouth`, `brow-left`, `brow-right`, `blush-left`, and `blush-right` should remain. Missing shine and heart IDs that the runtime already tries to access should be added to the base SVG so the runtime can actually control them.
3. An effects layer for hearts, sparkles, tears, zzz, question, and anger marks. These exist today and should be made visually stronger where needed.

The overlay needs a state signal that tests and runtime can inspect. A simple `data-face-overlay` attribute on `#face` or an opacity value on a patch group is enough. The implementation should avoid broad DOM rewrites. It should rely on attributes and class styling, which matches the current runtime style.

Neutral behavior should be deliberate. The neutral pose can set face patch opacity to zero and feature opacity to zero so the asset stays exact. It may still leave invisible rig anchors present. If the neutral state needs very small visible features to prevent a sudden jump, it should be minimal. The main acceptance risk is the user's complaint that nothing changes, so non-neutral states must be obvious.

## Emotion Coverage Expectations

All 30 emotions must produce visible differences across at least one of these dimensions:

- eye shape;
- mouth shape;
- brow shape;
- blush opacity;
- effect type and opacity;
- body offset, scale, or rotation.

For perceived completion, the important standard is stronger than "at least one property changed." Major emotion groups must look semantically different:

- Joy and affection should show closed happy eyes, big smiles, sparkles, hearts, and blush.
- Shy or attached states should use smaller smiles, worried or soft brows, stronger blush, and gentle tilt.
- Sad, lonely, hurt, and apologetic states should use sad eyes, worried brows, downturned or trembling mouths, and tears.
- Angry, annoyed, jealous, and sulky states should use sharp or half-closed eyes, angry brows, zigzag or pout mouths, and anger marks.
- Scared and nervous states should use wide eyes, worried brows, open or zigzag mouths, and question or tear effects.
- Surprised, confused, curious, and thinking states should use wide or raised expressions and question effects.
- Sleepy, tired, and bored states should use half-closed eyes, flat or sad mouths, zzz effects, and lower body posture.

This work should not pretend that every emotion has a professional bespoke expression. It should make the existing catalog visibly legible enough that a user can tell the character is reacting instead of being transformed as a static image.

## Runtime Behavior

The runtime already has a bounded pipeline:

- prompt text is entered in the SVG prompt;
- demo or local model classification returns labels and scores;
- a sanitized transition plan maps into allowed emotion, motion, effect, blush, easing, and timing values;
- frames interpolate between poses;
- DOM nodes are mutated in `renderPose`.

This pipeline should remain. The implementation should strengthen `renderPose` so each pose controls:

- pet transform;
- face overlay visibility;
- patch opacity;
- eye geometry and opacity;
- eye shine and heart-eye visibility;
- mouth geometry;
- brow geometry and opacity;
- blush opacity;
- effect opacity.

The runtime should not insert arbitrary innerHTML from the model or prompt. It should not parse SVG from model output. The expression overlay should be created in the base document and controlled through safe attribute updates.

## Preview Behavior

Generated previews are important because they make the difference reviewable without relying only on manual browser interaction. The pose sheet should show the uploaded PNG with the expression overlay for every emotion. The transition preview should show frame-to-frame expression changes, not only transform motion. If preview cells are too small for detailed faces, the overlay can be slightly stronger in preview mode while staying consistent with runtime geometry.

The preview renderer should reuse shared rendering functions where practical. It should not create a second unrelated face drawing style. If runtime uses patch plus face features, preview SVG should use the same patch plus face features.

## Testing Strategy

Tests need to stop rewarding transform-only behavior. Existing tests that count image references are still useful, but they are not enough. Add or update tests so they prove:

- the base SVG includes the approved `character-image` reference to `/assets/1.png`;
- the base SVG includes visible-capable expression nodes, including mask or patch elements, eye shines, heart-eye nodes, brows, mouth, blush, and effects;
- the face group is not globally hidden in a way that prevents runtime expression rendering;
- neutral preserves the base image by keeping overlay patches hidden or inactive;
- representative non-neutral poses activate face overlay and produce different eye/mouth/brow/effect geometry;
- the pose sheet renders expression overlays for all 30 emotions;
- transition previews include expression overlays across frames;
- runtime browser JS contains the expected nodes and can set overlay state;
- served demo prompt probes still map to expected emotions and now expose evidence of visible face state changes.

Verification should include both static tests and served runtime probes. If a Playwright-based served SVG verifier already exists, extend it to inspect DOM attributes for face overlay state after prompts. If screenshots are practical within the current tooling, take them for neutral, love, sad, angry, and surprised. If screenshot tooling is not available, DOM evidence plus generated preview artifacts can serve as the minimum automated proof.

## Documentation Strategy

Docs should be candid. They should not say the app has full raster expression assets. They should say:

- the base character identity is the uploaded `assets/1.png`;
- the app renders an SVG expression overlay for visible reactions;
- neutral remains closest to the exact uploaded asset;
- non-neutral emotion states intentionally overlay eyes, mouth, brows, blush, and effects;
- current assets still do not provide separate true eye and mouth PNG layers, so the overlay is an app-owned SVG expression rig.

The docs should also remove language that could make the current result sound done when it is only transform-based. The goal is to avoid the same mismatch happening again.

## Implementation Phases

### Phase 1: Scan And Coordinate Calibration

Read the current generated base SVG, browser runtime, pose map, preview renderer, character contract, and tests. Confirm the active coordinate positions for the rendered PNG and the face area. The current face anchors around x 37 to 63 and y 30 to 55 are probably close, but they were inherited from the rejected vector face and may need tuning for the uploaded PNG. Use visual inspection of `assets/1.png` and generated SVG layout if needed.

The output of this phase should be a concrete placement decision for patch and feature nodes. It does not need a new abstraction if a few constants are sufficient.

### Phase 2: Build Base Overlay Rig

Update the base character SVG source so the `face` group is not globally invisible. Add a patch group and any missing child nodes referenced by the runtime. Keep existing IDs stable. Add styles for face patches, eyes, shines, heart eyes, mouth, brows, blush, and effect strokes. Make the default neutral state non-destructive by using opacity zero for overlay patches and features until runtime sets a non-neutral pose.

The patch layer should be big enough to cover the original flattened eyes and mouth when active, but not so large that it visibly paints over the character's whole face. The face style should be polished enough for a small SVG app: clean strokes, rounded caps, consistent colors, and no accidental overlaps.

### Phase 3: Strengthen Runtime Pose Rendering

Update browser runtime pose rendering so each pose controls overlay visibility. Non-neutral expressions should activate patch and feature opacity. Heart eyes should hide normal eyes and shines. Closed eyes should use lines or flattened ellipses rather than leaving old ellipses visible. Mouth shapes should be visible and semantically distinct. Brow styles should show only when relevant. Blush should be obvious for affection and shy states.

Avoid using model output to drive raw DOM. All values should continue to come from bounded pose names and numeric pose fields. Keep animation frame scheduling unchanged unless a small adjustment is needed to avoid flicker.

### Phase 4: Update Preview Rendering

Update the preview renderer so `renderAnimeCharacter` renders body, face overlay, and effects. Generated pose sheet and transition previews should be regenerated. The preview should make expression differences obvious enough to review in static SVG artifacts.

### Phase 5: Update Tests And Docs

Adjust tests that previously expected no expression overlay. Add tests that assert face overlay nodes exist and that representative emotions produce materially different visible SVG output. Update documentation and review notes to describe the exact base plus SVG expression overlay design.

### Phase 6: Verify Runtime

Run the normal verification suite. Run served runtime verification. Confirm demo prompts such as `you are cute`, `I am sad`, `I hate this`, `are you there?`, and `sleep now` map to visibly different expression states. Where automation can inspect the DOM, assert that face overlay data or opacity changes from neutral to the target state and that mouth/eye/brow attributes differ.

### Phase 7: Review, Commit, Push

Review the diff for scope creep, dead code, and claims that exceed evidence. Leave unrelated `package-lock.json` out of the commit. Commit with a message that reflects the real change, such as `Add visible expression overlay rig`. Push to `origin/main`. Report the commit hash, verification results, current provisional score, and any honest remaining limitation.

## Acceptance Criteria

The result is acceptable for this phase only if:

- the default character still uses `assets/1.png` as its base;
- neutral does not look like the rejected hand-drawn replacement;
- non-neutral emotions visibly change the face, not just transform the whole image;
- at least happy/love, sad, angry, surprised, sleepy, and curious states are obviously different at a glance;
- all 30 emotions have a distinct pose mapping that changes facial features, effects, or both;
- runtime and previews use the same expression concept;
- tests prove expression variation rather than only image reference and transform behavior;
- served SVG demo and full verification still pass;
- package contents remain controlled;
- the final commit is focused and pushed.

## Risks And Mitigations

The main visual risk is that overlay patches could look like stickers on the PNG. Mitigation: keep patches small, face-colored, and active only when expressions change. Tune opacity and stroke weights through generated previews and browser inspection.

Another risk is that the overlay may not align perfectly with the uploaded face. Mitigation: start from the existing face anchors, inspect the rendered result, and adjust coordinates surgically. Do not attempt a broad redesign if a few coordinate changes solve the visible mismatch.

Another risk is overclaiming completion. This plan should not say the project has true 30-frame raster animation. It should say the app has an exact uploaded PNG base plus SVG expression overlay, which is the best current path without additional layered expression assets.

Another risk is test weakness. A green test suite that only checks file presence would not prove the user-visible issue is fixed. Mitigation: add explicit expression-variation tests and served DOM evidence.

Another risk is package or git noise. Mitigation: do not stage `package-lock.json` unless this task changes dependencies or install state. Do not include reference PNGs `assets/2.png` through `assets/6.png` unless they become runtime dependencies.

## Definition Of Done

This work is done when a user can open the local demo, type representative prompts, and see the character's face actually change. The implementation must keep the uploaded PNG base, add visible SVG expression overlays, preserve the local-only model and sanitized planner boundary, update previews and docs, pass verification, and land in a focused pushed commit. The final report should be honest: if the overlay is visibly improved but not professional-grade raster animation, say so. The long-term goal remains the user's standard of "I can feel this is complete," so if verification or visual review still suggests a static-photo feel, continue improving rather than marking the goal complete.
