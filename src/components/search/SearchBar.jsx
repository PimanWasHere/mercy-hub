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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`relative flex items-center bg-slate-900/90 backdrop-blur-2xl border-2 rounded-lg px-6 py-4 transition-all duration-500 ${isFocused ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20 bg-slate-900' : 'border-slate-700/50 shadow-xl shadow-black/30'}`}
      >
        <Search className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isFocused ? 'text-cyan-400' : 'text-slate-500'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="ENTER SEARCH QUERY OR INVESTIGATION PARAMETERS..."
          className="flex-1 bg-transparent outline-none px-4 text-lg text-cyan-50 placeholder:text-slate-600 font-mono uppercase tracking-wide"
          autoFocus={autoFocus}
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-2.5 rounded font-medium text-sm hover:bg-cyan-500 transition-all duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/50 uppercase tracking-wider font-mono"
        >
          <ArrowRight className="w-4 h-4" />
          Execute
        </button>
      </motion.div>
    </form>
  );
}