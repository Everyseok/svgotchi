# SVGotchi Active Plan

## 0. Workflow Status
- Codex-Subagent-Orchestrator installed: yes
- AGENTS.md present: yes
- plan/ present: yes
- skills/ present: yes
- vendor/agent-skills/ present: yes
- active plan created: yes
- implementation allowed: yes, approved stage scope only

Implementation has progressed only through approved scopes and initial-prompt gates: Stage -1 research, Stage 0 concept selection, Stage 1 neutral base/rig, Stage 2 pose map, Stage 3 pure SVG prompt prototype, Stage 4 deterministic transition previews, the revised Gate G model selection, and the revised Stage 6 packaging review. Gate H is now approved for Strategy B. Stage 7 local model runtime and TransitionPlan planner work is implemented and verified. Direct-open SVG full local model loading failed in normal Chrome at local config fetch, so the full LLM direct-open path is superseded by the user-approved npm/npx static-server distribution direction. The runtime defaults to setup-installed `models/` and `runtime/` folders, and full local mode now uses localhost only for static SVG/JS/WASM/tokenizer/model assets while browser code owns inference. Stage 8 has a served-SVG browser integration slice: `/` serves an SVG app document, not HTML, and Chrome verifies both deterministic demo prompt-to-transition and full browser-local model prompt-to-transition. A new Gate X is now open for the proposed PNG-preserving anime character overlay rig. Overlay rig implementation is blocked until the user approves Gate X.

## 1. Current User Score
- explicit user score: not provided
- provisional score if no explicit score: 50

Score rationale: Stage -2 setup, Stage -1 research, Stage 0 concept selection, Stage 1 neutral base/rig, Stage 2 pose sheet, Stage 3 prompt prototype, Stage 4 deterministic transition previews, revised Gate G model selection, revised Stage 6 packaging review, Stage 7 local model runtime, npm/npx distribution, and the Stage 8 served-SVG integration slice remain verified. The direct-open SVG full local blocker is resolved architecturally by the approved npm/npx static-server distribution path, and full browser local model mode now has Chrome verification. Final artifact review, source-sharing refactor decisions, performance checks, and later approval gates remain open. The score remains capped at 50 because no explicit user score has been provided.

