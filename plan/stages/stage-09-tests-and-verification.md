# Stage 9: Tests and Verification

## Goal
Prove the required contracts with unit, build, and browser checks.

## Required Tests
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
- served SVG route returns `image/svg+xml`, not an HTML wrapper
- served SVG contains/loads only approved SVG runtime code
- no foreignObject in runtime SVG/assets
- no HTML input/button in runtime SVG/assets
- no external API URL in runtime SVG/assets
- no hidden remote model endpoint
- model/runtime setup verification checks pinned byte sizes and SHA-256 hashes
- Chrome CDP verifies deterministic served SVG and full local served SVG prompt-to-transition

## E2E Requirement
Run the npm/npx static server, open the served SVG document, type "you are cute", submit, verify multi-frame transition and final visible state. Full local mode must use verified local model/runtime assets and must not send prompt text to a backend.
