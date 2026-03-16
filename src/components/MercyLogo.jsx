import React from "react";
import { Shield } from "lucide-react";

export default function MercyLogo({ size = "md", showSubtext = true }) {
  const sizes = {
    sm: { logo: "w-6 h-6", text: "text-lg", icon: "w-3 h-3" },
    md: { logo: "w-10 h-10", text: "text-2xl", icon: "w-5 h-5" },
    lg: { logo: "w-20 h-20", text: "text-6xl", icon: "w-10 h-10" }
  };
  
  const s = sizes[size];
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative" style={{ width: s.logo.split(' ')[0].replace('w-', '') + 'px', height: s.logo.split(' ')[1].replace('h-', '') + 'px' }}>
          <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3), transparent)' }} />
          <div className={`relative ${s.logo} rounded-full flex items-center justify-center`} style={{ background: 'radial-gradient(circle at 35% 35%, #1a5a7a, #051020)', border: '2px solid var(--accent)', boxShadow: '0 0 20px rgba(0,212,255,0.4), inset 0 0 15px rgba(0,212,255,0.1)' }}>
            <Shield className={s.icon + " text-white"} />
          </div>
        </div>
        <div className={`font-hud tracking-[0.2em] ${s.text}`} style={{ color: 'var(--accent)', textShadow: '0 0 15px rgba(0,212,255,0.6)' }}>
          MER<span style={{ color: 'var(--accent2)', textShadow: '0 0 15px rgba(255,60,60,0.8)' }}>CY</span>
        </div>
      </div>
      {showSubtext && size === "lg" && (
        <div className="font-mono-tech text-[0.5rem] tracking-[0.25em]" style={{ color: 'var(--text-dim)' }}>
          AI JUSTICE NETWORK · LOS ANGELES JURISDICTION
        </div>
      )}
    </div>
  );
}