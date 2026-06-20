const MODEL_ID = "onnx-community/tanaos-emotion-detection-v1-ONNX";
const TRANSFORMERS_MODULE_URL = "/vendor/transformers/transformers.web.min.js";

const EMOTIONS = [
  "neutral", "happy", "excited", "proud", "playful",
  "love", "shy_love", "comforted", "attached",
  "sad", "lonely", "disappointed", "hurt",
  "angry", "annoyed", "jealous",
  "scared", "nervous", "surprised", "confused",
  "sleepy", "hungry", "tired", "sick",
  "curious", "thinking", "bored",
  "grateful", "apologetic", "sulky"
];

const POSES = {
  neutral: pose("dot", "flat", "none", 0, 0, 0, 1, 0, "none", 0),
  happy: pose("happy_closed", "big_smile", "soft", 0.25, -1, 0, 1, 0, "sparkles", 0.7),
  excited: pose("wide", "big_smile", "raised", 0.35, -2, 0, 1, 0, "sparkles", 1),
  proud: pose("half_closed", "small_smile", "raised", 0.1, -0.5, 0, 1, 0, "sparkles", 0.55),
  playful: pose("happy_closed", "zigzag", "soft", 0.2, -1, 1, 1, 0, "sparkles", 0.5),
  love: pose("heart_like", "big_smile", "soft", 0.8, -1, 0, 1, 0, "hearts", 1),
  shy_love: pose("happy_closed", "small_smile", "worried", 1, 0.5, -1, 1, 0, "hearts", 0.9),
  comforted: pose("happy_closed", "small_smile", "soft", 0.35, 0, 0, 1, 0, "sparkles", 0.35),
  attached: pose("dot", "small_smile", "soft", 0.55, -0.5, 0, 1, 0, "hearts", 0.65),
  sad: pose("sad", "sad_curve", "worried", 0, 1, 0, 1, 0, "tears", 0.45),
  lonely: pose("sad", "flat", "worried", 0, 1.5, -1, 1, 0, "tears", 0.35),
  disappointed: pose("half_closed", "sad_curve", "worried", 0, 1, 0, 1, 0, "none", 0),
  hurt: pose("sad", "zigzag", "worried", 0, 1, 1, 1, 0, "tears", 0.75),
  angry: pose("sharp", "zigzag", "angry", 0, 0, 1, 1, 0, "anger", 1),
  annoyed: pose("half_closed", "flat", "angry", 0, 0, 0.5, 1, 0, "anger", 0.45),
  jealous: pose("sharp", "pout", "worried", 0.2, 0, -1, 1, 0, "anger", 0.35),
  scared: pose("wide", "tiny_open", "worried", 0, -0.5, 0, 1, 0, "tears", 0.3),
  nervous: pose("wide", "zigzag", "worried", 0.25, 0.5, -0.5, 1, 0, "question", 0.35),
  surprised: pose("wide", "surprised_o", "raised", 0, -1, 0, 1, 0, "question", 0.85),
  confused: pose("dot", "tiny_open", "raised", 0, 0, 0, 1, 0, "question", 1),
  sleepy: pose("half_closed", "flat", "none", 0, 1.5, 0, 1, 0, "zzz", 1),
  hungry: pose("dot", "tiny_open", "worried", 0, 0.5, 0, 1, 0, "question", 0.4),
  tired: pose("half_closed", "sad_curve", "none", 0, 2, 0, 1, 0, "zzz", 0.45),
  sick: pose("sad", "zigzag", "worried", 0, 1.5, 0, 1, 0, "none", 0),
  curious: pose("wide", "small_smile", "raised", 0, -0.5, 0, 1, 0, "question", 0.75),
  thinking: pose("half_closed", "tiny_open", "raised", 0, 0, 0, 1, 0, "question", 0.55),
  bored: pose("half_closed", "flat", "none", 0, 1, 0, 1, 0, "zzz", 0.2),
  grateful: pose("happy_closed", "small_smile", "soft", 0.45, -0.5, 0, 1, 0, "sparkles", 0.75),
  apologetic: pose("sad", "small_smile", "worried", 0.25, 1, 0, 1, 0, "tears", 0.25),
  sulky: pose("half_closed", "pout", "angry", 0.1, 1, -1, 1, 0, "anger", 0.2)
};

