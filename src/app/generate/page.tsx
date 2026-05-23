"use client";

import { useState } from "react";
import { useUserStore, useGenerationStore } from "@/store";
import { useAuthStore } from "@/store";
import { motion } from "framer-motion";
import { Wand2, Download, RefreshCw, Box, Lock, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

type Style = "stylized-realism" | "anime" | "low-poly" | "cyberpunk";
type Gender = "male" | "female" | "androgynous";
type PoseMood = "heroic-epic" | "combat-aggressive" | "relaxed-neutral";

export default function GeneratePage() {
  const { user, updateCredits } = useUserStore();
  const { openLogin } = useAuthStore();
  const { isGenerating, setIsGenerating, is3DConverting, setIs3DConverting } = useGenerationStore();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<Style>("stylized-realism");
  const [gender, setGender] = useState<Gender>("male");
  const [pose, setPose] = useState<PoseMood>("heroic-epic");
  const [result, setResult] = useState<{ id: string; imageUrl: string } | null>(null);
  const [conversionStatus, setConversionStatus] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openLogin(); return; }
    if (user.credits < 1) { toast.error("Not enough credits!"); return; }

    setIsGenerating(true);
    setResult(null);
    setModelUrl(null);
    setConversionStatus(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, gender, pose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult({ id: data.id, imageUrl: data.imageUrl });
      updateCredits(data.creditsRemaining);
      toast.success("Character generated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConvertTo3D = async () => {
    if (!user || !result) return;
    if (user.credits < 5) { toast.error("Not enough credits! 3D conversion requires 5 credits."); return; }
    setIs3DConverting(true);
    setConversionStatus("Converting to 3D model...");
    try {
      const res = await fetch("/api/convert3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: result.imageUrl, generationId: result.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "3D conversion failed");
      updateCredits(data.creditsRemaining);
      setModelUrl(data.modelUrl);
      setConversionStatus("3D model ready!");
      toast.success("3D model is ready for download!");
    } catch (error) {
      setConversionStatus("Conversion failed. Credits refunded.");
      toast.error(error instanceof Error ? error.message : "3D conversion failed.");
    } finally {
      setIs3DConverting(false);
    }
  };

  const handleDownloadPNG = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = `/api/download/${result.id}?format=png`;
    link.download = `chargen-${result.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload3D = (format: string) => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = `/api/download/${result.id}?format=${format}`;
    link.download = `chargen-${result.id}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(255,255,255,0.4)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
  };

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: disabled ? "rgba(255,255,255,0.3)" : "white",
    fontSize: "13px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.5 : 1,
  });

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "5%", paddingRight: "5%" }} className="min-h-screen">
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "8px" }}>AI Generator</h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>Create your custom 2D concept art and convert it to 3D.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px", alignItems: "start" }}>
        {/* Left Panel */}
        <form
          onSubmit={handleGenerate}
          style={{
            background: "rgba(10,0,20,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "28px",
          }}
        >
          {/* Prompt */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "10px", letterSpacing: "0.03em" }}>
              ✨ Character Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A cybernetic samurai with glowing blue accents, holding an energy katana, cinematic lighting..."
              required
              style={{
                width: "100%",
                height: "120px",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontSize: "14px",
                lineHeight: 1.6,
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          {/* Style + Gender */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value as Style)} style={selectStyle}>
                <option value="stylized-realism" style={{ background: "#1a0a2e", color: "white" }}>Stylized Realism</option>
                <option value="anime" style={{ background: "#1a0a2e", color: "white" }}>Anime / Cel Shaded</option>
                <option value="low-poly" style={{ background: "#1a0a2e", color: "white" }}>Low Poly</option>
                <option value="cyberpunk" style={{ background: "#1a0a2e", color: "white" }}>Cyberpunk</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} style={selectStyle}>
                <option value="male" style={{ background: "#1a0a2e", color: "white" }}>Male</option>
                <option value="female" style={{ background: "#1a0a2e", color: "white" }}>Female</option>
                <option value="androgynous" style={{ background: "#1a0a2e", color: "white" }}>Androgynous</option>
              </select>
            </div>
          </div>

          {/* Pose */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Pose & Mood</label>
            <select value={pose} onChange={(e) => setPose(e.target.value as PoseMood)} style={selectStyle}>
              <option value="heroic-epic" style={{ background: "#1a0a2e", color: "white" }}>Heroic Stance (Epic)</option>
              <option value="combat-aggressive" style={{ background: "#1a0a2e", color: "white" }}>Combat Ready (Aggressive)</option>
              <option value="relaxed-neutral" style={{ background: "#1a0a2e", color: "white" }}>Relaxed (Neutral)</option>
            </select>
          </div>

          {/* Credits */}
          {user && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "16px", padding: "0 4px" }}>
              <span>Cost: 1 credit</span>
              <span>Balance: {user.credits} credits</span>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)", marginBottom: "20px" }} />

          {/* Submit */}
          {!user ? (
            <button
              type="button"
              onClick={openLogin}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(139,92,246,0.4)",
                background: "rgba(139,92,246,0.1)",
                color: "#c084fc",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <Lock style={{ width: "16px", height: "16px" }} /> Login to Generate
            </button>
          ) : (
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                background: (isGenerating || !prompt.trim()) ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg, #860494 0%, #7873d0 100%)",
                color: "white",
                fontSize: "15px",
                fontWeight: 700,
                cursor: (isGenerating || !prompt.trim()) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: (isGenerating || !prompt.trim()) ? "none" : "0 8px 30px rgba(134,4,148,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              {isGenerating ? (
                <><RefreshCw style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} /> Generating...</>
              ) : (
                <><Wand2 style={{ width: "18px", height: "18px" }} /> Generate (1 Credit)</>
              )}
            </button>
          )}
        </form>

        {/* Right Panel - Preview */}
        <div
          style={{
            background: "rgba(10,0,20,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            minHeight: "600px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle glow */}
          <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(134,4,148,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Actions Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", position: "relative", zIndex: 10 }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>Preview</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              {modelUrl ? (
                <button onClick={() => handleDownload3D("obj")} style={btnStyle(false)}>
                  <Download style={{ width: "14px", height: "14px" }} /> Download 3D
                </button>
              ) : (
                <button onClick={handleConvertTo3D} disabled={!result || is3DConverting} style={btnStyle(!result || is3DConverting)}>
                  {is3DConverting ? (
                    <><Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} /> Converting...</>
                  ) : (
                    <><Box style={{ width: "14px", height: "14px" }} /> Convert to 3D (5 Credits)</>
                  )}
                </button>
              )}
              <button onClick={handleDownloadPNG} disabled={!result} style={btnStyle(!result)}>
                <Download style={{ width: "14px", height: "14px" }} /> Download PNG
              </button>
            </div>
          </div>

          {/* Conversion Status */}
          {conversionStatus && (
            <div style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
              fontSize: "13px",
              color: "#c4b5fd",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              position: "relative",
              zIndex: 10,
            }}>
              {is3DConverting ? (
                <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite", flexShrink: 0 }} />
              ) : conversionStatus.includes("failed") ? (
                <AlertCircle style={{ width: "16px", height: "16px", flexShrink: 0, color: "#f87171" }} />
              ) : (
                <Box style={{ width: "16px", height: "16px", flexShrink: 0, color: "#4ade80" }} />
              )}
              {conversionStatus}
            </div>
          )}

          {/* Canvas Area */}
          <div style={{
            flex: 1,
            borderRadius: "16px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            {isGenerating ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", border: "3px solid rgba(139,92,246,0.2)", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: "#c4b5fd", fontSize: "15px", fontWeight: 600 }}>Summoning your character...</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "8px" }}>This may take 10-30 seconds</p>
              </div>
            ) : result ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={result.imageUrl}
                alt="Generated character"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)" }}>
                <Wand2 style={{ width: "48px", height: "48px", margin: "0 auto 16px", opacity: 0.4 }} />
                <p style={{ fontSize: "15px" }}>Your generated character will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
