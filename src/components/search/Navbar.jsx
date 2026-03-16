import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Image, User, Shield, Grid3x3, Mic, Settings } from "lucide-react";
import SearchBar from "./SearchBar";
import AppMenu from "./AppMenu";

export default function Navbar({ showSearch = false, searchQuery = "", onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b relative" style={{ background: 'rgba(2,5,8,0.95)', borderColor: 'var(--border)' }}>
      <div className="absolute bottom-[-2px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/Home" className="flex items-center gap-2 shrink-0">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3), transparent)' }} />
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 35% 35%, #1a5a7a, #051020)', border: '2px solid var(--accent)', boxShadow: '0 0 20px rgba(0,212,255,0.4), inset 0 0 15px rgba(0,212,255,0.1)' }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-bold hidden sm:block font-hud tracking-[0.2em] text-lg" style={{ color: 'var(--accent)', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>
            MER<span style={{ color: 'var(--accent2)' }}>CY</span>
          </span>
        </Link>

        {showSearch && (
          <div className="flex-1 max-w-2xl">
            <SearchBar compact initialQuery={searchQuery} onSearch={onSearch} />
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <button className="w-9 h-9 flex items-center justify-center transition-all group border border-transparent hover:border-[var(--border-bright)] hover:bg-[rgba(0,212,255,0.05)]">
            <Mic className="w-4 h-4 transition-colors" style={{ color: 'var(--text-dim)' }} />
          </button>
          <Link
            to="/Settings"
            className="w-9 h-9 flex items-center justify-center transition-all group border border-transparent hover:border-[var(--border-bright)] hover:bg-[rgba(0,212,255,0.05)]"
          >
            <Settings className="w-4 h-4 transition-colors" style={{ color: 'var(--text-dim)' }} />
          </Link>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center transition-all group border border-transparent hover:border-[var(--border-bright)] hover:bg-[rgba(0,212,255,0.05)]"
          >
            <Grid3x3 className="w-4 h-4 transition-colors" style={{ color: 'var(--text-dim)' }} />
          </button>
          <Link
            to="/Profile"
            className="w-9 h-9 flex items-center justify-center text-white font-semibold text-sm transition-all ml-2 border font-hud"
            style={{ 
              background: 'radial-gradient(circle at 35% 35%, #1a5a7a, #051020)',
              borderColor: 'var(--accent)',
              boxShadow: '0 0 15px rgba(0,212,255,0.3)'
            }}
          >
            U
          </Link>
        </div>
      </div>

      <AppMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  );
}