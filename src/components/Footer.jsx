import React from "react";

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--border)', background: 'rgba(2,5,8,0.95)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="font-mono-tech text-[0.5rem] tracking-[0.2em]" style={{ color: 'var(--text-dim)' }}>
          MERCY AI JUSTICE NETWORK · LOS ANGELES JURISDICTION · BUILD 7.4.1
        </div>
        <div className="font-mono-tech text-[0.5rem] tracking-[0.15em]" style={{ color: 'var(--text-dim)' }}>
          © 2026 MERCY SYSTEMS · ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}