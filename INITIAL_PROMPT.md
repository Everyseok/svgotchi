# GOAL: Build SVGotchi — a pure-SVG local-LLM Tamagotchi with animated emotion transitions

You are working on a GitHub repository intended to be clean, reviewable, modular, and star-worthy.
Do not vibe-code.
Do not improvise architecture.
Do not create a monolithic script.
Do not silently skip requirements.
Do not replace hard requirements with easier substitutes.

The project is called:

SVGotchi

One-line concept:

A cute Tamagotchi-style pixel character living inside a single SVG artifact, where a local lightweight LLM plans emotion transitions and a deterministic SVG animation engine renders the intermediate frames.

The core experience:

- The user opens an SVG file.
- The SVG looks like an image, not a web app wrapper.
- The top 80% of the SVG is a cute pixel Tamagotchi character.
- The bottom 19% is a pure-SVG prompt area where the user types a message to the pet.
- The user writes something like "you are cute".
- A local lightweight LLM reads the input and returns only a structured TransitionPlan.
- The SVG engine animates the character from the current emotion to the target emotion through intermediate states.
- The transition must not be a single-frame image swap.
- The transition must be continuous enough to feel like low-FPS pixel animation.
- Example:
  neutral -> a1 -> a2 -> a3 -> shy_love
- The LLM must not directly write SVG.
- The LLM must not directly write path data.
- The LLM must not directly mutate DOM.
- The LLM must not generate JavaScript.
- The LLM only decides transition intent and parameters.
- The deterministic SVG runtime performs all visual changes.

-------------------------------------------------------------------------------
ABSOLUTE STAGE -2: ROOT WORKFLOW INSTALLATION
-------------------------------------------------------------------------------

Before doing anything related to SVGotchi implementation, install and apply the Codex-Subagent-Orchestrator workflow at the repository root.

This is mandatory.
This is not optional.
Do not ask whether to apply it.
Apply it first.

The workspace must start as:

svgotchi/
├─ AGENTS.md
├─ plan/
├─ skills/
├─ vendor/
│  └─ agent-skills/
└─ [SVGotchi files may be created only after workflow setup is verified]

Required root-level items:

- AGENTS.md
- plan/
- skills/
- vendor/
- vendor/agent-skills/
- plan/svgotchi-active-plan.md

Do not create any SVGotchi implementation files before this exists.

Do not create:
- package.json
- src/
- assets/
- dist/
- README.md for SVGotchi
- SVG template
- TypeScript files
- model files
- character files

until the root workflow installation is verified.

Required behavior:

1. Read AGENTS.md first.
2. Read relevant skill documents before planning implementation.
3. Use plan-first workflow for all coding work.
4. Keep the active plan under plan/svgotchi-active-plan.md.
5. Track progress inside the active plan.
6. Track user satisfaction score inside the active plan.
7. If the user has not provided a score, keep the provisional score at 50 or lower.
8. Use /sub only according to the installed orchestrator workflow, but the orchestrator files must be installed even if /sub is never used later.
9. Applying the orchestrator workflow is mandatory. Using every skill later is not mandatory.

Hard verification checklist before any SVGotchi implementation:

1. AGENTS.md exists at repository root.
2. plan/ exists at repository root.
3. skills/ exists at repository root.
4. vendor/ exists at repository root.
5. vendor/agent-skills/ exists at repository root.
6. plan/svgotchi-active-plan.md exists.
7. The active plan says implementation has not started yet.
8. The active plan lists all approval gates.
9. The active plan lists the Hugging Face ultra-light model review gate.
10. The active plan lists the character concept review gate.
11. The active plan lists the neutral base character review gate.
12. The active plan lists the rig contract review gate.
13. The active plan lists the 30-emotion pose sheet review gate.
14. The active plan lists the 5-transition sample review gate.
15. The active plan lists the local LLM runtime review gate.
16. The active plan lists the no-external-API/no-backend/no-runtime-network constraints.
17. The active plan lists the pure-SVG/no-foreignObject/no-HTML-input constraints.

If any item fails:

- stop immediately,
- report the exact missing item,
- do not create SVGotchi source code,
- do not create workaround code,
- do not invent a substitute workflow,
- do not proceed with implementation.

There is no fallback setup path.

-------------------------------------------------------------------------------
MANDATORY-FIRST RULE
-------------------------------------------------------------------------------

Do not treat the following as optional:

- Codex-Subagent-Orchestrator root setup
- AGENTS.md
- plan/
- skills/
- vendor/agent-skills/
- active plan file
- plan-first workflow
- approval gates
- research log
- architecture document
- ADRs
- staged implementation
- test gates
- no-external-API rule
- pure-SVG rule
- no-foreignObject rule
- no-HTML-input rule
- no-raw-LLM-SVG-mutation rule
- Hugging Face model review gate
- character/image approval gates
- intermediate code review after each stage
- comparison against relevant existing open-source or documentation patterns

Apply mandatory components first.

If a mandatory component later turns out to be unused, keep it installed and mark it as unused in the active plan.
Do not remove it unless the user explicitly asks.

Only ask the user when a real design decision must be made, such as:

