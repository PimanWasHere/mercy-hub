import React from 'react';

export default function MercyStyles() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600&display=swap');
        
        :root {
          --bg: #020508;
          --panel: #060d14;
          --border: #0e3a52;
          --border-bright: #1a7fa8;
          --accent: #00d4ff;
          --accent2: #ff3c3c;
          --accent3: #00ff88;
          --text: #c8e8f0;
          --text-dim: #4a7a90;
          --warn: #ff9f00;
          --guilty: #ff2244;
          --innocent: #00ff88;
          --font-hud: 'Orbitron', monospace;
          --font-mono: 'Share Tech Mono', monospace;
          --font-body: 'Rajdhani', sans-serif;
          --gold: #ffcc00;
          --judge-blue: #003366;
          --police-blue: #00d4ff;
        }
        
        body {
          background: var(--bg) !important;
          color: var(--text) !important;
          font-family: var(--font-body) !important;
          cursor: default;
        }
        
        /* Scanline overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
          pointer-events: none;
          z-index: 1000;
        }
        
        /* Animated grid background */
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridPulse 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        
        @keyframes gridPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Mercy UI Utilities */
        .font-hud { font-family: var(--font-hud); }
        .font-mono-tech { font-family: var(--font-mono); }
        .font-body { font-family: var(--font-body); }
        
        .text-accent { color: var(--accent); }
        .text-accent2 { color: var(--accent2); }
        .text-accent3 { color: var(--accent3); }
        .text-dim { color: var(--text-dim); }
        .text-warn { color: var(--warn); }
        
        .border-mercy { border-color: var(--border); }
        .border-mercy-bright { border-color: var(--border-bright); }
        
        .bg-panel { background: var(--panel); }
      `}</style>
    </>
  );
}