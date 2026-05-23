const MESHY_API_BASE = "https://api.meshy.ai/v2";

interface MeshyTaskResponse {
  result: string; // task ID
}

export interface MeshyTaskStatus {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";
  progress: number;
  model_urls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
  };
  thumbnail_url?: string;
  error?: string;
}

export async function createImageTo3DTask(imageUrl: string): Promise<string> {
  const response = await fetch(`${MESHY_API_BASE}/image-to-3d`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: imageUrl,
      ai_model: "meshy-4",
      topology: "quad",
      target_polycount: 30000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Meshy API error: ${response.status} - ${error}`);
  }

  const data: MeshyTaskResponse = await response.json();
  return data.result;
}

export async function getTaskStatus(taskId: string): Promise<MeshyTaskStatus> {
  const response = await fetch(`${MESHY_API_BASE}/image-to-3d/${taskId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Meshy API error: ${response.status} - ${error}`);
  }

  return response.json();
}
