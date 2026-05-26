"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, Zap, ChevronDown, User, LayoutDashboard, FolderOpen, LogOut } from "lucide-react";
import { useAuthStore, useUserStore } from "@/store";
import { createClient } from "@/lib/supabase/client";

const publicLinks = [
  { href: "/generate", label: "AI Generator" },
  { href: "/library", label: "Asset Library" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openLogin, openRegister } = useAuthStore();
  const { user, clearUser } = useUserStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-black/95 backdrop-blur-xl border-white/10 shadow-lg shadow-black/30"
            : "bg-black/80 backdrop-blur-xl border-transparent"
        }`}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto", paddingLeft: "5%", paddingRight: "5%", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", height: "80px" }}>
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center glow-purple group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">
                  Char<span className="gradient-text">Gen</span> AI
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center justify-center gap-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    background: pathname === link.href ? "rgba(255,255,255,0.08)" : "transparent",
                    color: pathname === link.href ? "white" : "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== link.href) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.href) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    background: pathname === "/dashboard" ? "rgba(255,255,255,0.08)" : "transparent",
                    color: pathname === "/dashboard" ? "white" : "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== "/dashboard") {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== "/dashboard") {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                    }
                  }}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right Side Controls */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
              {/* Auth Buttons (Desktop) */}
              <div className="hidden md:flex items-center gap-5">
                {user ? (
                  <div className="flex items-center gap-5">
                    {/* Credits badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-purple-500/30">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-xs font-semibold text-white">{user.credits} credits</span>
                    </div>
                    {/* User menu */}
                    <div className="relative group">
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "6px 12px",
                          borderRadius: "10px",
                          background: "rgba(10,0,20,0.6)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          color: "white",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                      >
                        <div style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "white",
                          boxShadow: "0 2px 8px rgba(134,4,148,0.4)",
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
                        <ChevronDown style={{ width: "14px", height: "14px", color: "rgba(255,255,255,0.4)" }} />
                      </button>
                      {/* Dropdown Menu */}
                      <div
                        className="opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "100%",
                          marginTop: "8px",
                          width: "220px",
                          background: "rgba(8,0,18,0.95)",
                          backdropFilter: "blur(30px)",
                          border: "1px solid rgba(139,92,246,0.25)",
                          borderRadius: "16px",
                          overflow: "hidden",
                          transition: "all 0.2s ease",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(134,4,148,0.1)",
                        }}
                      >
                        {/* User info header */}
                        <div style={{
                          padding: "14px 16px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "white", marginBottom: "2px" }}>{user.name}</p>
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Free Plan</p>
                        </div>
                        {/* Menu items */}
                        <div style={{ padding: "6px" }}>
                          {[
                            { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "#c084fc" },
                            { href: "/library", icon: FolderOpen, label: "My Assets", color: "#60a5fa" },
                            { href: "/profile", icon: User, label: "Profile", color: "#a78bfa" },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "10px 12px",
                                borderRadius: "10px",
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "rgba(255,255,255,0.75)",
                                textDecoration: "none",
                                transition: "all 0.15s ease",
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                                (e.currentTarget as HTMLElement).style.color = "white";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                              }}
                            >
                              <div style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "8px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: item.color,
                                flexShrink: 0,
                              }}>
                                <item.icon style={{ width: "15px", height: "15px" }} />
                              </div>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        {/* Separator */}
                        <div style={{
                          height: "1px",
                          margin: "2px 14px",
                          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
                        }} />
                        {/* Sign out */}
                        <div style={{ padding: "6px" }}>
                          <button
                            onClick={async () => {
                              const supabase = createClient();
                              await supabase.auth.signOut();
                              clearUser();
                            }}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 12px",
                              borderRadius: "10px",
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#f87171",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
                              (e.currentTarget as HTMLElement).style.color = "#fca5a5";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                              (e.currentTarget as HTMLElement).style.color = "#f87171";
                            }}
                          >
                            <div style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "8px",
                              background: "rgba(239,68,68,0.06)",
                              border: "1px solid rgba(239,68,68,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}>
                              <LogOut style={{ width: "15px", height: "15px" }} />
                            </div>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={openLogin}
                      className="px-6 py-2.5 text-sm font-medium text-white/80 rounded-2xl hover:text-white transition-colors"
                    >
                      Log In
                    </button>
                    <button
                      onClick={openRegister}
                      className="px-6 py-2.5 rounded-2xl btn-gradient text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)", border: "none", boxShadow: "0 4px 15px rgba(134,4,148,0.3)" }}
                    >
                      Get Started Free
                    </button>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-strong border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-2">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
                      Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
                      Profile
                    </Link>
                  </>
                )}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => { openLogin(); setMobileOpen(false); }}
                    className="w-full px-4 py-2.5 rounded-lg border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { openRegister(); setMobileOpen(false); }}
                    className="w-full px-4 py-2.5 rounded-lg btn-gradient text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)" }}
                  >
                    Get Started Free
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
