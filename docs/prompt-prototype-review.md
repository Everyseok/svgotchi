# SVGotchi Pure SVG Prompt Prototype Review

Status: Stage 3 complete
Last updated: 2026-06-17 03:06:12 Asia/Seoul

## Scope

Stage 3 implements prompt behavior for a pure SVG prompt area. It does not implement the transition engine, model planner, LLM runtime, packaging, or final dist artifact.

The prompt remains SVG-only:

- `rect` prompt background
- `text` placeholder
- `text` typed prompt text
- `rect` caret
- `rect`/`text` send zone

Forbidden controls remain absent:

- no `foreignObject`
- no HTML `input`
- no HTML `button`
- no `contenteditable`
- no HTML `form`

## Files

- `src/input/textBuffer.ts`
- `src/input/compositionController.ts`
- `src/input/keyboardController.ts`
- `src/input/caret.ts`
- `src/input/pixelPrompt.ts`
- `tests/textBuffer.test.ts`
- `tests/pixelPrompt.test.ts`

## Behavior Covered

- focus state for the SVG prompt model
- keydown handling
- Enter submit
- Backspace by Unicode code point
- IME composition state
- composition text rendering before commit
- composition commit on `compositionend`
- caret blink timing
- placeholder visibility
- clipped display text
- DOM-like adapter for SVG root, prompt text, placeholder, caret, prompt area, and send zone

## Validation Summary

Verification command:

```powershell
npm run verify
```

Result:

- typecheck passed
- 24 total tests passed
- pure input tests passed
- DOM-like prompt adapter tests passed
- no forbidden prompt controls detected in base SVG or input source

## Runtime Verification Note

The available environment does not currently provide a working browser executable for direct SVG document automation. Stage 3 therefore verifies the behavior through pure state tests and a DOM-like adapter test surface. Direct browser SVG-document verification remains a Stage 9 e2e requirement.

## Stage Decision

Stage 3 has no user approval gate in the initial prompt. The next required user approval gate is Stage 4, after five transition previews are generated and reviewed.
