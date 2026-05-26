"use client";

import { useState } from "react";
import { useAuthStore } from "@/store";
import { useUserStore } from "@/store";
import { createClient } from "@/lib/supabase/client";
import { login, register } from "@/app/actions/auth";
import { Sparkles, X, Mail, Code, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export function AuthModal() {
  const { isOpen, mode, close, openLogin, openRegister } = useAuthStore();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[AUTH] handleAuth started, mode:", mode);
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      if (mode === "register") {
        console.log("[AUTH] Calling register Server Action");
        const result = await register(formData);
        if (result.error) throw new Error(result.error);
        
        if (result.requireVerification) {
          toast.success("Account created! Check your email to verify.");
        } else {
          toast.success("Account created! Welcome to CharGen AI.");
        }
      } else {
        console.log("[AUTH] Calling login Server Action");
        const result = await login(formData);
        if (result.error) throw new Error(result.error);
        
        console.log("[AUTH] Login success, showing toast");
        toast.success("Successfully logged in!");
      }

      const profileRes = await fetch("/api/user");
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          plan: profile.plan,
          credits: profile.credits,
        });
      }
      
      console.log("[AUTH] Calling close()");
      close();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      console.error("[AUTH] Error caught:", message);
      toast.error(message);
    } finally {
      console.log("[AUTH] Finally block, setLoading(false)");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "OAuth failed");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.5)",
    marginBottom: "8px",
    letterSpacing: "0.03em",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop + Centered Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "440px",
              }}
            >
            <div
              style={{
                background: "linear-gradient(180deg, #1a0a2e 0%, #0d0015 100%)",
                borderRadius: "24px",
                border: "1px solid rgba(139,92,246,0.2)",
                boxShadow:
                  "0 0 80px rgba(134,4,148,0.15), 0 25px 50px rgba(0,0,0,0.5)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Gradient top bar */}
              <div
                style={{
                  height: "3px",
                  background:
                    "linear-gradient(90deg, #860494, #7873d0, #7a8bdc, #7873d0, #860494)",
                  backgroundSize: "200% 100%",
                  animation: "gradient-shift 3s ease infinite",
                }}
              />

              {/* Glow orb behind icon */}
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(134,4,148,0.3) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Close button */}
              <button
                onClick={close}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>

              {/* Content */}
              <div style={{ padding: "40px 32px 32px" }}>
                {/* Icon + Heading */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "32px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #860494 0%, #7873d0 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                      boxShadow:
                        "0 0 30px rgba(134,4,148,0.5), 0 0 60px rgba(134,4,148,0.2)",
                    }}
                  >
                    <Sparkles style={{ width: "26px", height: "26px", color: "white" }} />
                  </div>
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: 800,
                      color: "white",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {mode === "login" ? "Welcome back" : "Create an account"}
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.45)",
                      marginTop: "8px",
                      textAlign: "center",
                    }}
                  >
                    {mode === "login"
                      ? "Sign in to your CharGen AI workspace"
                      : "Start generating stunning 3D characters today"}
                  </p>
                </div>

                {/* OAuth buttons */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {[
                    {
                      label: "Google",
                      icon: Mail,
                      provider: "google" as const,
                    },
                    {
                      label: "GitHub",
                      icon: Code,
                      provider: "github" as const,
                    },
                  ].map((item) => (
                    <button
                      key={item.provider}
                      onClick={() => handleOAuth(item.provider)}
                      disabled={loading}
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.04)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        transition: "all 0.2s ease",
                        opacity: loading ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      }}
                    >
                      <item.icon style={{ width: "18px", height: "18px" }} />
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background:
                        "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    or with email
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background:
                        "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
                    }}
                  />
                </div>

                {/* Form */}
                <form
                  onSubmit={handleAuth}
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  {mode === "register" && (
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input
                        name="name"
                        placeholder="Your name"
                        required
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(139,92,246,0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Email address</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(139,92,246,0.5)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.1)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        minLength={6}
                        required
                        style={{ ...inputStyle, paddingRight: "48px" }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(139,92,246,0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "rgba(255,255,255,0.3)",
                          cursor: "pointer",
                          padding: "4px",
                          display: "flex",
                        }}
                      >
                        {showPassword ? (
                          <EyeOff style={{ width: "18px", height: "18px" }} />
                        ) : (
                          <Eye style={{ width: "18px", height: "18px" }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #860494 0%, #7873d0 100%)",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: loading ? "wait" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "8px",
                      transition: "all 0.3s ease",
                      opacity: loading ? 0.7 : 1,
                      boxShadow: "0 8px 30px rgba(134,4,148,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 40px rgba(134,4,148,0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(134,4,148,0.3)";
                    }}
                  >
                    {loading ? (
                      <Loader2
                        style={{
                          width: "20px",
                          height: "20px",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    ) : mode === "login" ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Toggle */}
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "24px",
                  }}
                >
                  {mode === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={mode === "login" ? openRegister : openLogin}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#c084fc",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#d8b4fe";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#c084fc";
                    }}
                  >
                    {mode === "login" ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
