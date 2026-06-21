# ADR 0001: Pure SVG Runtime

## Status

Superseded in part by the source-checkout static-server distribution decision

## Date

2026-06-17 Asia/Seoul

## Context

SVGotchi must behave as an SVG artifact, not an HTML application. The prompt area must use SVG elements only. Runtime dependencies on an HTML wrapper, `foreignObject`, canvas, React, a backend, localhost inference bridge, or remote APIs are disallowed.

Current update: direct-open SVG remains valid for model-free preview behavior. Full local LLM mode now uses source checkout scripts to start a localhost static file server so the browser can fetch local SVG, JavaScript, WASM, tokenizer, and model files. That server is not an LLM backend and must not receive prompt text for inference.

Research shows standalone SVG documents can execute SVG script, but SVG used as an image resource is processed in restricted modes where script and interactivity are disabled.

## Decision

Target a direct-open standalone SVG document with inline non-module JavaScript for model-free preview behavior. Treat image-preview contexts as static/non-interactive views. Use the source-checkout static-server path for full local LLM mode, serving the SVG app document directly instead of an HTML wrapper.

The runtime will:

- use SVG `rect`, `text`, `g`, transforms, opacity, and clip paths
- use known rig IDs only
- render prompt text and caret in SVG
- use deterministic JavaScript inside the SVG document for input, state, animation, and rendering
- load static JavaScript from the served SVG document for full local mode when model/runtime assets need normal HTTP fetch semantics

The runtime will not:

- require an HTML page
- use `foreignObject`
- use HTML form controls
- use canvas
- use a DOM framework
- depend on a server or runtime network

## Alternatives Considered

### HTML wrapper with embedded SVG

Pros:

- easier input handling
- easier model/runtime asset loading
- simpler browser testing

Cons:

- violates the product requirement that the SVG itself is the artifact
- encourages HTML input/button usage
- weakens the pure-SVG constraint

Rejected.

### `foreignObject` with HTML input

Pros:

- native IME/input behavior
- lower implementation effort

Cons:

- explicitly forbidden
- inconsistent SVG-renderer support
- turns the prompt into HTML UI inside SVG

Rejected.

### Static SVG plus external controller

Pros:

- simple SVG asset
- easier local model integration from normal web app code

Cons:

- violates standalone runtime goal
- creates hidden wrapper/backend dependency

Rejected.

## Consequences

- Prompt input must be custom-built and carefully tested.
- Some viewer contexts will not run the app because they process SVG as an image.
- Direct-open SVG should prefer inline plain script. Served full local mode may use a static module script from the SVG document if target-browser verification passes.
- Final docs must tell users to open the SVG directly as a document.
- E2E tests must exercise direct SVG document behavior, not only HTML embedding.

## Sources

- https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/script
- https://www.w3.org/TR/svg-integration/
- https://www.w3.org/TR/SVG/conform.html
