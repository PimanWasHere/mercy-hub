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
      <div className="grid-bg"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 relative z-10">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.2), transparent)' }} />
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 35% 35%, #1a5a7a, #051020)', border: '2px solid var(--accent)', boxShadow: '0 0 30px rgba(0,212,255,0.4), inset 0 0 20px rgba(0,212,255,0.1)' }}>
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-6xl sm:text-7xl font-black tracking-[0.3em] mb-2" style={{ fontFamily: 'var(--font-hud)', color: 'var(--accent)', textShadow: '0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.3)' }}>
            MER<span style={{ color: 'var(--accent2)', textShadow: '0 0 20px rgba(255,60,60,0.8)' }}>CY</span>
          </h1>
          <p className="text-xs tracking-[0.25em] font-mono-tech" style={{ color: 'var(--text-dim)' }}>
            CAPITAL COURT AI JUSTICE NETWORK · LOS ANGELES JURISDICTION · BUILD 7.4.1
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="px-4 py-1.5 border text-xs tracking-wider font-mono-tech relative overflow-hidden" style={{ borderColor: 'var(--border-bright)', color: 'var(--accent3)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,255,136,0.1)] to-transparent animate-[sweep_3s_ease-in-out_infinite]" style={{ left: '-100%' }}></div>
              ● SYSTEM ACTIVE
            </div>
            <div className="px-4 py-1.5 border text-xs tracking-wider font-mono-tech" style={{ borderColor: 'var(--border-bright)', color: 'var(--warn)' }}>
              ⚡ EVIDENCE ANALYSIS READY
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} autoFocus />

        {/* Category Pills */}
        <CategoryPills active={category} onSelect={setCategory} />

        {/* Quick Access */}
        <QuickAccessCards />
      </div>
    </div>
  );
}