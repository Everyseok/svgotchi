# SVGotchi Hugging Face Model Review

Status: Revised Gate G approved: `onnx-community/tanaos-emotion-detection-v1-ONNX`
Last updated: 2026-06-17 13:29:59 Asia/Seoul

## Scope

Stage 5 reviews local model candidates for TransitionPlan planning. It does not implement model runtime, model packaging, prompt/schema code, local asset loading, or final SVG integration.

The current product direction is English-first. Non-English coverage is optional and must not outweigh artifact size, local runtime fit, or emotion/intent planning reliability.

The Stage 4 planner contract still applies:

- the LLM may only produce sanitized TransitionPlan-shaped data
- the LLM must not generate pet reply text or reply style
- the LLM must not generate SVG, path data, selectors, HTML, CSS, JavaScript, URLs, or arbitrary animation code
- app-owned code remains responsible for any speech bubble text, if the UI uses a bubble

## Superseded Decision

The earlier Stage 5 recommendation selected `onnx-community/Qwen2.5-0.5B-Instruct` mainly because it was a strong multilingual instruction model with browser ONNX evidence. That reasoning is no longer the best fit.

Because the pet only needs intent and emotion planning, and because English is the primary language target, the model review should prioritize:

- English short-message intent/emotion recognition
- very small local artifacts
- GGUF or ONNX assets that can run in a browser/SVG-adjacent local runtime
- deterministic or schema-constrained mapping into TransitionPlan
- local/offline vendoring with clear license evidence

Qwen2.5 remains a deferred quality alternative, not the current primary recommendation.

## Sources Consulted

- `onnx-community/Qwen2.5-0.5B-Instruct`: https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct
- `Qwen/Qwen2.5-0.5B-Instruct`: https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- `onnx-community/gemma-3-270m-it-ONNX`: https://huggingface.co/onnx-community/gemma-3-270m-it-ONNX
- `onnx-community/SmolLM2-360M-ONNX`: https://huggingface.co/onnx-community/SmolLM2-360M-ONNX
- `bartowski/SmolLM2-135M-Instruct-GGUF`: https://huggingface.co/bartowski/SmolLM2-135M-Instruct-GGUF
- `onnx-community/tanaos-emotion-detection-v1-ONNX`: https://huggingface.co/onnx-community/tanaos-emotion-detection-v1-ONNX
- `afrideva/Tinystories-gpt-0.1-3m-GGUF`: https://huggingface.co/afrideva/Tinystories-gpt-0.1-3m-GGUF
- `ngxson/wllama`: https://github.com/ngxson/wllama
- `EvanZhouDev/llm.pdf`: https://github.com/EvanZhouDev/llm.pdf
- llm.pdf demo builds: https://evanzhoudev.github.io/llm.pdf/
- Transformers.js custom model settings: https://huggingface.co/docs/transformers.js/en/custom_usage
- Transformers.js dtype guide: https://huggingface.co/docs/transformers.js/en/guides/dtypes
- Hugging Face model cards: https://huggingface.co/docs/hub/en/model-cards
- Hugging Face repository licenses: https://huggingface.co/docs/hub/en/repositories-licenses

## Candidate Comparison

| Candidate or path | Role | License | Language fit | Browser runtime fit | Observed size | Current result |
|---|---|---|---|---|---:|---|
| `bartowski/SmolLM2-135M-Instruct-GGUF` | Small instruction LLM for short structured intent/emotion labels | Apache-2.0 | English tag; instruction-tuned | Needs GGUF browser runtime proof, likely Wllama or equivalent local llama.cpp/WASM build | smallest observed GGUF files about 88.2MB; common q4 variants about 91.7-91.9MB | Recommended GGUF candidate for revised Gate G |
| `onnx-community/tanaos-emotion-detection-v1-ONNX` | English emotion classifier that can map user text to app-owned TransitionPlan fields | MIT | English model card/tags; emotion-detection task | Strong: Transformers.js, ONNX, text-classification | int8/quantized ONNX about 118.5MB plus tokenizer about 17.1MB; q4f16 about 205.1MB | Approved by user for behavior stability |
| Tiny GGUF proof path, starting with `afrideva/Tinystories-gpt-0.1-3m-GGUF` | Proof candidate for ultra-small English text generation mapped to intent/emotion | License metadata not present in reviewed API response | English dataset/model card context; not a chat or instruction model | Needs GGUF browser runtime proof | Q2-Q8 GGUF files observed around 7.75-9.58MB; fp16 GGUF about 15.98MB | Proof-only; not recommended as primary production candidate yet |
| `onnx-community/SmolLM2-360M-ONNX` | Compact English-first text generation | Apache-2.0 | English-first is now acceptable | Strong: Transformers.js and ONNX path | `model_q4f16.onnx` about 259.7MB | Deferred alternative, still large for the artifact goal |
| `onnx-community/Qwen2.5-0.5B-Instruct` | General instruction LLM for structured TransitionPlan generation | ONNX wrapper metadata lacks explicit license; base model is Apache-2.0 | Multilingual strength is no longer decisive | Strong: Transformers.js and ONNX path | `model_q4f16.onnx` about 460.6MB; int8 about 488.4MB | Historical alternative only; too large for the revised goal |
| `onnx-community/gemma-3-270m-it-ONNX` | Smaller instruction LLM | Gemma custom license | Broad multilingual strength is no longer decisive | Strong: Transformers.js and ONNX path | q4f16/q4 variants previously observed around 260-308MB | Still on hold by user; license remains a blocker |
| `onnx-community/functiongemma-270m-it-ONNX` | Function-calling model foundation | Gemma custom license | Not material to revised goal | Strong: Transformers.js example; function-call oriented | q4f16 about 406.5MB; q4 about 764.4MB | Deferred; not the simplest MVP path |

