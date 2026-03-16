import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Image, ScanSearch, Scale, Users, Network, Mail, User, Settings, ArrowRight } from "lucide-react";
import MercyLogo from "../components/MercyLogo";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/SearchResults?q=${encodeURIComponent(query)}&cat=${category}`);
    }
  };

  const categories = [
    { id: "all", label: "All" },
    { id: "technology", label: "Technology" },
    { id: "science", label: "Science" },
    { id: "business", label: "Business" },
    { id: "health", label: "Health" }
  ];

  const quickAccess = [
    { path: "/SearchResults?q=trending&cat=all", label: "Web Search", icon: Search, color: "blue" },
    { path: "/ImageSearch", label: "Image Search", icon: Image, color: "green" },
    { path: "/ReverseSearch", label: "Reverse Search", icon: ScanSearch, color: "amber" },
    { path: "/Dashboard", label: "Trial Dashboard", icon: Scale, color: "red" },
    { path: "/Conclave", label: "Justice Conclave", icon: Users, color: "amber" },
    { path: "/Nexus", label: "NEXUS Command", icon: Network, color: "blue" },
    { path: "/Hmail", label: "Hmail", icon: Mail, color: "purple" },
    { path: "/Profile", label: "Profile", icon: User, color: "accent" },
    { path: "/Settings", label: "Settings", icon: Settings, color: "accent" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="grid-bg"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 relative z-10">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <MercyLogo size="lg" showSubtext />
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="px-5 py-2 border font-mono-tech text-xs tracking-wider relative overflow-hidden" style={{ borderColor: 'var(--border-bright)', color: 'var(--accent3)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,255,136,0.1)] to-transparent animate-[sweep_3s_ease-in-out_infinite]" style={{ left: '-100%' }}></div>
              ● SYSTEM ACTIVE
            </div>
            <div className="px-5 py-2 border font-mono-tech text-xs tracking-wider" style={{ borderColor: 'var(--border-bright)', color: 'var(--warn)' }}>
              ⚡ EVIDENCE ANALYSIS READY
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-3xl mx-auto mb-8"
        >
          <div className="relative flex items-center px-6 py-4 border transition-all duration-500 group" style={{ background: 'rgba(6,13,20,0.9)', borderColor: 'var(--border)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
            <Search className="w-5 h-5 shrink-0 transition-colors duration-300 group-focus-within:text-accent" style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER SEARCH QUERY OR INVESTIGATION PARAMETERS..."
              className="flex-1 bg-transparent outline-none px-4 text-lg uppercase tracking-wider font-mono-tech"
              style={{ color: 'var(--text)' }}
              autoFocus
            />
            <button
              type="submit"
              className="mercy-btn-primary flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Execute
            </button>
          </div>
        </motion.form>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="px-5 py-2 text-xs font-medium transition-all duration-300 font-mono-tech uppercase tracking-[0.15em] border"
              style={{
                background: category === cat.id ? 'var(--accent)' : 'rgba(6,13,20,0.6)',
                borderColor: category === cat.id ? 'rgba(0,212,255,0.3)' : 'var(--border)',
                color: category === cat.id ? '#000' : 'var(--text)',
                boxShadow: category === cat.id ? '0 0 20px rgba(0,212,255,0.5)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Quick Access Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
        >
          {quickAccess.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                onClick={() => navigate(item.path)}
                className="mercy-card cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `rgba(${item.color === 'blue' ? '59,158,255' : item.color === 'green' ? '39,201,122' : item.color === 'amber' ? '245,166,35' : item.color === 'red' ? '232,57,74' : item.color === 'purple' ? '155,89,255' : '0,212,255'},0.1)`, borderColor: `var(--${item.color === 'accent' ? 'accent' : item.color})` }}>
                    <Icon className="w-6 h-6" style={{ color: `var(--${item.color === 'accent' ? 'accent' : item.color})` }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1 font-hud tracking-wider" style={{ color: 'var(--text)' }}>{item.label}</h3>
                    <div className="h-px bg-gradient-to-r from-[var(--border)] to-transparent mb-2"></div>
                    <p className="text-xs font-mono-tech" style={{ color: 'var(--text-dim)' }}>Access {item.label.toLowerCase()}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}