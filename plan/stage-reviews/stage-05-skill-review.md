# Stage 5 Skill-Based Review

Review timestamp: 2026-06-17 03:22:36 Asia/Seoul
Stage: Stage 5: Hugging Face Ultra-Light Model Review
Status: Historical pass; superseded by English-first intent/emotion-only direction

## Reviewed Scope

Reviewed Stage 5 deliverables:

- `docs/model-review.md`
- `plan/svgotchi-active-plan.md`
- Stage 4 reply-generation exclusion contract

Explicitly not reviewed because those are later stages:

- no `src/llm/`
- no model runtime implementation
- no model packaging implementation
- no local model asset vendoring
- no `dist/`

## Verification Commands

Executed checks:

- Hugging Face model card and Hub source review
- Hugging Face repo metadata/API checks for tags, library, license, pipeline, and ONNX file list
- Hugging Face repo tree checks for ONNX file sizes
- Transformers.js docs check for local model settings and dtype support
- `npm run verify`
- local check that `src/llm` and `dist` do not exist
- local check that no `.onnx`, `.safetensors`, or `.gguf` model files were downloaded into the repo

Observed results:

- historical recommended candidate: `onnx-community/Qwen2.5-0.5B-Instruct`
- smaller alternative: `onnx-community/gemma-3-270m-it-ONNX`
- current status: recommendation superseded; revised Gate G required
- typecheck: passed
- unit tests: passed, 29 total tests
- no model runtime files created
- no model assets downloaded
- Gate G must be reopened around English-first ultra-small intent/emotion planning

## Score Breakdown

| Category | Score | Review Notes |
|---|---:|---|
| Requirement compliance score | 96 | Historical candidate review covered architecture, size, license, language coverage, browser runtime compatibility, offline feasibility, model-card quality, intended use, limitations, and risks. It no longer reflects the current English-first priority. |
| Architecture quality score | 94 | Recommends a model only for a narrow TransitionPlan boundary and carries forward the no-reply LLM contract. |
| Modularity score | 93 | Keeps model review separate from packaging and runtime implementation. |
| Test coverage score | 91 | Existing code verification still passes; no runtime tests are expected before model approval. |
| Documentation quality score | 96 | `docs/model-review.md` records sources, comparison table, recommendation, alternatives, rejected candidates, and post-approval runtime contract. |
| Approval-gate compliance score | 100 | Stops at Gate G and does not download assets, choose packaging, or implement runtime. |
| Risk score | 91 | Remaining risk is local runtime measurement, final package size, and strict structured-output reliability, all deferred to later approved stages. |

Overall stage score: 95/100

## Findings

Blocking finding under the current direction:

- The old recommendation over-weighted broad language coverage. The user clarified that English is primary and that the pet only needs intent/emotion planning, so Qwen2.5 is no longer the primary model recommendation.

Non-blocking observations:

- The recommended Qwen2.5 candidate is not small enough for a strict sub-300MB payload.
- The smaller Gemma candidate carries a less simple custom license.
- Tiny GGUF candidates should now be reviewed before any large ONNX model is accepted.
- Structured TransitionPlan reliability still requires a later local runtime test after approval.

## Gate Decision

The historical Stage 5 pass is preserved for traceability, but it is not the current Gate G basis. Stop and revise the model review around English-first, emotion-only, ultra-small local candidates before Stage 6 or Stage 7 continues.

## Revision Review: English-First Intent/Emotion Direction

Review timestamp: 2026-06-17 04:03:36 Asia/Seoul

Reviewed revised deliverables:

- `docs/model-review.md`
- `docs/packaging-review.md`
- `docs/adr/0005-model-packaging.md`
- `plan/svgotchi-active-plan.md`
- prompt/test references that previously used non-English examples

Observed revised candidates:

- recommended GGUF candidate: `bartowski/SmolLM2-135M-Instruct-GGUF`
- task-specific classifier alternative: `onnx-community/tanaos-emotion-detection-v1-ONNX`
- proof-only tiny candidate: `afrideva/Tinystories-gpt-0.1-3m-GGUF`
- large deferred alternative: `onnx-community/SmolLM2-360M-ONNX`
- historical alternative only: `onnx-community/Qwen2.5-0.5B-Instruct`

Revised score breakdown:

| Category | Score | Review Notes |
|---|---:|---|
| Requirement compliance score | 95 | Restores English-first priority, keeps no-reply planner boundary, and reopens Gate G instead of carrying Qwen2.5 into runtime work. |
| Architecture quality score | 94 | Separates instruction GGUF, classifier ONNX, proof-only GGUF, and large deferred paths without implementing runtime early. |
| Modularity score | 94 | Keeps model review, packaging review, runtime implementation, and tests separate. |
| Test coverage score | 93 | Existing typecheck and 29 tests pass after replacing non-English examples with English-first test data while preserving IME composition coverage. |
| Documentation quality score | 95 | Records revised model criteria, sizes, license notes, runtime risks, and superseded Qwen2.5 packaging status. |
| Approval-gate compliance score | 100 | Stops at revised Gate G; no model assets, runtime code, or packaging implementation were created. |
| Risk score | 91 | Remaining risk is browser GGUF runtime proof, structured-output reliability, and direct-open SVG asset loading. These are correctly deferred to approved later stages. |

Overall revision score: 95/100

Revision gate decision:

Stage 5 revision passes the 90-point threshold. Stop for revised Gate G model approval before Stage 6 packaging review resumes.
