import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Image, ScanSearch, Scale, Users, Network, Mail, User, Settings, ArrowRight } from "lucide-react";

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
    { id: "all", label: "ALL", uppercase: true },
    { id: "technology", label: "TECHNOLOGY", uppercase: true },
    { id: "science", label: "SCIENCE", uppercase: true },
    { id: "business", label: "BUSINESS", uppercase: true },
    { id: "health", label: "HEALTH", uppercase: true }
  ];

  const quickAccess = [
    { path: "/SearchResults?q=trending&cat=all", label: "Web Search", desc: "Access web search", icon: Search, color: "blue" },
    { path: "/ImageSearch", label: "Image Search", desc: "Access image search", icon: Image, color: "green" },
    { path: "/ReverseSearch", label: "Reverse Search", desc: "Access reverse search", icon: ScanSearch, color: "amber" },
    { path: "/Dashboard", label: "Trial Dashboard", desc: "Access trial dashboard", icon: Scale, color: "red" },
    { path: "/Conclave", label: "Justice Conclave", desc: "Access justice conclave", icon: Users, color: "amber" },
    { path: "/Nexus", label: "NEXUS Command", desc: "Access nexus command", icon: Network, color: "blue" },
    { path: "/Hmail", label: "Hmail", desc: "Access hmail", icon: Mail, color: "purple" },
    { path: "/Profile", label: "Profile", desc: "Access profile", icon: User, color: "accent" },
    { path: "/Settings", label: "Settings", desc: "Access settings", icon: Settings, color: "accent" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="grid-bg"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 relative z-10">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 mb-6">
              <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.4), transparent)' }} />
              <div className="absolute inset-[-6px] rounded-full border" style={{ borderColor: 'rgba(0,212,255,0.15)' }} />
              <div className="absolute inset-[-12px] rounded-full border" style={{ borderColor: 'rgba(0,212,255,0.07)' }} />
              <div className="relative w-28 h-28 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 35% 35%, #1a5a7a, #051020)', border: '2px solid var(--accent)', boxShadow: '0 0 50px rgba(0,212,255,0.6), inset 0 0 30px rgba(0,212,255,0.15)' }}>
                <div className="w-14 h-14 border-2 border-white" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              </div>
            </div>
            <div className="font-hud tracking-[0.3em] text-7xl sm:text-8xl leading-none mb-3" style={{ color: 'var(--accent)', textShadow: '0 0 30px rgba(0,212,255,0.8), 0 0 60px rgba(0,212,255,0.3)' }}>
              MER<span style={{ color: 'var(--accent2)', textShadow: '0 0 30px rgba(255,60,60,0.9)' }}>CY</span>
            </div>
            <div className="font-mono-tech text-[0.55rem] tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>
              AI JUSTICE NETWORK · LOS ANGELES JURISDICTION
            </div>
          </div>
              </div>
              <div className="font-hud tracking-[0.2em] text-6xl" style={{ color: 'var(--accent)', textShadow: '0 0 20px rgba(0,212,255,0.7)' }}>
                MER<span style={{ color: 'var(--accent2)', textShadow: '0 0 20px rgba(255,60,60,0.9)' }}>CY</span>
              </div>
            </div>
            <div className="font-mono-tech text-[0.5rem] tracking-[0.25em]" style={{ color: 'var(--text-dim)' }}>
              AI JUSTICE NETWORK · LOS ANGELES JURISDICTION
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-6">
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
          className="w-full max-w-3xl mx-auto mb-6"
        >
          <div className="relative flex items-center px-6 py-4 border transition-all duration-500 group" style={{ background: 'rgba(6,13,20,0.9)', borderColor: 'var(--border)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
            <Search className="w-5 h-5 shrink-0 transition-colors duration-300 group-focus-within:text-accent" style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER SEARCH QUERY OR INVESTIGATION PARAMETERS..."
              className="flex-1 bg-transparent outline-none px-4 text-base tracking-wider font-mono-tech placeholder:text-[var(--text-dim)]"
              style={{ color: 'var(--text)' }}
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
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="px-6 py-2.5 text-xs font-medium transition-all duration-300 font-mono-tech tracking-[0.15em] border"
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
                  <div className="w-14 h-14 border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `rgba(${item.color === 'blue' ? '59,158,255' : item.color === 'green' ? '39,201,122' : item.color === 'amber' ? '245,166,35' : item.color === 'red' ? '232,57,74' : item.color === 'purple' ? '155,89,255' : '0,212,255'},0.1)`, borderColor: `var(--${item.color === 'accent' ? 'accent' : item.color})` }}>
                    <Icon className="w-7 h-7" style={{ color: `var(--${item.color === 'accent' ? 'accent' : item.color})` }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1 font-body tracking-wide" style={{ color: 'var(--text)' }}>{item.label}</h3>
                    <div className="h-px bg-gradient-to-r from-[var(--border)] to-transparent mb-2"></div>
                    <p className="text-xs font-mono-tech" style={{ color: 'var(--text-dim)' }}>{item.desc}</p>
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