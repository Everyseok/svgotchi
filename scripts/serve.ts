#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createServer, get, type ServerResponse } from "node:http";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { BASE_CHARACTER_SVG } from "../src/character/baseCharacter.ts";
import { verifyModelAssets } from "./verify-model.ts";

type ServeMode = "demo" | "full";

type ServeOptions = Readonly<{
  mode: ServeMode;
  host: string;
  port: number;
  open: boolean;
  smoke: boolean;
}>;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");

export async function runServe(options: ServeOptions = parseServeArgs(process.argv.slice(2))): Promise<number> {
  if (options.mode === "full") {
    const verification = await verifyModelAssets();
    if (!verification.ok) {
      console.error("Full local model mode requires local model assets.");
      console.error("Run `npx svgotchi setup-model` or `npm run setup-model`, then try again.");
      return 1;
    }
  }

  const server = createServer((request, response) => {
    void handleRequest(request.url ?? "/", response, options.mode);
  });

  const port = await listen(server, options.host, options.port);
  const origin = `http://${options.host}:${port}`;
  const url = `${origin}/?mode=${options.mode}`;

  console.log(`SVGotchi static server: ${url}`);
  console.log("localhost is serving static SVG/JS/WASM/model files only.");
  console.log("No prompt text is sent to a backend; browser code owns local inference.");

  if (options.smoke) {
    const ok = await smokeCheck(origin, options.mode);
    server.close();
    return ok ? 0 : 1;
  }

  if (options.open) {
    openBrowser(url);
  }

  return new Promise((resolve) => {
    const shutdown = () => server.close(() => resolve(0));
    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  });
}

function parseServeArgs(args: readonly string[]): ServeOptions {
  if (args.includes("--help") || args.includes("-h")) {
    printServeHelp();
    process.exit(0);
  }

  const portIndex = args.indexOf("--port");
  const port = portIndex >= 0 && args[portIndex + 1] ? Number(args[portIndex + 1]) : 4173;

  return {
    mode: args.includes("--demo") ? "demo" : "full",
    host: "127.0.0.1",
    port: Number.isInteger(port) && port > 0 ? port : 4173,
    open: !args.includes("--no-open"),
    smoke: args.includes("--smoke"),
  };
}

function printServeHelp(): void {
  console.log(`Usage: svgotchi serve [--demo] [--port 4173] [--no-open]

Starts a localhost static server. It is not a model backend.
Use --demo for deterministic demo mode without model assets.`);
}

async function handleRequest(rawUrl: string, response: ServerResponse, mode: ServeMode): Promise<void> {
  try {
    const url = new URL(rawUrl, "http://127.0.0.1");
    if (url.pathname === "/" || url.pathname === "/index.html") {
      send(response, 200, "image/svg+xml; charset=utf-8", renderSvgApp(mode));
      return;
    }

    const route = resolveRoute(url.pathname);
    if (!route) {
      send(response, 404, "text/plain; charset=utf-8", "not found");
      return;
    }

    const bytes = await readFile(route.filePath);
    send(response, 200, route.contentType, bytes);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    send(response, 500, "text/plain; charset=utf-8", message);
  }
}

function resolveRoute(pathname: string): { filePath: string; contentType: string } | null {
  const routes = [
    { prefix: "/assets/", root: path.join(packageRoot, "assets") },
    { prefix: "/models/", root: path.resolve("models") },
    { prefix: "/runtime/", root: path.resolve("runtime") },
    { prefix: "/vendor/transformers/", root: path.join(packageRoot, "node_modules", "@huggingface", "transformers", "dist") },
    { prefix: "/vendor/onnxruntime-web/", root: path.join(packageRoot, "node_modules", "onnxruntime-web", "dist") },
    { prefix: "/vendor/onnxruntime-common/", root: path.join(packageRoot, "node_modules", "onnxruntime-common", "dist", "esm") },
  ];

  for (const route of routes) {
    if (!pathname.startsWith(route.prefix)) continue;
    const relative = decodeURIComponent(pathname.slice(route.prefix.length));
    const filePath = safeJoin(route.root, relative);
    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
      return null;
    }
    return { filePath, contentType: contentType(filePath) };
  }

  return null;
}

function safeJoin(root: string, relative: string): string | null {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, relative);
  return resolved === resolvedRoot || resolved.startsWith(`${resolvedRoot}${path.sep}`) ? resolved : null;
}

function contentType(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case ".html": return "text/html; charset=utf-8";
    case ".svg": return "image/svg+xml";
    case ".js": return "text/javascript; charset=utf-8";
    case ".mjs": return "text/javascript; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".wasm": return "application/wasm";
    case ".onnx": return "application/octet-stream";
    case ".png": return "image/png";
    case ".css": return "text/css; charset=utf-8";
    default: return "application/octet-stream";
  }
}

