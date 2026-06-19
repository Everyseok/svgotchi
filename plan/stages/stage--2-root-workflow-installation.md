# Stage -2: Root Workflow Installation

## Goal
Install the Codex-Subagent-Orchestrator workflow at the SVGotchi repository root before any SVGotchi implementation files are created.

## Required Root Items
- AGENTS.md
- plan/
- skills/
- vendor/
- vendor/agent-skills/
- plan/svgotchi-active-plan.md

## Execution Notes
- Source workflow: https://github.com/lemos999/Codex-Subagent-Orchestrator
- Root README.md is intentionally not created during Stage -2 because the user explicitly prohibited creating an SVGotchi README before workflow verification.
- SVGotchi source, package, asset, dist, and template files remain prohibited during this stage.

## Exit Criteria
- Required root items exist.
- Active plan exists.
- Active plan says implementation has not started.
- Active plan lists approval gates and non-negotiable constraints.
- Verification result is reported to the user.
- Stop after report and wait for user approval before Stage -1.