- which character concept to approve,
- which neutral base SVG to approve,
- which rig contract to approve,
- which 30-emotion pose sheet to approve,
- which transition samples to approve,
- which Hugging Face model candidate to use,
- whether model weights must be embedded into one SVG or may be shipped as local sibling assets,
- which browser/runtime target to prioritize if compatibility conflicts arise.

Do not use uncertainty as a reason to bypass mandatory setup.

-------------------------------------------------------------------------------
ABSOLUTE PRODUCT CONSTRAINTS
-------------------------------------------------------------------------------

Final runtime target:

- SVG, not PDF.
- Pure SVG runtime.
- No HTML wrapper.
- No foreignObject.
- No HTML input.
- No HTML button.
- No canvas.
- No React.
- No DOM framework.
- No remote API.
- No OpenAI API.
- No Anthropic API.
- No Gemini API.
- No hosted Hugging Face inference endpoint.
- No external backend.
- No localhost server dependency.
- No runtime network call.
- No runtime model download.
- No hidden cloud inference.
- No fake “local LLM” that is actually remote.

The project must appear and behave as:

local LLM + SVG

Allowed development-time activities:

- web research,
- Hugging Face model search,
- documentation review,
- GitHub prior-art review,
- model license review,
- model conversion feasibility review,
- user approval requests.

Disallowed runtime activities:

- network call to download model,
- network call to classify input,
- network call to fetch code,
- network call to fetch SVG assets,
- network call to any external inference provider,
- localhost HTTP bridge as the primary architecture.

If true single-SVG local LLM embedding is not technically feasible or is too large, stop and report the technical findings.
Do not silently switch to a server/backend approach.
Ask the user to approve one of the following packaging strategies:

A. True single-file SVG with embedded runtime/model assets.
B. SVG + local sibling model assets, still with no network and no backend.
C. SVG + development-only deterministic test planner, with LLM runtime postponed.
D. Another explicitly approved user decision.

Do not choose B, C, or D silently.

-------------------------------------------------------------------------------
HIGH-LEVEL ARCHITECTURE
-------------------------------------------------------------------------------

The final architecture must be:

User input
→ local lightweight LLM transition planner
→ sanitized TransitionPlan
→ deterministic transition engine
→ pose interpolation
→ low-FPS frame scheduler
→ SVG renderer
→ visual emotion transition

The LLM’s role:

- parse user intent,
- choose target emotion,
- choose transition intensity,
- choose duration,
- choose fps,
- choose easing/curve,
- choose motion,
- choose effect,
- choose blush on/off,
- choose reply style.

The LLM must not:

- generate raw SVG,
- generate raw HTML,
- generate raw CSS,
- generate JavaScript patches,
- generate path data,
- call setAttribute directly,
- choose arbitrary DOM IDs,
- create arbitrary animation code,
- create arbitrary frame SVG.

The deterministic SVG runtime’s role:

- own the character rig,
- own all SVG IDs,
- own all pose definitions,
- own all effect definitions,
- own all interpolation logic,
- own all animation scheduling,
- own all speech bubble rendering,
- own all prompt UI rendering,
- own all state updates.

-------------------------------------------------------------------------------
CHARACTER-FIRST RULE
-------------------------------------------------------------------------------

Do not begin LLM integration first.
Do not begin model runtime first.
Do not begin transition planning first.

The first SVGotchi-specific task after workflow installation is the character system.

Required sequence:

1. Character concept candidates.
2. User review of character concepts.
3. Neutral base character SVG.
4. User review of neutral base character.
5. Character coordinate contract.
6. User review of coordinate contract.
7. Rig slot definition.
8. User review of rig slot definition.
9. 30-emotion pose sheet preview.
10. User review of 30-emotion pose sheet.
11. 5 sample emotion transitions.
12. User review of transition samples.
13. Only then proceed to full implementation.

If any character image, emotion image, pose preview, sprite preview, or transition preview is generated, stop and request user review before continuing.

Do not assume generated character art is approved.

-------------------------------------------------------------------------------
CHARACTER CONTRACT AND RIG REQUIREMENT
-------------------------------------------------------------------------------

The base character must be a riggable SVG.
It must not be an opaque raster image.
It must not be a single unstructured path blob.

Use:

viewBox="0 0 100 100"

Layout:

- y = 0..80: pet area
- y = 81..100: pure-SVG prompt area

The character must be simple, cute, pixel-style, and Tamagotchi-like.
Prefer primitive SVG shapes and pixel-block styling over complex path morphing.

The character rig is not a complex animation skeleton.
It is a coordinate and slot contract.

Minimum coordinate contract:

CHARACTER_CONTRACT = {
  viewBox: { x: 0, y: 0, width: 100, height: 100 },
  petArea: { x: 0, y: 0, width: 100, height: 80 },
  promptArea: { x: 0, y: 81, width: 100, height: 19 },

  bodyBox: { x: 30, y: 18, width: 40, height: 44 },

  anchors: {
    bodyCenter: { x: 50, y: 42 },
    faceCenter: { x: 50, y: 41 },

    eyeLeft: { x: 42, y: 38 },
    eyeRight: { x: 58, y: 38 },

    browLeft: { x: 42, y: 33 },
    browRight: { x: 58, y: 33 },

    mouth: { x: 50, y: 50 },

    blushLeft: { x: 38, y: 46 },
    blushRight: { x: 62, y: 46 },

    heartOrigin: { x: 64, y: 26 },
    tearLeft: { x: 39, y: 43 },
    tearRight: { x: 61, y: 43 },
    zzzOrigin: { x: 66, y: 20 },
    questionOrigin: { x: 66, y: 24 },
    angerOrigin: { x: 66, y: 25 },
    sparkleOrigin: { x: 63, y: 26 }
  }
}

