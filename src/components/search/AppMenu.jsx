import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Mail, User, Settings, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", link: "/Home", color: "bg-blue-100 text-blue-600" },
  { icon: Search, label: "Search", link: "/SearchResults?q=trending&cat=all", color: "bg-green-100 text-green-600" },
  { icon: Mail, label: "Hmail", link: "/Hmail", color: "bg-red-100 text-red-600" },
  { icon: User, label: "Profile", link: "/Profile", color: "bg-purple-100 text-purple-600" },
  { icon: Settings, label: "Settings", link: "/Settings", color: "bg-orange-100 text-orange-600" },
  { icon: Sparkles, label: "AI Search", link: "/SearchResults?q=AI+powered&cat=technology", color: "bg-indigo-100 text-indigo-600" },
];

export default function AppMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed top-16 right-4 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-300/50 border border-gray-100 p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">Quick Access</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-3 gap-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.link}
                    onClick={onClose}
                    className="group flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}