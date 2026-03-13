import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Image, User, Sparkles, Grid3x3, Mic, Settings } from "lucide-react";
import SearchBar from "./SearchBar";
import AppMenu from "./AppMenu";

export default function Navbar({ showSearch = false, searchQuery = "", onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/Home" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 hidden sm:block">Nova</span>
        </Link>

        {showSearch && (
          <div className="flex-1 max-w-2xl">
            <SearchBar compact initialQuery={searchQuery} onSearch={onSearch} />
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors group">
            <Mic className="w-4 h-4 text-gray-500 group-hover:text-indigo-500 transition-colors" />
          </button>
          <Link
            to="/Settings"
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors group"
          >
            <Settings className="w-4 h-4 text-gray-500 group-hover:text-indigo-500 transition-colors" />
          </Link>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors group"
          >
            <Grid3x3 className="w-4 h-4 text-gray-500 group-hover:text-indigo-500 transition-colors" />
          </button>
          <Link
            to="/Profile"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-200/50 transition-all ml-2"
          >
            U
          </Link>
        </div>
      </div>

      <AppMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  );
}