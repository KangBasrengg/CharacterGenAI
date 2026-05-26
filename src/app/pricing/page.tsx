"use client";

import { Check, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "0",
    desc: "For hobbyists and beginners",
    credits: "10 credits / month",
    features: ["Limited generations", "Standard queue", "Watermarked PNG", "Low-poly 3D export", "Community support"],
    notIncluded: ["HD Export", "Commercial use", "API Access"],
    button: "Current Plan",
    highlight: false,
  },
  {
    name: "Pro",
    price: "19",
    desc: "For independent creators and devs",
    credits: "1000 credits / month",
    features: ["Everything in Free", "Unlimited generations", "Fast queue", "HD PNG & 3D Export", "Commercial use", "Private generations"],
    notIncluded: ["API Access", "Team collaboration"],
    button: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Studio",
    price: "89",
    desc: "For teams and game studios",
    credits: "Custom credits",
    features: ["Everything in Pro", "Priority rendering", "API Access", "Team collaboration", "Custom AI models", "Dedicated support"],
    notIncluded: [],
    button: "Contact Sales",
    highlight: false,
  }
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div style={{ paddingTop: "160px", paddingBottom: "96px", paddingLeft: "5%", paddingRight: "5%" }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 64px auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "9999px",
            fontSize: "14px",
            color: "#c4b5fd",
            fontWeight: 500,
            marginBottom: "24px",
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Sparkles style={{ width: "16px", height: "16px" }} /> Pricing Plans
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            color: "white",
            marginBottom: "24px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Simple, <span className="gradient-text">Transparent Pricing</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "40px",
            lineHeight: 1.7,
            maxWidth: "600px",
            margin: "0 auto 40px auto",
          }}
        >
          Choose the perfect plan for your creative needs. Upgrade, downgrade, or cancel anytime.
        </motion.p>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px",
            borderRadius: "12px",
            background: "rgba(10,10,10,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            onClick={() => setAnnual(false)}
            style={{
              padding: "10px 32px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: !annual ? "rgba(255,255,255,0.1)" : "transparent",
              color: !annual ? "white" : "rgba(255,255,255,0.4)",
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{
              padding: "10px 32px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: annual ? "rgba(255,255,255,0.1)" : "transparent",
              color: annual ? "white" : "rgba(255,255,255,0.4)",
            }}
          >
            Annually <span style={{ color: "#a78bfa", marginLeft: "6px" }}>-20%</span>
          </button>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        {plans.map((plan, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            key={plan.name}
            style={{
              position: "relative",
              borderRadius: "24px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              background: "rgba(10,0,20,0.6)",
              backdropFilter: "blur(20px)",
              border: plan.highlight ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: plan.highlight ? "0 0 40px rgba(139,92,246,0.15), 0 25px 50px -12px rgba(0,0,0,0.5)" : "none",
              transform: plan.highlight ? "scale(1.05)" : "scale(1)",
              zIndex: plan.highlight ? 10 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {plan.highlight && (
              <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "4px 16px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                fontSize: "11px",
                fontWeight: 700,
                color: "white",
                boxShadow: "0 4px 12px rgba(139,92,246,0.4)",
                letterSpacing: "0.05em",
              }}>
                MOST POPULAR
              </div>
            )}

            <h3 style={{ fontSize: "24px", fontWeight: 700, color: "white", marginBottom: "8px" }}>{plan.name}</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "24px", minHeight: "40px" }}>{plan.desc}</p>

            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "40px", fontWeight: 900, color: "white" }}>
                ${annual && plan.price !== "0" ? Math.floor(parseInt(plan.price) * 0.8) : plan.price}
              </span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>/month</span>
            </div>

            <p style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#c4b5fd",
              marginBottom: "32px",
              paddingBottom: "32px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}>
              {plan.credits}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
              {plan.features.map((feature) => (
                <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                  <Check style={{ width: "20px", height: "20px", color: "#a78bfa", flexShrink: 0, marginTop: "1px" }} />
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{feature}</span>
                </li>
              ))}
              {plan.notIncluded.map((feature) => (
                <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px", opacity: 0.5 }}>
                  <X style={{ width: "20px", height: "20px", color: "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: "1px" }} />
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "line-through" }}>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (plan.button !== "Current Plan") {
                  window.location.href = "mailto:nurilhuda155@gmail.com?subject=Upgrade%20Inquiry%20for%20CharacterGenAI";
                }
              }}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "32px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: plan.button === "Current Plan" ? "default" : "pointer",
                transition: "all 0.2s ease",
                border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                background: plan.highlight
                  ? "linear-gradient(135deg, #860494 0%, #7873d0 100%)"
                  : "rgba(255,255,255,0.05)",
                color: "white",
                boxShadow: plan.highlight ? "0 8px 24px rgba(134,4,148,0.3)" : "none",
                opacity: plan.button === "Current Plan" ? 0.5 : 1,
              }}
            >
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
