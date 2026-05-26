import { Activity } from "lucide-react";

export default function StatusPage() {
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
              background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(21,128,61,0.1) 100%)",
              border: "1px solid rgba(34,197,94,0.3)",
              marginBottom: "24px",
              boxShadow: "0 10px 30px rgba(34,197,94,0.1)",
            }}>
              <Activity style={{ width: "32px", height: "32px", color: "#4ade80" }} />
            </div>
            <h1 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.02em" }}>
              System Status
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              Current operational status of CharGen AI systems.
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "16px", fontWeight: 500 }}>Web Application</span>
                <span style={{ color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: "100px", fontSize: "13px" }}>Operational</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "16px", fontWeight: 500 }}>Replicate API (2D Generation)</span>
                <span style={{ color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: "100px", fontSize: "13px" }}>Operational</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "16px", fontWeight: 500 }}>Tripo API (3D Conversion)</span>
                <span style={{ color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: "100px", fontSize: "13px" }}>Operational</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: 500 }}>Database & Storage</span>
                <span style={{ color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: "100px", fontSize: "13px" }}>Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