Score history:
- 2026-06-17 Asia/Seoul: provisional 45. Root workflow installation started; no explicit user score provided.
- 2026-06-17 Asia/Seoul: provisional 48. Stage -2 root workflow checklist verified; implementation remains blocked pending user approval for Stage -1.
- 2026-06-17 02:14:54 Asia/Seoul: provisional 49. User approved Stage -1 research and architecture; implementation remains blocked.
- 2026-06-17 02:19:50 Asia/Seoul: provisional 49. Stage -1 deliverables created and verified; implementation remains blocked pending Stage 0 approval.
- 2026-06-17 02:28:59 Asia/Seoul: provisional 49. Temporary handoff file `1.md` was read and deleted as requested. Stage -1 skill-based review passed with overall score 94/100; Stage 0 remains blocked pending explicit approval.
- 2026-06-17 02:30:25 Asia/Seoul: provisional 49. User clarified approval should be requested only for initial-prompt approval gates. Stage 0 character concept candidate work may proceed; final concept selection remains a required user approval gate.
- 2026-06-17 02:30:48 Asia/Seoul: provisional 49. User explicitly reminded that Hugging Face model candidate approval is also required; Gate G remains a mandatory later approval gate.
- 2026-06-17 02:34:35 Asia/Seoul: provisional 50. Stage 0 character concepts and preview SVG created; skill-based review passed with overall score 94/100; waiting for user concept approval before Stage 1.
- 2026-06-17 02:46:00 Asia/Seoul: provisional 50. User approved Mochi Sprout with black background and white-only rendering constraint; Stage 1 neutral base SVG, rig contract, validator, and tests were created and verified.
- 2026-06-17 02:49:03 Asia/Seoul: provisional 50. User reported the head/sprout visually overlapped the face; neutral base SVG was revised so the sprout connects to the body. Verification rerun passed; Stage 1 score remains 95/100.
- 2026-06-17 02:56:58 Asia/Seoul: provisional 50. User approved Stage 1 neutral base and rig contract for now, with design refinements deferred; Stage 2 30-emotion pose sheet work started.
- 2026-06-17 03:00:00 Asia/Seoul: provisional 50. Stage 2 POSE_MAP and monochrome 30-emotion pose sheet were created and verified; skill-based review passed with overall score 95/100; waiting for user pose sheet approval before Stage 3.
- 2026-06-17 03:04:20 Asia/Seoul: provisional 50. User approved Stage 2 pose sheet; Stage 3 pure SVG prompt prototype work started.
- 2026-06-17 03:06:12 Asia/Seoul: provisional 50. Stage 3 pure SVG prompt prototype modules and tests completed; skill-based review passed with overall score 94/100.
- 2026-06-17 03:07:10 Asia/Seoul: provisional 50. Stage 4 deterministic transition engine work started; next user gate is approval of five transition previews.
- 2026-06-17 03:10:59 Asia/Seoul: provisional 50. Stage 4 deterministic transition engine and five sample transition previews completed; verification passed with 28 tests and skill-based review scored 95/100; waiting for Gate F user approval before Stage 5.
- 2026-06-17 03:22:36 Asia/Seoul: provisional 50. User approved Stage 4 while requiring that the LLM must not generate pet replies. TransitionConfig and TransitionFrame now exclude reply text; preview speech bubble copy is app-owned via previewReply. Verification passed with 29 tests. Stage 5 Hugging Face model review started.
- 2026-06-17 03:27:15 Asia/Seoul: provisional 50. Stage 5 Hugging Face model review completed. Recommended candidate is `onnx-community/Qwen2.5-0.5B-Instruct`, with `onnx-community/gemma-3-270m-it-ONNX` as smaller alternative. Verification passed, no model runtime or model assets were created, and Gate G user approval is required before Stage 6.
- 2026-06-17 03:47:55 Asia/Seoul: provisional 50. User approved `onnx-community/Qwen2.5-0.5B-Instruct` and put Gemma on hold. Stage 6 packaging review completed, recommending Strategy B: SVG plus local sibling model/runtime assets, no network and no backend. Verification passed, no runtime or model assets were created, and Gate H user approval is required before Stage 7.
- 2026-06-17 03:59:10 Asia/Seoul: provisional 50. User clarified that English is the primary language target and that the pet only needs intent/emotion planning, not model-generated replies. Stage 5 and Stage 6 Qwen2.5-centered recommendations were marked superseded; revised Gate G must evaluate English-first ultra-small candidates, especially tiny GGUF plus local browser runtime options.
- 2026-06-17 04:03:36 Asia/Seoul: provisional 50. English-first correction was applied across prompt, docs, plan files, and tests. Non-English example strings were removed, IME composition support was generalized, Qwen2.5 packaging was marked superseded, and `npm run verify` passed with 29 tests.
- 2026-06-17 04:03:36 Asia/Seoul: provisional 50. Stage 5 revision review passed with overall score 95/100. Recommended revised Gate G choice is `bartowski/SmolLM2-135M-Instruct-GGUF`; task-specific classifier alternative is `onnx-community/tanaos-emotion-detection-v1-ONNX`; 3M TinyStories GGUF is proof-only.
- 2026-06-17 13:29:59 Asia/Seoul: provisional 50. User approved behavior-stability-first classifier path, selecting `onnx-community/tanaos-emotion-detection-v1-ONNX` for revised Gate G. Stage 6 packaging review was redone for Tanaos and recommends Strategy B: SVG plus local sibling Tanaos model/runtime assets, no network and no backend. Gate H approval is required before Stage 7.
- 2026-06-17 13:38:05 Asia/Seoul: provisional 50. User proposed graded emotion strength for ambiguous expressions. Stage 7 contract now requires app-owned `TransitionPlan.intensity` derivation on a 0.0-1.0 scale, quantized to 0.1 increments, and partial target-pose interpolation when intensity is below 1.0.
- 2026-06-17 13:41:27 Asia/Seoul: provisional 50. User approved Strategy B. Gate H is recorded as approved; Stage 7 local classifier runtime and TransitionPlan planner work started.
- 2026-06-17 13:56:08 Asia/Seoul: provisional 50. User rejected any substitute planner path and required actual model calls only. Runtime code now calls the local Tanaos ONNX classifier through local Transformers.js/ONNX Runtime assets with remote loading disabled; stale substitute-path wording was removed from project docs and tests; `npm run verify` passed with 35 tests.
- 2026-06-17 13:57:44 Asia/Seoul: provisional 50. Actual local model verification was strengthened to assert expected top labels and mapped emotions for clear English prompts. `npm run verify` passed again with 35 tests.
- 2026-06-17 15:11:52 Asia/Seoul: provisional 50. User opened Gate X for a PNG-preserving anime character overlay rig, clarified that blink/eye occlusion is required for release, and selected npm install plus a model download/setup script as the later full-feature distribution direction. Overlay rig implementation is blocked until Gate X approval.
- 2026-06-17 15:36:49 Asia/Seoul: provisional 50. User approved implementation of the two-tier distribution scaffold. Active work plan created at `plan/20260617-153649--work-plan--two-tier-distribution--v01.md`; scope is limited to setup/verify scripts, ignored local asset folders, `.gitignore`, and distribution documentation.
- 2026-06-17 15:42:33 Asia/Seoul: provisional 50. Two-tier distribution scaffold completed and verified; skill-based review scored 94/100; provisional score remains capped because no explicit user score was provided.
- 2026-06-17 15:47:15 Asia/Seoul: provisional 50. Runtime asset path alignment completed and verified; `createTanaosEmotionClassifierRuntime()` now defaults to the setup-installed `models/` and `runtime/` folders; review scored 95/100.
- 2026-06-17 22:13:50 Asia/Seoul: provisional 50. Direct-open SVG local asset proof completed; normal Chrome `file://` SVG failed at local config fetch; proof review scored 92/100 and created a packaging decision blocker.
- 2026-06-17 22:33:15 Asia/Seoul: provisional 50. User adopted npm/npx public distribution with localhost static serving only; the direct-open full local blocker is superseded for full local mode.
- 2026-06-17 22:45:22 Asia/Seoul: provisional 50. npm/npx public distribution scaffold completed and verified; skill-based review scored 95/100; no explicit numeric user score provided.
- 2026-06-17 23:22:31 Asia/Seoul: provisional 50. Pure-SVG served browser integration slice completed and verified; review scored 94/100; full browser model automation remains a residual manual-check item.
- 2026-06-17 23:48:24 Asia/Seoul: provisional 50. Runtime manifest and served-SVG verification were corrected; full browser-local model mode and `verify:release` now pass Chrome CDP verification; review score updated to 96/100.
- 2026-06-18 00:37:13 Asia/Seoul: provisional 50. Label/score emotion routing correction completed; `sadness` no longer maps to `comforted` unless support is explicit; `verify:release` passed.

