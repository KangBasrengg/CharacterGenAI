"use client";

import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { FaGithub, FaDiscord, FaYoutube } from "react-icons/fa";

const footerLinks = {
  Product: [
    { label: "AI Generator", href: "/generate" },
    { label: "Asset Library", href: "/library" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api-reference" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/KangBasrengg", label: "GitHub" },
  { icon: FaDiscord, href: "https://discord.com/users/cinn10_", label: "Discord" },
  { icon: FaYoutube, href: "https://www.youtube.com/@cinsss1936", label: "YouTube" },
];

export function Footer() {
  return (
    <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Main footer content */}
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingTop: "72px", paddingBottom: "0", paddingLeft: "5%", paddingRight: "5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px" }}>
          {/* Brand Column */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "20px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #860494 0%, #7873d0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(134,4,148,0.3)",
              }}>
                <Sparkles style={{ width: "18px", height: "18px", color: "white" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "18px", color: "white" }}>
                Char<span className="gradient-text">Gen</span> AI
              </span>
            </Link>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: "320px", marginBottom: "28px" }}>
              AI-powered character creation platform for game developers, animators, VTubers, and creative professionals.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(10,0,20,0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "white";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(134,4,148,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <social.icon style={{ width: "16px", height: "16px" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "white", marginBottom: "20px", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                {category}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.4)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: "56px",
          paddingTop: "28px",
          paddingBottom: "28px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
            © 2026 CharGen AI. All rights reserved.
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "5px" }}>
            Made with <Heart style={{ width: "12px", height: "12px", color: "#c084fc", fill: "#c084fc" }} /> by Muhammad Nuril
          </p>
        </div>
      </div>
    </footer>
  );
}
