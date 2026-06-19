import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

type ChromeRun = Readonly<{
  mode: "normal" | "diagnostic-file-access-flag";
  args: readonly string[];
  exitCode: number | null;
  stdout: string;
  stderr: string;
  proofStatus: string;
  detail: string | null;
  steps: readonly (string | null)[];
  label: string | null;
  score: string | null;
}>;

const proofPath = path.resolve("proofs", "direct-open-local-model.svg");
const resultPath = path.resolve("proofs", "direct-open-local-model-result.json");
const chromePath = resolveChromePath();

if (!existsSync(proofPath)) {
  fail(`proof SVG missing: ${proofPath}`);
}

if (!chromePath) {
  fail("Chrome executable not found. Set CHROME_PATH to run the direct-open SVG proof.");
}

const proofUrl = pathToFileURL(proofPath).href;
const normal = runChrome("normal", []);
const runs: ChromeRun[] = [normal];

if (normal.proofStatus !== "pass") {
  runs.push(runChrome("diagnostic-file-access-flag", ["--allow-file-access-from-files"]));
}

const summary = {
  proofUrl,
  chromePath,
  runs: runs.map((run) => ({
    mode: run.mode,
    exitCode: run.exitCode,
    proofStatus: run.proofStatus,
    detail: run.detail,
    steps: run.steps,
    label: run.label,
    score: run.score,
    stderrTail: run.stderr.slice(-2000)
  }))
};

writeFileSync(resultPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));

if (normal.proofStatus === "pass") {
  process.exitCode = 0;
} else {
  process.exitCode = 1;
}

function runChrome(mode: ChromeRun["mode"], extraArgs: readonly string[]): ChromeRun {
  const profileDir = path.resolve(".tmp", `chrome-direct-open-${mode}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(profileDir, { recursive: true });

  const args = [
    "--headless",
    "--disable-gpu",
    "--disable-gpu-compositing",
    "--disable-3d-apis",
    "--disable-webgl",
    "--disable-webgpu",
    "--disable-features=Vulkan,UseSkiaRenderer,DawnGraphite",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    `--user-data-dir=${profileDir}`,
    "--virtual-time-budget=300000",
    "--dump-dom",
    ...extraArgs,
    proofUrl
  ];

  const result = spawnSync(chromePath as string, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10
  });

  return {
    mode,
    args,
    exitCode: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    proofStatus: readAttribute(result.stdout ?? "", "data-proof-status") ?? "missing",
    detail: readAttribute(result.stdout ?? "", "data-proof-detail"),
    steps: [1, 2, 3, 4].map((step) => readAttribute(result.stdout ?? "", `data-proof-step-${step}`)),
    label: readAttribute(result.stdout ?? "", "data-proof-label"),
    score: readAttribute(result.stdout ?? "", "data-proof-score")
  };
}

function resolveChromePath(): string | null {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter((candidate): candidate is string => typeof candidate === "string" && candidate.length > 0);

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function readAttribute(markup: string, name: string): string | null {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`${escapedName}="([^"]*)"`).exec(markup);
  return match?.[1] ?? null;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
