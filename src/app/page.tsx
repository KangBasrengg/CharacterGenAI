"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Wand2, Download, Layers } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{ paddingTop: "160px", paddingBottom: "100px" }}
      >
        <div style={{ textAlign: "center", paddingLeft: "10%", paddingRight: "10%" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", fontSize: "14px", color: "#c4b5fd", fontWeight: 500, marginBottom: "40px", background: "rgba(10,0,20,0.6)", border: "1px solid rgba(139,92,246,0.3)", backdropFilter: "blur(20px)" }}
          >
            <Sparkles style={{ width: "16px", height: "16px" }} />
            <span>CharGen AI v1.0 is now live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, color: "white", marginBottom: "32px", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            Create Stunning <br />
            <span className="gradient-text">3D Characters</span> with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", margin: "0 auto 48px auto", lineHeight: 1.7 }}
          >
            The ultimate AI-powered character studio for game developers,
            animators, and VTubers. Generate production-ready assets in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}
          >
            <Link
              href="/generate"
              className="btn-gradient"
              style={{ padding: "16px 40px", borderRadius: "12px", color: "white", fontWeight: 700, fontSize: "18px", display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
            >
              Start Generating <ArrowRight style={{ width: "20px", height: "20px" }} />
            </Link>
            <Link
              href="/library"
              className="glass"
              style={{ padding: "16px 40px", borderRadius: "12px", color: "white", fontWeight: 700, fontSize: "18px", display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              View Gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "white", marginBottom: "20px" }}>
              Everything you need to create
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", maxWidth: "640px", margin: "0 auto", lineHeight: 1.7 }}>
              A complete pipeline from text prompt to 3D model ready for your
              favorite game engine.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            {[
              {
                icon: Wand2,
                title: "AI 2D Generation",
                desc: "Describe your character with text prompts and our AI will generate highly detailed concept art with cinematic lighting.",
                color: "#c084fc",
              },
              {
                icon: Layers,
                title: "2D to 3D Conversion",
                desc: "Transform your 2D concepts into fully realized 3D models with proper topology in a single click.",
                color: "#60a5fa",
              },
              {
                icon: Download,
                title: "Export Anywhere",
                desc: "Download as GLB, FBX, or OBJ. Ready to drop into Unity, Unreal Engine, Roblox, or your favorite 3D software.",
                color: "#a78bfa",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass card-hover"
                style={{ padding: "32px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px auto",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: feature.color,
                  }}
                >
                  <feature.icon style={{ width: "28px", height: "28px" }} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "white", marginBottom: "16px" }}>
                  {feature.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ paddingTop: "40px", paddingBottom: "100px" }}>
        <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <div
            className="glass glow-purple"
            style={{ borderRadius: "24px", overflow: "hidden", textAlign: "center", padding: "80px 40px", border: "1px solid rgba(139,92,246,0.3)", position: "relative" }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(88,28,135,0.5), rgba(91,33,182,0.5))", mixBlendMode: "overlay" }} />
            <div style={{ position: "relative", zIndex: 10 }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "white", marginBottom: "28px" }}>
                Ready to bring your characters to life?
              </h2>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", margin: "0 auto 40px auto", lineHeight: 1.7 }}>
                Join thousands of creators building the next generation of games
                and animations with CharGen AI.
              </p>
              <Link
                href="/generate"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 40px",
                  borderRadius: "12px",
                  background: "white",
                  color: "#3b0764",
                  fontWeight: 700,
                  fontSize: "18px",
                  textDecoration: "none",
                  boxShadow: "0 20px 25px -5px rgba(255,255,255,0.1)",
                }}
              >
                Start for free today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
