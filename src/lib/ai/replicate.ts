import { client } from "@gradio/client";

const TRIPOSR_SPACE = process.env.HF_3D_SPACE || "stabilityai/TripoSR";
const TRIPOSR_TIMEOUT_MS = Number(process.env.HF_3D_TIMEOUT_MS || 180000);
const TRIPOSR_RESOLUTION = Number(process.env.HF_3D_RESOLUTION || 96);
const TRIPO_API_BASE = "https://api.tripo3d.ai/v2/openapi";
const TRIPO_MODEL_VERSION = process.env.TRIPO_MODEL_VERSION || "v3.0-20250812";
const TRIPO_POLL_INTERVAL_MS = Number(process.env.TRIPO_POLL_INTERVAL_MS || 5000);
const TRIPO_MAX_POLLS = Number(process.env.TRIPO_MAX_POLLS || 60);

export type Ai3DProvider = "tripo" | "huggingface";

type GradioFile = {
  url?: string;
  path?: string;
};

type TripoCreateResponse = {
  code?: number;
  message?: string;
  suggestion?: string;
  data?: {
    task_id?: string;
  };
};

type TripoTaskResponse = {
  code?: number;
  message?: string;
  suggestion?: string;
  data?: {
    status?: string;
    progress?: number;
    output?: {
      model?: string;
      pbr_model?: string;
      base_model?: string;
    };
    error_code?: number;
    message?: string;
  };
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Free 3D service timed out. Please try again in a few minutes."));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

function getFileUrl(file: unknown): string | null {
  if (file && typeof file === "object" && "url" in file) {
    return (file as GradioFile).url || null;
  }

  if (typeof file === "string" && file.startsWith("http")) {
    return file;
  }

  return null;
}

function getDataItem(result: unknown, index: number): unknown {
  if (!result || typeof result !== "object" || !("data" in result)) {
    return null;
  }

  const data = (result as { data?: unknown }).data;
  return Array.isArray(data) ? data[index] : null;
}

function tripoErrorMessage(payload: { message?: string; suggestion?: string }) {
  return [payload.message, payload.suggestion].filter(Boolean).join(" ");
}

async function tripoFetch<T>(
  path: string,
  init: RequestInit,
  apiKey: string
): Promise<T> {
  const res = await fetch(`${TRIPO_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(init.headers || {}),
    },
  });

  const data = (await res.json().catch(() => ({}))) as T & {
    code?: number;
    message?: string;
    suggestion?: string;
  };

  if (!res.ok || (typeof data.code === "number" && data.code !== 0)) {
    throw new Error(
      tripoErrorMessage(data) || `Tripo API request failed with ${res.status}`
    );
  }

  return data;
}

/**
 * Generate a 2D character concept art using Pollinations.ai (Free FLUX model).
 * No API key required!
 */
export async function generateCharacterImage(
  prompt: string,
  negativePrompt: string
): Promise<string> {
  // Pollinations generates images on the fly via URL
  const combinedPrompt = `${prompt}, ${negativePrompt || "masterpiece, high quality"}`;
  const encodedPrompt = encodeURIComponent(combinedPrompt);
  const seed = Math.floor(Math.random() * 1000000);
  
  // Using FLUX model via Pollinations
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;
  
  return imageUrl;
}

/**
 * Convert a 2D image to a GLB model with the free public TripoSR Space.
 * This follows the generated image, so the model is related to the user's prompt.
 */
async function convertImageToHuggingFace3D(
  imageUrl: string
): Promise<string> {
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch source image: ${imageResponse.status}`);
  }

  const sourceImage = await imageResponse.blob();
  const app = await withTimeout(client(TRIPOSR_SPACE), 30000);

  const preprocessed = await withTimeout(
    app.predict("/preprocess", [sourceImage, true, 0.85]),
    60000
  );
  const processedUrl = getFileUrl(getDataItem(preprocessed, 0));
  if (!processedUrl) {
    throw new Error("3D preprocessing did not return an image.");
  }

  const processedImage = await fetch(processedUrl).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch processed image: ${res.status}`);
    }
    return res.blob();
  });

  const generated = await withTimeout(
    app.predict("/generate", [processedImage, TRIPOSR_RESOLUTION]),
    TRIPOSR_TIMEOUT_MS
  );
  const glbUrl = getFileUrl(getDataItem(generated, 1));

  if (!glbUrl) {
    throw new Error("3D generation did not return a GLB model.");
  }

  return glbUrl;
}

async function convertImageToTripo3D(imageUrl: string): Promise<string> {
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) {
    throw new Error("TRIPO_API_KEY is not configured on the server.");
  }

  const submitted = await tripoFetch<TripoCreateResponse>(
    "/task",
    {
      method: "POST",
      body: JSON.stringify({
        type: "image_to_model",
        file: {
          type: "image",
          url: imageUrl,
        },
        model_version: TRIPO_MODEL_VERSION,
        texture: true,
        pbr: true,
      }),
    },
    apiKey
  );

  const taskId = submitted.data?.task_id;
  if (!taskId) {
    throw new Error("Tripo did not return a task id.");
  }

  for (let poll = 0; poll < TRIPO_MAX_POLLS; poll += 1) {
    const task = await tripoFetch<TripoTaskResponse>(
      `/task/${taskId}`,
      { method: "GET" },
      apiKey
    );

    const status = task.data?.status;
    if (status === "success") {
      const output = task.data?.output;
      const modelUrl = output?.pbr_model || output?.model || output?.base_model;
      if (!modelUrl) {
        throw new Error("Tripo finished but did not return a model URL.");
      }
      return modelUrl;
    }

    if (
      status &&
      ["failed", "banned", "expired", "cancelled", "unknown"].includes(status)
    ) {
      throw new Error(
        task.data?.message ||
          `Tripo task ${status}. Error code: ${task.data?.error_code || "unknown"}`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, TRIPO_POLL_INTERVAL_MS));
  }

  throw new Error("Tripo conversion timed out before the model was ready.");
}

/**
 * Convert a 2D image to a GLB model using the selected provider.
 */
export async function convertImageTo3D(
  imageUrl: string,
  provider: Ai3DProvider = "tripo"
): Promise<string> {
  if (provider === "tripo") {
    return convertImageToTripo3D(imageUrl);
  }

  return convertImageToHuggingFace3D(imageUrl);
}