function renderSvgApp(mode: ServeMode): string {
  const appNodes = `
  <text id="app-status" x="4" y="77">${mode === "demo" ? "demo ready" : "model ready"}</text>
  <text id="app-plan" x="4" y="72"></text>
  <script type="importmap"><![CDATA[
    {
      "imports": {
        "onnxruntime-common": "/vendor/onnxruntime-common/index.js",
        "onnxruntime-web/webgpu": "/vendor/onnxruntime-web/ort.webgpu.bundle.min.mjs"
      }
    }
  ]]></script>
  <script><![CDATA[
    const svgotchiRoot = document.getElementById("svgotchi-root");
    if (svgotchiRoot) svgotchiRoot.setAttribute("data-loader-started", "true");
    import("/assets/svgotchi-browser.js").catch((error) => {
      const status = document.getElementById("app-status");
      const message = error instanceof Error ? error.message : String(error);
      if (svgotchiRoot) svgotchiRoot.setAttribute("data-app-error", message);
      if (status) status.textContent = "app load failed";
    });
  ]]></script>`;

  return BASE_CHARACTER_SVG
    .replace("<svg ", `<svg data-mode="${mode}" `)
    .replace("</svg>", `${appNodes}
</svg>`);
}

function send(response: ServerResponse, status: number, contentTypeHeader: string, body: string | Buffer): void {
  response.writeHead(status, {
    "Content-Type": contentTypeHeader,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(body);
}

function listen(server: ReturnType<typeof createServer>, host: string, startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      server.once("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE" && port < startPort + 20) {
          tryPort(port + 1);
          return;
        }
        reject(error);
      });
      server.listen(port, host, () => resolve(port));
    };
    tryPort(startPort);
  });
}

function openBrowser(url: string): void {
  const command = process.platform === "win32" ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, args, { detached: true, stdio: "ignore", shell: false });
  child.unref();
}

async function smokeCheck(baseUrl: string, mode: ServeMode): Promise<boolean> {
  const checks = mode === "full"
    ? [
        { path: "/", contentType: "image/svg+xml" },
        { path: "/assets/base-character.svg", contentType: "image/svg+xml" },
        { path: "/assets/1.png", contentType: "image/png" },
        { path: "/assets/svgotchi-browser.js", contentType: "text/javascript" },
        { path: "/vendor/onnxruntime-common/index.js", contentType: "text/javascript" },
        { path: "/vendor/onnxruntime-web/ort.webgpu.bundle.min.mjs", contentType: "text/javascript" },
        { path: "/models/onnx-community/tanaos-emotion-detection-v1-ONNX/config.json", contentType: "application/json" },
      ]
    : [
        { path: "/", contentType: "image/svg+xml" },
        { path: "/assets/base-character.svg", contentType: "image/svg+xml" },
        { path: "/assets/1.png", contentType: "image/png" },
        { path: "/assets/svgotchi-browser.js", contentType: "text/javascript" },
        { path: "/vendor/onnxruntime-common/index.js", contentType: "text/javascript" },
        { path: "/vendor/onnxruntime-web/ort.webgpu.bundle.min.mjs", contentType: "text/javascript" },
      ];
  const results = await Promise.all(checks.map(async (check) => {
    const result = await requestOk(`${baseUrl}${check.path}`, check.contentType);
    return { ...check, ...result };
  }));
  const allOk = results.every((result) => result.ok);
  for (const result of results) {
    if (!result.ok) {
      const route = resolveRoute(result.path);
      const routeDetail = route ? `resolved ${route.filePath}` : "unresolved route";
      console.error(`Smoke check failed: ${result.path} expected ${result.contentType}, got ${result.statusCode} ${result.actualContentType}; ${routeDetail}`);
    }
  }
  console.log(`Static server smoke check: ${allOk ? "passed" : "failed"}`);
  return allOk;
}

function requestOk(url: string, expectedContentType: string): Promise<{ ok: boolean; statusCode: number | null; actualContentType: string }> {
  return new Promise((resolve) => {
    get(url, (response) => {
      response.resume();
      const contentTypeHeader = response.headers["content-type"];
      const contentTypeValue = Array.isArray(contentTypeHeader) ? contentTypeHeader.join(";") : contentTypeHeader ?? "";
      resolve({
        ok: response.statusCode === 200 && contentTypeValue.startsWith(expectedContentType),
        statusCode: response.statusCode ?? null,
        actualContentType: contentTypeValue,
      });
    }).on("error", () => resolve({ ok: false, statusCode: null, actualContentType: "" }));
  });
}

function isDirectCli(): boolean {
  return process.argv[1] !== undefined && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}

if (isDirectCli()) {
  process.exitCode = await runServe();
}