const state = {
  mode: "full",
  currentEmotion: "neutral",
  prompt: "",
  composing: "",
  focused: false,
  transformersPromise: null,
  classifierPromise: null,
  animating: false
};

const root = document.getElementById("svgotchi-root");
const nodes = ids([
  "pet", "prompt-area", "prompt-bg", "prompt-placeholder", "prompt-text", "prompt-caret",
  "send-zone", "app-status", "app-plan", "face", "face-cover", "face-features", "eye-left", "eye-right", "mouth",
  "eye-left-shine", "eye-right-shine", "eye-left-heart", "eye-right-heart",
  "brow-left", "brow-right", "blush-left", "blush-right",
  "effect-hearts", "effect-sparkles", "effect-tears", "effect-zzz", "effect-question", "effect-anger"
]);

if (root) {
  state.mode = root.dataset.mode || "full";
  root.dataset.appReady = "true";
  installPromptHandlers();
  renderPrompt();
  renderPose(POSES.neutral);
  root.dataset.currentEmotion = state.currentEmotion;
  setStatus(state.mode === "demo" ? "demo: local model off" : "ready");
  void runVerificationProbe();
  runFragmentProbe();
}

function installPromptHandlers() {
  root.addEventListener("click", () => focusPrompt());
  nodes["prompt-area"]?.addEventListener("click", () => focusPrompt());
  nodes["prompt-bg"]?.addEventListener("click", () => focusPrompt());
  nodes["send-zone"]?.addEventListener("click", () => submitPrompt());

  root.addEventListener("keydown", (event) => {
    if (!state.focused || state.animating) return;
    if (event.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      void submitPrompt();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      state.prompt = [...state.prompt].slice(0, -1).join("");
      renderPrompt();
      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      state.prompt = [...state.prompt, event.key].slice(-34).join("");
      renderPrompt();
    }
  });

  root.addEventListener("compositionstart", () => {
    state.composing = "";
  });

  root.addEventListener("compositionupdate", (event) => {
    state.composing = event.data || "";
    renderPrompt();
  });

  root.addEventListener("compositionend", (event) => {
    state.prompt = [...state.prompt, ...(event.data || "")].slice(-34).join("");
    state.composing = "";
    renderPrompt();
  });
}

function focusPrompt() {
  state.focused = true;
  root.focus();
  renderPrompt();
}

async function submitPrompt() {
  const promptText = state.prompt.trim();
  if (!promptText || state.animating) return;

  state.prompt = "";
  state.composing = "";
  renderPrompt();

  try {
    const results = state.mode === "demo"
      ? demoClassify(promptText)
      : await classifyLocal(promptText);
    const planned = createTransitionPlan(state.currentEmotion, promptText, results);
    if (!planned.ok) {
      setStatus(`invalid: ${planned.reason}`);
      return;
    }
    setPlanText(`${planned.plan.to} ${planned.plan.intensity.toFixed(1)}`);
    root.dataset.lastPlanTo = planned.plan.to;
    setStatus("animating");
    await animatePlan(planned.plan);
    state.currentEmotion = planned.plan.to;
    root.dataset.currentEmotion = state.currentEmotion;
    setStatus(state.mode === "demo" ? "demo ready" : "ready");
  } catch (error) {
    setStatus(`model unavailable`);
    setPlanText(error instanceof Error ? error.message.slice(0, 28) : "unknown error");
  }
}

function runFragmentProbe() {
  if (!location.hash.startsWith("#probe=")) return;
  try {
    state.prompt = decodeURIComponent(location.hash.slice("#probe=".length));
    renderPrompt();
    setTimeout(() => {
      void submitPrompt();
    }, 0);
  } catch {
    setStatus("probe invalid");
  }
}

