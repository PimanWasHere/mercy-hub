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
        className={`relative flex items-center bg-white/70 backdrop-blur-2xl border-2 rounded-2xl px-6 py-4 transition-all duration-500 ${isFocused ? 'border-indigo-400 shadow-2xl shadow-indigo-100/50 bg-white/90' : 'border-white/60 shadow-xl shadow-gray-200/30'}`}
      >
        <Sparkles className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isFocused ? 'text-indigo-500' : 'text-gray-300'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask anything, search the web..."
          className="flex-1 bg-transparent outline-none px-4 text-lg text-gray-800 placeholder:text-gray-400 font-light"
          autoFocus={autoFocus}
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:from-indigo-600 hover:to-violet-600 transition-all duration-300 shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </motion.div>
    </form>
  );
}