"use client";

import { useEffect, useState } from "react";
import { useUserStore, useAuthStore } from "@/store";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  User, Mail, CreditCard, Zap, Shield, Calendar, Edit3, Check, X,
  ArrowRight, Loader2, TrendingUp, Sparkles,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface ProfileData {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "studio";
  credits: number;
  avatarUrl: string | null;
  createdAt: string;
}

interface ProfileStats {
  totalGenerations: number;
  total2D: number;
  total3D: number;
}

export default function ProfilePage() {
  const { user, isLoading: authLoading, setUser } = useUserStore();
  const { openLogin } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/dashboard"),
        ]);
        const profileData = await profileRes.json();
        const statsData = await statsRes.json();

        setProfile(profileData);
        setNewName(profileData.name || "");

        // Calculate stats from recent generations
        const gens = statsData.recentGenerations || [];
        setStats({
          totalGenerations: statsData.stats?.totalGenerations || 0,
          total2D: gens.filter((g: { type: string }) => g.type === "2d").length,
          total3D: gens.filter((g: { type: string }) => g.type === "3d").length,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const handleUpdateName = async () => {
    if (!newName.trim() || !user) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ name: newName.trim() })
        .eq("id", user.id);

      if (error) throw error;

      setUser({ ...user, name: newName.trim() });
      setEditingName(false);
      toast.success("Name updated successfully!");
    } catch (error) {
      toast.error("Failed to update name");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Auth loading
  if (authLoading) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "80px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 style={{ width: "32px", height: "32px", color: "#a78bfa", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "80px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "20px", paddingRight: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", maxWidth: "400px" }}
        >
          <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(147,51,234,0.2) 0%, rgba(139,92,246,0.2) 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px auto", border: "1px solid rgba(168,85,247,0.2)" }}>
            <User style={{ width: "40px", height: "40px", color: "#c084fc" }} />
          </div>
          <h1 style={{ fontSize: "30px", fontWeight: 700, color: "white", marginBottom: "12px" }}>Your Profile</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "32px", lineHeight: 1.6 }}>
            Sign in to view and manage your profile, credits, and subscription.
          </p>
          <button
            onClick={openLogin}
            style={{ padding: "14px 32px", borderRadius: "12px", background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)", color: "white", fontWeight: 600, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px", border: "none", cursor: "pointer" }}
          >
            Sign In to Continue <ArrowRight style={{ width: "16px", height: "16px" }} />
          </button>
        </motion.div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "80px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 style={{ width: "32px", height: "32px", color: "#a78bfa", animation: "spin 1s linear infinite", margin: "0 auto 16px auto" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const planColors = {
    free: { bg: "linear-gradient(to right, rgba(107,114,128,0.1), rgba(156,163,175,0.05))", border: "rgba(107,114,128,0.2)", text: "#d1d5db", badge: "rgba(107,114,128,0.1)" },
    pro: { bg: "linear-gradient(to right, rgba(168,85,247,0.1), rgba(139,92,246,0.05))", border: "rgba(168,85,247,0.2)", text: "#d8b4fe", badge: "rgba(168,85,247,0.1)" },
    studio: { bg: "linear-gradient(to right, rgba(245,158,11,0.1), rgba(249,115,22,0.05))", border: "rgba(245,158,11,0.2)", text: "#fcd34d", badge: "rgba(245,158,11,0.1)" },
  };

  const currentPlan = profile?.plan || user.plan;
  const planStyle = planColors[currentPlan];

  return (
    <div style={{ paddingTop: "160px", paddingBottom: "80px", paddingLeft: "5%", paddingRight: "5%", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "40px" }}
        >
          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "white", marginBottom: "8px" }}>My Profile</h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Manage your account settings and subscription.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {/* Left Column — Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ gridColumn: "span 1" }}
          >
            <div style={{ background: "rgba(10,0,20,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px", textAlign: "center" }}>
              {/* Avatar */}
              <div style={{ width: "96px", height: "96px", borderRadius: "24px", background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", boxShadow: "0 0 30px rgba(139,92,246,0.3)", fontSize: "36px", fontWeight: 700, color: "white" }}>
                {(profile?.name || user.name).charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              {editingName ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginBottom: "8px" }}>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "14px", color: "white", textAlign: "center", outline: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.4)", width: "160px" }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateName();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                  />
                  <button
                    onClick={handleUpdateName}
                    disabled={saving}
                    style={{ padding: "6px", borderRadius: "8px", background: "rgba(34,197,94,0.2)", color: "#4ade80", border: "none", cursor: "pointer" }}
                  >
                    {saving ? <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} /> : <Check style={{ width: "16px", height: "16px" }} />}
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setNewName(profile?.name || user.name); }}
                    style={{ padding: "6px", borderRadius: "8px", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", cursor: "pointer" }}
                  >
                    <X style={{ width: "16px", height: "16px" }} />
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "white", margin: 0 }}>{profile?.name || user.name}</h2>
                  <button
                    onClick={() => setEditingName(true)}
                    style={{ padding: "4px", borderRadius: "6px", color: "rgba(255,255,255,0.3)", background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    <Edit3 style={{ width: "14px", height: "14px" }} />
                  </button>
                </div>
              )}

              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "20px", margin: "0 0 20px 0" }}>{profile?.email || user.email}</p>

              {/* Plan Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 16px", borderRadius: "9999px", background: planStyle.badge, border: `1px solid ${planStyle.border}`, color: planStyle.text, fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "24px" }}>
                <Shield style={{ width: "14px", height: "14px" }} />
                {currentPlan} Plan
              </div>

              {/* Member Since */}
              {profile?.createdAt && (
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", margin: 0 }}>
                  <Calendar style={{ width: "12px", height: "12px" }} />
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                style={{ width: "100%", marginTop: "24px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "14px", fontWeight: 500, background: "transparent", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* Right Column — Details */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}
            >
              {[
                {
                  label: "Credits",
                  value: (profile?.credits ?? user.credits).toString(),
                  icon: Zap,
                  color: "#facc15",
                },
                {
                  label: "2D Generated",
                  value: (stats?.total2D ?? 0).toString(),
                  icon: Sparkles,
                  color: "#c084fc",
                },
                {
                  label: "3D Converted",
                  value: (stats?.total3D ?? 0).toString(),
                  icon: TrendingUp,
                  color: "#60a5fa",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ background: "rgba(10,0,20,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "20px", textAlign: "center" }}
                >
                  <s.icon style={{ width: "20px", height: "20px", margin: "0 auto 8px auto", color: s.color }} />
                  <p style={{ fontSize: "24px", fontWeight: 700, color: "white", margin: "0 0 4px 0" }}>{s.value}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Account Details */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ background: "rgba(10,0,20,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden" }}
            >
              <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "white", margin: 0 }}>Account Details</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { icon: User, label: "Display Name", value: profile?.name || user.name },
                  { icon: Mail, label: "Email Address", value: profile?.email || user.email },
                  { icon: CreditCard, label: "Subscription Plan", value: `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan` },
                  { icon: Zap, label: "Available Credits", value: `${profile?.credits ?? user.credits} credits` },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "16px 24px", gap: "16px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
                      <item.icon style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.4)" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 2px 0" }}>{item.label}</p>
                      <p style={{ fontSize: "14px", color: "white", fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upgrade CTA (only for free users) */}
            {currentPlan === "free" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, rgba(134,4,148,0.15) 0%, rgba(120,115,208,0.1) 100%)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  padding: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <h3 style={{ color: "white", fontWeight: 700, margin: "0 0 4px 0", fontSize: "16px" }}>Upgrade to Pro</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
                    Get 1000 credits/month, HD exports, commercial use, and more.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  style={{
                    padding: "10px 24px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "white",
                    background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    flexShrink: 0
                  }}
                >
                  View Plans <ArrowRight style={{ width: "16px", height: "16px" }} />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