Required SVG IDs:

- svgotchi-root
- pet-area
- prompt-area
- pet
- body
- face
- eye-left
- eye-right
- brow-left
- brow-right
- mouth
- blush-left
- blush-right
- effect-hearts
- effect-tears
- effect-zzz
- effect-sparkles
- effect-question
- effect-anger
- speech-bubble
- prompt-bg
- prompt-placeholder
- prompt-text
- prompt-caret
- send-zone
- send-label

All emotion-specific optional parts must exist as hidden layers by default.
Do not create different SVG structures for different emotions.
Every emotion must use the same rig slots.
Missing visual parts should be represented by opacity=0, not by absent DOM nodes.

Good:

- effect-hearts exists in all states but opacity=0 when unused.
- blush-left exists in all states but opacity=0 when unused.
- brow-left exists in all states but opacity=0 when unused.

Bad:

- happy has hearts DOM nodes, but neutral has no hearts group.
- angry has brows DOM nodes, but neutral has no brows group.
- sleepy has zzz nodes, but other states have no zzz group.

Implement:

- CHARACTER_CONTRACT
- REQUIRED_RIG_IDS
- validateCharacterRig()
- assertRigSlotExists()
- loadCharacterRig()

Do not continue if rig validation fails.

-------------------------------------------------------------------------------
PURE SVG PROMPT REQUIREMENT
-------------------------------------------------------------------------------

Do not use foreignObject.
Do not use HTML input.
Do not use HTML button.
Do not use contenteditable.
Do not use an HTML form.

The prompt area must be implemented using SVG elements only:

- rect for prompt background,
- text for placeholder,
- text for typed input,
- rect for caret,
- rect/text for send zone.

The SVG root must be focusable.

Required behavior:

- clicking the prompt area focuses the SVG root,
- clicking the send zone submits the current buffer,
- Enter submits,
- Backspace deletes one Unicode code point,
- IME input must be supported using compositionstart, compositionupdate, compositionend,
- caret must blink,
- placeholder must disappear when buffer is non-empty,
- prompt text must be clipped/truncated safely inside the prompt region.

Required modules:

src/input/pixelPrompt.ts
src/input/keyboardController.ts
src/input/compositionController.ts
src/input/caret.ts
src/input/textBuffer.ts

Do not replace this with HTML controls.

-------------------------------------------------------------------------------
EMOTION TAXONOMY
-------------------------------------------------------------------------------

Implement exactly these 30 emotions:

1. neutral
2. happy
3. excited
4. proud
5. playful
6. love
7. shy_love
8. comforted
9. attached
10. sad
11. lonely
12. disappointed
13. hurt
14. angry
15. annoyed
16. jealous
17. scared
18. nervous
19. surprised
20. confused
21. sleepy
22. hungry
23. tired
24. sick
25. curious
26. thinking
27. bored
28. grateful
29. apologetic
30. sulky

Do not silently add or remove emotions.

-------------------------------------------------------------------------------
INTENT TAXONOMY
-------------------------------------------------------------------------------

Implement these intents:

- greeting
- compliment
- affection
- feed
- sleep
- play
- tease
- insult
- apology
- comfort_request
- question
- goodbye
- unknown

Intent and emotion are separate.

Example:

Input: "cute"
intent: compliment
emotion target may be shy_love or love depending on state and intensity.

-------------------------------------------------------------------------------
TRANSITIONPLAN CONTRACT
-------------------------------------------------------------------------------

The local LLM must return only a TransitionPlan.

TypeScript type:

type Emotion =
  | "neutral"
  | "happy"
  | "excited"
  | "proud"
  | "playful"
  | "love"
  | "shy_love"
  | "comforted"
  | "attached"
  | "sad"
  | "lonely"
  | "disappointed"
  | "hurt"
  | "angry"
  | "annoyed"
  | "jealous"
  | "scared"
  | "nervous"
  | "surprised"
  | "confused"
  | "sleepy"
  | "hungry"
  | "tired"
  | "sick"
  | "curious"
  | "thinking"
  | "bored"
  | "grateful"
  | "apologetic"
  | "sulky";

type Intent =
  | "greeting"
  | "compliment"
  | "affection"
  | "feed"
  | "sleep"
  | "play"
  | "tease"
  | "insult"
  | "apology"
  | "comfort_request"
  | "question"
  | "goodbye"
  | "unknown";

type EasingName =
  | "linear"
  | "ease_in"
  | "ease_out"
  | "bounce"
  | "overshoot";

type MotionName =
  | "none"
  | "tiny_bounce"
  | "shake"
  | "sway"
  | "hop";

type EffectName =
  | "none"
  | "hearts"
  | "sparkles"
  | "tears"
  | "zzz"
  | "question"
  | "anger";

