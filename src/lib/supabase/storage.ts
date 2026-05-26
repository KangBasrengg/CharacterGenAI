import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "generations";

/**
 * Upload an image from a URL to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImageToStorage(
  imageUrl: string,
  userId: string,
  generationId: string
): Promise<string> {
  const supabase = await createClient();

  // Fetch the image from the temporary URL
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Determine file extension from content type
  const contentType = response.headers.get("content-type") || "image/png";
  const ext = contentType.includes("webp")
    ? "webp"
    : contentType.includes("jpeg") || contentType.includes("jpg")
      ? "jpg"
      : "png";

  const filePath = `${userId}/${generationId}.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Upload a 3D model from a URL to Supabase Storage.
 * Returns the public URL of the uploaded model.
 */
export async function uploadModelToStorage(
  modelUrl: string,
  userId: string,
  generationId: string,
  format: string = "obj"
): Promise<string> {
  const supabase = await createClient();

  const response = await fetch(modelUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch model: ${response.status}`);
  }

  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());

  const filePath = `${userId}/${generationId}.${format}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType:
        format === "glb" ? "model/gltf-binary" : "application/octet-stream",
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(`Failed to upload model: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return publicUrl;
}
