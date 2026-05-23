"use client";

import { useEffect, useState, useCallback } from "react";
import { useUserStore, useAuthStore } from "@/store";
import { Download, Box, Search, Loader2, ArrowRight, Wand2, Image as ImageIcon, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface LibraryAsset {
  id: string;
  type: string;
  prompt: string;
  style: string | null;
  image_url: string | null;
  model_url: string | null;
  model_format: string | null;
  created_at: string;
}

export default function LibraryPage() {
  const { user, isLoading: authLoading } = useUserStore();
  const { openLogin } = useAuthStore();
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [total, setTotal] = useState(0);
  const [previewAsset, setPreviewAsset] = useState<LibraryAsset | null>(null);

  const fetchAssets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter !== "all") params.set("type", typeFilter);

      const res = await fetch(`/api/library?${params.toString()}`);
      const data = await res.json();
      setAssets(data.generations || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch library:", error);
    } finally {
      setLoading(false);
    }
  }, [user, search, typeFilter]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const timer = setTimeout(fetchAssets, 300);
    return () => clearTimeout(timer);
  }, [fetchAssets, user, authLoading]);

  const handleDownload = (asset: LibraryAsset, format: string) => {
    const link = document.createElement("a");
    link.href = `/api/download/${asset.id}?format=${format}`;
    link.download = `chargen-${asset.id}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <ImageIcon className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Asset Library</h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            Sign in to view and manage your generated characters and 3D models.
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

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "5%", paddingRight: "5%" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            My Asset Library
          </h1>
          <p className="text-white/50">
            Manage and download your generated characters.{" "}
            <span className="text-purple-400 font-medium">{total} asset{total !== 1 ? "s" : ""}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30 outline-none transition-all"
              style={{
                background: "rgba(10,0,20,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.4)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>
          {/* Type Filter */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(10,0,20,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {["all", "2d", "3d"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: typeFilter === t ? "rgba(139,92,246,0.2)" : "transparent",
                  color: typeFilter === t ? "#c4b5fd" : "rgba(255,255,255,0.5)",
                  border: typeFilter === t ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                }}
              >
                {t === "all" ? "All" : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white/40 text-sm">Loading assets...</p>
          </div>
        </div>
      ) : assets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Box className="w-10 h-10 text-white/20" />
          </div>
          <p className="text-white/40 text-lg font-medium mb-2">
            {search ? "No matching assets" : "No assets yet"}
          </p>
          <p className="text-white/25 text-sm max-w-sm mx-auto mb-6">
            {search
              ? "Try a different search term or adjust your filters."
              : "Start generating characters to build your personal asset library!"}
          </p>
          {!search && (
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gradient text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)" }}
            >
              <Wand2 className="w-4 h-4" /> Generate Your First Character
            </Link>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {assets.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl glass border border-white/10 overflow-hidden card-hover flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                {asset.image_url ? (
                  <img
                    src={asset.image_url}
                    alt={asset.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                    <Box className="w-12 h-12 text-white/20" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white">
                    {asset.type.toUpperCase()}
                  </span>
                  {asset.model_format && (
                    <span className="px-2.5 py-1 rounded-md bg-purple-900/60 backdrop-blur-md border border-purple-500/30 text-xs font-medium text-purple-200">
                      {asset.model_format.toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <div className="flex gap-2 w-full">
                    {asset.image_url && (
                      <button
                        onClick={() => setPreviewAsset(asset)}
                        className="flex-1 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/20 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                    )}
                    {asset.image_url && (
                      <button
                        onClick={() => handleDownload(asset, "png")}
                        className="flex-1 py-2.5 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)" }}
                      >
                        <Download className="w-3.5 h-3.5" /> PNG
                      </button>
                    )}
                    {asset.model_url && (
                      <button
                        onClick={() =>
                          handleDownload(asset, asset.model_format || "glb")
                        }
                        className="flex-1 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/20 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> 3D
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="p-4 border-t border-white/5 bg-[#0a0a0a]/50">
                <h3 className="text-white font-medium text-sm truncate mb-1">
                  {asset.prompt}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-white/30 text-xs">
                    {new Date(asset.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {asset.style && (
                    <span className="text-purple-400/60 text-xs capitalize">
                      {asset.style.replace("-", " ")}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
            onClick={() => setPreviewAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full max-h-[85vh] flex flex-col glass rounded-2xl border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Image */}
              <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/50 min-h-0">
                {previewAsset.image_url && (
                  <img
                    src={previewAsset.image_url}
                    alt={previewAsset.prompt}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                )}
              </div>
              {/* Info */}
              <div className="p-6 border-t border-white/10">
                <p className="text-white font-medium mb-3">{previewAsset.prompt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">
                      {previewAsset.type.toUpperCase()}
                    </span>
                    {previewAsset.style && (
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/50 capitalize">
                        {previewAsset.style.replace("-", " ")}
                      </span>
                    )}
                    <span className="text-white/30 text-xs">
                      {new Date(previewAsset.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {previewAsset.image_url && (
                      <button
                        onClick={() => handleDownload(previewAsset, "png")}
                        className="px-4 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5"
                        style={{ background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)" }}
                      >
                        <Download className="w-3.5 h-3.5" /> PNG
                      </button>
                    )}
                    {previewAsset.model_url && (
                      <button
                        onClick={() => handleDownload(previewAsset, previewAsset.model_format || "obj")}
                        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-white/20 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> 3D Model
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
