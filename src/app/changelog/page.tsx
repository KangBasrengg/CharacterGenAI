import { History } from "lucide-react";

export default function ChangelogPage() {
  return (
    <div style={{ paddingTop: "128px", paddingBottom: "64px", paddingLeft: "5%", paddingRight: "5%", color: "white" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(134,4,148,0.2) 0%, rgba(120,115,208,0.2) 100%)",
              border: "1px solid rgba(139,92,246,0.3)",
              marginBottom: "24px",
              boxShadow: "0 10px 30px rgba(134,4,148,0.15)",
            }}>
              <History style={{ width: "32px", height: "32px", color: "#c084fc" }} />
            </div>
            <h1 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.02em" }}>
              Changelog
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              Latest updates and improvements to CharGen AI.
            </p>
          </div>

          {/* Content Card */}
          <div style={{
            background: "rgba(10,0,20,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "48px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>v1.0.0 - The Beginning</h2>
                <span style={{ fontSize: "14px", color: "#c084fc", background: "rgba(139,92,246,0.1)", padding: "4px 12px", borderRadius: "100px", border: "1px solid rgba(139,92,246,0.3)" }}>May 26, 2026</span>
              </div>
              <ul style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>✨ <strong>Initial Release:</strong> Launched the CharGen AI platform.</li>
                <li>🎨 <strong>2D Generation:</strong> Added Replicate integration for high-quality anime character generation.</li>
                <li>🧊 <strong>3D Conversion:</strong> Added Tripo AI integration for converting 2D images to 3D models.</li>
                <li>📱 <strong>UI Redesign:</strong> Implemented a beautiful, consistent dark glassmorphic design system across all pages.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}
