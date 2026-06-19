# Backlog: Semantic Routing Pipeline

Status: deferred future work
Last reviewed: 2026-06-19 Asia/Seoul

This note preserves the semantic-routing proposal that used to live in the repository root as `1.md`. It is not part of the current public baseline. The current baseline keeps the smaller verified label/score routing correction: raw model labels map to pet emotion families, model scores and top-label margins derive expression intensity, and explicit support requests are required before routing to `comforted`.

## Problem Statement

The current planner is intentionally compact, but it still blends user affect, user intent, and pet reaction in one small mapping function. The most important bug from this area has already been fixed: ordinary sad wording no longer becomes `comfort_request`.

The larger unresolved design question is whether the planner should eventually become a semantic routing pipeline:

```text
input + raw model label
-> SemanticSignals
-> PetReactionResolver
-> TransitionPlan
```

## Original Example

Problem example:

```text
Input: "I'm sad but you are comfortable?"
Old behavior:
- rawLabel: sadness
- keyword intent: comfort_request because of "sad"
- final to: comforted
```

That was wrong. `sad` alone is a user affect statement, not a comfort request.

The current corrected baseline no longer makes that mistake. A future semantic router would go further and distinguish question, target, speech act, and accent emotion.

## Future Architecture Candidate

Potential future `SemanticSignals` fields:

- `rawEmotion`
- `userAffect`
- `speechAct`
- `target`
- `topic`
- `explicitRequest`
- `directedAtPet`
- `isQuestion`
- `intensity`

Candidate future phases:

1. Add `mapRawLabelToUserAffect()` so raw model labels become user affect evidence only and do not map directly to `TransitionPlan.to`.
2. Add `extractKeywordSignals()` for high-precision keyword signals.
3. Ensure `sad`, `lonely`, `scared`, or `afraid` alone do not become `comfort_request`.
4. Add `detectSpeechAct()` for statement, question, compliment, affection, support request, apology, insult, play request, feed request, and sleep request.
5. Add `detectTarget()` for self, pet, relationship, world, and unknown.
6. Add `resolvePetReaction()` so intent priority is explicit and raw emotion can be fallback or accent evidence.
7. Consider extending `TransitionPlan` with optional `accentEmotion` and `accentWeight`, but only after a separate schema and renderer plan.
8. Add golden routing fixtures before changing behavior.

## Required Future Test Coverage

A future implementation should add a fixture file such as `tests/fixtures/semantic-routing-cases.json` with broad coverage. The old proposal suggested at least 80 cases across:

- English cases;
- Korean cases;
- mixed emotional sentences;
- questions;
- compliments;
- affection;
- insults;
- explicit comfort requests;
- user emotion statements that are not requests.

## Candidate Future Routing Expectations

These examples are future design targets, not current release acceptance criteria:

| Input | Future target behavior |
| --- | --- |
| `I'm sad but you are comfortable?` | `to` curious or confused, `accentEmotion` sad, not comforted |
| `I'm sad` | `to` sad or disappointed, not comforted |
| `I'm sad, comfort me` | `to` comforted |
| `comfort me` | `to` comforted |
| `you are cute` | `to` shy_love |
| `I love you` | `to` love or attached |
| `are you hungry?` | `to` hungry |
| `go to sleep` | `to` sleepy |
| `I hate you` | `to` hurt or angry |
| `sorry, my fault` | `to` grateful or comforted |

## Constraints For Any Future Work

- Do not change model selection as part of this backlog item.
- Do not change the character renderer unless the approved schema requires it.
- Do not change the transition engine unless `accentEmotion` or similar behavior is explicitly approved.
- Do not let the model generate reply text.
- Do not allow raw SVG mutation.
- Do not allow model-generated CSS, JavaScript, DOM selectors, path data, or arbitrary animation code.

## Recommended Timing

Do not do this before public pre-release cleanup. The current verified baseline is good enough for an experimental GitHub upload after documentation and test-surface cleanup. This backlog should become the next planner-quality workstream only if semantic nuance becomes more important than shipping the current Mochi Sprout path.
