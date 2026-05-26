"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reconstruct the search string
    const search = searchParams.toString();
    // Redirect to root with all the OAuth parameters (code, error, etc.)
    // so that AuthProvider can handle them natively.
    router.replace(`/?${search}`);
  }, [router, searchParams]);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      background: "#0d0015",
      color: "white",
      flexDirection: "column",
      gap: "16px"
    }}>
      <div className="animate-spin" style={{ 
        width: "32px", 
        height: "32px", 
        border: "3px solid rgba(139,92,246,0.3)", 
        borderTopColor: "#8b5cf6", 
        borderRadius: "50%" 
      }} />
      <p style={{ color: "rgba(255,255,255,0.7)" }}>Authenticating...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0d0015" }}>
        <p style={{ color: "white" }}>Loading...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