type TransitionPlan = {
  intent: Intent;
  from: Emotion;
  to: Emotion;
  intensity: number;      // 0..1
  durationMs: number;     // 300..1200
  fps: number;            // 4..12
  easing: EasingName;
  motion: MotionName;
  effect: EffectName;
  blush: boolean;
  confidence: number;     // 0..1
};

Sanitize every plan.

Validation rules:

- intent must be in Intent.
- from must equal current state mood unless explicitly corrected by sanitizer.
- to must be in Emotion.
- intensity must be clamped to 0..1.
- durationMs must be clamped to 300..1200.
- fps must be clamped to 4..12.
- easing must be known.
- motion must be known.
- effect must be known.
- confidence must be clamped to 0..1.
- unknown fields must be ignored.
- raw SVG, HTML, CSS, JS, path data, or DOM selectors from the model must be rejected.

-------------------------------------------------------------------------------
POSE AND TRANSITION ENGINE
-------------------------------------------------------------------------------

Do not create 30 totally different SVG structures.
Use primitive composition.

A Pose is a visual parameter set.

Example:

type EyePose =
  | "dot"
  | "happy_closed"
  | "half_closed"
  | "sharp"
  | "wide"
  | "sad"
  | "heart_like";

type MouthPose =
  | "flat"
  | "small_smile"
  | "big_smile"
  | "sad_curve"
  | "zigzag"
  | "tiny_open"
  | "surprised_o"
  | "pout";

type Pose = {
  eyes: EyePose;
  mouth: MouthPose;
  brows: "none" | "soft" | "angry" | "worried" | "raised";
  blushOpacity: number;
  bodyOffsetY: number;
  bodyOffsetX: number;
  bodyScale: number;
  bodyRotation: number;
  effect: EffectName;
  effectOpacity: number;
};

Implement:

- POSE_MAP for all 30 emotions.
- transition plan -> target pose.
- current pose -> target pose interpolation.
- frame scheduler.
- low-FPS animation.
- effect rendering.
- speech bubble rendering.

The transition must be multi-frame.

For example:

neutral -> shy_love

frame 0:
- eyes dot
- mouth flat
- blush 0
- body y 0

frame 1:
- eyes begin closing
- mouth slight smile
- blush 0.2
- body y -0.3

frame 2:
- eyes happy_closed
- mouth small_smile
- blush 0.6
- body y -0.8

frame 3:
- hearts appear
- blush 1.0
- body bounce

frame 4:
- shy_love completed

This intermediate state generation must be deterministic code.
The LLM only chooses the transition plan.

-------------------------------------------------------------------------------
ANIMATION REQUIREMENTS
-------------------------------------------------------------------------------

Emotion changes must not be single-frame swaps.

Required animation capabilities:

- body bounce,
- body shake,
- body sway,
- body hop,
- eyes transition,
- mouth transition,
- brow visibility/position,
- blush opacity,
- hearts effect,
- sparkles effect,
- tears effect,
- zzz effect,
- question mark effect,
- anger mark effect,
- speech bubble update.

Use low-FPS pixel-style animation.
Preferred fps range: 4..12.

Use:

- requestAnimationFrame for frame scheduling, or
- Web Animations API where appropriate,
- step-based timing/easing for pixel feel.

Avoid complex path morphing.
If path morphing is used, it must only be used for compatible path pairs and must be tested.
Primitive composition is preferred.

-------------------------------------------------------------------------------
LOCAL LLM REQUIREMENT
-------------------------------------------------------------------------------

The model must be local.
The model must be ultra-light.
The model must only perform intent/transition planning.
The model must not generate free-form chat replies.
The model must not generate long text.
The model must not generate SVG.

The model should output or help produce TransitionPlan.

Before implementing local LLM runtime, perform a Hugging Face model search and submit candidates for user review.

This gate is mandatory.

Do not pick a model silently.
Do not implement a model before user approval.
Do not use a cloud model.
Do not use external API inference.
Do not use hosted Hugging Face inference endpoints.
Do not make runtime network calls to download model files.
Do not assume a model is acceptable because it is small.

Search goals:

- Find ultra-light text classification / intent classification / emotion classification / small English-first models suitable for short user messages.
- Prefer models compatible with Transformers.js or ONNX Runtime Web.
- Prefer models that can be vendored locally.
- Prefer permissive licenses.
- Prefer small artifact size.
- Prefer deterministic structured outputs or easily mappable classification logits.
- Prefer models suitable for English input; treat multilingual support as optional.

Candidate categories to inspect:

1. tiny English-first text classification models
2. tiny sentiment/emotion classifiers
3. small English-first encoder models
4. ONNX-exported Transformers.js-compatible models
5. models tagged for transformers.js
6. models with explicit license metadata
7. models with documented intended use and limitations

For each candidate, report:

- model id
- Hugging Face URL
- model architecture
- parameter count if available
- file size / ONNX size / quantized size if available
- license
- language coverage
- English intent/emotion fit evidence
- task type / pipeline_tag
- whether it is text-classification, zero-shot-classification, sentence-embedding, or generative
- whether it can run in Transformers.js
- whether it can run in ONNX Runtime Web
- whether it can be used fully offline after vendoring
- whether it requires WebGPU, WASM, or both
- expected latency class
- expected memory class
- model card quality
- intended use
- limitations
- risks
- reason to accept
- reason to reject
- final recommendation

