import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { buildPrompt, NEGATIVE_PROMPT } from "@/lib/ai/prompts";
import { generateCharacterImage } from "@/lib/ai/replicate";
import { uploadImageToStorage } from "@/lib/supabase/storage";
import type { CharacterStyle, Gender, PoseMood } from "@/lib/ai/prompts";

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

    // 2. Get user profile and check credits
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();
    let profile = existingProfile;

    if (profileError || !profile) {
      const { data: createdProfile, error: createProfileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              "User",
            avatar_url: user.user_metadata?.avatar_url || null,
            plan: "free",
            credits: 10,
          },
          { onConflict: "id" }
        )
        .select("credits")
        .single();

      if (createProfileError || !createdProfile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }

      profile = createdProfile;
    }

    if (profile.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // 3. Parse request body
    const body = await request.json();
    const { prompt, style, gender, pose } = body as {
      prompt: string;
      style: CharacterStyle;
      gender: Gender;
      pose: PoseMood;
    };

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 4. Build the full AI prompt
    const fullPrompt = buildPrompt(prompt, style, gender, pose);

    // 5. Insert generation record (processing)
    const { data: generation, error: insertError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        type: "2d",
        prompt,
        style,
        gender,
        pose,
        status: "processing",
        credits_used: 1,
      })
      .select()
      .single();

    if (insertError || !generation) {
      return NextResponse.json(
        { error: "Failed to create generation record" },
        { status: 500 }
      );
    }

    // 6. Deduct 1 credit
    await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    try {
      // 7. Call Replicate FLUX
      const tempImageUrl = await generateCharacterImage(
        fullPrompt,
        NEGATIVE_PROMPT
      );

      // 8. Upload to Supabase Storage for persistence
      let persistentUrl = tempImageUrl;
      try {
        persistentUrl = await uploadImageToStorage(
          tempImageUrl,
          user.id,
          generation.id
        );
      } catch (storageError) {
        // If storage upload fails, fall back to temporary URL
        console.warn("Storage upload failed, using temporary URL:", storageError);
      }

      // 9. Update generation record with result
      await supabase
        .from("generations")
        .update({
          status: "completed",
          image_url: persistentUrl,
        })
        .eq("id", generation.id);

      return NextResponse.json({
        id: generation.id,
        imageUrl: persistentUrl,
        creditsRemaining: profile.credits - 1,
      });
    } catch (aiError) {
      // If AI generation fails, refund the credit
      await supabase
        .from("profiles")
        .update({ credits: profile.credits })
        .eq("id", user.id);

      await supabase
        .from("generations")
        .update({
          status: "failed",
          error_message:
            aiError instanceof Error ? aiError.message : "Unknown error",
        })
        .eq("id", generation.id);

      return NextResponse.json(
        { error: "AI generation failed. Credit has been refunded." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
