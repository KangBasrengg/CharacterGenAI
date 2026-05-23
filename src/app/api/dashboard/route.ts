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

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get total generations count
    const { count: totalGenerations } = await supabase
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get recent generations (last 10)
    const { data: recentGenerations } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      profile: {
        name: profile?.name || "User",
        plan: profile?.plan || "free",
        credits: profile?.credits ?? 0,
      },
      stats: {
        totalGenerations: totalGenerations || 0,
        hoursSaved:
          ((totalGenerations || 0) * 2).toFixed(1) + "h",
      },
      recentGenerations: recentGenerations || [],
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
