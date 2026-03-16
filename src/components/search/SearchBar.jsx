import React, { useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar({ initialQuery = "", onSearch, compact = false, autoFocus = false }) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className={`flex items-center bg-white border rounded-full px-4 py-2.5 transition-all duration-300 ${isFocused ? 'border-indigo-300 shadow-md shadow-indigo-100/30' : 'border-gray-300 shadow-sm'}`}>
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search"
            className="flex-1 bg-transparent outline-none px-3 text-sm text-gray-800 placeholder:text-gray-400"
            autoFocus={autoFocus}
          />
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative flex items-center px-6 py-4 transition-all duration-500 border"
        style={{
          background: isFocused ? 'var(--panel)' : 'rgba(6,13,20,0.9)',
          borderColor: isFocused ? 'var(--border-bright)' : 'var(--border)',
          boxShadow: isFocused ? '0 0 30px rgba(0,212,255,0.2)' : '0 10px 40px rgba(0,0,0,0.5)'
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
        <Search className="w-5 h-5 shrink-0 transition-colors duration-300" style={{ color: isFocused ? 'var(--accent)' : 'var(--text-dim)' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="ENTER SEARCH QUERY OR INVESTIGATION PARAMETERS..."
          className="flex-1 bg-transparent outline-none px-4 text-lg uppercase tracking-wider font-mono-tech"
          style={{ color: 'var(--text)' }}
          autoFocus={autoFocus}
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 font-medium text-sm uppercase tracking-wider font-mono-tech transition-all duration-300 border"
          style={{
            background: 'rgba(0,212,255,0.1)',
            borderColor: 'var(--accent)',
            color: 'var(--accent)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.2)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <ArrowRight className="w-4 h-4" />
          Execute
        </button>
      </motion.div>
    </form>
  );
}