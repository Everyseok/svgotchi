# Stage 8: Full Integration

## Goal
Connect prompt input, local planner, transition engine, renderer, and pet state.

## Required Work
- Wire app lifecycle.
- Maintain PetState and current mood.
- Send prompt text to local planner.
- Sanitize TransitionPlan.
- Execute multi-frame transition.
- Render any speech bubble text from app-owned copy, never from model output.
- Update state/history.
- Keep debug overlay optional behind a compile flag.

## Acceptance Demo
Typing "you are cute" must produce a local plan targeting shy_love or love, hearts, blush, body bounce, and multi-frame animation. If a speech bubble is visible, its text must be app-owned and independent from model output.

## Current Evidence
- `/` serves an SVG app document, not an HTML wrapper.
- Chrome CDP served-SVG demo verification passes for `you are cute` -> `shy_love`.
- Chrome CDP served-SVG full local model verification passes for `you are cute` -> `shy_love`.
- Label/score routing regression passes for `I'm sad but you are comfortable?` -> `sad`.
- No backend inference route is introduced; localhost serves only static SVG/JS/WASM/tokenizer/model assets.