## 2. Product Goal
- pure-SVG local-LLM Tamagotchi
- animated emotion transition
- local transition planning only
- English-first intent/emotion planning
- no remote runtime dependencies

SVGotchi must be a cute Tamagotchi-style pixel character living inside a single SVG-facing artifact. The runtime target is local LLM + deterministic SVG animation, not a web app wrapper.

## 3. Non-Negotiable Constraints
- SVG, not PDF
- no foreignObject
- no HTML input/button
- no external API
- no hosted model inference
- no backend server as primary architecture
- no localhost inference backend
- localhost static serving is allowed only for SVG, JS, WASM, tokenizer, and local model assets in the approved npm/npx full local mode
- no runtime network call
- local model assets only
- English is the primary model language target; non-English support is optional
- LLM outputs TransitionPlan only
- no raw SVG mutation by LLM
- LLM must not generate pet reply text or reply style
- deterministic animation engine
- multi-frame emotion transition
- character-first workflow
- no OpenAI API
- no Anthropic API
- no Gemini API
- no hosted Hugging Face inference endpoint
- no runtime model download
- no hidden cloud inference
- no canvas
- no React
- no DOM framework
- no raw HTML, CSS, JavaScript, path data, DOM selectors, arbitrary animation code, reply text, reply style, or frame SVG from the LLM
- model output is untrusted and must be sanitized before use
- pure-SVG prompt area only: rect/text/caret/send-zone SVG elements, no HTML controls
- IME composition support is an input robustness requirement, not a model-language priority
- classifier confidence is not identical to emotional intensity; app-owned mapping must derive expression strength
- `TransitionPlan.intensity` should support 0.0-1.0 expression strength, quantized to 0.1 increments where practical
- transitions should support partial target-pose interpolation for intensities below 1.0
- uploaded/generated PNG character pixels must remain immutable if the overlay rig path is approved
- no auto-vector-tracing, redrawing, regenerating, or silently replacing the uploaded PNG character
- expression changes in the proposed anime character path must be rendered through approved overlay rig layers above the PNG
- ordinary human-like blink is required for the proposed anime character overlay rig and must be app-owned, deterministic, and independent of model output
- full-feature distribution direction for the current local model path is npm/npx plus an explicit model download/setup script, not committing oversized model binaries directly for GitHub Pages
- two-tier distribution model is approved: Tier 1 deterministic GitHub-friendly demo without model assets; Tier 2 full local LLM mode with explicit setup, ignored local model/runtime folders, and localhost static serving only

## 4. Approval Gates
- Gate A: root workflow installation verification
- Gate B: character concept candidates
- Gate C: neutral base character SVG
- Gate D: rig coordinate contract
- Gate E: 30-emotion pose sheet
- Gate F: 5 sample transition previews
- Gate G: Hugging Face ultra-light model candidate review
- Gate H: model packaging strategy
- Gate I: local model runtime strategy
- Gate J: final SVG artifact review
- Gate X: PNG-preserving anime character overlay rig review

Approval gate policy:
- Approval requests should be limited to the real user decision gates listed in the initial prompt, not invented stage-start confirmations.
- No SVGotchi implementation files may be created before Gate A is verified.
- No Stage -1 research or architecture deliverables may begin before user approval after the Stage -2 report.
- No character image, emotion image, pose preview, sprite preview, or transition preview may be treated as approved without explicit user review.
- Hugging Face ultra-light model candidate selection is a required user approval gate at Stage 5.
- No local LLM runtime may be implemented before Hugging Face candidate review and model packaging approval.
- No packaging strategy B, C, or D may be selected silently.
- No PNG-preserving anime character overlay rig implementation may begin before Gate X is explicitly approved.
- No existing Mochi Sprout Stage 1-4 implementation may be silently replaced by the proposed overlay rig.
- No eye, mouth, blush, or expression overlay mapping may be wired into the transition engine until the overlay rig contract and preview plan are approved.

