"use client";

import { useEffect, useState, useCallback } from "react";
import { useUserStore, useAuthStore } from "@/store";
import { Download, Box, Search, Loader2, ArrowRight, Wand2, Eye, Sparkles, X } from "lucide-react";
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
    if (!user) return;
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

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: active ? "rgba(139,92,246,0.2)" : "transparent",
    color: active ? "#c4b5fd" : "rgba(255,255,255,0.5)",
    border: active ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
  });

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

  // Not logged in
  if (!user) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "80px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "16px", paddingRight: "16px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", maxWidth: "448px" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", fontSize: "14px", color: "#c4b5fd", fontWeight: 500, marginBottom: "24px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", backdropFilter: "blur(12px)" }}>
            <Sparkles style={{ width: "16px", height: "16px" }} /> Asset Library
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "white", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Your <span className="gradient-text">Assets</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "32px", lineHeight: 1.7 }}>
            Sign in to view and manage your generated characters and 3D models.
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

  return (
    <div style={{ paddingTop: "128px", paddingBottom: "80px", paddingLeft: "5%", paddingRight: "5%", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "28px", marginBottom: "40px" }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", fontSize: "14px", color: "#c4b5fd", fontWeight: 500, marginBottom: "16px", background: "rgba(10,0,20,0.6)", border: "1px solid rgba(139,92,246,0.3)", backdropFilter: "blur(20px)" }}>
              <Sparkles style={{ width: "16px", height: "16px" }} /> Collection
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "white", marginBottom: "12px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              My <span className="gradient-text">Asset Library</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>
              Manage and download your generated characters.{" "}
              <span style={{ color: "#c084fc", fontWeight: 500 }}>{total} asset{total !== 1 ? "s" : ""}</span>
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "16px",
              background: "rgba(10,0,20,0.58)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", minWidth: "200px", flex: "1 1 auto" }}>
              <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "rgba(255,255,255,0.3)" }} />
              <input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "40px",
                  paddingRight: "16px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  color: "white",
                  background: "rgba(10,0,20,0.6)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.4)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
            {/* Type Filter */}
            <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {["all", "2d", "3d"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  style={filterBtnStyle(typeFilter === t)}
                >
                  {t === "all" ? "All" : t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div style={{ minHeight: "560px" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "96px", paddingBottom: "96px" }}>
              <div style={{ textAlign: "center" }}>
                <Loader2 style={{ width: "32px", height: "32px", color: "#c084fc", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading assets...</p>
              </div>
            </div>
          ) : assets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", paddingTop: "112px", paddingBottom: "112px" }}
            >
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <Box style={{ width: "40px", height: "40px", color: "rgba(255,255,255,0.2)" }} />
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", fontWeight: 500, marginBottom: "8px" }}>
                {search ? "No matching assets" : "No assets yet"}
              </p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "14px", maxWidth: "384px", margin: "0 auto 24px" }}>
                {search
                  ? "Try a different search term or adjust your filters."
                  : "Start generating characters to build your personal asset library!"}
              </p>
              {!search && (
                <Link
                  href="/generate"
                  className="btn-gradient"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "12px", color: "white", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
                >
                  <Wand2 style={{ width: "16px", height: "16px" }} /> Generate Your First Character
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", paddingBottom: "40px" }}
            >
              {assets.map((asset, i) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-hover"
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    background: "rgba(10,0,20,0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 25px 50px rgba(30,0,50,0.15)",
                  }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                    {asset.image_url ? (
                      <img
                        src={asset.image_url}
                        alt={asset.prompt}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box style={{ width: "48px", height: "48px", color: "rgba(255,255,255,0.2)" }} />
                      </div>
                    )}
                    {/* Badges */}
                    <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "8px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "12px", fontWeight: 500, color: "white" }}>
                        {asset.type.toUpperCase()}
                      </span>
                      {asset.model_format && (
                        <span style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(88,28,135,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(168,85,247,0.3)", fontSize: "12px", fontWeight: 500, color: "#e9d5ff" }}>
                          {asset.model_format.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div
                      className="asset-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        padding: "16px",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
                    >
                      <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                        {asset.image_url && (
                          <button
                            onClick={() => setPreviewAsset(asset)}
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "8px",
                              background: "rgba(255,255,255,0.1)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              cursor: "pointer",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                          >
                            <Eye style={{ width: "14px", height: "14px" }} /> Preview
                          </button>
                        )}
                        {asset.image_url && (
                          <button
                            onClick={() => handleDownload(asset, "png")}
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)",
                              border: "none",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              cursor: "pointer",
                              transition: "opacity 0.2s ease",
                            }}
                          >
                            <Download style={{ width: "14px", height: "14px" }} /> PNG
                          </button>
                        )}
                        {asset.model_url && (
                          <button
                            onClick={() => handleDownload(asset, asset.model_format || "glb")}
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "8px",
                              background: "rgba(255,255,255,0.1)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              cursor: "pointer",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                          >
                            <Download style={{ width: "14px", height: "14px" }} /> 3D
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(10,10,10,0.55)" }}>
                    <h3 style={{ color: "white", fontWeight: 600, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "8px" }}>
                      {asset.prompt}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                        {new Date(asset.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {asset.style && (
                        <span style={{ color: "rgba(192,132,252,0.6)", fontSize: "12px", textTransform: "capitalize" }}>
                          {asset.style.replace("-", " ")}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {previewAsset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewAsset(null)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(12px)",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "768px",
                  width: "100%",
                  maxHeight: "85vh",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "rgba(10,0,20,0.9)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setPreviewAsset(null)}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                >
                  <X style={{ width: "18px", height: "18px" }} />
                </button>
                {/* Preview Image */}
                <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", minHeight: 0 }}>
                  {previewAsset.image_url && (
                    <img
                      src={previewAsset.image_url}
                      alt={previewAsset.prompt}
                      style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain" }}
                    />
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: "24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <p style={{ color: "white", fontWeight: 500, marginBottom: "12px" }}>{previewAsset.prompt}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", fontSize: "12px", fontWeight: 500, color: "#c4b5fd" }}>
                        {previewAsset.type.toUpperCase()}
                      </span>
                      {previewAsset.style && (
                        <span style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>
                          {previewAsset.style.replace("-", " ")}
                        </span>
                      )}
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                        {new Date(previewAsset.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {previewAsset.image_url && (
                        <button
                          onClick={() => handleDownload(previewAsset, "png")}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)",
                            border: "none",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                          }}
                        >
                          <Download style={{ width: "14px", height: "14px" }} /> PNG
                        </button>
                      )}
                      {previewAsset.model_url && (
                        <button
                          onClick={() => handleDownload(previewAsset, previewAsset.model_format || "obj")}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                            transition: "background 0.2s ease",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                        >
                          <Download style={{ width: "14px", height: "14px" }} /> 3D Model
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
    </div>
  );
}
