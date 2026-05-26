import { client } from "@gradio/client";

async function testGradio() {
  try {
    const app = await client("stabilityai/TripoSR");
    console.log("Connected to Space:", app);
  } catch (err) {
    console.error("Gradio error stabilityai:", err.message);
  }
}

testGradio();