## 5. Current Stage
- stage name: Stage 8: Pure SVG Full Local Browser Integration
- status: complete for the scoped served-SVG integration slice
- entry criteria: user approved npm/npx static serving for full local mode and clarified that the runtime surface should not be an HTML page
- exit criteria:
  - `/` serves an SVG app document, not an HTML wrapper
  - localhost remains static-only and has no inference endpoint
  - browser code loads local Transformers.js and local verified model/runtime assets
  - model output remains classifier label/score only and maps to a sanitized app-owned TransitionPlan
  - prompt submission in served SVG can complete deterministic demo and full browser-local model transitions
  - no runtime network model download, hosted inference, backend prompt processing, HTML controls, canvas, React, `foreignObject`, or `dist` artifact is introduced
- blockers:
  - Gate X PNG-preserving anime character overlay rig implementation is blocked pending user approval.
  - Final release hardening and future source-sharing refactor decisions remain open but do not block the scoped Stage 8 proof.

## 6. Research Status
- documentation reviewed:
  - https://github.com/lemos999/Codex-Subagent-Orchestrator
  - local AGENTS.md from the installed workflow
  - skills/agent-skills-integration/agent-skill-routing.md
  - skills/plan-mode-default/SKILL.md
  - skills/plan-mode-default/references/coding-plan-prompt-en.md
  - skills/codex-parent-session-orchestrator/SKILL.md
  - skills/codex-subagent-orchestrator/SKILL.md
  - skills/karpathy-guidelines/SKILL.md
  - https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/script
  - https://www.w3.org/TR/svg-integration/
  - https://www.w3.org/TR/SVG/conform.html
  - https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/tabindex
  - https://developer.mozilla.org/en-US/docs/Web/API/SVGElement/focus
  - https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event
  - https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
  - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
  - https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
  - https://developer.mozilla.org/en-US/docs/Glossary/State_machine
  - https://huggingface.co/docs/transformers.js/index
  - https://huggingface.co/docs/transformers.js/custom_usage
  - https://huggingface.co/docs/transformers.js/api/env
  - https://huggingface.co/docs/transformers.js/guides/webgpu
  - https://onnxruntime.ai/docs/get-started/with-javascript/web.html
  - https://onnxruntime.ai/docs/tutorials/web/deploy.html
  - https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html
  - https://huggingface.co/docs/hub/en/model-cards
  - https://huggingface.co/docs/hub/en/repositories-licenses
  - https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
  - https://datatracker.ietf.org/doc/html/rfc2397
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp
- GitHub/community prior art reviewed: Codex-Subagent-Orchestrator only for Stage -2
- unresolved technical questions:
  - target-browser proof for direct-open SVG keyboard, focus, IME, and animation behavior
  - target-browser proof for direct-open SVG sibling local model/WASM asset loading
  - direct-open SVG proof for the approved local Tanaos model/runtime asset layout
  - true single-file SVG model/runtime embedding feasibility with measured artifact size and memory cost
- sources consulted:
  - https://github.com/lemos999/Codex-Subagent-Orchestrator
- conclusions:
  - The orchestrator workflow requires AGENTS.md, plan/, skills/, and vendor/agent-skills/.
  - Coding work must follow a plan-first gate and active plan tracking.
  - Score tracking belongs in the active plan, with provisional score capped at 50 until the user gives an explicit score.
  - /sub is available only when explicitly requested or when justified by the installed workflow; it is not mandatory for Stage -2.
  - Standalone SVG can be interactive, but SVG used as an image resource is restricted and should be documented as non-runtime/static preview context.
  - Pure SVG prompt input is feasible as a custom focusable SVG control with explicit composition handling.
  - Low-FPS animation should use requestAnimationFrame as a clock while the engine samples deterministic frame indices.
  - Transformers.js and ONNX Runtime Web are plausible browser-local runtime families, but both create packaging and local asset loading obligations.
  - WebGPU should not be required for the MVP because support and secure-context behavior vary.
  - Model selection and packaging strategy remain later approval gates.

## 7. Model Review Status
- not started / researching / candidates prepared / user approved / rejected: user approved
- selected model: `onnx-community/tanaos-emotion-detection-v1-ONNX`
- historical selected model: `onnx-community/Qwen2.5-0.5B-Instruct`
- approved model architecture: English text-classification emotion detector over Transformers.js/ONNX
- current packaging recommendation: Strategy B, SVG plus local sibling Tanaos model/runtime assets
- previous recommended path for review: `bartowski/SmolLM2-135M-Instruct-GGUF` plus local browser llama.cpp/WASM runtime proof
- large deferred alternative: English-first ONNX/Transformers.js model such as `onnx-community/SmolLM2-360M-ONNX`, if smaller paths fail reliability or licensing checks
- held candidate: `onnx-community/gemma-3-270m-it-ONNX`, deferred by user
- reason: User chose behavior stability. The Tanaos classifier returns labels/scores instead of generative text, which fits deterministic SVGotchi transition behavior.
- strength mapping: Stage 7 must derive `TransitionPlan.intensity` from classifier evidence and app-owned rules, quantized to 0.1 increments; ambiguous inputs may stop partway toward a target emotion.
- license: Tanaos ONNX model metadata reports MIT; runtime licenses and notices must still be packaged
- local/offline strategy: Strategy B approved; Stage 7 in progress
- local assets present:
  - default full-local-mode model root: `models/onnx-community/tanaos-emotion-detection-v1-ONNX/`
  - default full-local-mode runtime root: `runtime/onnxruntime/`
  - historical proof model root remains available under `assets/model/onnx-community/tanaos-emotion-detection-v1-ONNX/`
  - historical proof runtime root remains available under `assets/runtime/onnxruntime/`
