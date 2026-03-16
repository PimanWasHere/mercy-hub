import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Bell,
  Palette,
  Globe,
  Search,
  Moon,
  Lock,
  Eye,
  History,
  Database,
  Zap,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const [settings, setSettings] = useState({
    safeSearch: true,
    darkMode: false,
    notifications: true,
    saveHistory: true,
    autoSuggest: true,
    privateMode: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 pt-8 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/Home"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-white/70 mt-2">Customize your Mercy AI experience</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-12">
        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Privacy & Security</h2>
              <p className="text-sm text-gray-500">Control your data and privacy</p>
            </div>
          </div>

          <div className="space-y-4">
            <SettingRow
              icon={Lock}
              title="Safe Search"
              description="Filter explicit content from results"
              checked={settings.safeSearch}
              onToggle={() => toggleSetting("safeSearch")}
            />
            <SettingRow
              icon={Eye}
              title="Private Mode"
              description="Don't save searches or browsing history"
              checked={settings.privateMode}
              onToggle={() => toggleSetting("privateMode")}
            />
            <SettingRow
              icon={History}
              title="Save History"
              description="Keep track of your searches"
              checked={settings.saveHistory}
              onToggle={() => toggleSetting("saveHistory")}
            />
          </div>
        </motion.div>

        {/* Search Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Search className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Search Preferences</h2>
              <p className="text-sm text-gray-500">Customize how you search</p>
            </div>
          </div>

          <div className="space-y-4">
            <SettingRow
              icon={Zap}
              title="Auto-Suggest"
              description="Show search suggestions as you type"
              checked={settings.autoSuggest}
              onToggle={() => toggleSetting("autoSuggest")}
            />
            <SettingRow
              icon={Globe}
              title="Region"
              description="United States"
              isLink
            />
            <SettingRow
              icon={Database}
              title="Results per page"
              description="10 results"
              isLink
            />
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Palette className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-500">Personalize the look and feel</p>
            </div>
          </div>

          <div className="space-y-4">
            <SettingRow
              icon={Moon}
              title="Dark Mode"
              description="Switch to dark theme"
              checked={settings.darkMode}
              onToggle={() => toggleSetting("darkMode")}
            />
            <SettingRow
              icon={Bell}
              title="Notifications"
              description="Get updates and alerts"
              checked={settings.notifications}
              onToggle={() => toggleSetting("notifications")}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, title, description, checked, onToggle, isLink = false }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Icon className="w-5 h-5 text-gray-400" />
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {!isLink && onToggle && (
        <Switch checked={checked} onCheckedChange={onToggle} />
      )}
      {isLink && (
        <button className="text-sm text-indigo-500 hover:text-indigo-600 font-medium">
          Change
        </button>
      )}
    </div>
  );
}