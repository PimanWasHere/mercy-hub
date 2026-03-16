import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Image, User, Shield, Grid3x3, Mic, Settings } from "lucide-react";
import SearchBar from "./SearchBar";
import AppMenu from "./AppMenu";

export default function Navbar({ showSearch = false, searchQuery = "", onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-b border-cyan-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/Home" className="flex items-center gap-2 shrink-0">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-pulse" />
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 border border-cyan-400/30">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-bold text-cyan-400 hidden sm:block font-mono uppercase tracking-wider">Mercy AI</span>
        </Link>

        {showSearch && (
          <div className="flex-1 max-w-2xl">
            <SearchBar compact initialQuery={searchQuery} onSearch={onSearch} />
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <button className="w-9 h-9 rounded hover:bg-cyan-500/10 flex items-center justify-center transition-colors group border border-transparent hover:border-cyan-500/30">
            <Mic className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>
          <Link
            to="/Settings"
            className="w-9 h-9 rounded hover:bg-cyan-500/10 flex items-center justify-center transition-colors group border border-transparent hover:border-cyan-500/30"
          >
            <Settings className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </Link>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded hover:bg-cyan-500/10 flex items-center justify-center transition-colors group border border-transparent hover:border-cyan-500/30"
          >
            <Grid3x3 className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>
          <Link
            to="/Profile"
            className="w-9 h-9 rounded bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all ml-2 border border-cyan-400/30"
          >
            U
          </Link>
        </div>
      </div>

      <AppMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  );
}