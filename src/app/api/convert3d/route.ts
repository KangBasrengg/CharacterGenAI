import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { convertImageTo3D } from "@/lib/ai/replicate";
import { uploadModelToStorage } from "@/lib/supabase/storage";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Verify auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check credits (3D costs 5)
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits < 5) {
      return NextResponse.json(
        {
          error:
            "Insufficient credits. 3D conversion requires 5 credits.",
        },
        { status: 402 }
      );
    }

    // 3. Parse request
    const { imageUrl, generationId } = await request.json();
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // 4. Deduct 5 credits
    await supabase
      .from("profiles")
      .update({ credits: profile.credits - 5 })
      .eq("id", user.id);

    // 5. Insert 3D generation record
    const { data: generation } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        type: "3d",
        prompt: `3D conversion of generation ${generationId || "unknown"}`,
        status: "processing",
        image_url: imageUrl,
        credits_used: 5,
      })
      .select()
      .single();

    try {
      // 6. Call TripoSR on Replicate (synchronous — returns when done)
      const tempModelUrl = await convertImageTo3D(imageUrl);

      // 7. Upload model to Supabase Storage
      let persistentModelUrl = tempModelUrl;
      const modelFormat = "obj";
      try {
        if (generation) {
          persistentModelUrl = await uploadModelToStorage(
            tempModelUrl,
            user.id,
            generation.id,
            modelFormat
          );
        }
      } catch (storageError) {
        console.warn("Model storage upload failed, using temporary URL:", storageError);
      }

      // 8. Update generation record
      if (generation) {
        await supabase
          .from("generations")
          .update({
            status: "completed",
            model_url: persistentModelUrl,
            model_format: modelFormat,
          })
          .eq("id", generation.id);
      }

      return NextResponse.json({
        id: generation?.id,
        modelUrl: persistentModelUrl,
        format: modelFormat,
        creditsRemaining: profile.credits - 5,
      });
    } catch (aiError) {
      // Refund credits on failure
      await supabase
        .from("profiles")
        .update({ credits: profile.credits })
        .eq("id", user.id);

      if (generation) {
        await supabase
          .from("generations")
          .update({
            status: "failed",
            error_message:
              aiError instanceof Error
                ? aiError.message
                : "3D conversion failed",
          })
          .eq("id", generation.id);
      }

      return NextResponse.json(
        { error: "3D conversion failed. Credits refunded." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Convert3D API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
