import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Verify auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get generation record
    const { data: generation, error } = await supabase
      .from("generations")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !generation) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Determine download URL based on format requested
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "png";

    let downloadUrl: string | null = null;
    let filename = `chargen-${generation.id}`;

    if (format === "png" && generation.image_url) {
      downloadUrl = generation.image_url;
      filename += ".png";
    } else if (
      ["glb", "fbx", "obj"].includes(format) &&
      generation.model_url
    ) {
      downloadUrl = generation.model_url;
      filename += `.${format}`;
    }

    if (!downloadUrl) {
      return NextResponse.json(
        {
          error: `No ${format.toUpperCase()} file available for this asset`,
        },
        { status: 404 }
      );
    }

    // Fetch the file and stream it back with proper headers
    const fileResponse = await fetch(downloadUrl);
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: 500 }
      );
    }

    const blob = await fileResponse.blob();

    return new NextResponse(blob, {
      headers: {
        "Content-Type":
          fileResponse.headers.get("Content-Type") ||
          "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Download API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
