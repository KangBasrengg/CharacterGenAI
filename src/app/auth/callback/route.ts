import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  // Instead of attempting to exchange the code on the server (which fails with PKCE errors on Netlify),
  // we redirect back to the client and let createBrowserClient & AuthProvider handle the code exchange.
  return NextResponse.redirect(`${origin}/?${searchParams.toString()}`);
}
