# Runtime Asset Path Alignment Review

Reviewed At: 2026-06-17 15:47:15 Asia/Seoul
Scope: `src/llm/modelRuntime.ts`, `tests/llmPlanner.test.ts`, `docs/distribution.md`, and related plan records.

## Result

Overall score: 95/100

Gate result: passed. The full local model runtime now defaults to the same ignored `models/` and `runtime/` folders populated by the setup scripts, while explicit path overrides remain available.

## Score Breakdown

- requirement compliance: 97
- architecture boundary quality: 96
- runtime safety: 97
- test coverage quality: 95
- documentation accuracy: 94
- scope control: 98
- rollback safety: 95
- remaining packaging risk handling: 90

## Findings

No blocking findings.

The runtime still has the required local-only controls: `env.allowRemoteModels = false`, `env.allowLocalModels = true`, and `local_files_only: true`. No fallback planner, hosted inference path, backend dependency, localhost dependency, character change, transition engine change, or `dist` output was introduced.

The remaining risk is outside this task: direct-open SVG browser loading of local sibling model/WASM assets still needs a browser-context proof before final full integration. This task proves Node-side local model loading through the default installed folders, not file-URL browser behavior.

Git metadata was not available in this workspace, so `git status --short` could not be used as evidence. File inspection and targeted scans were used instead.

## Verification Evidence

- `cmd /c npm run verify:model`: passed; all required files in `models/` and `runtime/` matched pinned byte sizes and SHA-256 hashes.
- `cmd /c npm run verify`: passed; typecheck passed and 36 tests passed.
- Actual local model test now calls `createTanaosEmotionClassifierRuntime()` without explicit asset paths and still maps clear English samples to the expected labels/emotions.
- `dist` check: passed; no `dist` directory exists.
- Scope check: passed by file inspection; `src/character`, `src/engine`, and `src/render` files were not modified for this task.

## Review Notes

The change is narrow and rollback-friendly. The runtime defaults now match the setup and verification contract, while explicit path options remain available for controlled packaging experiments. The model behavior and `TransitionPlan` schema remain unchanged.