File sizes were checked through repository metadata/API calls without downloading model weights into the project.

## Revised Recommendation

Do not proceed to Stage 7 with Qwen2.5 packaging.

Reopen Gate G around an English-first, emotion-only model decision. The most balanced GGUF candidate is:

```text
bartowski/SmolLM2-135M-Instruct-GGUF
```

Reason:

- It is instruction-tuned, so short structured labels are more plausible than with a TinyStories-only generator.
- It has Apache-2.0 license metadata.
- The smallest reviewed GGUF files are roughly 88-92MB, far below the Qwen2.5 ONNX payload class.
- It can be evaluated with a browser GGUF runtime path such as Wllama.

The user selected the task-specific classifier because behavior stability is the product's real requirement:

```text
onnx-community/tanaos-emotion-detection-v1-ONNX
```

Reason:

- It is explicitly an English text-classification emotion-detection model.
- It is MIT licensed.
- It is tagged for Transformers.js and ONNX.
- Its int8/quantized ONNX artifact is about 118.5MB, plus tokenizer/config overhead.
- It returns labels and scores rather than prose, which is a better fit for deterministic SVGotchi behavior.

This selection changes the planner shape:

- the local model output is an emotion label plus confidence score
- app-owned code maps classifier labels into SVGotchi emotions, effects, motion, duration, and intent defaults
- app-owned code derives `TransitionPlan.intensity` as expression strength on a 0.0-1.0 scale, quantized to 0.1 increments
- classifier confidence must inform expression strength but must not be treated as identical to emotional intensity
- low-confidence or ambiguous inputs may produce partial transitions that stop before the full target pose
- the model does not generate JSON TransitionPlan text
- the model does not generate pet reply text
- `Intent` may be `unknown` unless app-owned deterministic parsing identifies an allowed intent

The 3M TinyStories GGUF path should remain experimental. Its 8-16MB size is attractive, but it is not instruction-tuned, its reviewed metadata did not expose a license, and it may not reliably return stable intent/emotion labels.

Any approved path must:

- use the model only to infer intent/emotion/transition parameters
- ask for one very short structured output or map logits/completions through app-owned parsing
- reject any natural-language pet reply from model output
- measure whether the runtime can load locally from the final SVG context or an approved sibling-asset strategy
- verify that artifact size is materially smaller than the Qwen2.5 path

The GGUF path is not automatically approved. It needs runtime proof, structured-output reliability checks, and packaging review. It is now the right next thing to test because it matches the corrected product requirement better than Qwen2.5.

## Required Runtime Contract After Approval

Any later approved model path must still enforce:

- local model path only, according to the approved packaging strategy
- local WASM/runtime asset path only
- no hosted Hugging Face inference endpoint
- no runtime model download
- no backend and no localhost inference bridge as the primary architecture
- localhost static serving is allowed only for the approved source-checkout full local mode
- max token budget low enough for TransitionPlan only
- JSON-only, schema-constrained, classifier, or app-owned parser strategy where possible
- sanitizer that ignores unknown fields and rejects forbidden fields
- forbidden TransitionPlan fields: `reply`, `replyText`, `replyStyle`, `message`, `speech`, `svg`, `path`, `selector`, `html`, `css`, `script`, `url`
- explicit model-unavailable or model-invalid state instead of substituting a deterministic production planner

## Decision Needed

Gate G result:

- approved model: `onnx-community/tanaos-emotion-detection-v1-ONNX`
- approved rationale: behavior stability and task-specific emotion classification matter more than a general instruction model
- next required gate: Gate H packaging strategy approval

No Stage 7 runtime implementation should begin until Gate H is explicit.
