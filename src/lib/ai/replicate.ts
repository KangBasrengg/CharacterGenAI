import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

/**
 * Generate a 2D character concept art using FLUX on Replicate.
 */
export async function generateCharacterImage(
  prompt: string,
  negativePrompt: string
): Promise<string> {
  const output = await replicate.run("black-forest-labs/flux-schnell", {
    input: {
      prompt,
      aspect_ratio: "1:1",
      output_format: "png",
      output_quality: 90,
      num_outputs: 1,
    },
  });

  // Output is typically an array of URLs or FileOutput objects
  if (Array.isArray(output) && output.length > 0) {
    const result = output[0];
    if (typeof result === "string") return result;
    if (result && typeof result === "object" && "url" in result) {
      return (result as { url: () => string }).url();
    }
    return String(result);
  }

  throw new Error("No output received from Replicate");
}

/**
 * Convert a 2D image to 3D model using TripoSR on Replicate.
 * This uses the same Replicate API token — no separate 3D service needed!
 */
export async function convertImageTo3D(
  imageUrl: string
): Promise<string> {
  const output = await replicate.run(
    "camenduru/triposr:625ce89b4528e87eabc0a0e9568b4966beb1e68076d78c7482ad2a7e94139a38",
    {
      input: {
        image: imageUrl,
        mc_resolution: 256,
        render: true,
      },
    }
  );

  // TripoSR returns a URL to the generated 3D model (GLB or OBJ)
  if (typeof output === "string") return output;

  if (Array.isArray(output) && output.length > 0) {
    const result = output[0];
    if (typeof result === "string") return result;
    if (result && typeof result === "object" && "url" in result) {
      return (result as { url: () => string }).url();
    }
    return String(result);
  }

  if (output && typeof output === "object" && "url" in output) {
    return (output as { url: () => string }).url();
  }

  throw new Error("No 3D model output received from Replicate");
}
