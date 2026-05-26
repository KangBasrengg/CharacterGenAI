import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <Shield style={{ width: "32px", height: "32px", color: "#c084fc" }} />
            </div>
            <h1 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.02em" }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              Last updated: May 26, 2026
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
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>1. Information We Collect</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                We collect information you provide directly to us, such as when you create an account, use our AI generation services, or communicate with us. This includes your email address, generated assets, and usage data.
              </p>
              
              <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)", margin: "16px 0" }} />

              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>2. How We Use Your Information</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you about your account.
              </p>

              <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)", margin: "16px 0" }} />

              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>3. Data Security</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
