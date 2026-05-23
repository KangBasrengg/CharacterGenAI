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
    if (!user) {
      setLoading(false);
      return;
    }

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
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <User className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Your Profile</h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            Sign in to view and manage your profile, credits, and subscription.
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

  // Loading
  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const planColors = {
    free: { bg: "from-gray-500/10 to-gray-600/5", border: "border-gray-500/20", text: "text-gray-300", badge: "bg-gray-500/10" },
    pro: { bg: "from-purple-500/10 to-violet-500/5", border: "border-purple-500/20", text: "text-purple-300", badge: "bg-purple-500/10" },
    studio: { bg: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/20", text: "text-amber-300", badge: "bg-amber-500/10" },
  };

  const currentPlan = profile?.plan || user.plan;
  const planStyle = planColors[currentPlan];

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "5%", paddingRight: "5%" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/50">Manage your account settings and subscription.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-1"
          >
            <div className="glass border border-white/10 rounded-2xl p-8 text-center card-hover">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center mx-auto mb-5 glow-purple text-3xl font-bold text-white">
                {(profile?.name || user.name).charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              {editingName ? (
                <div className="flex items-center gap-2 justify-center mb-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-sm text-white text-center outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(139,92,246,0.4)",
                      width: "160px",
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateName();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                  />
                  <button
                    onClick={handleUpdateName}
                    disabled={saving}
                    className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setNewName(profile?.name || user.name); }}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white">{profile?.name || user.name}</h2>
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1 rounded-md text-white/30 hover:text-white/60 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-white/40 text-sm mb-5">{profile?.email || user.email}</p>

              {/* Plan Badge */}
              <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${planStyle.badge} ${planStyle.border} border ${planStyle.text} text-xs font-semibold uppercase tracking-wider mb-6`}>
                <Shield className="w-3.5 h-3.5" />
                {currentPlan} Plan
              </div>

              {/* Member Since */}
              {profile?.createdAt && (
                <p className="text-white/25 text-xs flex items-center justify-center gap-1.5">
                  <Calendar className="w-3 h-3" />
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
                className="w-full mt-6 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* Right Column — Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                {
                  label: "Credits",
                  value: (profile?.credits ?? user.credits).toString(),
                  icon: Zap,
                  color: "text-yellow-400",
                },
                {
                  label: "2D Generated",
                  value: (stats?.total2D ?? 0).toString(),
                  icon: Sparkles,
                  color: "text-purple-400",
                },
                {
                  label: "3D Converted",
                  value: (stats?.total3D ?? 0).toString(),
                  icon: TrendingUp,
                  color: "text-blue-400",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="glass border border-white/10 rounded-xl p-5 text-center"
                >
                  <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-white/40 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Account Details */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <h3 className="text-sm font-semibold text-white">Account Details</h3>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { icon: User, label: "Display Name", value: profile?.name || user.name },
                  { icon: Mail, label: "Email Address", value: profile?.email || user.email },
                  { icon: CreditCard, label: "Subscription Plan", value: `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan` },
                  { icon: Zap, label: "Available Credits", value: `${profile?.credits ?? user.credits} credits` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center px-6 py-4 gap-4">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                      <item.icon className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40 mb-0.5">{item.label}</p>
                      <p className="text-sm text-white font-medium truncate">{item.value}</p>
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
                className="rounded-2xl overflow-hidden relative"
                style={{
                  background: "linear-gradient(135deg, rgba(134,4,148,0.15) 0%, rgba(120,115,208,0.1) 100%)",
                  border: "1px solid rgba(139,92,246,0.25)",
                }}
              >
                <div className="px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-bold mb-1">Upgrade to Pro</h3>
                    <p className="text-white/50 text-sm">
                      Get 1000 credits/month, HD exports, commercial use, and more.
                    </p>
                  </div>
                  <Link
                    href="/pricing"
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 inline-flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)" }}
                  >
                    View Plans <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
