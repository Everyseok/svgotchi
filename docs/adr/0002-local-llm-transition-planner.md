# ADR 0002: Local LLM Transition Planner Boundary

## Status

Proposed for user review

## Date

2026-06-17 Asia/Seoul

## Context

The product concept requires local LLM planning, but the model must not generate SVG, JavaScript, CSS, DOM selectors, path data, or raw animation code. The deterministic SVG runtime owns rendering and animation.

The model is useful only for mapping user text and current mood into a constrained transition intent. It is not trusted code.

## Decision

Define a strict planner boundary:

- input: user text, current emotion, limited state context
- output: TransitionPlan-shaped data only
- sanitizer: required between model output and runtime
- renderer: never receives raw model text except through sanitized fields

The model may decide:

- intent
- target emotion
- intensity
- duration
- fps
- easing
- motion
- effect
- blush
- confidence

The model may not decide:

- pet reply text
- reply style
- SVG markup
- path data
- element IDs
- DOM selectors
- attribute names
- scripts
- CSS
- arbitrary animation keyframes
- URLs

## Alternatives Considered

### Free-form model-generated SVG

Pros:

- flexible visual output

Cons:

- violates hard requirement
- untestable and unsafe
- breaks rig consistency
- gives untrusted output direct rendering power

Rejected.

### Rule-based planner only

Pros:

- deterministic and simple
- small artifact

Cons:

- does not satisfy local LLM requirement for production
- allowed only as development/test planner

Rejected for production. Allowed as deterministic development planner for earlier stages.

### LLM-generated natural-language reply plus transition

Pros:

- more conversational

Cons:

- expands model scope
- increases safety and localization burden
- conflicts with requirement that model only performs transition planning

Rejected for initial architecture.

## Consequences

- A schema/sanitizer layer is mandatory.
- Production model failure must show explicit unavailable status.
- Deterministic development planner must not be silently substituted in production.
- Local model review must prioritize structured planning reliability over chat fluency.

## Sources

- https://huggingface.co/docs/transformers.js/index
- https://huggingface.co/docs/hub/en/model-cards
- https://huggingface.co/docs/hub/en/repositories-licenses