Required comparison table:

| rank | model_id | task | size | license | English fit / optional multilingual | browser runtime | offline vendoring | pros | cons | recommendation |

Hard acceptance criteria:

- No external inference API.
- No hosted endpoint.
- No runtime model download.
- No opaque license.
- No model without basic documentation unless explicitly approved by user.
- No model that cannot be legally redistributed or vendored.
- No model that requires a backend server as the primary architecture.
- No model whose output cannot be sanitized into TransitionPlan.

If no acceptable Hugging Face model is found:

- report the search process,
- list rejected candidates and reasons,
- propose a deterministic development planner only for testing transition engine,
- do not present it as a replacement for local LLM,
- ask user for approval before proceeding.

Do not implement model runtime before user approval.

-------------------------------------------------------------------------------
MODEL PACKAGING GATE
-------------------------------------------------------------------------------

Before implementing model runtime, prepare a packaging feasibility report.

Compare:

A. True single-file SVG
- model runtime and model weights embedded into SVG
- no runtime file loading
- no runtime network
- maximum purity
- may create very large SVG

B. SVG + local sibling model assets
- SVG remains the UI/runtime artifact
- model files live locally next to SVG
- no network
- may be more practical
- may have browser file-loading constraints

C. Other local-only approach
- must still satisfy no external API, no backend, no runtime network

Report:

- estimated artifact size,
- browser compatibility,
- startup latency,
- memory risk,
- build complexity,
- offline behavior,
- legal/licensing implications,
- recommendation.

Stop and ask user to approve the packaging strategy.

Do not silently choose.

-------------------------------------------------------------------------------
DEVELOPMENT-ONLY DETERMINISTIC PLANNER
-------------------------------------------------------------------------------

A deterministic development planner may be implemented only to test:

- prompt UI,
- state machine,
- rig,
- transition engine,
- emotion animations,
- e2e tests.

Do not name it fallbackPlanner.
Do not market it as fallback.
Do not use it to hide LLM failure.

Allowed names:

- deterministicDevPlanner
- deterministicTestPlanner
- ruleBasedDevPlanner

If local LLM runtime fails in production mode, show explicit model unavailable status.
Do not silently switch to a non-LLM mode.

-------------------------------------------------------------------------------
REQUIRED SOURCE STRUCTURE
-------------------------------------------------------------------------------

After Stage -2 is verified, use this structure.

svgotchi/
├─ AGENTS.md
├─ plan/
│  └─ svgotchi-active-plan.md
├─ skills/
├─ vendor/
│  └─ agent-skills/
├─ docs/
│  ├─ research.md
│  ├─ architecture.md
│  ├─ model-review.md
│  ├─ character-review.md
│  ├─ transition-review.md
│  └─ adr/
│     ├─ 0001-pure-svg-runtime.md
│     ├─ 0002-local-llm-transition-planner.md
│     ├─ 0003-character-rig-contract.md
│     ├─ 0004-pure-svg-prompt-input.md
│     └─ 0005-model-packaging.md
├─ assets/
│  ├─ base-character.svg
│  ├─ pose-previews/
│  └─ transition-previews/
├─ src/
│  ├─ core/
│  │  ├─ app.ts
│  │  ├─ state.ts
│  │  ├─ types.ts
│  │  └─ lifecycle.ts
│  ├─ input/
│  │  ├─ pixelPrompt.ts
│  │  ├─ keyboardController.ts
│  │  ├─ compositionController.ts
│  │  ├─ caret.ts
│  │  └─ textBuffer.ts
│  ├─ character/
│  │  ├─ characterContract.ts
│  │  ├─ requiredRigIds.ts
│  │  ├─ rig.ts
│  │  ├─ validateCharacterRig.ts
│  │  └─ baseCharacter.ts
│  ├─ emotion/
│  │  ├─ emotionCatalog.ts
│  │  ├─ intentCatalog.ts
│  │  ├─ poseMap.ts
│  │  ├─ replyBank.ts
│  │  └─ stateRules.ts
│  ├─ planner/
│  │  ├─ transitionPlan.types.ts
│  │  ├─ sanitizeTransitionPlan.ts
│  │  ├─ deterministicDevPlanner.ts
│  │  └─ planRouter.ts
│  ├─ llm/
│  │  ├─ modelRuntime.ts
│  │  ├─ modelManifest.ts
│  │  ├─ transitionPlannerPrompt.ts
│  │  ├─ transitionPlanSchema.ts
│  │  └─ localTransitionPlanner.ts
│  ├─ engine/
│  │  ├─ transitionEngine.ts
│  │  ├─ interpolation.ts
│  │  ├─ frameScheduler.ts
│  │  ├─ easing.ts
│  │  └─ poseResolver.ts
│  ├─ render/
│  │  ├─ renderer.ts
│  │  ├─ effects.ts
│  │  ├─ bubble.ts
│  │  ├─ pixelText.ts
│  │  └─ debugOverlay.ts
│  ├─ template/
│  │  └─ svgotchi.template.svg
│  └─ build/
│     ├─ buildSvg.ts
│     ├─ inlineAssets.ts
│     └─ verifyDist.ts
├─ tests/
│  ├─ characterContract.test.ts
│  ├─ validateCharacterRig.test.ts
│  ├─ pixelPrompt.test.ts
│  ├─ sanitizeTransitionPlan.test.ts
│  ├─ poseMap.test.ts
│  ├─ transitionEngine.test.ts
│  ├─ interpolation.test.ts
│  ├─ frameScheduler.test.ts
│  └─ buildSvg.test.ts
├─ e2e/
│  └─ svgotchi.spec.ts
├─ package.json
├─ tsconfig.json
├─ vitest.config.ts
├─ playwright.config.ts
└─ dist/
   └─ svgotchi.svg