- actual local model call evidence:
  - `you are cute` -> top label `joy`, score `0.8494`, sanitized `to: shy_love`, `intensity: 0.9`
  - `I am scared` -> top label `fear`, score `0.9360`, sanitized `to: scared`, `intensity: 1.0`
  - `I feel sad` -> top label `sadness`, score `0.9219`, sanitized `to: sad`, `intensity: 0.9`
  - `I'm sad but you are comfortable?` -> top label `sadness`, score `0.9254`, sanitized `to: sad`, `intensity: 1.0`
  - `wow that's surprising` -> top label `surprise`, score `0.8974`, sanitized `to: surprised`, `intensity: 0.9`
  - `hello there` -> top label `surprise`, score `0.5233`, close second label `joy`, score `0.4112`, sanitized `to: surprised`, `intensity: 0.4`

## 8. Character Review Status
- concept candidates: prepared
- concept candidate work: completed
- approved concept: Mochi Sprout
- visual constraint: black background with white-only visible character/UI marks
- neutral SVG approved: yes, provisional; user said design can be revisited later
- rig contract approved: yes
- 30-emotion pose sheet approved: yes
- transition previews approved: yes, with the added contract that LLM output must not generate reply text or reply style
- PNG-preserving anime character overlay rig proposal: in progress for Gate X review
- proposed anime character base: uploaded/generated PNG must remain immutable; expression changes must use overlay layers
- proposed blink policy: ordinary human-like blink is required and app-owned; persistent strong eye masking still requires preview approval
- proposed full-feature distribution direction: npm install plus model download/setup script; GitHub Pages can be lightweight preview only unless a separate approved model hosting strategy is added

