import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  // If there's an OAuth code in the root URL, forcefully redirect to /auth/callback
  const url = request.nextUrl.clone();
  if (url.pathname === "/" && url.searchParams.has("code")) {
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  // Session refresh proxy
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Trigger session refresh
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log("[PROXY DEBUG] Cookies present:", request.cookies.getAll().map(c => c.name));
  console.log("[PROXY DEBUG] getUser() result:", user?.id, "error:", error?.message);

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};


