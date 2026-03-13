import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";

export default function ResultCard({ result, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group bg-white/70 backdrop-blur-xl border border-gray-100 rounded-xl p-5 hover:bg-white hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
          <Globe className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
              {result.title}
            </h3>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
          </div>
          {result.url && (
            <p className="text-xs text-indigo-500/70 mb-2 truncate">{result.url}</p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {result.snippet}
          </p>
        </div>
      </div>
    </motion.div>
  );
}