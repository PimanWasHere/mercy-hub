import React from "react";
import { motion } from "framer-motion";
import { Search, Image, User, Clock, Shield, Zap, ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Web Search",
    description: "AI-powered results from across the web",
    icon: Search,
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
    link: "/SearchResults?q=trending+news+today&cat=all"
  },
  {
    title: "Image Search",
    description: "Visual discovery with smart image search",
    icon: Image,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    link: "/ImageSearch?q=beautiful+landscapes"
  },
  {
    title: "Reverse Search",
    description: "Find similar content with image/video",
    icon: ScanSearch,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    link: "/ReverseSearch"
  },
  {
    title: "Profile",
    description: "Manage your account and preferences",
    icon: User,
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    link: "/Profile"
  },
];

const features = [
  { icon: Shield, label: "Private & Secure", desc: "No tracking, no data storage" },
  { icon: Zap, label: "AI-Powered", desc: "Intelligent search results" },
  { icon: Clock, label: "Real-time", desc: "Fresh results from the web" },
];

export default function QuickAccessCards() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.link}>
              <div className="group relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-indigo-50/50 group-hover:to-violet-50/30 transition-all duration-500" />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 bg-gradient-to-r ${card.color} bg-clip-text`} style={{ color: card.color.includes('indigo') ? '#6366f1' : card.color.includes('emerald') ? '#10b981' : '#8b5cf6' }} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-8"
      >
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.label} className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-700">{feat.label}</p>
                <p className="text-xs text-gray-400">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}