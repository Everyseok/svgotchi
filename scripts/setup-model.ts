#!/usr/bin/env node
import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  EXPECTED_MODEL_BYTES,
  EXPECTED_RUNTIME_BYTES,
  EXPECTED_TOTAL_BYTES,
  HF_BASE_URL,
  MODEL_ASSETS,
  MODEL_REPO,
  RUNTIME_ASSETS,
  assetPath,
  formatBytes,
  modelRoot,
  runtimeRoot,
  type RequiredAsset,
} from "./model-manifest.ts";
import { printModelVerificationReport, verifyModelAssets } from "./verify-model.ts";

type SetupOptions = Readonly<{
  yes: boolean;
  dryRun: boolean;
}>;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");

export async function runSetupModel(options: SetupOptions = parseSetupArgs(process.argv.slice(2))): Promise<number> {
  const verification = await verifyModelAssets();

  if (verification.ok) {
    printModelVerificationReport(verification);
    console.log("Model setup is already complete.");
    return 0;
  }

  console.log("SVGotchi full local model setup");
  console.log(`Model: ${MODEL_REPO}`);
  console.log(`Model target:   ${modelRoot()}`);
  console.log(`Runtime target: ${runtimeRoot()}`);
  console.log(`Expected model payload:   ${formatBytes(EXPECTED_MODEL_BYTES)}`);
  console.log(`Expected runtime payload: ${formatBytes(EXPECTED_RUNTIME_BYTES)}`);
  console.log(`Expected total payload:   ${formatBytes(EXPECTED_TOTAL_BYTES)}`);
  console.log("");
  console.log("Setup may download model files now, but runtime will not download model files silently.");
  console.log("Inference remains browser-local; localhost is only a static file server.");
  console.log("");
  printModelVerificationReport(verification);

  if (!options.yes && !(await confirm("Install or download the missing local model/runtime assets?"))) {
    console.log("Setup cancelled. No files were downloaded.");
    return 1;
  }

  if (options.dryRun) {
    console.log("Dry run complete. No files were written.");
    return 0;
  }

  for (const asset of MODEL_ASSETS) {
    await installModelAsset(asset);
  }

  for (const asset of RUNTIME_ASSETS) {
    await installRuntimeAsset(asset);
  }

  const after = await verifyModelAssets();
  printModelVerificationReport(after);

  if (!after.ok) {
    console.error("Setup finished, but verification failed. Refusing to treat full local model mode as ready.");
    return 1;
  }

  console.log("Setup complete. Run `npm run serve` to start the static server.");
  return 0;
}

function parseSetupArgs(args: readonly string[]): SetupOptions {
  if (args.includes("--help") || args.includes("-h")) {
    printSetupHelp();
    process.exit(0);
  }

  return {
    yes: args.includes("--yes") || args.includes("-y"),
    dryRun: args.includes("--dry-run"),
  };
}

function printSetupHelp(): void {
  console.log(`Usage: npm run setup-model -- [--yes] [--dry-run]

Installs SVGotchi local model/runtime assets into ignored local folders.
Downloads happen only during this explicit setup step and are verified by SHA-256.`);
}

async function installModelAsset(asset: RequiredAsset): Promise<void> {
  const destination = assetPath(asset);
  const localSource = findFirstExisting([
    path.resolve("assets", "model", MODEL_REPO, ...asset.relativePath.split("/")),
    path.join(packageRoot, "assets", "model", MODEL_REPO, ...asset.relativePath.split("/")),
  ]);

  if (localSource) {
    await copyAsset(localSource, destination, `model:${asset.relativePath}`);
    return;
  }

  await downloadAsset(`${HF_BASE_URL}/${asset.relativePath}`, destination, `model:${asset.relativePath}`);
}

async function installRuntimeAsset(asset: RequiredAsset): Promise<void> {
  const destination = assetPath(asset);
  const localSource = findFirstExisting([
    path.resolve("assets", "runtime", "onnxruntime", ...asset.relativePath.split("/")),
    path.join(packageRoot, "assets", "runtime", "onnxruntime", ...asset.relativePath.split("/")),
    path.join(packageRoot, "node_modules", "onnxruntime-web", "dist", ...asset.relativePath.split("/")),
  ]);

  if (!localSource) {
    throw new Error(`missing runtime asset source for ${asset.relativePath}; run npm install first`);
  }

  await copyAsset(localSource, destination, `runtime:${asset.relativePath}`);
}

async function copyAsset(source: string, destination: string, label: string): Promise<void> {
  ensureParent(destination);
  await copyFile(source, destination);
  console.log(`copied ${label} (${formatBytes(statSync(destination).size)})`);
}

async function downloadAsset(url: string, destination: string, label: string): Promise<void> {
  ensureParent(destination);
  console.log(`downloading ${label}`);

  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`download failed for ${label}: HTTP ${response.status}`);
  }

  await pipeline(Readable.fromWeb(response.body as any), createWriteStream(destination));
}

function ensureParent(filePath: string): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

function findFirstExisting(candidates: readonly string[]): string | null {
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

async function confirm(question: string): Promise<boolean> {
  if (!process.stdin.isTTY) {
    console.error("Refusing to download without an interactive terminal. Rerun with --yes to approve setup explicitly.");
    return false;
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${question} [y/N] `);
    return answer.trim().toLowerCase() === "y" || answer.trim().toLowerCase() === "yes";
  } finally {
    rl.close();
  }
}

function isDirectCli(): boolean {
  return process.argv[1] !== undefined && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}

if (isDirectCli()) {
  process.exitCode = await runSetupModel();
}
