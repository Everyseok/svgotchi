import path from "node:path";

export type AssetKind = "model" | "runtime";

export type RequiredAsset = Readonly<{
  kind: AssetKind;
  relativePath: string;
  bytes: number;
  sha256: string;
}>;

export const MODEL_REPO = "onnx-community/tanaos-emotion-detection-v1-ONNX";
export const DEFAULT_MODEL_ROOT = path.join("models", ...MODEL_REPO.split("/"));
export const DEFAULT_RUNTIME_ROOT = path.join("runtime", "onnxruntime");
export const HF_BASE_URL = `https://huggingface.co/${MODEL_REPO}/resolve/main`;

export const MODEL_ASSETS: readonly RequiredAsset[] = [
  {
    kind: "model",
    relativePath: "config.json",
    bytes: 1150,
    sha256: "eed9c09b78532c00e67a422af36fea027c202a8d5672ad05f2639d9a8c41d1b9",
  },
  {
    kind: "model",
    relativePath: "special_tokens_map.json",
    bytes: 964,
    sha256: "8c785abebea9ae3257b61681b4e6fd8365ceafde980c21970d001e834cf10835",
  },
  {
    kind: "model",
    relativePath: "tokenizer.json",
    bytes: 17082900,
    sha256: "8bf8afbfd11306bd872018c53bfdf2e160a56f8edbcf49933324404791c148d3",
  },
  {
    kind: "model",
    relativePath: "tokenizer_config.json",
    bytes: 1231,
    sha256: "b2e0abfa1251ec878d056016f830bd2261869408e7e05f1a9de6df1d1f02e385",
  },
  {
    kind: "model",
    relativePath: "onnx/model_int8.onnx",
    bytes: 118453659,
    sha256: "c18c3320049354475100d19b6af7d32ed10b11a2cf1b8793f6ded628f479aa4d",
  },
] as const;

export const RUNTIME_ASSETS: readonly RequiredAsset[] = [
  {
    kind: "runtime",
    relativePath: "ort-wasm-simd-threaded.mjs",
    bytes: 24180,
    sha256: "5f2cd914554830762579c372d0211614c1e3f40ab3f6c0cfcf0900343229071d",
  },
  {
    kind: "runtime",
    relativePath: "ort-wasm-simd-threaded.wasm",
    bytes: 12942611,
    sha256: "f4f290847a4df02d0b93cdbf39b4b0e71acefbe80573e7e6b9342a7abd7b290a",
  },
  {
    kind: "runtime",
    relativePath: "ort-wasm-simd-threaded.asyncify.mjs",
    bytes: 47389,
    sha256: "5959c6733039619c9af710d8e1bae8d6e84402787990637be987c2b1bd6c5fa9",
  },
  {
    kind: "runtime",
    relativePath: "ort-wasm-simd-threaded.asyncify.wasm",
    bytes: 23567050,
    sha256: "e0c0c6d3e73d43b8a249972f8358f845b08cc16fec3c80efafdf8bed40366786",
  },
] as const;

export const REQUIRED_ASSETS: readonly RequiredAsset[] = [...MODEL_ASSETS, ...RUNTIME_ASSETS];
export const EXPECTED_MODEL_BYTES = sumBytes(MODEL_ASSETS);
export const EXPECTED_RUNTIME_BYTES = sumBytes(RUNTIME_ASSETS);
export const EXPECTED_TOTAL_BYTES = sumBytes(REQUIRED_ASSETS);

export function modelRoot(cwd = process.cwd()): string {
  return path.resolve(process.env.SVGOTCHI_MODEL_DIR ?? path.join(cwd, DEFAULT_MODEL_ROOT));
}

export function runtimeRoot(cwd = process.cwd()): string {
  return path.resolve(process.env.SVGOTCHI_RUNTIME_DIR ?? path.join(cwd, DEFAULT_RUNTIME_ROOT));
}

export function assetPath(asset: RequiredAsset, cwd = process.cwd()): string {
  const root = asset.kind === "model" ? modelRoot(cwd) : runtimeRoot(cwd);
  return path.join(root, ...asset.relativePath.split("/"));
}

export function formatBytes(bytes: number): string {
  const mib = bytes / 1024 / 1024;
  return `${bytes.toLocaleString("en-US")} bytes (${mib.toFixed(2)} MiB)`;
}

function sumBytes(assets: readonly RequiredAsset[]): number {
  return assets.reduce((sum, asset) => sum + asset.bytes, 0);
}
