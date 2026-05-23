import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getTaskStatus } from "@/lib/ai/meshy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;

    // Check task status from Meshy
    const status = await getTaskStatus(taskId);

    // If completed, update the generation record
    if (status.status === "SUCCEEDED" && status.model_urls) {
      await supabase
        .from("generations")
        .update({
          status: "completed",
          model_url: status.model_urls.glb || status.model_urls.fbx || null,
          model_format: status.model_urls.glb ? "glb" : status.model_urls.fbx ? "fbx" : null,
        })
        .eq("ai_task_id", taskId)
        .eq("user_id", user.id);
    } else if (status.status === "FAILED") {
      // Refund credits on failure
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ credits: profile.credits + 5 })
          .eq("id", user.id);
      }

      await supabase
        .from("generations")
        .update({
          status: "failed",
          error_message: status.error || "3D conversion failed",
        })
        .eq("ai_task_id", taskId)
        .eq("user_id", user.id);
    }

    return NextResponse.json({
      status: status.status,
      progress: status.progress,
      modelUrls: status.model_urls || null,
      thumbnailUrl: status.thumbnail_url || null,
    });
  } catch (error) {
    console.error("Convert3D status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
