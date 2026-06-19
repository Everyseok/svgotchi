#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { runServe } from "./serve.ts";
import { runSetupModel } from "./setup-model.ts";
import { printModelVerificationReport, runVerifyModelCli, verifyModelAssets } from "./verify-model.ts";

export async function runSvgotchiCli(args = process.argv.slice(2)): Promise<number> {
  const command = args[0] ?? "guided";
  const rest = args.slice(1);

  switch (command) {
    case "guided":
      return runGuidedMode();
    case "demo":
      return runServe({ mode: "demo", host: "127.0.0.1", port: readPort(rest), open: !rest.includes("--no-open"), smoke: rest.includes("--smoke") });
    case "setup-model":
      return runSetupModel({ yes: rest.includes("--yes") || rest.includes("-y"), dryRun: rest.includes("--dry-run") });
    case "serve":
      return runServe({ mode: "full", host: "127.0.0.1", port: readPort(rest), open: !rest.includes("--no-open"), smoke: rest.includes("--smoke") });
    case "verify-model":
      return runVerifyModelCli();
    case "help":
    case "--help":
    case "-h":
      printHelp();
      return 0;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      return 1;
  }
}

async function runGuidedMode(): Promise<number> {
  console.log("SVGotchi guided mode");
  console.log("Checking local model assets...");
  const verification = await verifyModelAssets();
  printModelVerificationReport(verification);

  if (!verification.ok) {
    const setupCode = await runSetupModel({ yes: false, dryRun: false });
    if (setupCode !== 0) {
      console.log("Starting deterministic demo instead. Run `svgotchi setup-model` for full local mode.");
      return runServe({ mode: "demo", host: "127.0.0.1", port: 4173, open: true, smoke: false });
    }
  }

  return runServe({ mode: "full", host: "127.0.0.1", port: 4173, open: true, smoke: false });
}

function readPort(args: readonly string[]): number {
  const index = args.indexOf("--port");
  const value = index >= 0 ? Number(args[index + 1]) : 4173;
  return Number.isInteger(value) && value > 0 ? value : 4173;
}

function printHelp(): void {
  console.log(`SVGotchi

Usage:
  svgotchi                 Guided setup and serve flow
  svgotchi demo            Start deterministic demo, no model required
  svgotchi setup-model     Install local model/runtime assets after confirmation
  svgotchi serve           Start full local mode static server
  svgotchi verify-model    Verify local model/runtime assets

localhost is a static file server only. LLM inference runs in the browser.`);
}

function isDirectCli(): boolean {
  return process.argv[1] !== undefined && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}

if (isDirectCli()) {
  process.exitCode = await runSvgotchiCli();
}
