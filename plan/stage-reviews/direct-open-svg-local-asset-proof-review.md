# Direct-Open SVG Local Asset Proof Review

Reviewed At: 2026-06-17 22:13:50 Asia/Seoul
Scope: `proofs/direct-open-local-model.svg`, `scripts/verify-direct-open-svg.ts`, `docs/direct-open-svg-local-model-proof.md`, package script wiring, and plan records.

## Result

Overall score: 92/100

Gate result: proof completed; normal direct-open SVG full local model loading failed in Chrome. This is a Stage 7 architecture blocker for the direct-open full LLM path, not a code-quality failure of the proof.

## Score Breakdown

- requirement compliance: 96
- proof rigor: 94
- runtime safety: 97
- documentation accuracy: 93
- scope control: 98
- repeatability: 90
- architecture viability discovered: 78
- rollback safety: 95

## Findings

Blocking architecture finding:

Normal Chrome direct-open `file://` SVG cannot fetch the sibling local model config file. The proof reached script execution, then failed at `config fetch` with `Failed to fetch`. This means the current direct-open SVG full local model path cannot be claimed as working under ordinary Chrome settings.

Non-shippable diagnostic:

With `--allow-file-access-from-files`, the proof reached the local config fetch step and then remained at browser runtime import during the headless run. This indicates that the local asset layout is more reachable under relaxed file access, but the flag is not acceptable as a normal user distribution strategy unless explicitly approved later.

No unrelated implementation drift was found. The proof did not modify character implementation, transition engine behavior, the planner contract, or final artifact output. No `dist` directory was created.

## Verification Evidence

- `cmd /c npm run verify:model`: passed before proof; local model/runtime assets match pinned manifest.
- `cmd /c npm run verify:direct-open-svg`: failed as expected; normal run status `fail`, detail `config fetch failed: Failed to fetch`.
- diagnostic Chrome flag run: partial only; config fetch reached `ok`, runtime import remained `running`.
- `cmd /c npm run verify`: passed with 36 tests.
- `dist` check: passed; no `dist` directory exists.

## Review Notes

The proof is useful because it prevents a false architectural claim. The next gate should not be final full LLM SVG integration. The next decision should be packaging strategy: deterministic direct-open SVG only, approved local wrapper, approved localhost exception, or explicit browser-flag requirement.