Keep modules small.
Refactor any source file over 300 lines unless there is a documented reason.
Avoid circular dependencies.
Avoid hidden global state except the explicitly managed PetState.

-------------------------------------------------------------------------------
ACTIVE PLAN REQUIREMENTS
-------------------------------------------------------------------------------

plan/svgotchi-active-plan.md must include:

# SVGotchi Active Plan

## 0. Workflow Status
- Codex-Subagent-Orchestrator installed: yes/no
- AGENTS.md present: yes/no
- plan/ present: yes/no
- skills/ present: yes/no
- vendor/agent-skills/ present: yes/no
- active plan created: yes/no
- implementation allowed: yes/no

Implementation is allowed only when all above are yes.

## 1. Current User Score
- explicit user score:
- provisional score if no explicit score: <= 50

## 2. Product Goal
- pure-SVG local-LLM Tamagotchi
- animated emotion transition
- local transition planning only
- no remote runtime dependencies

## 3. Non-Negotiable Constraints
- SVG, not PDF
- no foreignObject
- no HTML input/button
- no external API
- no hosted model inference
- no backend server as primary architecture
- no localhost dependency
- no runtime network call
- local model assets only
- LLM outputs TransitionPlan only
- no raw SVG mutation by LLM
- deterministic animation engine
- multi-frame emotion transition
- character-first workflow

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

## 5. Current Stage
- stage name
- status
- entry criteria
- exit criteria
- blockers

## 6. Research Status
- documentation reviewed
- GitHub/community prior art reviewed
- unresolved technical questions
- sources consulted
- conclusions

## 7. Model Review Status
- not started / researching / candidates prepared / user approved / rejected
- selected model:
- reason:
- license:
- local/offline strategy:

## 8. Character Review Status
- concept candidates:
- approved concept:
- neutral SVG approved:
- rig contract approved:
- 30-emotion pose sheet approved:
- transition previews approved:

## 9. Test Status
- unit tests
- e2e tests
- typecheck
- lint
- build verification

## 10. Next Action
- exact next action
- whether user approval is required before proceeding

-------------------------------------------------------------------------------
WEB RESEARCH AND UNCERTAINTY RULE
-------------------------------------------------------------------------------

If any technical detail is ambiguous, do not guess.

Research first using available web/documentation/GitHub/community sources.

Examples requiring research:

- SVG keyboard focus behavior,
- IME composition events in SVG/document context,
- single-file SVG model embedding feasibility,
- Transformers.js local model loading constraints,
- ONNX Runtime Web local model loading constraints,
- Hugging Face model licensing,
- Hugging Face model English-first intent/emotion fit,
- browser limitations for SVG script,
- existing interactive SVG app structures,
- existing Tamagotchi/pet state machine structures,
- existing local in-browser model runtime examples.

After research:

1. summarize findings,
2. cite sources or list exact source URLs,
3. compare options,
4. recommend one option,
5. ask the user for approval if the decision affects architecture, model, packaging, character, or runtime.

Do not treat uncertainty as permission to implement randomly.
Do not bury assumptions in code.
Do not continue past approval gates without approval.

If web access is unavailable:

- stop,
- report that research cannot be completed,
- list the exact unresolved questions,
- do not guess,
- wait for user direction.

-------------------------------------------------------------------------------
STAGE SEQUENCE
-------------------------------------------------------------------------------

Stage -2: Root Workflow Installation

Goal:
Install the Codex-Subagent-Orchestrator workflow at repository root.

Tasks:
- Create AGENTS.md.
- Create plan/.
- Create skills/.
- Create vendor/.
- Create vendor/agent-skills/.
- Create plan/svgotchi-active-plan.md.
- Record all mandatory constraints.
- Record all approval gates.
- Mark implementation as blocked.

Exit criteria:
- all required root files/folders exist,
- active plan exists,
- implementation is still blocked,
- report created.

Stop and report to user.

Do not proceed to Stage -1 without user approval.

Stage -1: Research and Architecture

Goal:
Research relevant implementation patterns before coding.

Research:
- interactive SVG script patterns,
- pure SVG keyboard input,
- IME composition event handling,
- SVG animation / low-FPS animation,
- finite-state pet/Tamagotchi architecture,
- local in-browser LLM runtimes,
- Transformers.js,
- ONNX Runtime Web,
- Hugging Face model cards and licensing,
- model vendoring/offline packaging,
- single-file SVG asset embedding.

Deliverables:
- docs/research.md
- docs/architecture.md
- ADRs:
  - 0001-pure-svg-runtime.md
  - 0002-local-llm-transition-planner.md
  - 0003-character-rig-contract.md
  - 0004-pure-svg-prompt-input.md
  - 0005-model-packaging.md