async function runVerificationProbe() {
  if (location.hash !== "#verify-transformers-import") return;
  try {
    const module = await getTransformers();
    const hasExpectedExports = Boolean(module.env && module.pipeline);
    root.dataset.transformersImportOk = hasExpectedExports ? "true" : "false";
    root.dataset.transformersImportUrl = TRANSFORMERS_MODULE_URL;
    root.dataset.transformersImportExports = ["env", "pipeline"].filter((key) => key in module).join(",");
    setStatus(hasExpectedExports ? "transformers import ok" : "transformers import invalid");
  } catch (error) {
    root.dataset.transformersImportOk = "false";
    root.dataset.transformersImportUrl = TRANSFORMERS_MODULE_URL;
    root.dataset.transformersImportError = error instanceof Error ? error.message.slice(0, 160) : String(error).slice(0, 160);
    setStatus("transformers import failed");
    setPlanText(error instanceof Error ? error.message.slice(0, 28) : "unknown error");
  }
}

async function classifyLocal(promptText) {
  setStatus(state.classifierPromise ? "thinking" : "loading model");
  const classifier = await getClassifier();
  const output = await classifier(promptText, { top_k: null });
  return normalizeClassifierOutput(output);
}

async function getClassifier() {
  if (!state.classifierPromise) {
    const { env, pipeline } = await getTransformers();
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = "/models/";
    env.backends.onnx.wasm.wasmPaths = "/runtime/onnxruntime/";
    state.classifierPromise = pipeline("text-classification", MODEL_ID, {
      dtype: "int8",
      local_files_only: true
    });
  }
  return state.classifierPromise;
}

async function getTransformers() {
  state.transformersPromise ??= import(TRANSFORMERS_MODULE_URL);
  return state.transformersPromise;
}

function demoClassify(promptText) {
  const text = promptText.toLowerCase();
  if (/\b(love|cute|sweet|adorable|hug)\b/.test(text)) return [{ label: "joy", score: 0.86 }, { label: "neutral", score: 0.08 }];
  if (/\b(scared|afraid|nervous)\b/.test(text)) return [{ label: "fear", score: 0.88 }, { label: "sadness", score: 0.07 }];
  if (/\b(sad|lonely|hurt)\b/.test(text)) return [{ label: "sadness", score: 0.86 }, { label: "neutral", score: 0.09 }];
  if (/\b(angry|hate|bad)\b/.test(text)) return [{ label: "anger", score: 0.86 }, { label: "disgust", score: 0.08 }];
  if (promptText.includes("?")) return [{ label: "surprise", score: 0.74 }, { label: "neutral", score: 0.18 }];
  return [{ label: "joy", score: 0.62 }, { label: "neutral", score: 0.22 }];
}

function createTransitionPlan(currentEmotion, promptText, results) {
  const top = [...results].sort((a, b) => b.score - a.score)[0];
  if (!top) return { ok: false, reason: "classifier returned no labels" };
  const label = normalizeLabel(top.label);
  if (!label) return { ok: false, reason: `unsupported label: ${top.label}` };

  const intent = inferIntent(promptText);
  const intensity = deriveStrength(results);
  const to = mapLabelToEmotion(label, intent, intensity);
  return sanitizePlan({
    intent,
    from: currentEmotion,
    to,
    intensity,
    durationMs: 420 + intensity * 620,
    fps: intensity >= 0.7 ? 8 : 6,
    easing: chooseEasing(label, intensity),
    motion: chooseMotion(label, intensity),
    effect: chooseEffect(label, intensity),
    blush: shouldBlush(to, intensity),
    confidence: top.score
  }, currentEmotion);
}

