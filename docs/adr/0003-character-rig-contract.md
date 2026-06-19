# ADR 0003: Character Rig Contract

## Status

Accepted and active

## Date

2026-06-17 Asia/Seoul

## Context

SVGotchi needs 30 emotions and animated transitions without swapping unrelated full-character images or letting a model generate SVG. The current accepted base character is the user-provided composed PNG at `assets/1.png`, rendered inside the SVG app shell. The character still needs a stable rig contract so emotion changes can be app-owned, validated, and animated predictably. Optional parts must exist as stable layers rather than appearing only for some emotions.

## Decision

Use a fixed `viewBox="0 0 100 100"` rig with required IDs and stable slots. All emotions share the same DOM structure. Pose data controls visibility, transforms, opacity, and simple primitive shapes. The active runtime character uses the uploaded composed PNG at `assets/1.png` inside the SVG app shell so the base identity matches the user-provided asset. Non-neutral emotions activate app-owned SVG expression overlays for face cover patches, eyes, eye shines, heart eyes, mouth, brows, blush, and effects.

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

### Exact PNG base plus SVG expression overlay

Pros:

- preserves the uploaded character identity
- avoids another approximate redraw
- makes emotions visibly change without requiring new raster expression assets
- keeps model output bounded to app-owned pose fields

Cons:

- non-neutral expressions are overlays, not true edits to the original raster pixels
- face-cover patches require careful coordinate tuning

Accepted as the current active visual contract.

## Consequences

- Character art and overlays must be designed around riggability.
- Stage 0 concepts must be judged partly by whether they can fit the rig.
- Stage 1 must include rig validation tests.
- Emotion rendering becomes data-driven pose resolution rather than DOM swapping.
- Runtime and preview verification must prove facial overlay changes, not only whole-body transforms.

## Sources

- https://developer.mozilla.org/en-US/docs/Glossary/State_machine
- https://gameprogrammingpatterns.com/state.html
