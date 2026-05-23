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
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center glow-purple group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Char<span className="gradient-text">Gen</span> AI
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-5">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === "/dashboard"
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Auth Buttons */}
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
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/10 hover:border-white/20 transition-all">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-white font-medium">{user.name.split(" ")[0]}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-xl border border-white/10 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl shadow-black/40">
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-white/40" /> Dashboard
                      </Link>
                      <Link href="/library" className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                        <FolderOpen className="w-4 h-4 text-white/40" /> My Assets
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                        <User className="w-4 h-4 text-white/40" /> Profile
                      </Link>
                      <hr className="border-white/10 my-1" />
                      <button
                        onClick={async () => {
                          const supabase = createClient();
                          await supabase.auth.signOut();
                          clearUser();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
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
                    style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)" }}
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
