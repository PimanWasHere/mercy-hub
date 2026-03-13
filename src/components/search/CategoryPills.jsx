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

export default function CategoryPills({ active = "all", onSelect }) {
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
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200/50"
                : "bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-md border border-white/80"
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