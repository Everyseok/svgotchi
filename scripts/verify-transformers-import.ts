import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";

const host = "127.0.0.1";
const port = 4206;
const url = `http://${host}:${port}/?mode=demo#verify-transformers-import`;
const chromePath = resolveChromePath();

if (!chromePath) {
  fail("Chrome executable not found. Set CHROME_PATH to run Transformers import verification.");
}

const server = spawn(process.execPath, ["scripts/serve.ts", "--no-open", "--port", String(port), "--demo"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"]
});

try {
  await waitForServer();

  const profileDir = path.resolve(".tmp", `chrome-transformers-import-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(profileDir, { recursive: true });

  const result = spawnSync(chromePath, [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    `--user-data-dir=${profileDir}`,
    "--virtual-time-budget=60000",
    "--dump-dom",
    url
  ], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20
  });

  const stdout = result.stdout ?? "";
  const importOk = readAttribute(stdout, "data-transformers-import-ok");
  const importUrl = readAttribute(stdout, "data-transformers-import-url");
  const exportsSeen = readAttribute(stdout, "data-transformers-import-exports");
  const importError = readAttribute(stdout, "data-transformers-import-error");

  console.log(JSON.stringify({
    url,
    chromePath,
    exitCode: result.status,
    importOk,
    importUrl,
    exportsSeen,
    importError,
    stderrTail: (result.stderr ?? "").slice(-1200)
  }, null, 2));

  process.exitCode = result.status === 0
    && importOk === "true"
    && exportsSeen?.split(",").includes("env")
    && exportsSeen?.split(",").includes("pipeline")
    ? 0
    : 1;
} finally {
  server.kill();
}

function waitForServer(): Promise<void> {
  const deadline = Date.now() + 10000;
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (response) => {
        response.resume();
        if (response.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      }).on("error", retry);
    };

    const retry = () => {
      if (Date.now() > deadline) {
        reject(new Error("served SVG server did not become ready"));
      } else {
        setTimeout(check, 200);
      }
    };

    check();
  });
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
