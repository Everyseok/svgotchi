# ADR 0003: Character Rig Contract

## Status

Accepted and active

## Date

2026-06-17 Asia/Seoul

## Context

SVGotchi needs 30 emotions and animated transitions without swapping unrelated images or loading runtime character PNGs. The character must be a riggable SVG using a stable coordinate and slot contract. Optional parts must exist as hidden layers rather than appearing only for some emotions.

## Decision

Use a fixed `viewBox="0 0 100 100"` rig with required IDs and stable slots. All emotions share the same DOM structure. Pose data controls visibility, transforms, opacity, and simple primitive shapes. The active runtime character is a pure SVG anime companion inspired by reference PNG layers, but those PNG files are not runtime dependencies.

The rig validator must run before the app starts and fail clearly when required IDs or layout invariants are missing.

## Alternatives Considered

### Separate SVG per emotion

Pros:

- easy to draw each emotion independently

Cons:

- breaks interpolation
- makes DOM validation hard
- encourages single-frame swaps
- increases asset drift across 30 emotions

Rejected.

### One complex path blob with path morphing

Pros:

- compact visual tree
- possible smooth morphs

Cons:

- hard to validate
- compatible path morphing is fragile
- harder to keep compact SVG readability

Rejected for base architecture. Compatible path morphing may be used later only if tested and narrowly justified.

### Primitive slot rig

Pros:

- predictable IDs
- easy validation
- easy pose interpolation
- good fit for a compact riggable SVG character

Cons:

- visual complexity is intentionally limited compared with a full illustration

Accepted as proposed direction.

## Consequences

- Character art must be designed around riggability.
- Stage 0 concepts must be judged partly by whether they can fit the rig.
- Stage 1 must include rig validation tests.
- Emotion rendering becomes data-driven pose resolution rather than DOM swapping.

## Sources

- https://developer.mozilla.org/en-US/docs/Glossary/State_machine
- https://gameprogrammingpatterns.com/state.html