## 9. Test Status
- unit tests: passed, 38 total tests
- e2e tests: started; Chrome CDP served-SVG demo and full local model checks pass, broader Stage 9 release verification hardening remains open
- typecheck: passed
- lint: not configured
- build verification: no build script yet; final artifact build remains later-stage work
- Stage -2 filesystem verification: passed
- Stage -1 deliverable verification: passed
- Stage -1 forbidden implementation file check: passed
- Stage -1 skill-based review: passed, overall score 94/100
- Stage 0 deliverable verification: passed
- Stage 0 forbidden implementation file check: passed
- Stage 0 skill-based review: passed, overall score 94/100
- Stage 1 typecheck: passed
- Stage 1 unit tests: passed, 10 tests
- Stage 1 rig validation: passed
- Stage 1 base SVG XML parse: passed
- Stage 1 dependency audit: passed, 0 vulnerabilities
- Stage 1 skill-based review: passed, overall score 95/100
- Stage 1 user-feedback revision: sprout/head connection fixed; verification passed
- Stage 2 typecheck: passed
- Stage 2 unit tests: passed, 15 total tests
- Stage 2 pose sheet XML parse: passed
- Stage 2 pose sheet emotion count: passed, 30 emotions
- Stage 2 pose sheet monochrome check: passed
- Stage 2 skill-based review: passed, overall score 95/100
- Stage 3 status: complete
- Stage 3 typecheck: passed
- Stage 3 unit tests: passed, 24 total tests
- Stage 3 forbidden prompt control scan: passed
- Stage 3 skill-based review: passed, overall score 94/100
- Stage 4 status: complete; Gate F approved with reply-generation exclusion contract
- Stage 4 typecheck: passed
- Stage 4 unit tests: passed, 29 total tests
- Stage 4 transition preview XML parse: passed
- Stage 4 transition preview frame group count: passed, 25 groups
- Stage 4 transition preview required-transition scan: passed, five transitions
- Stage 4 transition preview monochrome check: passed
- Stage 4 later-stage directory check: passed, no `src/llm` and no `dist`
- Stage 4 skill-based review: passed, overall score 95/100
- Stage 4 reply contract revision: passed, `TransitionConfig` and `TransitionFrame` exclude reply text; preview copy is app-owned through `previewReply`
- Stage 5 status: revised Gate G approved; no runtime implementation started
- Stage 5 model review document: updated at `docs/model-review.md`
- Stage 5 historical recommended candidate: `onnx-community/Qwen2.5-0.5B-Instruct`
- Stage 5 selected model: `onnx-community/tanaos-emotion-detection-v1-ONNX`
- Stage 5 prior review path: `bartowski/SmolLM2-135M-Instruct-GGUF` plus local browser runtime proof
- Stage 5 large deferred alternative: English-first ONNX/Transformers.js model if smaller paths fail reliability or licensing checks
- Stage 5 no model runtime check: passed, no `src/llm`
- Stage 5 no final artifact check: passed, no `dist`
- Stage 5 no model asset download check: passed, no `.onnx`, `.safetensors`, `.gguf`, or `.bin` model files found in repo
- Stage 5 skill-based review: historical pass, overall score 95/100; no longer current Gate G basis
- Stage 5 revision review: passed, overall score 95/100; user approved Tanaos for revised Gate G
- Stage 6 status: revised packaging review complete; Gate H approved
- Stage 6 packaging review document: updated at `docs/packaging-review.md`
- Stage 6 historical recommended strategy: B, SVG plus local sibling Qwen2.5 model/runtime assets, no network and no backend
- Stage 6 current recommended strategy: B, SVG plus local sibling Tanaos model/runtime assets, no network and no backend
- Stage 6 no model runtime check: passed, no `src/llm`
- Stage 6 no final artifact check: passed, no `dist`
- Stage 6 no model asset download check: passed, no `.onnx`, `.safetensors`, `.gguf`, or `.bin` model files found in repo
- Stage 6 skill-based review: historical pass, overall score 95/100; no longer current Gate H basis
- Stage 6 revision review: passed, overall score 95/100; Gate H was later approved
- Stage 6 revision verification: passed, `npm run verify` completed with 29 tests
- Gate H approval: passed; user approved Strategy B on 2026-06-17 13:41:27 Asia/Seoul
- Stage 7 status: complete for local runtime and distribution-facing path alignment
- Stage 7 local runtime implementation: actual local Tanaos model call passed
- Stage 7 local model network prohibition: passed by configuration, `env.allowRemoteModels = false` and `local_files_only: true`
- Stage 7 substitute planner scan: passed, no legacy substitute-runner, test-double, or unavailable-helper terms remain under `src`, `tests`, `docs`, or `plan`
- Stage 7 latest verification: passed, `npm run verify` completed with 35 tests and actual model assertions for joy, fear, sadness, and surprise samples
- Stage 7 runtime asset path alignment: passed, `createTanaosEmotionClassifierRuntime()` now defaults to `models/` and `runtime/onnxruntime/`
- Stage 7 runtime asset verification: passed, `cmd /c npm run verify:model` confirmed pinned byte sizes and SHA-256 hashes in the default full-local-mode folders
- Stage 7 latest verification after runtime path alignment: passed, `cmd /c npm run verify` completed with 36 tests and actual model assertions through default paths
- Stage 7 direct-open SVG proof: completed, normal Chrome direct-open `file://` run failed at config fetch with `Failed to fetch`
- Stage 7 direct-open SVG diagnostic: partial only, Chrome with `--allow-file-access-from-files` reached config fetch but did not complete runtime import/classification during headless run; diagnostic flag is non-shippable
- Stage 7 latest verification after direct-open proof: passed, `cmd /c npm run verify` completed with 36 tests
- Stage 7 public distribution direction: npm/npx static-server path approved by user after direct-open proof failure
- Stage 7 localhost boundary: static file serving only; no inference endpoint, no prompt submission to server, browser-side inference remains required
- Stage 7 npm/npx distribution scaffold: complete, `svgotchi` CLI command surface and static-server scripts added
- Stage 7 npm/npx distribution review: passed, overall score 95/100
- Stage 8 status: pure-SVG served integration slice complete
- Stage 8 served SVG runtime: passed, `/` serves `image/svg+xml` SVG app document, not HTML
- Stage 8 browser app script: passed, static browser JS handles SVG prompt, app-owned mapping, demo/full submit flow, and known-ID rig animation
- Stage 8 Chrome served-SVG demo proof: passed, `you are cute` resolves to `shy_love` and updates current emotion
- Stage 8 full browser local model proof: passed, Chrome CDP verifies served SVG full mode loads local model/runtime assets and completes prompt-to-transition.
- Stage 8 label/score routing proof: passed, `I'm sad but you are comfortable?` resolves to `sad 1.0`, not `comforted 1.0`.
- English-first correction verification: passed, `npm run verify` completed with 29 tests
- Non-English example string scan: passed, no Hangul example text remains outside historical source names and forbidden-field checks
- Gate X proposal verification: passed, `cmd /c npm run verify` completed with 35 tests; PowerShell `npm run verify` was blocked by host execution policy for `npm.ps1`
- Gate X proposal review: passed, overall score 95/100; PNG overlay rig implementation remains blocked pending user approval
- Two-tier distribution scaffold: complete under `plan/20260617-153649--work-plan--two-tier-distribution--v01.md`
- Two-tier distribution pre-setup model verification: passed as an expected negative check; `cmd /c npm run verify:model` failed with 7 precise missing asset reports before setup
- Two-tier distribution setup verification: historical pass; `scripts/setup-model.ps1` copied local proof assets before the npm/npx TypeScript setup path replaced the shell/PowerShell wrappers
- Two-tier distribution post-setup model verification: passed; `cmd /c npm run verify:model` confirmed pinned byte sizes and SHA-256 hashes
- Two-tier distribution scaffold verification: passed; `cmd /c npm run verify` completed with 35 tests

