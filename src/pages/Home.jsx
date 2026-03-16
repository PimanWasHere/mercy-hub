import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Shield } from "lucide-react";
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/10 rounded-full blur-3xl"
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-200/50">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent">
              Mercy AI
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 font-light max-w-md mx-auto">
            AI-powered search that understands you. Fast, private, intelligent.
          </p>
        </motion.div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} autoFocus />

        {/* Category Pills */}
        <CategoryPills active={category} onSelect={setCategory} />

        {/* Privacy Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-400"
        >
          <Shield className="w-4 h-4" />
          <span>Your searches are private. We don't track or store your data.</span>
        </motion.div>

        {/* Quick Access */}
        <QuickAccessCards />
      </div>
    </div>
  );
}