# ADR 0004: Pure SVG Prompt Input

## Status

Proposed for user review

## Date

2026-06-17 Asia/Seoul

## Context

The prompt area must be pure SVG. HTML input, HTML button, form controls, `contenteditable`, and `foreignObject` are forbidden. IME composition input must be supported.

## Decision

Implement the prompt as a custom SVG control:

- `rect` for prompt background
- `text` for placeholder
- `text` for committed and composing text
- `rect` for caret
- `rect`/`text` for send zone
- clip path for text overflow
- focus management through SVG focusable elements
- manual keyboard and composition event handling

Maintain separate text states:

- committed buffer
- composition draft
- focus status
- caret blink state

## Alternatives Considered

### Native HTML input in `foreignObject`

Pros:

- native IME behavior
- native caret and editing

Cons:

- explicitly forbidden
- weakens SVG portability

Rejected.

### Hidden HTML input outside SVG

Pros:

- easy input capture

Cons:

- violates no HTML wrapper/control rule
- creates invisible runtime dependency

Rejected.

### SVG text plus keyboard/composition handlers

Pros:

- satisfies pure-SVG requirement
- keeps rendering deterministic
- testable buffer behavior

Cons:

- more custom logic
- must handle IME and Unicode deletion carefully

Accepted as proposed direction.

## Consequences

- Text editing scope should remain intentionally small.
- Cursor movement and text selection are not part of MVP unless separately approved.
- Enter must not submit while IME composition is active.
- Backspace must operate on Unicode code points, not UTF-16 code units.
- Browser e2e tests must cover composition behavior as much as automation allows.

## Sources

- https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/tabindex
- https://developer.mozilla.org/en-US/docs/Web/API/SVGElement/focus
- https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event
- https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