## 10. Stage Review Scores

Stage -1: Research and Architecture
- review file: plan/stage-reviews/stage--1-skill-review.md
- requirement compliance score: 96
- architecture quality score: 93
- modularity score: 92
- test coverage score: 90
- documentation quality score: 94
- approval-gate compliance score: 100
- risk score: 92
- overall stage score: 94/100
- gate result: passed score threshold; Stage 0 was later completed and concept approval was received before Stage 1
- reviewed at: 2026-06-17 02:28:59 Asia/Seoul

Stage 0: Character Concept Candidates
- review file: plan/stage-reviews/stage-00-skill-review.md
- requirement compliance score: 97
- architecture quality score: 94
- modularity score: 93
- test coverage score: 90
- documentation quality score: 95
- approval-gate compliance score: 100
- risk score: 92
- overall stage score: 94/100
- gate result: passed score threshold; Mochi Sprout was later approved before Stage 1
- reviewed at: 2026-06-17 02:34:35 Asia/Seoul

Stage 1: Neutral Base Character and Rig Contract
- review file: plan/stage-reviews/stage-01-skill-review.md
- requirement compliance score: 96
- architecture quality score: 94
- modularity score: 94
- test coverage score: 94
- documentation quality score: 93
- approval-gate compliance score: 100
- risk score: 92
- overall stage score: 95/100
- gate result: passed score threshold; neutral base and rig were later approved before Stage 2
- reviewed at: 2026-06-17 02:46:36 Asia/Seoul

Stage 2: 30-Emotion Pose Sheet
- review file: plan/stage-reviews/stage-02-skill-review.md
- requirement compliance score: 97
- architecture quality score: 94
- modularity score: 94
- test coverage score: 95
- documentation quality score: 94
- approval-gate compliance score: 100
- risk score: 92
- overall stage score: 95/100
- gate result: passed score threshold; pose sheet was later approved before Stage 3
- reviewed at: 2026-06-17 03:00:00 Asia/Seoul

Stage 3: Pure SVG Prompt Prototype
- review file: plan/stage-reviews/stage-03-skill-review.md
- requirement compliance score: 95
- architecture quality score: 93
- modularity score: 94
- test coverage score: 94
- documentation quality score: 92
- approval-gate compliance score: 100
- risk score: 90
- overall stage score: 94/100
- gate result: passed score threshold; no user approval gate; continuing to Stage 4
- reviewed at: 2026-06-17 03:06:12 Asia/Seoul

Stage 4: Deterministic Transition Engine
- review file: plan/stage-reviews/stage-04-skill-review.md
- requirement compliance score: 97
- architecture quality score: 94
- modularity score: 95
- test coverage score: 95
- documentation quality score: 94
- approval-gate compliance score: 100
- risk score: 92
- overall stage score: 95/100
- gate result: passed score threshold; user approved Gate F with the added contract that the LLM must not generate pet reply text or reply style
- reviewed at: 2026-06-17 03:10:59 Asia/Seoul

Stage 5: Hugging Face Ultra-Light Model Review
- review file: plan/stage-reviews/stage-05-skill-review.md
- requirement compliance score: 96
- architecture quality score: 94
- modularity score: 93
- test coverage score: 91
- documentation quality score: 96
- approval-gate compliance score: 100
- risk score: 91
- overall stage score: 95/100
- gate result: historical pass; later superseded by English-first emotion-only direction and requires revised Gate G
- reviewed at: 2026-06-17 03:22:36 Asia/Seoul

Stage 5 Revision: Behavior-Stability Classifier Selection
- review file: plan/stage-reviews/stage-05-skill-review.md
- requirement compliance score: 95
- architecture quality score: 94
- modularity score: 94
- test coverage score: 93
- documentation quality score: 95
- approval-gate compliance score: 100
- risk score: 91
- overall stage score: 95/100
- gate result: passed score threshold; user approved `onnx-community/tanaos-emotion-detection-v1-ONNX` for revised Gate G
- reviewed at: 2026-06-17 13:29:59 Asia/Seoul

Stage 6: Model Packaging Strategy
- review file: plan/stage-reviews/stage-06-skill-review.md
- requirement compliance score: 97
- architecture quality score: 95
- modularity score: 94
- test coverage score: 91
- documentation quality score: 96
- approval-gate compliance score: 100
- risk score: 91
- overall stage score: 95/100
- gate result: historical pass; later superseded because the Qwen2.5 model premise changed and requires revised Gate H
- reviewed at: 2026-06-17 03:47:55 Asia/Seoul

Stage 6 Revision: Tanaos Model Packaging Strategy
- review file: plan/stage-reviews/stage-06-skill-review.md
- requirement compliance score: 97
- architecture quality score: 95
- modularity score: 94
- test coverage score: 92
- documentation quality score: 96
- approval-gate compliance score: 100
- risk score: 91
- overall stage score: 95/100
- gate result: passed score threshold; user approved Strategy B before Stage 7
- reviewed at: 2026-06-17 13:29:59 Asia/Seoul

