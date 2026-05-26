"use client";

import { useEffect, useState } from "react";
import { useUserStore, useAuthStore } from "@/store";
import { Activity, Clock, Zap, CreditCard, Loader2, Wand2, ArrowRight, TrendingUp, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardData {
  profile: { name: string; plan: string; credits: number };
  stats: { totalGenerations: number; hoursSaved: string };
  recentGenerations: Array<{
    id: string;
    type: string;
    prompt: string;
    status: string;
    created_at: string;
    credits_used: number;
    image_url: string | null;
  }>;
}

const statColors = [
  { color: "#facc15", bgFrom: "rgba(234,179,8,0.1)", bgTo: "rgba(245,158,11,0.05)" },
  { color: "#c084fc", bgFrom: "rgba(168,85,247,0.1)", bgTo: "rgba(139,92,246,0.05)" },
  { color: "#60a5fa", bgFrom: "rgba(59,130,246,0.1)", bgTo: "rgba(6,182,212,0.05)" },
  { color: "#4ade80", bgFrom: "rgba(34,197,94,0.1)", bgTo: "rgba(16,185,129,0.05)" },
];

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useUserStore();
  const { openLogin } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  // Auth still loading
  if (authLoading) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "80px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 style={{ width: "32px", height: "32px", color: "#c084fc", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in — show CTA
  if (!user) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "80px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "16px", paddingRight: "16px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", maxWidth: "448px" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", fontSize: "14px", color: "#c4b5fd", fontWeight: 500, marginBottom: "24px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", backdropFilter: "blur(12px)" }}>
            <Sparkles style={{ width: "16px", height: "16px" }} /> Workspace
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "white", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "32px", lineHeight: 1.7 }}>
            Sign in to view your generation stats, credits balance, and recent activity.
          </p>
          <button
            onClick={openLogin}
            className="btn-gradient"
            style={{ padding: "14px 32px", borderRadius: "12px", color: "white", fontWeight: 700, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 8px 30px rgba(134,4,148,0.25)" }}
          >
            Sign In to Continue <ArrowRight style={{ width: "16px", height: "16px" }} />
          </button>
        </motion.div>
      </div>
    );
  }

  // Data loading
  if (loading) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "80px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 style={{ width: "32px", height: "32px", color: "#c084fc", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stats = [
    {
      label: "Available Credits",
      value: (data?.profile.credits ?? user.credits).toString(),
      icon: Zap,
      colorIdx: 0,
    },
    {
      label: "Total Generations",
      value: (data?.stats.totalGenerations ?? 0).toString(),
      icon: TrendingUp,
      colorIdx: 1,
    },
    {
      label: "Hours Saved",
      value: data?.stats.hoursSaved || "0h",
      icon: Clock,
      colorIdx: 2,
    },
    {
      label: "Current Plan",
      value: (data?.profile.plan || user.plan).toUpperCase(),
      icon: CreditCard,
      colorIdx: 3,
    },
  ];

  return (
    <div style={{ paddingTop: "128px", paddingBottom: "80px", paddingLeft: "5%", paddingRight: "5%", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", fontSize: "14px", color: "#c4b5fd", fontWeight: 500, marginBottom: "16px", background: "rgba(10,0,20,0.6)", border: "1px solid rgba(139,92,246,0.3)", backdropFilter: "blur(20px)" }}>
              <Activity style={{ width: "16px", height: "16px" }} /> Overview
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "white", marginBottom: "12px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Welcome back,{" "}
              <span className="gradient-text">
                {data?.profile.name.split(" ")[0] || user.name.split(" ")[0]}
              </span>!
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar style={{ width: "20px", height: "20px", opacity: 0.7 }} />
              Here&apos;s what&apos;s happening with your account today.
            </p>
          </div>
          <Link
            href="/generate"
            className="btn-gradient"
            style={{ padding: "12px 24px", borderRadius: "12px", color: "white", fontWeight: 700, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", boxShadow: "0 8px 30px rgba(134,4,148,0.25)" }}
          >
            <Wand2 style={{ width: "16px", height: "16px" }} /> Generate Character
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {stats.map((stat, i) => {
            const c = statColors[stat.colorIdx];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card-hover"
                style={{
                  minHeight: "132px",
                  padding: "24px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  background: "rgba(10,0,20,0.6)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                }}
              >
                {/* Subtle gradient bg */}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${c.bgFrom} 0%, ${c.bgTo} 100%)`, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 10 }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: "30px", fontWeight: 900, color: "white" }}>{stat.value}</p>
                </div>
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: c.color,
                  }}
                >
                  <stat.icon style={{ width: "20px", height: "20px" }} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ paddingBottom: "40px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>Recent Activity</h2>
            {data?.recentGenerations && data.recentGenerations.length > 0 && (
              <Link href="/library" style={{ fontSize: "14px", color: "#c084fc", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", transition: "color 0.2s" }}>
                View all <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
            )}
          </div>
          <div
            style={{
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(30,0,50,0.2)",
              background: "rgba(10,0,20,0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", fontSize: "14px", color: "rgba(255,255,255,0.7)", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "16px 24px", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>Type</th>
                    <th style={{ padding: "16px 24px", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>Prompt</th>
                    <th style={{ padding: "16px 24px", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>Status</th>
                    <th style={{ padding: "16px 24px", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>Date</th>
                    <th style={{ padding: "16px 24px", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", textAlign: "right" }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentGenerations &&
                  data.recentGenerations.length > 0 ? (
                    data.recentGenerations.map((gen) => {
                      const typeBadge = gen.type === "2d"
                        ? { bg: "rgba(168,85,247,0.1)", color: "#c4b5fd", border: "1px solid rgba(168,85,247,0.2)" }
                        : { bg: "rgba(59,130,246,0.1)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" };

                      const statusStyle = gen.status === "completed"
                        ? { bg: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }
                        : gen.status === "failed"
                          ? { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }
                          : { bg: "rgba(234,179,8,0.1)", color: "#facc15", border: "1px solid rgba(234,179,8,0.2)" };

                      return (
                        <tr
                          key={gen.id}
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.15s" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <td style={{ padding: "16px 24px", whiteSpace: "nowrap", fontWeight: 500, color: "white" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, background: typeBadge.bg, color: typeBadge.color, border: typeBadge.border }}>
                              {gen.type === "2d" ? "2D" : "3D"}
                            </span>
                          </td>
                          <td style={{ padding: "16px 24px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
                            {gen.prompt}
                          </td>
                          <td style={{ padding: "16px 24px" }}>
                            <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, background: statusStyle.bg, color: statusStyle.color, border: statusStyle.border }}>
                              {gen.status.charAt(0).toUpperCase() + gen.status.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                            {formatDate(gen.created_at)}
                          </td>
                          <td style={{ padding: "16px 24px", whiteSpace: "nowrap", textAlign: "right" }}>
                            {gen.status === "failed"
                              ? <span style={{ color: "#f87171" }}>Refunded</span>
                              : `${gen.credits_used} Credit${gen.credits_used !== 1 ? "s" : ""}`}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ padding: "64px 24px", textAlign: "center" }}
                      >
                        <Wand2 style={{ width: "40px", height: "40px", color: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />
                        <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500, marginBottom: "8px" }}>No generations yet</p>
                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", marginBottom: "16px" }}>Start creating characters to see your activity here!</p>
                        <Link
                          href="/generate"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#c084fc", fontSize: "12px", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
                        >
                          Generate your first character <ArrowRight style={{ width: "12px", height: "12px" }} />
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
