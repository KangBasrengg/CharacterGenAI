import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      const { data: created } = await supabase
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
        .select("*")
        .single();

      profile = created;
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name:
        profile?.name || user.user_metadata?.full_name || "User",
      plan: profile?.plan || "free",
      credits: profile?.credits ?? 10,
      avatarUrl: profile?.avatar_url || null,
      createdAt: profile?.created_at,
    });
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