function sanitizePlan(candidate, currentEmotion) {
  const allowed = {
    intent: ["greeting", "compliment", "affection", "feed", "sleep", "play", "tease", "insult", "apology", "comfort_request", "question", "goodbye", "unknown"],
    easing: ["linear", "ease_in", "ease_out", "bounce", "overshoot"],
    motion: ["none", "tiny_bounce", "shake", "sway", "hop"],
    effect: ["none", "hearts", "sparkles", "tears", "zzz", "question", "anger"]
  };
  const forbidden = ["reply", "replyText", "replyStyle", "message", "speech", "svg", "path", "selector", "html", "css", "script", "url"];
  for (const field of forbidden) {
    if (Object.hasOwn(candidate, field)) return { ok: false, reason: `forbidden field: ${field}` };
  }
  return {
    ok: true,
    plan: {
      intent: pick(candidate.intent, allowed.intent, "unknown"),
      from: currentEmotion,
      to: pick(candidate.to, EMOTIONS, currentEmotion),
      intensity: quantize(candidate.intensity),
      durationMs: clamp(Math.round(number(candidate.durationMs, 650)), 300, 1200),
      fps: clamp(Math.round(number(candidate.fps, 6)), 4, 12),
      easing: pick(candidate.easing, allowed.easing, "ease_out"),
      motion: pick(candidate.motion, allowed.motion, "none"),
      effect: pick(candidate.effect, allowed.effect, "none"),
      blush: candidate.blush === true,
      confidence: clamp01(number(candidate.confidence, 0))
    }
  };
}

function deriveStrength(results) {
  const sorted = [...results].filter((result) => Number.isFinite(result.score)).sort((a, b) => b.score - a.score);
  const top = sorted[0];
  if (!top) return 0;
  const score = clamp01(top.score);
  const second = sorted[1] ? clamp01(sorted[1].score) : 0;
  const margin = Math.max(0, score - second);
  let strength = sorted[1] ? score * 0.65 + clamp01(margin * 2) * 0.35 : score;
  if (score < 0.35) strength *= 0.5;
  else if (score < 0.5) strength *= 0.75;
  if (sorted[1] && margin < 0.08) strength *= 0.65;
  if (normalizeLabel(top.label) === "neutral") strength = Math.min(strength, 0.5);
  return quantize(strength);
}

function inferIntent(promptText) {
  const text = promptText.toLowerCase();
  if (/\b(hi|hello|hey|good morning|good evening)\b/.test(text)) return "greeting";
  if (/\b(comfort me|help me|hug me|cheer me up|hold me)\b/.test(text)) return "comfort_request";
  if (/\b(cute|sweet|nice|good|great|pretty|adorable|proud)\b/.test(text)) return "compliment";
  if (/\b(love|like you|miss you|hug|cuddle)\b/.test(text)) return "affection";
  if (/\b(feed|food|hungry|snack|eat)\b/.test(text)) return "feed";
  if (/\b(sleep|sleepy|tired|nap)\b/.test(text)) return "sleep";
  if (/\b(play|game|dance|jump)\b/.test(text)) return "play";
  if (/\b(stupid|hate|bad pet|ugly)\b/.test(text)) return "insult";
  if (/\b(sorry|apologize|my fault)\b/.test(text)) return "apology";
  if (/\b(bye|goodbye|see you)\b/.test(text)) return "goodbye";
  if (text.includes("?")) return "question";
  return "unknown";
}

function mapLabelToEmotion(label, intent, intensity) {
  if (intent === "comfort_request") return "comforted";
  if (intent === "feed") return "hungry";
  if (intent === "sleep") return "sleepy";
  if (intent === "apology") return "grateful";

  if (label === "joy") {
    if (intent === "affection") return intensity >= 0.7 ? "love" : "attached";
    if (intent === "compliment") return "shy_love";
    return "happy";
  }
  if (label === "excitement") return intent === "play" ? "playful" : "excited";
  if (label === "surprise") return "surprised";
  if (label === "sadness") return intensity >= 0.7 ? "sad" : "disappointed";
  if (label === "fear") return intensity >= 0.7 ? "scared" : "nervous";
  if (label === "anger") return intensity >= 0.7 ? "angry" : "annoyed";
  if (label === "disgust") return intensity >= 0.7 ? "sulky" : "disappointed";
  return intent === "question" ? "curious" : "neutral";
}

function chooseEffect(label, intensity) {
  if (intensity < 0.3) return "none";
  if (label === "joy" || label === "excitement") return "sparkles";
  if (label === "sadness" || label === "fear") return "tears";
  if (label === "anger" || label === "disgust") return "anger";
  return intensity >= 0.5 ? "question" : "none";
}

