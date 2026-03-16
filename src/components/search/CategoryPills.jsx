import React from "react";
import { motion } from "framer-motion";
import { Cpu, FlaskConical, Briefcase, Heart, Globe } from "lucide-react";

const categories = [
  { id: "all", label: "All", icon: Globe },
  { id: "technology", label: "Technology", icon: Cpu },
  { id: "science", label: "Science", icon: FlaskConical },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "health", label: "Health", icon: Heart },
];

export default function CategoryPills({ active = "all", onSelect, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto">
        {categories.slice(1).map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="flex flex-wrap justify-center gap-2 mt-6"
    >
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-300 font-mono uppercase tracking-wider ${
              isActive
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/50 border border-cyan-400/30"
                : "bg-slate-800/60 backdrop-blur-sm text-slate-400 hover:bg-slate-800 hover:shadow-md border border-slate-700/50 hover:border-cyan-500/30"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        );
      })}
    </motion.div>
  );
}