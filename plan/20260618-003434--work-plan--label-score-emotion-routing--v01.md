# Label/Score Emotion Routing Work Plan

Plan Type: work-plan
Workstream: SVGotchi model-label to pet-emotion routing correction
Version: v01
Status: Complete
Created: 2026-06-18 00:34:34 Asia/Seoul
Last Updated: 2026-06-18 00:37:13 Asia/Seoul
Approval: User said "시작" after approving the simple label/score mapping direction.

## Objective

Fix the planner so the model's raw emotion label determines the pet emotion family and the model score determines expression intensity. Remove the incorrect rule where ordinary `sad` wording is converted into `comfort_request` and then into `comforted`.

## Scope

- Keep the selected Tanaos classifier model.
- Keep the character renderer and transition engine.
- Keep the LLM/model boundary: no reply text, raw SVG, DOM patch, CSS, JavaScript, or path generation.
- Update `src/llm/localTransitionPlanner.ts` as the canonical planner.
- Update `assets/svgotchi-browser.js` so the served SVG runtime matches the canonical planner.
- Update tests for corrected routing examples.

## Intended Routing

- `model label` chooses the base pet emotion.
- `model score` and top-label margin choose `TransitionPlan.intensity`.
- `sadness` maps to `sad` or `disappointed`, not `comforted`.
- `comforted` is only an explicit support-request exception such as `comfort me`, `help me`, `hug me`, or `cheer me up`.
- Explicit pet-state requests may still map to app-owned states such as `hungry` or `sleepy` because the classifier does not have hunger or sleep labels.

## Verification

- Add/adjust planner tests for `I'm sad`, `I'm sad but you are comfortable?`, `I'm sad, comfort me`, `you are cute`, `I love you`, `are you hungry?`, and `go to sleep`.
- Run `npm run verify`.
- Run `npm run verify:release` if the base verification passes.

Completed verification:

- `cmd /c node --test tests\llmPlanner.test.ts`: passed.
- `cmd /c npm run verify:release`: passed.
- Full served SVG regression check passed: `node scripts\verify-served-svg.ts --full --prompt "I'm sad but you are comfortable?" --expect sad`.

Corrected example:

- Model raw top result: `sadness 0.9253530502319336`.
- Old app result: `comforted 1.0`.
- New app result: `sad 1.0`.

## Scoreboard

Current score: 50
Score source: provisional
Last updated: 2026-06-18 00:37:13 Asia/Seoul

Score rationale: The user has not provided an explicit numeric score. The previous served full-local integration scored 96/100, but this work addresses a real behavioral routing bug, so the local workflow score remains provisionally capped at 50 until user scoring.

Score history:

- 2026-06-18 00:34:34 Asia/Seoul: provisional 50. Work started for label/score routing correction after explicit user approval.
- 2026-06-18 00:37:13 Asia/Seoul: provisional 50. Routing correction completed and verified; score remains capped because no explicit numeric user score was provided.