function chooseMotion(label, intensity) {
  if (intensity < 0.2) return "none";
  if (label === "joy") return "tiny_bounce";
  if (label === "excitement") return "hop";
  if (label === "anger" || label === "disgust") return "shake";
  if (label === "surprise" || label === "fear" || label === "neutral") return "sway";
  return "none";
}

function chooseEasing(label, intensity) {
  if (label === "excitement" && intensity >= 0.7) return "bounce";
  if (label === "surprise") return "overshoot";
  if (label === "sadness" || label === "fear") return "ease_in";
  return "ease_out";
}

function shouldBlush(emotion, intensity) {
  return intensity >= 0.4 && ["shy_love", "love", "attached", "grateful"].includes(emotion);
}

async function animatePlan(plan) {
  state.animating = true;
  const frames = createFrames(plan);
  const started = performance.now();
  let lastIndex = -1;
  let queued = false;
  const frameMs = 1000 / plan.fps;
  return new Promise((resolve) => {
    const tick = (now) => {
      if (!queued) return;
      queued = false;
      const elapsed = now - started;
      const index = Math.min(frames.length - 1, Math.floor(elapsed / frameMs));
      if (index !== lastIndex) {
        renderPose(frames[index]);
        root.dataset.frameIndex = String(index);
        lastIndex = index;
      }
      if (index >= frames.length - 1) {
        state.animating = false;
        resolve();
        return;
      }
      queue();
    };
    const queue = () => {
      queued = true;
      requestAnimationFrame(tick);
      setTimeout(() => tick(performance.now()), frameMs);
    };
    root.dataset.transitionStarted = "true";
    queue();
  });
}

function createFrames(plan) {
  const frameCount = Math.max(2, Math.round(plan.durationMs / (1000 / plan.fps)) + 1);
  const fromPose = POSES[plan.from] || POSES.neutral;
  const fullTarget = { ...(POSES[plan.to] || POSES.neutral) };
  fullTarget.effect = plan.effect;
  fullTarget.effectOpacity = plan.effect === "none" ? 0 : Math.max(fullTarget.effectOpacity, 0.75);
  fullTarget.blushOpacity = plan.blush ? Math.max(fullTarget.blushOpacity, 0.6) : fullTarget.blushOpacity;
  const target = interpolatePose(fromPose, fullTarget, plan.intensity, "linear");
  return Array.from({ length: frameCount }, (_, index) => {
    const progress = index / (frameCount - 1);
    return applyMotion(interpolatePose(fromPose, target, progress, plan.easing), plan.motion, progress, plan.intensity);
  });
}

function renderPose(p) {
  setPetTransform(p);
  setEyes(p.eyes);
  setMouth(p.mouth);
  setBrows(p.brows);
  setFaceOverlay(p);
  attr(nodes["blush-left"], { opacity: p.blushOpacity });
  attr(nodes["blush-right"], { opacity: p.blushOpacity });
  for (const effect of ["hearts", "sparkles", "tears", "zzz", "question", "anger"]) {
    attr(nodes[`effect-${effect}`], { opacity: p.effect === effect ? p.effectOpacity : 0 });
  }
}

function setFaceOverlay(p) {
  const active = p.eyes !== "dot" || p.mouth !== "flat" || p.brows !== "none" || p.blushOpacity > 0.05;
  const opacity = active ? 1 : 0;
  attr(nodes["face"], { "data-face-overlay": active ? "active" : "neutral" });
  attr(nodes["face-cover"], { opacity });
  attr(nodes["face-features"], { opacity });
  if (root) root.dataset.faceOverlay = active ? "active" : "neutral";
}

function setPetTransform(p) {
  const cx = 50;
  const cy = 40;
  const transform = [
    `translate(${round(p.bodyOffsetX)} ${round(p.bodyOffsetY)})`,
    `rotate(${round(p.bodyRotation)} ${cx} ${cy})`,
    `translate(${cx} ${cy})`,
    `scale(${round(p.bodyScale)})`,
    `translate(${-cx} ${-cy})`
  ].join(" ");
  attr(nodes.pet, { transform });
}

