import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";

const host = "127.0.0.1";
const mode = process.argv.includes("--full") ? "full" : "demo";
const port = mode === "full" ? 4208 : 4207;
const promptText = readArg("--prompt") ?? "you are cute";
const expectedEmotions = (readArg("--expect") ?? "shy_love,love,happy").split(",").map((emotion) => emotion.trim()).filter(Boolean);
const url = `http://${host}:${port}/?mode=${mode}#probe=${encodeURIComponent(promptText)}`;
const chromePath = resolveChromePath();

if (!chromePath) {
  fail("Chrome executable not found. Set CHROME_PATH to run served SVG browser verification.");
}
const resolvedChromePath = chromePath;

const serverArgs = ["scripts/serve.ts", "--no-open", "--port", String(port)];
if (mode === "demo") serverArgs.push("--demo");

const server = spawn(process.execPath, serverArgs, {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"]
});

try {
  await waitForServer();
  const profileDir = path.resolve(".tmp", `chrome-served-svg-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(profileDir, { recursive: true });
  const result = await probeWithChrome(profileDir);

  console.log(JSON.stringify({
    url,
    mode,
    promptText,
    expectedEmotions,
    chromePath: resolvedChromePath,
    ...result
  }, null, 2));

  process.exitCode = result.exitCode === 0
    && result.isSvg
    && result.loaderStarted
    && result.appReady
    && !result.hasHtmlRoot
    && result.servedMode === mode
    && expectedEmotions.includes(result.lastPlanTo ?? "")
    && result.currentEmotion === result.lastPlanTo
    ? 0
    : 1;
} finally {
  server.kill();
}

type ProbeResult = Readonly<{
  exitCode: number | null;
  isSvg: boolean;
  loaderStarted: boolean;
  appReady: boolean;
  hasHtmlRoot: boolean;
  servedMode: string | null;
  lastPlanTo: string | null;
  currentEmotion: string | null;
  appStatus: string | null;
  appPlan: string | null;
  appError: string | null;
  httpErrors: readonly Readonly<{ url: string; status: number }>[];
  requestFailures: readonly Readonly<{ url: string; failure: string | null }>[];
  consoleErrors: readonly string[];
  stderrTail: string;
}>;

type AppState = Omit<ProbeResult, "exitCode" | "httpErrors" | "requestFailures" | "consoleErrors" | "stderrTail">;

type CdpMessage = Readonly<{
  id?: number;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}>;

type CdpClient = Readonly<{
  send<T = any>(method: string, params?: Record<string, unknown>): Promise<T>;
  onMessage(handler: (message: CdpMessage) => void): void;
  close(): Promise<void>;
}>;

async function probeWithChrome(profileDir: string): Promise<ProbeResult> {
  const debugPort = port + 100;
  const stderr: string[] = [];
  const httpErrors: { url: string; status: number }[] = [];
  const requestFailures: { url: string; failure: string | null }[] = [];
  const consoleErrors: string[] = [];
  const requestUrls = new Map<string, string>();
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
  let state: AppState = emptyAppState();

  try {
    client = await connectCdp(await waitForPageWebSocket(debugPort));
    client.onMessage((message) => {
      if (message.method === "Network.requestWillBeSent" && typeof message.params?.requestId === "string") {
        requestUrls.set(message.params.requestId, String(message.params.request?.url ?? ""));
      }
      if (message.method === "Network.responseReceived" && typeof message.params?.response?.status === "number") {
        const status = message.params.response.status;
        const responseUrl = String(message.params.response.url ?? "");
        if (status >= 400 && !responseUrl.endsWith("/favicon.ico")) {
          httpErrors.push({ url: responseUrl, status });
        }
      }
      if (message.method === "Network.loadingFailed") {
        const requestId = String(message.params?.requestId ?? "");
        requestFailures.push({
          url: requestUrls.get(requestId) ?? requestId,
          failure: typeof message.params?.errorText === "string" ? message.params.errorText : null
        });
      }
      if (message.method === "Runtime.consoleAPICalled" && message.params?.type === "error") {
        const text = Array.isArray(message.params.args)
          ? message.params.args.map((arg: any) => String(arg.value ?? arg.description ?? "")).join(" ")
          : "";
        consoleErrors.push(text);
      }
    });

    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Page.enable");
    await client.send("Page.navigate", { url });

    const deadline = Date.now() + (mode === "full" ? 180000 : 60000);
    do {
      state = await readAppState(client);
      if (isTerminalState(state)) break;
      await delay(500);
    } while (Date.now() < deadline);
  } finally {
    await client?.close();
    chrome.kill();
  }

  return {
    ...state,
    exitCode: chrome.exitCode ?? 0,
    httpErrors,
    requestFailures,
    consoleErrors,
    stderrTail: stderr.join("").slice(-1200)
  };
}

function emptyAppState(): AppState {
  return {
    isSvg: false,
    loaderStarted: false,
    appReady: false,
    hasHtmlRoot: false,
    servedMode: null,
    lastPlanTo: null,
    currentEmotion: null,
    appStatus: null,
    appPlan: null,
    appError: null
  };
}

function isTerminalState(state: AppState): boolean {
  const reachedTarget = Boolean(state.lastPlanTo && state.currentEmotion === state.lastPlanTo);
  return Boolean(
    reachedTarget
    || state.appError
    || state.appStatus?.includes("model unavailable")
  );
}

async function readAppState(client: CdpClient): Promise<AppState> {
  const evaluated = await client.send<{ result?: { value?: AppState } }>("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const root = document.getElementById("svgotchi-root");
      const documentTag = document.documentElement?.tagName?.toLowerCase() || "";
      return {
        isSvg: documentTag === "svg" && root?.id === "svgotchi-root",
        loaderStarted: root?.getAttribute("data-loader-started") === "true",
        appReady: root?.getAttribute("data-app-ready") === "true",
        hasHtmlRoot: documentTag === "html",
        servedMode: root?.getAttribute("data-mode") ?? null,
        lastPlanTo: root?.getAttribute("data-last-plan-to") ?? null,
        currentEmotion: root?.getAttribute("data-current-emotion") ?? null,
        appStatus: document.getElementById("app-status")?.textContent ?? null,
        appPlan: document.getElementById("app-plan")?.textContent ?? null,
        appError: root?.getAttribute("data-app-error") ?? null
      };
    })()`
  });
  return evaluated.result?.value ?? emptyAppState();
}

type CdpTarget = Readonly<{
  type?: string;
  url?: string;
  webSocketDebuggerUrl?: string;
}>;

async function waitForPageWebSocket(debugPort: number): Promise<string> {
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
  const handlers: ((message: CdpMessage) => void)[] = [];
  const pending = new Map<number, { resolve(value: any): void; reject(reason: unknown): void }>();
  let nextId = 1;

  await new Promise<void>((resolve, reject) => {
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener("error", (event: unknown) => reject(event), { once: true });
  });

  socket.addEventListener("message", (event: { data: unknown }) => {
    const data = typeof event.data === "string" ? event.data : Buffer.from(event.data as ArrayBuffer).toString("utf8");
    const message = JSON.parse(data) as CdpMessage;
    if (typeof message.id === "number" && pending.has(message.id)) {
      const deferred = pending.get(message.id)!;
      pending.delete(message.id);
      if (message.error) {
        deferred.reject(new Error(JSON.stringify(message.error)));
      } else {
        deferred.resolve(message.result);
      }
      return;
    }
    for (const handler of handlers) {
      handler(message);
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
    onMessage(handler: (message: CdpMessage) => void): void {
      handlers.push(handler);
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

function readArg(name: string): string | null {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? null : null;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
