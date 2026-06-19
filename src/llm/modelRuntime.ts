import { env, pipeline } from "@huggingface/transformers";

import type { ClassifierResult } from "./transitionPlanSchema.ts";

export type EmotionClassifierRuntime = Readonly<{
  status: "ready";
  classify(promptText: string): Promise<readonly ClassifierResult[]>;
}>;

export type TanaosRuntimeOptions = Readonly<{
  localModelPath?: string;
  wasmPath?: string;
  modelId?: string;
}>;

const DEFAULT_MODEL_ID = "onnx-community/tanaos-emotion-detection-v1-ONNX";
export const DEFAULT_TANAOS_LOCAL_MODEL_PATH = "models/";
export const DEFAULT_TANAOS_WASM_PATH = "runtime/onnxruntime/";

type ResolvedTanaosRuntimeOptions = Readonly<{
  localModelPath: string;
  wasmPath: string;
  modelId: string;
}>;

export function resolveTanaosRuntimeOptions(options: TanaosRuntimeOptions = {}): ResolvedTanaosRuntimeOptions {
  return {
    localModelPath: withTrailingSlash(options.localModelPath ?? DEFAULT_TANAOS_LOCAL_MODEL_PATH),
    wasmPath: withTrailingSlash(options.wasmPath ?? DEFAULT_TANAOS_WASM_PATH),
    modelId: options.modelId ?? DEFAULT_MODEL_ID
  };
}

export function configureLocalTransformersRuntime(options: TanaosRuntimeOptions = {}): ResolvedTanaosRuntimeOptions {
  const resolvedOptions = resolveTanaosRuntimeOptions(options);

  env.allowRemoteModels = false;
  env.allowLocalModels = true;
  env.localModelPath = resolvedOptions.localModelPath;
  const onnxBackend = env.backends.onnx as { wasm?: { wasmPaths?: string } };
  onnxBackend.wasm ??= {};
  onnxBackend.wasm.wasmPaths = resolvedOptions.wasmPath;

  return resolvedOptions;
}

export async function createTanaosEmotionClassifierRuntime(options: TanaosRuntimeOptions = {}): Promise<EmotionClassifierRuntime> {
  const resolvedOptions = configureLocalTransformersRuntime(options);

  const classifier = await pipeline("text-classification", resolvedOptions.modelId, {
    dtype: "int8",
    local_files_only: true
  });

  return {
    status: "ready",
    async classify(promptText: string): Promise<readonly ClassifierResult[]> {
      const output = await classifier(promptText, { top_k: null });
      return normalizeClassifierOutput(output);
    }
  };
}

export function normalizeClassifierOutput(output: unknown): readonly ClassifierResult[] {
  const rows = isRecord(output) ? [output] : Array.isArray(output) && Array.isArray(output[0]) ? output[0] : output;

  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row) => {
      if (!isRecord(row)) return null;

      const label = row.label;
      const score = row.score;

      if (typeof label !== "string" || typeof score !== "number" || !Number.isFinite(score)) {
        return null;
      }

      return { label, score };
    })
    .filter((row): row is ClassifierResult => row !== null);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function withTrailingSlash(value: string): string {
  return value.endsWith("/") || value.endsWith("\\") ? value : `${value}/`;
}
