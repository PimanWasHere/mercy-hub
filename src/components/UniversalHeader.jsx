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
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b relative" style={{ background: 'rgba(2,5,8,0.95)', borderColor: 'var(--border)' }}>
      <div className="absolute bottom-[-2px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/Home" className="flex items-center gap-2 shrink-0">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3), transparent)' }} />
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 35% 35%, #1a5a7a, #051020)', border: '2px solid var(--accent)', boxShadow: '0 0 20px rgba(0,212,255,0.4), inset 0 0 15px rgba(0,212,255,0.1)' }}>
              <div className="w-4 h-4 border-2 border-white" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
            </div>
          </div>
          <span className="font-bold hidden sm:block font-hud tracking-[0.2em] text-lg" style={{ color: 'var(--accent)', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>
            MER<span style={{ color: 'var(--accent2)' }}>CY</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
          <div className="relative flex items-center px-4 py-2 border transition-all group" style={{ background: 'rgba(6,13,20,0.6)', borderColor: 'var(--border)' }}>
            <Search className="w-4 h-4 shrink-0 transition-colors group-focus-within:text-accent" style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investigations, cases, evidence..."
              className="flex-1 bg-transparent outline-none px-3 text-sm font-mono-tech"
              style={{ color: 'var(--text)' }}
            />
          </div>
        </form>

        {/* Menu Button */}
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 flex items-center justify-center border transition-all ml-auto"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
        >
          <Menu className="w-5 h-5" style={{ color: 'var(--text)' }} />
        </button>
      </div>
    </header>
  );
}