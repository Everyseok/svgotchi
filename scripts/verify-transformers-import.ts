import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";

const host = "127.0.0.1";
const port = 4206;
const debugPort = 5206;
const url = `http://${host}:${port}/?mode=preview#verify-transformers-import`;
const chromePath = resolveChromePath();

if (!chromePath) {
  fail("Chrome executable not found. Set CHROME_PATH to run Transformers import verification.");
}
const resolvedChromePath = chromePath;

const server = spawn(process.execPath, ["scripts/serve.ts", "--no-open", "--port", String(port), "--preview"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"]
});

try {
  await waitForServer();
  const result = await probeWithChrome();

  console.log(JSON.stringify({
    url,
    chromePath: resolvedChromePath,
    ...result
  }, null, 2));

  process.exitCode = result.importOk === "true"
    && result.exportsSeen?.split(",").includes("env")
    && result.exportsSeen?.split(",").includes("pipeline")
    ? 0
    : 1;
} finally {
  server.kill();
}

type ImportState = Readonly<{
  importOk: string | null;
  importUrl: string | null;
  exportsSeen: string | null;
  importError: string | null;
  appReady: boolean;
  appStatus: string | null;
}>;

type ProbeResult = ImportState & Readonly<{
  stderrTail: string;
}>;

type CdpMessage = Readonly<{
  id?: number;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}>;

type CdpClient = Readonly<{
  send<T = any>(method: string, params?: Record<string, unknown>): Promise<T>;
  close(): Promise<void>;
}>;

async function probeWithChrome(): Promise<ProbeResult> {
  const profileDir = path.resolve(".tmp", `chrome-transformers-import-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(profileDir, { recursive: true });

  const stderr: string[] = [];
  const chrome = spawn(resolvedChromePath, [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    "about:blank"
  ], {
    cwd: process.cwd(),
    stdio: ["ignore", "ignore", "pipe"]
  });

  chrome.stderr.on("data", (chunk: Buffer) => stderr.push(String(chunk)));

  let client: CdpClient | null = null;
  let state = emptyImportState();

  try {
    client = await connectCdp(await waitForPageWebSocket());
    await client.send("Runtime.enable");
    await client.send("Page.enable");
    await client.send("Page.navigate", { url });

    const deadline = Date.now() + 30000;
    do {
      state = await readImportState(client);
      if (state.importOk !== null || state.importError !== null) break;
      await delay(250);
    } while (Date.now() < deadline);
  } finally {
    await client?.close();
    chrome.kill();
  }

  return {
    ...state,
    stderrTail: stderr.join("").slice(-1200)
  };
}

function emptyImportState(): ImportState {
  return {
    importOk: null,
    importUrl: null,
    exportsSeen: null,
    importError: null,
    appReady: false,
    appStatus: null
  };
}

async function readImportState(client: CdpClient): Promise<ImportState> {
  const evaluated = await client.send<{ result?: { value?: ImportState } }>("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const root = document.getElementById("svgotchi-root");
      return {
        importOk: root?.getAttribute("data-transformers-import-ok") ?? null,
        importUrl: root?.getAttribute("data-transformers-import-url") ?? null,
        exportsSeen: root?.getAttribute("data-transformers-import-exports") ?? null,
        importError: root?.getAttribute("data-transformers-import-error") ?? null,
        appReady: root?.getAttribute("data-app-ready") === "true",
        appStatus: document.getElementById("app-status")?.textContent ?? null
      };
    })()`
  });
  return evaluated.result?.value ?? emptyImportState();
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

type CdpTarget = Readonly<{
  type?: string;
  webSocketDebuggerUrl?: string;
}>;

async function waitForPageWebSocket(): Promise<string> {
  const listUrl = `http://127.0.0.1:${debugPort}/json/list`;
  const deadline = Date.now() + 10000;

  while (Date.now() < deadline) {
    try {
      const targets = await getJson<CdpTarget[]>(listUrl);
      const page = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
      if (page?.webSocketDebuggerUrl) {
        return page.webSocketDebuggerUrl;
      }
    } catch {
      // Chrome may need a moment to open the debugging endpoint.
    }
    await delay(200);
  }

  throw new Error("Chrome DevTools endpoint did not become ready");
}

function getJson<T>(targetUrl: string): Promise<T> {
  return new Promise((resolve, reject) => {
    http.get(targetUrl, (response) => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      response.on("end", () => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode} for ${targetUrl}`));
          return;
        }
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")) as T);
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function connectCdp(webSocketUrl: string): Promise<CdpClient> {
  const WebSocketCtor = (globalThis as unknown as { WebSocket?: new (url: string) => any }).WebSocket;
  if (!WebSocketCtor) {
    throw new Error("global WebSocket is unavailable; Node 24 or newer is required");
  }

  const socket = new WebSocketCtor(webSocketUrl);
  const pending = new Map<number, { resolve(value: any): void; reject(reason: unknown): void }>();
  let nextId = 1;

  await new Promise<void>((resolve, reject) => {
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener("error", (event: unknown) => reject(event), { once: true });
  });

  socket.addEventListener("message", (event: { data: unknown }) => {
    const data = typeof event.data === "string" ? event.data : Buffer.from(event.data as ArrayBuffer).toString("utf8");
    const message = JSON.parse(data) as CdpMessage;
    if (typeof message.id !== "number" || !pending.has(message.id)) return;

    const deferred = pending.get(message.id)!;
    pending.delete(message.id);
    if (message.error) {
      deferred.reject(new Error(JSON.stringify(message.error)));
    } else {
      deferred.resolve(message.result);
    }
  });

  return {
    send<T = any>(method: string, params: Record<string, unknown> = {}): Promise<T> {
      const id = nextId++;
      const payload = JSON.stringify({ id, method, params });
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(payload);
      });
    },
    close(): Promise<void> {
      if (socket.readyState >= 2) return Promise.resolve();
      return new Promise((resolve) => {
        socket.addEventListener("close", () => resolve(), { once: true });
        socket.close();
      });
    }
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveChromePath(): string | null {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter((candidate): candidate is string => typeof candidate === "string" && candidate.length > 0);

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