function setEyes(kind) {
  const presets = {
    dot: [[41.8, 31.6, 4.9, 5.8, "", 1], [58.2, 31.6, 4.9, 5.8, "", 1], 1, 0],
    happy_closed: [[41.8, 32.4, 5, 0.6, "", 1], [58.2, 32.4, 5, 0.6, "", 1], 0, 0],
    half_closed: [[41.8, 32, 5, 1.35, "", 1], [58.2, 32, 5, 1.35, "", 1], 0, 0],
    sharp: [[41.8, 31.7, 5, 3, "rotate(12 41.8 31.7)", 1], [58.2, 31.7, 5, 3, "rotate(-12 58.2 31.7)", 1], 0, 0],
    wide: [[41.8, 31.4, 5.3, 6.5, "", 1], [58.2, 31.4, 5.3, 6.5, "", 1], 1, 0],
    sad: [[41.8, 32.2, 4.8, 3, "rotate(-12 41.8 32.2)", 1], [58.2, 32.2, 4.8, 3, "rotate(12 58.2 32.2)", 1], 0, 0],
    heart_like: [[41.8, 31.6, 4.9, 5.8, "", 0], [58.2, 31.6, 4.9, 5.8, "", 0], 0, 1]
  };
  const [left, right, shineOpacity, heartOpacity] = presets[kind] || presets.dot;
  ellipse(nodes["eye-left"], left);
  ellipse(nodes["eye-right"], right);
  attr(nodes["eye-left-shine"], { opacity: shineOpacity });
  attr(nodes["eye-right-shine"], { opacity: shineOpacity });
  attr(nodes["eye-left-heart"], { opacity: heartOpacity });
  attr(nodes["eye-right-heart"], { opacity: heartOpacity });
}

function setMouth(kind) {
  const presets = {
    flat: ["M46 40.6h8", ""],
    small_smile: ["M45 39.8q5 4 10 0", ""],
    big_smile: ["M43 38.8q7 7 14 0", ""],
    sad_curve: ["M45 42.2q5-4 10 0", ""],
    zigzag: ["M44 40.7l3-2l3 2l3-2l3 2", "rotate(-4 50 40.7)"],
    tiny_open: ["M49 38.7q1-1 2 0q1 2 0 4q-1 1-2 0q-1-2 0-4z", ""],
    surprised_o: ["M50 38.2a3 4 0 1 0 0.1 0", ""],
    pout: ["M45 40.8q5-2 10 0", ""]
  };
  const [d, transform] = presets[kind] || presets.flat;
  attr(nodes.mouth, { d, transform });
}

function setBrows(kind) {
  const presets = {
    none: [["M37.2 25.7q4.6-2 9.2 0", 0, ""], ["M53.6 25.7q4.6-2 9.2 0", 0, ""]],
    soft: [["M37.2 25.7q4.6-2 9.2 0", 0.55, ""], ["M53.6 25.7q4.6-2 9.2 0", 0.55, ""]],
    angry: [["M36.8 25l9.4 3", 1, ""], ["M63.2 25l-9.4 3", 1, ""]],
    worried: [["M36.8 28.4l9.4-3", 1, ""], ["M53.8 25.4l9.4 3", 1, ""]],
    raised: [["M37.2 23.5q4.6-2 9.2 0", 1, ""], ["M53.6 23.5q4.6-2 9.2 0", 1, ""]]
  };
  const [left, right] = presets[kind] || presets.none;
  pathNode(nodes["brow-left"], left);
  pathNode(nodes["brow-right"], right);
}

function renderPrompt() {
  const text = state.prompt + state.composing;
  if (nodes["prompt-text"]) nodes["prompt-text"].textContent = text;
  attr(nodes["prompt-placeholder"], { opacity: text ? 0 : 1 });
  attr(nodes["prompt-caret"], { opacity: state.focused && !state.animating ? 1 : 0, x: 7 + Math.min(30, [...text].length) * 2.8 });
}

