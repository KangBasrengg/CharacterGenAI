import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { buildPrompt, NEGATIVE_PROMPT } from "@/lib/ai/prompts";
import { generateCharacterImage } from "@/lib/ai/replicate";
import type { CharacterStyle, Gender, PoseMood } from "@/lib/ai/prompts";

export const maxDuration = 60; // Extend Vercel timeout to 60 seconds

const BUCKET_NAME = "generations";

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
      // 7. Call Hugging Face FLUX to generate image (returns Buffer)
      const { buffer, contentType } = await generateCharacterImage(
        fullPrompt,
        NEGATIVE_PROMPT
      );

      // 8. Upload buffer directly to Supabase Storage
      const ext = contentType.includes("webp")
        ? "webp"
        : contentType.includes("jpeg") || contentType.includes("jpg")
          ? "jpg"
          : "png";

      const filePath = `${user.id}/${generation.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, buffer, {
          contentType,
          upsert: true,
        });

      let persistentUrl: string;

      if (uploadError) {
        console.warn("Storage upload failed:", uploadError);
        // Fallback: return a base64 data URL
        persistentUrl = `data:${contentType};base64,${buffer.toString("base64")}`;
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        persistentUrl = publicUrl;
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

      let errorMessage = aiError instanceof Error ? aiError.message : "Unknown error";
      if (aiError instanceof Error && (aiError as any).cause) {
        errorMessage += ` (Cause: ${(aiError as any).cause.message || (aiError as any).cause})`;
      }

      await supabase
        .from("generations")
        .update({
          status: "failed",
          error_message: errorMessage,
        })
        .eq("id", generation.id);

      return NextResponse.json(
        { error: errorMessage },
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
