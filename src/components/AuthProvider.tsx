"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, setLoading } = useUserStore();

  useEffect(() => {
    const supabase = createClient();

    // Check initial session
    const initAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          if (profile) {
            setUser({
              id: profile.id,
              email: user.email || "",
              name:
                profile.name ||
                user.user_metadata?.full_name ||
                "User",
              plan: profile.plan || "free",
              credits: profile.credits ?? 10,
            });
          } else {
            // Profile might not exist yet (trigger hasn't fired)
            setUser({
              id: user.id,
              email: user.email || "",
              name: user.user_metadata?.full_name || "User",
              plan: "free",
              credits: 10,
            });
          }
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Small delay to let the trigger create the profile
        await new Promise((r) => setTimeout(r, 500));
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
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

    return () => subscription.unsubscribe();
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}
