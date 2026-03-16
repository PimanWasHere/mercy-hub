import React from 'react';

export default function MercyStyles() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
        
        :root {
          --bg: #020508;
          --surface: #0d1117;
          --surface2: #111820;
          --panel: #060d14;
          --border: #0e3a52;
          --border2: #2a4055;
          --border-bright: #1a7fa8;
          --accent: #00d4ff;
          --accent2: #ff3c3c;
          --accent3: #00ff88;
          --text: #c8e8f0;
          --text-dim: #4a7a90;
          --text-mid: #8aa0b4;
          --warn: #ff9f00;
          --amber: #f5a623;
          --amber-dim: #7a5010;
          --red: #e8394a;
          --green: #27c97a;
          --blue: #3b9eff;
          --purple: #9b59ff;
          --guilty: #ff2244;
          --innocent: #00ff88;
          --font-hud: 'Orbitron', monospace;
          --font-mono: 'Share Tech Mono', monospace;
          --font-body: 'Rajdhani', sans-serif;
          --font-disp: 'Bebas Neue', sans-serif;
          --gold: #ffcc00;
          --judge-blue: #003366;
          --police-blue: #00d4ff;
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: var(--border2) var(--bg);
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: var(--bg);
        }
        
        *::-webkit-scrollbar-thumb {
          background: var(--border2);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: var(--border-bright);
        }
        
        body {
          background: var(--bg) !important;
          color: var(--text) !important;
          font-family: var(--font-body) !important;
          cursor: default;
          overflow-x: hidden;
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
        
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Mercy UI Utilities */
        .font-hud { font-family: var(--font-hud); }
        .font-mono-tech { font-family: var(--font-mono); }
        .font-body { font-family: var(--font-body); }
        .font-disp { font-family: var(--font-disp); }
        
        .text-accent { color: var(--accent); }
        .text-accent2 { color: var(--accent2); }
        .text-accent3 { color: var(--accent3); }
        .text-dim { color: var(--text-dim); }
        .text-mid { color: var(--text-mid); }
        .text-warn { color: var(--warn); }
        .text-amber { color: var(--amber); }
        .text-red { color: var(--red); }
        .text-green { color: var(--green); }
        .text-blue { color: var(--blue); }
        .text-purple { color: var(--purple); }
        
        .border-mercy { border-color: var(--border); }
        .border-mercy-bright { border-color: var(--border-bright); }
        .border-mercy2 { border-color: var(--border2); }
        
        .bg-panel { background: var(--panel); }
        .bg-surface { background: var(--surface); }
        .bg-surface2 { background: var(--surface2); }
        
        /* Standard Panel Style */
        .mercy-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .mercy-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border2), transparent);
        }
        
        /* Standard Panel Title */
        .mercy-panel-title {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
          padding: 8px 14px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mercy-panel-title strong {
          color: var(--text-mid);
          font-weight: 500;
        }
        
        /* Status Indicator Dots */
        .mercy-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .mercy-dot.amber { background: var(--amber); box-shadow: 0 0 5px var(--amber); }
        .mercy-dot.red { background: var(--red); box-shadow: 0 0 5px var(--red); }
        .mercy-dot.green { background: var(--green); box-shadow: 0 0 5px var(--green); }
        .mercy-dot.blue { background: var(--blue); box-shadow: 0 0 5px var(--blue); }
        .mercy-dot.purple { background: var(--purple); box-shadow: 0 0 5px var(--purple); }
        .mercy-dot.accent { background: var(--accent); box-shadow: 0 0 5px var(--accent); }
        
        /* Branded Buttons */
        .mercy-btn {
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 10px 20px;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .mercy-btn:hover:not(:disabled) {
          border-color: var(--accent);
          background: rgba(0,212,255,0.05);
          box-shadow: 0 0 15px rgba(0,212,255,0.2);
        }
        .mercy-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .mercy-btn-primary {
          background: rgba(0,212,255,0.1);
          border-color: var(--accent);
          color: var(--accent);
        }
        .mercy-btn-primary:hover:not(:disabled) {
          background: rgba(0,212,255,0.2);
          box-shadow: 0 0 20px rgba(0,212,255,0.4);
        }
        
        /* Input Fields */
        .mercy-input {
          background: rgba(0,212,255,0.03);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: var(--font-mono);
          padding: 10px 12px;
          font-size: 0.7rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .mercy-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 10px rgba(0,212,255,0.1);
        }
        .mercy-input::placeholder {
          color: var(--text-dim);
        }
        
        /* Cards */
        .mercy-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 16px;
          transition: all 0.3s;
          position: relative;
        }
        .mercy-card:hover {
          border-color: var(--border-bright);
          background: var(--surface2);
          box-shadow: 0 0 20px rgba(0,212,255,0.1);
        }
        
        /* Badge */
        .mercy-badge {
          font-family: var(--font-mono);
          font-size: 0.5rem;
          padding: 3px 8px;
          border: 1px solid currentColor;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        
        /* Loading Spinner */
        .mercy-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}