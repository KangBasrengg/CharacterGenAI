import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.search;
  
  // Return an HTML script to redirect on the client-side.
  // This bypasses Netlify HTTP 302/307 rewrite loops and correctly passes the query to the root.
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=/${search}" />
      </head>
      <body>
        <script>window.location.href = "/${search}";</script>
        <p>Redirecting to authentication...</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

