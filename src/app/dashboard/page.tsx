"use client";

import { useEffect, useState } from "react";
import { useUserStore, useAuthStore } from "@/store";
import { Activity, Clock, Zap, CreditCard, Loader2, Wand2, ArrowRight, TrendingUp, Calendar } from "lucide-react";
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

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useUserStore();
  const { openLogin } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  // Auth still loading
  if (authLoading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in — show CTA
  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <Activity className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Dashboard</h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            Sign in to view your generation stats, credits balance, and recent activity.
          </p>
          <button
            onClick={openLogin}
            className="px-8 py-3.5 rounded-xl btn-gradient text-white font-semibold text-sm inline-flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)" }}
          >
            Sign In to Continue <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  // Data loading
  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading dashboard...</p>
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
      color: "text-yellow-400",
      bg: "from-yellow-500/10 to-amber-500/5",
    },
    {
      label: "Total Generations",
      value: (data?.stats.totalGenerations ?? 0).toString(),
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "from-purple-500/10 to-violet-500/5",
    },
    {
      label: "Hours Saved",
      value: data?.stats.hoursSaved || "0h",
      icon: Clock,
      color: "text-blue-400",
      bg: "from-blue-500/10 to-cyan-500/5",
    },
    {
      label: "Current Plan",
      value: (data?.profile.plan || user.plan).toUpperCase(),
      icon: CreditCard,
      color: "text-green-400",
      bg: "from-green-500/10 to-emerald-500/5",
    },
  ];

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "5%", paddingRight: "5%" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back,{" "}
            <span className="gradient-text">
              {data?.profile.name.split(" ")[0] || user.name.split(" ")[0]}
            </span>!
          </h1>
          <p className="text-white/50 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
        <Link
          href="/generate"
          className="px-6 py-3 rounded-xl btn-gradient text-white font-semibold text-sm inline-flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)" }}
        >
          <Wand2 className="w-4 h-4" /> Generate New Character
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl glass border border-white/10 flex items-start justify-between card-hover relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} pointer-events-none`} />
            <div className="relative z-10">
              <p className="text-sm font-medium text-white/50 mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <div
              className={`relative z-10 w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          {data?.recentGenerations && data.recentGenerations.length > 0 && (
            <Link href="/library" className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <div className="glass border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-[#0a0a0a]/50 text-xs uppercase text-white/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Prompt</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data?.recentGenerations &&
                data.recentGenerations.length > 0 ? (
                  data.recentGenerations.map((gen) => (
                    <tr
                      key={gen.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          gen.type === "2d" 
                            ? "bg-purple-500/10 text-purple-300 border border-purple-500/20" 
                            : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                        }`}>
                          {gen.type === "2d" ? "2D" : "3D"}
                        </span>
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {gen.prompt}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            gen.status === "completed"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : gen.status === "failed"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}
                        >
                          {gen.status.charAt(0).toUpperCase() +
                            gen.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(gen.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {gen.status === "failed"
                          ? <span className="text-red-400">Refunded</span>
                          : `${gen.credits_used} Credit${gen.credits_used !== 1 ? "s" : ""}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <Wand2 className="w-10 h-10 text-white/15 mx-auto mb-4" />
                      <p className="text-white/40 font-medium mb-2">No generations yet</p>
                      <p className="text-white/25 text-xs mb-4">Start creating characters to see your activity here!</p>
                      <Link
                        href="/generate"
                        className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors"
                      >
                        Generate your first character <ArrowRight className="w-3 h-3" />
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
  );
}
