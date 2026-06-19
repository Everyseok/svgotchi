# Label/Score Emotion Routing Review

Reviewed: 2026-06-18 00:37:13 Asia/Seoul
Scope: `src/llm/localTransitionPlanner.ts`, `assets/svgotchi-browser.js`, `tests/llmPlanner.test.ts`, `scripts/verify-served-svg.ts`, and plan records.

## Result

Overall score: 96/100

The routing bug is fixed. The model's raw emotion label now maps to the pet emotion family without converting ordinary `sad` statements into `comforted`. The model score and top-label margin still drive `TransitionPlan.intensity`.

## Old Mapping Problem

| Input | Model top result | Old app intent | Old app result |
| --- | --- | --- | --- |
| `I'm sad but you are comfortable?` | `sadness 0.925...` | `comfort_request` | `comforted 1.0` |

## Corrected Mapping

| Input | Model top result | New app intent | New app result |
| --- | --- | --- | --- |
| `I'm sad but you are comfortable?` | `sadness 0.925...` | `question` | `sad 1.0` |
| `I'm sad` | `sadness` | `unknown` | `sad 1.0` |
| `I'm sad, comfort me` | `sadness` | `comfort_request` | `comforted 1.0` |
| `comfort me` | `sadness` | `comfort_request` | `comforted 1.0` |
| `you are cute` | `joy` | `compliment` | `shy_love` |
| `I love you` | `joy` | `affection` | `love` |
| `are you hungry?` | `neutral` | `feed` | `hungry` |
| `go to sleep` | `neutral` | `sleep` | `sleepy` |

## Verification

- `cmd /c node --test tests\llmPlanner.test.ts`: passed.
- `cmd /c npm run verify:release`: passed.
- `cmd /c node scripts\verify-served-svg.ts --full --prompt "I'm sad but you are comfortable?" --expect sad`: passed.

## Residual Risk

The browser runtime still duplicates a compact copy of planner rules from `src/llm/localTransitionPlanner.ts`. The duplicate was kept in sync for this fix, but future routing changes must update both locations until a source-sharing/browser-build decision is approved.
