"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    <div style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "5%", paddingRight: "5%" }}>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h1>
        <p className="text-lg text-white/50 mb-10">Choose the perfect plan for your creative needs. Upgrade, downgrade, or cancel anytime.</p>
        
        {/* Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#0a0a0a] border border-white/10 glass">
          <button 
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button 
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${annual ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
            onClick={() => setAnnual(true)}
          >
            Annually <span className="text-purple-400 ml-1">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative rounded-3xl p-8 glass card-hover ${
              plan.highlight ? "border-purple-500/50 glow-purple shadow-xl" : "border-white/10"
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-xs font-bold text-white shadow-lg">
                MOST POPULAR
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-sm text-white/50 mb-6 h-10">{plan.desc}</p>
            
            <div className="mb-6">
              <span className="text-4xl font-black text-white">${annual && plan.price !== "0" ? Math.floor(parseInt(plan.price) * 0.8) : plan.price}</span>
              <span className="text-white/50">/month</span>
            </div>
            
            <p className="text-sm font-semibold text-purple-300 mb-8 pb-8 border-b border-white/10">{plan.credits}</p>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-400 shrink-0" />
                  <span className="text-sm text-white/80">{feature}</span>
                </li>
              ))}
              {plan.notIncluded.map((feature) => (
                <li key={feature} className="flex items-start gap-3 opacity-50">
                  <X className="w-5 h-5 text-white/30 shrink-0" />
                  <span className="text-sm text-white/50 line-through">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.highlight ? "default" : "outline"} 
              className={`w-full py-6 mt-auto ${
                plan.highlight 
                  ? "btn-gradient text-white" 
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {plan.button}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