Exit criteria:
- architecture documented,
- risks documented,
- unresolved issues documented,
- user approval requested.

Stop and report.

Stage 0: Character Concept Candidates

Goal:
Define the visual identity before code.

Tasks:
- Create 3 to 5 cute pixel Tamagotchi character concepts.
- Each concept must fit 100x100 SVG layout.
- Each concept must be riggable.
- Each concept must have simple body, eyes, mouth, blush, optional ears/antenna/tail.
- Do not make complex unriggable artwork.
- Generate visual previews if possible.
- Store previews under assets/pose-previews/ or docs/character-review.md.

Exit criteria:
- concepts presented to user,
- pros/cons listed,
- one recommended concept,
- user approval requested.

Stop and wait for user review.

Stage 1: Neutral Base Character and Rig Contract

Goal:
Create the approved neutral base character as riggable SVG.

Tasks:
- Create assets/base-character.svg.
- Use viewBox 0 0 100 100.
- Add all required rig IDs.
- Add hidden effect layers.
- Add prompt area placeholders but not full runtime yet.
- Implement CHARACTER_CONTRACT.
- Implement REQUIRED_RIG_IDS.
- Implement validateCharacterRig().
- Unit-test rig validation.

Exit criteria:
- base-character.svg exists,
- rig validator passes,
- neutral preview generated,
- user approval requested.

Stop and wait for user review.

Stage 2: 30-Emotion Pose Sheet

Goal:
Define target poses for all 30 emotions using the same rig.

Tasks:
- Implement POSE_MAP for all 30 emotions.
- Do not create different DOM structures per emotion.
- Use primitive pose parameters.
- Generate static preview for each emotion.
- Generate a 30-emotion pose sheet image or SVG preview.
- Document emotion-to-pose mapping.

Exit criteria:
- all 30 emotions mapped,
- pose sheet preview generated,
- user approval requested.

Stop and wait for user review.

Stage 3: Pure SVG Prompt Prototype

Goal:
Implement pure SVG prompt input without HTML controls.

Tasks:
- Implement pixel prompt UI using rect/text/caret/send-zone.
- Implement focus handling.
- Implement keydown handling.
- Implement IME composition handling.
- Implement Enter submit.
- Implement Backspace deletion by Unicode code point.
- Implement caret blink.
- Implement text clipping/truncation.

Deliverables:
- src/input modules
- tests for textBuffer and prompt input behavior
- minimal dist SVG prototype if appropriate

Exit criteria:
- prompt works in target browser SVG document context,
- no foreignObject,
- no HTML input/button,
- tests pass,
- report user-visible behavior.

Stage 4: Deterministic Transition Engine

Goal:
Implement emotion1 -> intermediate frames -> emotion2 transition.

Tasks:
- Implement Pose type.
- Implement interpolation.
- Implement easing.
- Implement frame scheduler.
- Implement renderer.
- Implement effects renderer.
- Implement speech bubble renderer.
- Implement multi-frame transition.
- Use deterministicDevPlanner only for testing.
- Do not present deterministicDevPlanner as production replacement for local LLM.

Required sample transitions:
1. neutral -> shy_love
2. neutral -> hungry
3. neutral -> sleepy
4. neutral -> hurt
5. neutral -> curious

Exit criteria:
- 5 transition previews generated,
- multi-frame transitions verified,
- user approval requested.

Stop and wait for user review.

Stage 5: Hugging Face Ultra-Light Model Review

Goal:
Find and review local ultra-light models for intent/transition planning.

Tasks:
- Search Hugging Face.
- Compare candidates.
- Check license.
- Check English-first intent/emotion fit and optional multilingual notes.
- Check browser runtime compatibility.
- Check offline vendoring feasibility.
- Check artifact size.
- Check model card quality.
- Prepare docs/model-review.md.

Do not implement model runtime yet.

Exit criteria:
- candidate table complete,
- recommendation provided,
- user approval requested.

Stop and wait for user approval.

Stage 6: Model Packaging Strategy

Goal:
Decide how model/runtime assets are packaged.

Tasks:
- Compare true single-file SVG embedding vs local sibling model assets.
- Estimate size and memory.
- Check browser constraints.
- Check legal constraints.
- Check build complexity.
- Document recommendation.

Exit criteria:
- docs/adr/0005-model-packaging.md updated,
- user approval requested.

Stop and wait for user approval.

Stage 7: Local LLM Transition Planner

Goal:
Implement the approved local LLM runtime.

Tasks:
- Implement modelRuntime.ts.
- Implement localTransitionPlanner.ts.
- Implement transitionPlanSchema.ts.
- Implement sanitizeTransitionPlan.ts.
- Ensure no runtime network calls.
- Ensure no backend server.
- Ensure no external API.
- Ensure model output is constrained and sanitized.
- Ensure model only produces TransitionPlan.
- Add explicit model-unavailable status if runtime fails.
- Do not silently switch to deterministic planner in production mode.

Exit criteria:
- local model runs according to approved packaging strategy,
- TransitionPlan generated and sanitized,
- tests pass,
- no runtime network calls verified.

Stage 8: Full Integration

Goal:
Connect prompt -> local LLM planner -> transition engine -> renderer.

