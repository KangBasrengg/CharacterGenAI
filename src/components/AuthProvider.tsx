"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store";
import toast from "react-hot-toast";

interface AuthProfile {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "studio";
  credits: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, setLoading } = useUserStore();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const withTimeout = async <T,>(promise: PromiseLike<T>, timeoutMs: number): Promise<T> => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Auth request timed out")), timeoutMs);
      });

      try {
        return await Promise.race([Promise.resolve(promise), timeout]);
      } finally {
        if (timer) clearTimeout(timer);
      }
    };

    // Check for URL errors or code (from OAuth callbacks)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let error = params.get("error");
      let errorDesc = params.get("error_description");
      const code = params.get("code");

      // Also check hash for implicit flow OAuth errors
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        if (hashParams.has("error")) {
          error = hashParams.get("error");
          errorDesc = hashParams.get("error_description");
        }
      }

      if (error) {
        const msg = errorDesc || error;
        toast.error(decodeURIComponent(msg || "Authentication error"));
        // Remove error from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (code) {
        // Exchange code for session if we landed here directly with a code
        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
          if (error) {
            console.error("Error exchanging code:", error);
            toast.error("Failed to verify login code.");
          } else {
            toast.success("Successfully logged in via Google!");
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      }
    }

    /**
     * Ensure a profile row exists for the given user.
     * This is a fallback in case the database trigger didn't fire
     * or if RLS blocks the trigger INSERT.
     */
    const ensureProfile = async (userId: string, meta: Record<string, string | undefined>) => {
      // Try to read existing profile
      const { data: existing } = await withTimeout(
        supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single(),
        8000
      );

      if (existing) return existing;

      // Profile doesn't exist — create it from the client side
      const { data: created, error } = await withTimeout(
        supabase
          .from("profiles")
          .upsert({
            id: userId,
            name: meta?.full_name || meta?.name || "User",
            avatar_url: meta?.avatar_url || null,
            plan: "free",
            credits: 10,
          }, { onConflict: "id" })
          .select()
          .single(),
        8000
      );

      if (error) {
        console.error("Failed to create profile:", error);
        return null;
      }
      return created;
    };

    const initAuth = async () => {
      try {
        const profileRes = await withTimeout(
          fetch("/api/user", {
            credentials: "same-origin",
            cache: "no-store",
          }),
          8000
        );
        if (cancelled) return;

        if (profileRes.ok) {
          const profile = (await profileRes.json()) as AuthProfile;
          setUser({
            id: profile.id,
            email: profile.email || "",
            name: profile.name || "User",
            plan: profile.plan || "free",
            credits: profile.credits ?? 10,
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          if (
            error instanceof Error &&
            error.message !== "Auth request timed out"
          ) {
            console.warn("Initial auth check failed:", error);
          }
          setLoading(false);
        }
      }
    };
    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
        let profile = null;
        try {
          // Give a small delay then ensure profile exists
          await new Promise((r) => setTimeout(r, 300));
          profile = await ensureProfile(
            session.user.id,
            session.user.user_metadata as Record<string, string | undefined>
          );
        } catch (error) {
          if (
            error instanceof Error &&
            error.message !== "Auth request timed out"
          ) {
            console.warn("Profile sync failed:", error);
          }
        }
        if (cancelled) return;
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name:
            profile?.name ||
            session.user.user_metadata?.full_name ||
            "User",
          plan: profile?.plan || "free",
          credits: profile?.credits ?? 10,
        });
      } else if (event === "SIGNED_OUT") {
        clearUser();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}
