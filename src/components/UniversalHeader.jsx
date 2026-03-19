import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import MercyLogo from "./MercyLogo";

export default function UniversalHeader({ onMenuToggle }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === "/" || location.pathname === "/Home";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/SearchResults?q=${encodeURIComponent(searchQuery)}&cat=all`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b relative" style={{ background: 'rgba(2,5,8,0.97)', borderColor: 'var(--border)' }}>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/Home" className="flex items-center gap-2 shrink-0 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.25), transparent)' }} />
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ background: 'radial-gradient(circle at 35% 35%, #1a5a7a, #051020)', border: '2px solid var(--accent)', boxShadow: '0 0 20px rgba(0,212,255,0.4), inset 0 0 15px rgba(0,212,255,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V12C4 16.5 7 20.5 12 22C17 20.5 20 16.5 20 12V6L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(0,212,255,0.1)"/>
                <path d="M8 10V16M8 10L12 14L16 10M16 10V16" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l" style={{ borderColor: 'var(--accent)' }}></div>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r" style={{ borderColor: 'var(--accent)' }}></div>
          </div>
          <span className="font-bold hidden sm:block font-hud tracking-[0.2em] text-lg transition-all" style={{ color: 'var(--accent)', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>
            MER<span style={{ color: 'var(--accent2)' }}>CY</span>
          </span>
        </Link>

        {/* Search Bar — hidden on home page since home has its own */}
        {!isHomePage && (
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative flex items-center px-3 py-2 border transition-all group" style={{ background: 'rgba(6,13,20,0.8)', borderColor: 'var(--border)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-bright)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-dim)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search investigations, cases, evidence..."
                className="flex-1 bg-transparent outline-none px-3 text-xs font-mono-tech placeholder:text-[var(--text-dim)]"
                style={{ color: 'var(--text)' }}
              />
              {searchQuery && (
                <button type="submit" className="font-mono-tech text-[0.55rem] tracking-wider px-2 py-0.5 border transition-all" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  EXEC
                </button>
              )}
            </div>
          </form>
        )}

        {isHomePage && <div className="flex-1"></div>}

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {[{to:'/Dashboard',label:'TRIAL'},{to:'/Conclave',label:'CONCLAVE'},{to:'/Nexus',label:'NEXUS'}].map(({to, label}) => (
            <Link key={to} to={to} className="px-3 py-1 font-mono-tech text-[0.55rem] tracking-wider border transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(0,212,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; }}
            >{label}</Link>
          ))}
        </div>

        {/* Menu Button */}
        <button
          onClick={onMenuToggle}
          className="w-9 h-9 flex items-center justify-center border transition-all"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.background = 'rgba(0,212,255,0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--panel)'; }}
        >
          <Menu className="w-4 h-4" style={{ color: 'var(--text)' }} />
        </button>
      </div>
    </header>
  );
}