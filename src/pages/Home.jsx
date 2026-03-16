import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import SearchBar from "../components/search/SearchBar";
import CategoryPills from "../components/search/CategoryPills";
import QuickAccessCards from "../components/search/QuickAccessCards";

export default function Home() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");

  const handleSearch = (query) => {
    navigate(`/SearchResults?q=${encodeURIComponent(query)}&cat=${category}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        {/* Scanning line effect */}
        <motion.div
          animate={{ y: [-1000, 1000] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent blur-xl"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/50 border-2 border-cyan-400/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent font-mono">
              MERCY AI
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 font-light max-w-md mx-auto font-mono uppercase tracking-wide text-sm">
            Advanced Intelligence System • Evidence Analysis • Investigation Protocol
          </p>
        </motion.div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} autoFocus />

        {/* Category Pills */}
        <CategoryPills active={category} onSelect={setCategory} />

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center justify-center gap-4 mt-8 text-sm text-cyan-400/80 font-mono"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="uppercase tracking-wider">System Active</span>
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <span className="text-slate-500 uppercase tracking-wider">Analysis Ready</span>
        </motion.div>

        {/* Quick Access */}
        <QuickAccessCards />
      </div>
    </div>
  );
}