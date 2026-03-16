import React from "react";

export default function MercyLogo({ size = "md", showSubtext = true }) {
  const sizes = {
    sm: { logo: 32, text: "text-lg", iconSize: 16 },
    md: { logo: 40, text: "text-2xl", iconSize: 20 },
    lg: { logo: 80, text: "text-6xl", iconSize: 40 }
  };
  
  const s = sizes[size];
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative" style={{ width: s.logo, height: s.logo }}>
          {/* Outer glow */}
          <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.4), transparent)' }} />
          
          {/* Main circle */}
          <div 
            className="relative rounded-full flex items-center justify-center"
            style={{ 
              width: s.logo, 
              height: s.logo,
              background: 'radial-gradient(circle at 35% 35%, #1a5a7a, #051020)', 
              border: '2px solid var(--accent)', 
              boxShadow: '0 0 25px rgba(0,212,255,0.5), inset 0 0 20px rgba(0,212,255,0.15)' 
            }}
          >
            {/* Custom M shield icon */}
            <svg width={s.iconSize} height={s.iconSize} viewBox="0 0 24 24" fill="none">
              {/* Shield outline */}
              <path 
                d="M12 2L4 6V12C4 16.5 7 20.5 12 22C17 20.5 20 16.5 20 12V6L12 2Z" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeLinejoin="round"
                fill="rgba(0,212,255,0.1)"
              />
              {/* M letter */}
              <path 
                d="M8 10V16M8 10L12 14L16 10M16 10V16" 
                stroke="var(--accent)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {/* Corner accents */}
          <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: 'var(--accent)' }}></div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: 'var(--accent)' }}></div>
          <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: 'var(--accent)' }}></div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: 'var(--accent)' }}></div>
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