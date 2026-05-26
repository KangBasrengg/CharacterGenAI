import Replicate from "replicate";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function test() {
  console.log("Testing Replicate...");
  try {
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt: "A medieval knight, anime style",
        aspect_ratio: "1:1",
        output_format: "png",
        output_quality: 90,
        num_outputs: 1,
      },
    });
    console.log("Replicate output:", output);
    console.log("Type of output:", typeof output);
    if (Array.isArray(output)) {
        console.log("Output[0] type:", typeof output[0]);
        console.log("Output[0]:", output[0]);
        if (output[0] && typeof output[0] === 'object' && 'url' in output[0]) {
            console.log("URL:", output[0].url());
        }
    }
  } catch (err) {
    console.error("Replicate Error:", err);
  }
}

test();