function setStatus(value) {
  if (nodes["app-status"]) nodes["app-status"].textContent = value;
}

function setPlanText(value) {
  if (nodes["app-plan"]) nodes["app-plan"].textContent = value;
}

function normalizeClassifierOutput(output) {
  const rows = output && !Array.isArray(output) ? [output] : Array.isArray(output?.[0]) ? output[0] : output;
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => typeof row?.label === "string" && Number.isFinite(row.score) ? { label: row.label, score: row.score } : null)
    .filter(Boolean);
}

function normalizeLabel(label) {
  const normalized = String(label).toLowerCase().trim();
  return ["joy", "anger", "fear", "sadness", "surprise", "disgust", "excitement", "neutral"].includes(normalized) ? normalized : null;
}

function interpolatePose(a, b, progress, easing) {
  const t = ease(clamp01(progress), easing);
  return {
    eyes: t < 0.5 ? a.eyes : b.eyes,
    mouth: t < 0.5 ? a.mouth : b.mouth,
    brows: t < 0.5 ? a.brows : b.brows,
    effect: t < 0.5 ? a.effect : b.effect,
    blushOpacity: lerp(a.blushOpacity, b.blushOpacity, t),
    bodyOffsetY: lerp(a.bodyOffsetY, b.bodyOffsetY, t),
    bodyOffsetX: lerp(a.bodyOffsetX, b.bodyOffsetX, t),
    bodyScale: lerp(a.bodyScale, b.bodyScale, t),
    bodyRotation: lerp(a.bodyRotation, b.bodyRotation, t),
    effectOpacity: lerp(a.effectOpacity, b.effectOpacity, t)
  };
}

function applyMotion(poseValue, motion, progress, intensity) {
  const wave = Math.sin(progress * Math.PI * 2);
  const amount = clamp01(intensity);
  if (motion === "tiny_bounce") return { ...poseValue, bodyOffsetY: poseValue.bodyOffsetY - Math.abs(wave) * 0.8 * amount };
  if (motion === "shake") return { ...poseValue, bodyOffsetX: poseValue.bodyOffsetX + Math.sign(wave || 1) * 1.2 * amount };
  if (motion === "sway") return { ...poseValue, bodyOffsetX: poseValue.bodyOffsetX + wave * 0.9 * amount };
  if (motion === "hop") return { ...poseValue, bodyOffsetY: poseValue.bodyOffsetY - Math.sin(progress * Math.PI) * 2.5 * amount };
  return poseValue;
}

function ease(t, name) {
  if (name === "ease_in") return t * t;
  if (name === "ease_out") return 1 - (1 - t) * (1 - t);
  if (name === "bounce") return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  if (name === "overshoot") {
    const c = 1.70158;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  }
  return t;
}

function pose(eyes, mouth, brows, blushOpacity, bodyOffsetY, bodyOffsetX, bodyScale, bodyRotation, effect, effectOpacity) {
  return { eyes, mouth, brows, blushOpacity, bodyOffsetY, bodyOffsetX, bodyScale, bodyRotation, effect, effectOpacity };
}

function ids(names) {
  return Object.fromEntries(names.map((name) => [name, document.getElementById(name)]));
}

function ellipse(node, values) {
  const [cx, cy, rx, ry, transform, opacity] = values;
  attr(node, { cx, cy, rx, ry, transform, opacity });
}

function pathNode(node, values) {
  const [d, opacity, transform] = values;
  attr(node, { d, opacity, transform });
}

function attr(node, values) {
  if (!node) return;
  for (const [key, value] of Object.entries(values)) {
    if (value === "") node.removeAttribute(key);
    else node.setAttribute(key, String(round(value)));
  }
}

function pick(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function number(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value) {
  return clamp(Number.isFinite(value) ? value : 0, 0, 1);
}

function quantize(value) {
  return Math.round(clamp01(value) * 10) / 10;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function round(value) {
  return typeof value === "number" ? Math.round(value * 100) / 100 : value;
}
