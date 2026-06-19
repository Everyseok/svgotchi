# Stage 7: Local LLM Transition Planner

## Goal
Implement the approved local-only model runtime and TransitionPlan planner.

## Required Work
- Implement modelRuntime.ts, localTransitionPlanner.ts, transitionPlanSchema.ts, and sanitizeTransitionPlan.ts.
- Ensure no runtime network calls, no backend server, and no external API.
- Ensure model output is constrained and sanitized.
- Ensure model only produces or maps to TransitionPlan.
- Derive TransitionPlan intensity as app-owned expression strength on a 0.0-1.0 scale, quantized to 0.1 increments.
- Do not treat classifier confidence as identical to emotion intensity; use confidence as one input to app-owned strength mapping.
- Support partial target-pose interpolation so ambiguous inputs can stop partway toward the target emotion.
- Surface a hard model-unavailable/model-invalid status if runtime loading or inference fails.
- Do not silently switch to a deterministic planner or any substitute planner in production mode.

## Current Evidence
- 2026-06-17 13:56:08 Asia/Seoul: `src/llm/modelRuntime.ts` uses `@huggingface/transformers` with local model assets, local ONNX Runtime WASM assets, `env.allowRemoteModels = false`, and `local_files_only: true`.
- 2026-06-17 13:56:08 Asia/Seoul: `src/llm/localTransitionPlanner.ts` maps actual classifier labels/scores into app-owned sanitized `TransitionPlan` values; the model does not generate replies, JSON, SVG, CSS, HTML, selectors, path data, or scripts.
- 2026-06-17 13:56:08 Asia/Seoul: `npm run verify` passed with 35 tests, including an actual local Tanaos model call through the installed local ONNX model and local WASM runtime.
- 2026-06-18 00:37:13 Asia/Seoul: the actual model test now asserts expected top labels and mapped emotions for clear English samples: joy/`shy_love`, fear/`scared`, sadness/`sad`, and surprise/`surprised`.
- 2026-06-17 13:56:08 Asia/Seoul: sampled direct local calls produced label/score evidence and sanitized plans:
  - `you are cute` -> `joy` score `0.8494` -> `to: shy_love`, `intensity: 0.9`
  - `I am scared` -> `fear` score `0.9360` -> `to: scared`, `intensity: 1.0`
  - `I feel sad` -> `sadness` score `0.9219` -> `to: sad`, `intensity: 0.9`
  - `I'm sad but you are comfortable?` -> `sadness` score `0.9254` -> `to: sad`, `intensity: 1.0`
  - `wow that's surprising` -> `surprise` score `0.8974` -> `to: surprised`, `intensity: 0.9`
  - `hello there` -> `surprise` score `0.5233` with close `joy` score `0.4112` -> `to: surprised`, `intensity: 0.4`
- Direct-open full local model loading was later proven unsuitable in normal Chrome and superseded by the approved npm/npx localhost static-server path.

## Stop Condition
Verify local model behavior according to the approved packaging strategy.
