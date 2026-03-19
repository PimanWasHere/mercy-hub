import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Bell, Globe, Search, Moon, Lock, Eye, History, Database, Zap } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    safeSearch: true,
    darkMode: true,
    notifications: true,
    saveHistory: true,
    autoSuggest: true,
    privateMode: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)' }}>
      <div className="grid-bg"></div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Link to="/Home" className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-wider mb-8 transition-colors hover:text-accent" style={{ color: 'var(--text-dim)' }}>
          <ArrowLeft className="w-4 h-4" />
          BACK TO HOME
        </Link>

        <div className="mb-8">
          <h1 className="font-hud text-3xl tracking-[0.2em] mb-1" style={{ color: 'var(--accent)', textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>SYSTEM CONFIG</h1>
          <p className="font-mono-tech text-xs tracking-wider" style={{ color: 'var(--text-dim)' }}>CONFIGURE MERCY AI PARAMETERS</p>
        </div>

        {/* Privacy & Security */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mercy-panel mb-4">
          <div className="mercy-panel-title"><span className="mercy-dot red"></span><strong>PRIVACY & SECURITY</strong></div>
          <div className="p-2 space-y-1">
            <SettingRow icon={Lock} title="Safe Search" description="Filter explicit content from results" checked={settings.safeSearch} onToggle={() => toggleSetting("safeSearch")} />
            <SettingRow icon={Eye} title="Private Mode" description="Disable search & browsing history logging" checked={settings.privateMode} onToggle={() => toggleSetting("privateMode")} />
            <SettingRow icon={History} title="Save History" description="Persist search activity records" checked={settings.saveHistory} onToggle={() => toggleSetting("saveHistory")} />
          </div>
        </motion.div>

        {/* Search Preferences */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mercy-panel mb-4">
          <div className="mercy-panel-title"><span className="mercy-dot blue"></span><strong>SEARCH PARAMETERS</strong></div>
          <div className="p-2 space-y-1">
            <SettingRow icon={Zap} title="Auto-Suggest" description="Show query suggestions in real-time" checked={settings.autoSuggest} onToggle={() => toggleSetting("autoSuggest")} />
            <SettingRow icon={Globe} title="Region" description="United States / LA-04 Jurisdiction" isLink />
            <SettingRow icon={Database} title="Results Per Page" description="10 results per query" isLink />
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mercy-panel mb-4">
          <div className="mercy-panel-title"><span className="mercy-dot purple"></span><strong>DISPLAY SETTINGS</strong></div>
          <div className="p-2 space-y-1">
            <SettingRow icon={Moon} title="Dark Mode" description="Enforce dark interface (recommended)" checked={settings.darkMode} onToggle={() => toggleSetting("darkMode")} />
            <SettingRow icon={Bell} title="Notifications" description="Receive system alerts and updates" checked={settings.notifications} onToggle={() => toggleSetting("notifications")} />
            <SettingRow icon={Search} title="Search Animations" description="Enable animated search results" checked={settings.autoSuggest} onToggle={() => toggleSetting("autoSuggest")} />
          </div>
        </motion.div>

        {/* System Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mercy-panel">
          <div className="mercy-panel-title"><span className="mercy-dot accent"></span><strong>SYSTEM INFORMATION</strong></div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "BUILD VERSION", value: "7.4.1" },
              { label: "NETWORK", value: "MERCY-AI" },
              { label: "JURISDICTION", value: "LA-04" },
              { label: "STATUS", value: "OPERATIONAL" },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 border" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
                <div className="font-mono-tech text-[0.5rem] tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>{label}</div>
                <div className="font-mono-tech text-sm" style={{ color: 'var(--accent3)' }}>{value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, title, description, checked, onToggle, isLink = false }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border border-transparent transition-all cursor-pointer group"
      style={{ borderRadius: 0 }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,212,255,0.03)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--text-dim)' }} />
      <div className="flex-1">
        <p className="font-body text-sm font-medium" style={{ color: 'var(--text)' }}>{title}</p>
        <p className="font-mono-tech text-[0.55rem] tracking-wide" style={{ color: 'var(--text-dim)' }}>{description}</p>
      </div>
      {!isLink && onToggle && (
        <button
          onClick={onToggle}
          className="w-10 h-5 relative transition-all shrink-0"
          style={{
            background: checked ? 'var(--accent)' : 'var(--border2)',
            border: `1px solid ${checked ? 'var(--accent)' : 'var(--border2)'}`,
            boxShadow: checked ? '0 0 10px rgba(0,212,255,0.4)' : 'none',
          }}
        >
          <div className="absolute top-0.5 w-4 h-4 transition-all duration-200" style={{
            background: checked ? '#000' : 'var(--text-dim)',
            left: checked ? 'calc(100% - 18px)' : '2px',
          }}></div>
        </button>
      )}
      {isLink && (
        <button className="font-mono-tech text-xs tracking-wider transition-colors" style={{ color: 'var(--accent)' }}>
          MODIFY
        </button>
      )}
    </div>
  );
}