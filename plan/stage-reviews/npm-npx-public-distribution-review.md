# npm/npx Public Distribution Review

Reviewed: 2026-06-17 22:45:22 Asia/Seoul
Scope: npm/npx CLI command surface, TypeScript setup/verify/serve scripts, package bin/script wiring, direct model/runtime dependency declaration, distribution docs, README install section, active plan updates, and cleanup of obsolete setup wrappers.

## Result

Overall score: 95/100
Gate result: passed. The npm/npx public distribution scaffold is suitable for user review. Final browser-side LLM UI integration remains a later gate.

## Score Breakdown

| Area | Score | Notes |
| --- | ---: | --- |
| Requirement compliance | 97 | Implements `svgotchi`, `demo`, `setup-model`, `serve`, and `verify-model` command design; keeps model files out of Git and avoids GitHub Pages as full mode. |
| Architecture boundary | 96 | Localhost is explicitly static serving only; no inference endpoint or prompt-submission backend was added. |
| CLI and setup UX | 94 | Guided mode, setup confirmation, size reporting, verification, and server launch are present. Public `npx` still depends on package publication. |
| Model/runtime asset safety | 95 | Pinned manifest checks size and SHA-256; setup verifies after install; model/runtime payload folders remain ignored. |
| Static server safety | 94 | Binds to `127.0.0.1`, rejects path traversal, serves a narrow route set, and has smoke checks. Future hardening can add request logging and stricter headers if needed. |
| Documentation quality | 95 | Distribution, model setup, static server, README, ADR, and active architecture docs now distinguish direct-open demo, local served full mode, GitHub Pages demo, and npm/npx full experience. |
| Package hygiene | 96 | `npm pack --dry-run` shows a small package with `.gitkeep` only for model/runtime folders; no `dist` artifact is created. |
| Verification quality | 95 | Typecheck, test suite, model verification, setup no-op, server smoke checks, CLI help, and package dry-run were run. |
| Scope control | 98 | Stage 1-4 implementation, transition engine, PNG overlay implementation, and model planner semantics were not changed. |
| Residual risk handling | 91 | Node 24 TypeScript-bin choice is acceptable for this scaffold but should be reconsidered before broad npm release; final browser app integration is still separate. |

## Verification

- `cmd /c npm run verify:model`: passed, pinned local model/runtime assets match expected byte sizes and SHA-256 hashes.
- `cmd /c npm run verify`: passed, 36 tests.
- `cmd /c npm run serve:smoke`: passed.
- `node scripts/serve.ts --demo --no-open --smoke`: passed.
- `node scripts/svgotchi.ts demo --no-open --smoke`: passed.
- `node scripts/svgotchi.ts serve --no-open --smoke`: passed.
- `node scripts/svgotchi.ts help`: passed.
- `node scripts/setup-model.ts --yes`: passed as already-complete no-op.
- `npm pack --dry-run` with workspace npm cache: passed; expected tarball size about 74.8 kB, with no model/runtime payload files included.
- `dist` check: passed; no `dist` directory exists.

## Findings

No blocking issues found.

Residual risks:

- The public `npx svgotchi` command cannot be fully exercised until the package is published or installed from a packed tarball.
- The current bin points at a TypeScript file and requires Node 24+. This is intentional to avoid creating `dist`, but a release-hardening gate should consider a JS bin build if broader Node support is needed.
- The static server currently opens an honest shell page. Final browser-side local LLM UI integration remains later work and must not be claimed complete.

## Scope Confirmation

Changed later-facing distribution files only. No Stage 1-4 character implementation, transition engine behavior, PNG overlay implementation, or `src/llm` semantics were changed. The older shell and PowerShell setup wrappers were removed because the npm/npx TypeScript setup path is now the single maintained public setup implementation.
