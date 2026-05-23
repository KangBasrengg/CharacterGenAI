import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const type = url.searchParams.get("type") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    let query = supabase
      .from("generations")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike("prompt", `%${search}%`);
    }

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    const { data: generations, count, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch library" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      generations: generations || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Library API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
