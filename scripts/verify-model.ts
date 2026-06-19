import { createHash } from "node:crypto";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { REQUIRED_ASSETS, assetPath, formatBytes, modelRoot, runtimeRoot, type RequiredAsset } from "./model-manifest.ts";

type CheckResult = {
  asset: RequiredAsset;
  absolutePath: string;
  status: "OK" | "MISSING" | "BAD_SIZE" | "BAD_SHA256" | "ERROR";
  actualBytes?: number;
  actualSha256?: string;
  message?: string;
};

export type ModelVerificationResult = Readonly<{
  ok: boolean;
  results: readonly CheckResult[];
  failures: readonly CheckResult[];
}>;

async function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);

    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

export async function checkModelAsset(asset: RequiredAsset): Promise<CheckResult> {
  const absolutePath = assetPath(asset);

  if (!existsSync(absolutePath)) {
    return {
      asset,
      absolutePath,
      status: "MISSING",
      message: "file is not present",
    };
  }

  try {
    const actualBytes = statSync(absolutePath).size;
    if (actualBytes !== asset.bytes) {
      return {
        asset,
        absolutePath,
        status: "BAD_SIZE",
        actualBytes,
        message: `expected ${asset.bytes} bytes`,
      };
    }

    const actualSha256 = await sha256File(absolutePath);
    if (actualSha256 !== asset.sha256) {
      return {
        asset,
        absolutePath,
        status: "BAD_SHA256",
        actualBytes,
        actualSha256,
        message: `expected ${asset.sha256}`,
      };
    }

    return {
      asset,
      absolutePath,
      status: "OK",
      actualBytes,
      actualSha256,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      asset,
      absolutePath,
      status: "ERROR",
      message,
    };
  }
}

export async function verifyModelAssets(): Promise<ModelVerificationResult> {
  const results = await Promise.all(REQUIRED_ASSETS.map(checkModelAsset));
  const failures = results.filter((result) => result.status !== "OK");
  return { ok: failures.length === 0, results, failures };
}

export function printModelVerificationReport(verification: ModelVerificationResult): void {
  console.log("SVGotchi local model asset verification");
  console.log(`model root:   ${modelRoot()}`);
  console.log(`runtime root: ${runtimeRoot()}`);
  console.log("");

  for (const result of verification.results) {
    printResult(result);
  }

  console.log("");
}

function printResult(result: CheckResult): void {
  const expected = formatBytes(result.asset.bytes);
  const actual = result.actualBytes === undefined ? "-" : formatBytes(result.actualBytes);
  const label = `${result.asset.kind}:${result.asset.relativePath}`;
  const message = result.message === undefined ? "" : ` (${result.message})`;

  console.log(`${result.status.padEnd(10)} ${label.padEnd(46)} expected=${expected.padEnd(16)} actual=${actual}${message}`);
}

export async function runVerifyModelCli(): Promise<number> {
  const verification = await verifyModelAssets();
  printModelVerificationReport(verification);

  if (!verification.ok) {
    console.error(`Model asset verification failed: ${verification.failures.length} issue(s).`);
    console.error("");
    console.error("Install the full local model assets, then rerun:");
    console.error("  npm run verify:model");
    console.error("");
    console.error("Setup commands:");
    console.error("  npx svgotchi setup-model");
    console.error("  npm run setup-model");
    return 1;
  }

  console.log("Model asset verification passed. Full local model assets are present and match the pinned manifest.");
  return 0;
}

if (isDirectCli()) {
  process.exitCode = await runVerifyModelCli();
}

function isDirectCli(): boolean {
  return process.argv[1] !== undefined && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}
