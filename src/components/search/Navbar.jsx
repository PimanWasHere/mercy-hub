import React from "react";
import { Link } from "react-router-dom";
import { Search, Image, User, Sparkles } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar({ showSearch = false, searchQuery = "", onSearch }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/Home" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 hidden sm:block">Nova</span>
        </Link>

        {showSearch && (
          <div className="flex-1 max-w-xl">
            <SearchBar compact initialQuery={searchQuery} onSearch={onSearch} />
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <Link
            to="/SearchResults?q=trending+today&cat=all"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <Link
            to="/ImageSearch?q=trending"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Images</span>
          </Link>
          <Link
            to="/Profile"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}