Tasks:
- Wire app lifecycle.
- Maintain PetState.
- Store current mood.
- Send prompt text to local planner.
- Sanitize TransitionPlan.
- Execute transition.
- Render any speech bubble text from app-owned copy, never from model output.
- Update state/history.
- Add debug overlay optional behind compile flag.

Exit criteria:
- "you are cute" causes:
  - local LLM transition plan,
  - target shy_love or love,
  - hearts effect,
  - blush activation,
  - body bounce,
  - multi-frame transition.

Stage 9: Tests and Verification

Required tests:
- rig validation
- character contract
- prompt text buffer
- IME composition event handling if testable
- sanitizeTransitionPlan
- POSE_MAP completeness
- interpolation
- transition engine
- effect rendering
- build SVG contains required IDs
- dist SVG contains inline runtime
- no foreignObject in dist
- no HTML input/button in dist
- no external API URL in dist
- no localhost URL in dist
- no hidden remote model endpoint in dist

E2E test:
- open dist/svgotchi.svg in browser SVG document context,
- focus prompt,
- type "you are cute",
- submit,
- verify transition runs over multiple frames,
- verify final emotion is shy_love/love,
- verify hearts visible,
- verify blush visible,
- if a speech bubble is visible, verify its text is app-owned and not model-generated.

Stage 10: Final Polish

Tasks:
- Improve README.
- Add demo GIF or screenshots.
- Add security/runtime notes.
- Add model license notes.
- Add browser support notes.
- Add architecture diagram.
- Minimize dist size if possible.
- Ensure source files are modular.
- Refactor any source file over 300 lines.
- Run full test/typecheck/lint/build.

README must clearly state:

- This is an SVG artifact, not an HTML app.
- Open the SVG directly as an SVG document.
- The artifact uses local model assets only according to approved packaging.
- No external API is used at runtime.
- The LLM generates TransitionPlan only.
- The SVG engine renders the animation deterministically.
- Image-preview contexts may render a static frame and may not run interactivity.

-------------------------------------------------------------------------------
INTERMEDIATE REVIEW AFTER EACH STAGE
-------------------------------------------------------------------------------

At the end of every stage, perform a review before moving on.

Report:

1. what was implemented,
2. what files changed,
3. whether the active plan was updated,
4. whether requirements are still satisfied,
5. which tests were run,
6. test results,
7. architecture risks,
8. code smells found,
9. refactors performed,
10. external references consulted,
11. comparison with relevant prior-art patterns,
12. whether user approval is required before the next stage.

If any stage violates modularity, testability, SVG purity, local-only runtime, or user approval gates:

- stop,
- explain the violation,
- refactor,
- re-run tests,
- update active plan,
- report again.

Do not continue silently.

-------------------------------------------------------------------------------
CODE QUALITY RULES
-------------------------------------------------------------------------------

Mandatory:

- TypeScript strict mode.
- No implicit any unless documented.
- No monolithic runtime file.
- No hidden global mutable state except managed PetState.
- No untyped model output.
- No raw model output used directly.
- No raw innerHTML insertion from model output.
- No eval.
- No Function constructor.
- No remote URLs in runtime artifact.
- No API keys.
- No backend assumptions.
- No localhost references.
- No hidden dependency on HTML wrapper.
- No foreignObject.
- No HTML form controls.

Preferred:

- small modules,
- pure functions for interpolation,
- typed schemas,
- deterministic renderer,
- reproducible build,
- unit tests for logic,
- e2e tests for interactive behavior,
- documented ADRs.

-------------------------------------------------------------------------------
SECURITY RULES
-------------------------------------------------------------------------------

The model output is untrusted.

Never apply model output directly to:

- setAttribute name,
- DOM selector,
- path data,
- style text,
- script text,
- innerHTML,
- external URL,
- animation keyframes without sanitization.

The only accepted model output is sanitized TransitionPlan.

Reject or clamp everything else.

-------------------------------------------------------------------------------
FINAL ACCEPTANCE CRITERIA
-------------------------------------------------------------------------------

The project is complete only when:

1. Codex-Subagent-Orchestrator workflow is installed at root.
2. Active plan is complete and updated.
3. Character concept was reviewed by user.
4. Neutral base character was reviewed by user.
5. Rig contract was reviewed by user.
6. 30-emotion pose sheet was reviewed by user.
7. 5 transition previews were reviewed by user.
8. Hugging Face model candidates were reviewed by user.
9. Model packaging strategy was reviewed by user.
10. Local LLM runtime uses approved local-only strategy.
11. Final SVG uses pure SVG prompt UI.
12. Final SVG has no foreignObject.
13. Final SVG has no HTML input/button.
14. Final SVG has no external API calls.
15. Final SVG has no backend dependency.
16. Final SVG has no runtime network calls.
17. LLM outputs TransitionPlan only.
18. Animation engine creates multi-frame emotion transitions.
19. "you are cute" demo works.
20. Tests pass.
21. Typecheck passes.
22. Lint passes.
23. Build passes.
24. README clearly documents usage and limitations.
25. No approval gate was skipped.

Start now with Stage -2 only.
Do not implement SVGotchi yet.
Set up the root workflow, create the active plan, verify the checklist, then stop and report.
