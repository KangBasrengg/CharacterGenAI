"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Authenticating...");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setStatus(`Error: ${errorDescription || error}`);
        setTimeout(() => router.replace("/"), 2000);
        return;
      }

      if (code) {
        try {
          const supabase = createClient();
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("Code exchange failed:", exchangeError);
            setStatus("Login failed. Redirecting...");
          } else {
            setStatus("Login successful! Redirecting...");
          }
        } catch (err) {
          console.error("Unexpected error during code exchange:", err);
          setStatus("Something went wrong. Redirecting...");
        }
      }

      // Always redirect to home
      router.replace("/");
    };

    handleCallback();
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
      <div style={{
        width: "32px",
        height: "32px",
        border: "3px solid rgba(139,92,246,0.3)",
        borderTopColor: "#8b5cf6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <p style={{ color: "rgba(255,255,255,0.7)" }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