Gate X: PNG-Preserving Anime Character Overlay Rig Review
- review file: plan/stage-reviews/character-overlay-proposal-review.md
- requirement compliance score: 97
- architecture quality score: 94
- migration quality score: 95
- interface-contract quality score: 93
- preview readiness score: 94
- verification quality score: 91
- approval-gate compliance score: 100
- distribution-risk handling score: 92
- overall proposal score: 95/100
- gate result: proposal review passed threshold; implementation remains blocked until explicit user approval
- reviewed at: 2026-06-17 15:11:52 Asia/Seoul

Two-Tier Distribution Scaffold Review
- review file: plan/stage-reviews/two-tier-distribution-skill-review.md
- requirement compliance score: 98
- architecture boundary quality score: 95
- script safety and failure behavior score: 93
- verification quality score: 95
- documentation quality score: 95
- runtime non-interference score: 100
- Git asset safety score: 94
- future integration risk handling score: 88
- overall stage score: 94/100
- gate result: passed score threshold; no runtime path refactor performed
- reviewed at: 2026-06-17 15:42:33 Asia/Seoul

Runtime Asset Path Alignment Review
- review file: plan/stage-reviews/runtime-asset-path-alignment-review.md
- requirement compliance score: 97
- architecture boundary quality score: 96
- runtime safety score: 97
- test coverage quality score: 95
- documentation accuracy score: 94
- scope control score: 98
- rollback safety score: 95
- remaining packaging risk handling score: 90
- overall stage score: 95/100
- gate result: passed score threshold; browser direct-open SVG proof remains a later gate
- reviewed at: 2026-06-17 15:47:15 Asia/Seoul

Direct-Open SVG Local Asset Proof Review
- review file: plan/stage-reviews/direct-open-svg-local-asset-proof-review.md
- requirement compliance score: 96
- proof rigor score: 94
- runtime safety score: 97
- documentation accuracy score: 93
- scope control score: 98
- repeatability score: 90
- architecture viability discovered score: 78
- rollback safety score: 95
- overall stage score: 92/100
- gate result: proof completed; normal direct-open full local model path is blocked in Chrome
- reviewed at: 2026-06-17 22:13:50 Asia/Seoul

npm/npx Public Distribution Review
- review file: plan/stage-reviews/npm-npx-public-distribution-review.md
- requirement compliance score: 97
- architecture boundary score: 96
- CLI and setup UX score: 94
- model/runtime asset safety score: 95
- static server safety score: 94
- documentation quality score: 95
- package hygiene score: 96
- verification quality score: 95
- scope control score: 98
- residual risk handling score: 91
- overall stage score: 95/100
- gate result: passed score threshold; final browser-side LLM UI integration remains a later gate
- reviewed at: 2026-06-17 22:45:22 Asia/Seoul

Pure SVG Full Local Integration Review
- review file: plan/stage-reviews/pure-svg-full-local-integration-review.md
- requirement compliance score: 96
- pure-SVG runtime boundary score: 96
- browser app integration score: 95
- static server safety score: 95
- model boundary safety score: 94
- animation correctness score: 92
- verification quality score: 96
- documentation quality score: 94
- scope control score: 98
- residual risk handling score: 92
- overall stage score: 96/100
- gate result: passed for scoped served-SVG integration slice; full browser local model automation passes through Chrome CDP
- reviewed at: 2026-06-17 23:48:24 Asia/Seoul

Label/Score Emotion Routing Review
- review file: plan/stage-reviews/label-score-emotion-routing-review.md
- overall stage score: 96/100
- gate result: passed; raw `sadness` now maps to `sad` unless explicit support is requested
- reviewed at: 2026-06-18 00:37:13 Asia/Seoul

## 11. Next Action
- exact next action: decide between Stage 9 release verification hardening, Stage 10 polish, or Gate X PNG-preserving overlay implementation review/approval.
- whether user approval is required before proceeding: yes for Gate X PNG overlay implementation and final artifact review; no for narrow verification/documentation cleanup inside already approved scopes.

## Stage File Index
- plan/stages/stage--2-root-workflow-installation.md
- plan/stages/stage--1-research-and-architecture.md
- plan/stages/stage-00-character-concept-candidates.md
- plan/stages/stage-01-neutral-base-character-and-rig-contract.md
- plan/stages/stage-02-30-emotion-pose-sheet.md
- plan/stages/stage-03-pure-svg-prompt-prototype.md
- plan/stages/stage-04-deterministic-transition-engine.md
- plan/stages/stage-05-hugging-face-model-review.md
- plan/stages/stage-06-model-packaging-strategy.md
- plan/stages/stage-07-local-llm-transition-planner.md
- plan/stages/stage-08-full-integration.md
- plan/stages/stage-09-tests-and-verification.md
- plan/stages/stage-10-final-polish.md
