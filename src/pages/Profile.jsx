import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Search, Clock, LogOut, Sparkles, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: searchHistory = [] } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: () => base44.entities.SearchHistory.list("-created_date", 10),
    initialData: [],
  });

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)' }}>
      <div className="grid-bg"></div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <Link to="/Home" className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-wider mb-8 transition-colors hover:text-accent" style={{ color: 'var(--text-dim)' }}>
          <ArrowLeft className="w-4 h-4" />
          BACK TO HOME
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mercy-panel p-6 mb-6"
        >
          <div className="mercy-panel-title mb-4"><span className="mercy-dot accent"></span><strong>AGENT PROFILE</strong></div>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 border-2 flex items-center justify-center font-hud text-2xl shrink-0" style={{ background: 'rgba(0,212,255,0.1)', borderColor: 'var(--accent)', color: 'var(--accent)', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
              {initials}
            </div>
            <div>
              <div className="font-hud text-2xl tracking-wider mb-1" style={{ color: 'var(--accent)' }}>{user?.full_name || "LOADING..."}</div>
              <div className="font-mono-tech text-xs tracking-wider" style={{ color: 'var(--text-dim)' }}>{user?.email || "—"}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="mercy-dot green"></span>
                <span className="font-mono-tech text-[0.6rem] tracking-wider" style={{ color: 'var(--green)' }}>AGENT ACTIVE</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mercy-panel mb-6"
        >
          <div className="mercy-panel-title"><span className="mercy-dot blue"></span><strong>ACCOUNT DETAILS</strong></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'var(--border)' }}>
            <InfoRow icon={User} label="FULL NAME" value={user?.full_name || "N/A"} />
            <InfoRow icon={Mail} label="EMAIL ADDRESS" value={user?.email || "N/A"} />
            <InfoRow icon={Shield} label="CLEARANCE LEVEL" value={(user?.role || "USER").toUpperCase()} />
            <InfoRow icon={Calendar} label="ENROLLED SINCE" value={user?.created_date ? format(new Date(user.created_date), "MMM d, yyyy") : "N/A"} />
          </div>
        </motion.div>

        {/* Recent Searches */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mercy-panel mb-6"
        >
          <div className="mercy-panel-title"><span className="mercy-dot amber"></span><strong>RECENT INVESTIGATIONS</strong></div>
          <div className="p-4">
            {searchHistory.length > 0 ? (
              <div className="space-y-1">
                {searchHistory.map((item) => (
                  <Link
                    key={item.id}
                    to={`/SearchResults?q=${encodeURIComponent(item.query)}&cat=${item.category || "all"}`}
                    className="flex items-center gap-3 px-3 py-2.5 border border-transparent transition-all group"
                    style={{ background: 'rgba(0,212,255,0.02)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.background = 'rgba(0,212,255,0.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'rgba(0,212,255,0.02)'; }}
                  >
                    <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-dim)' }} />
                    <span className="flex-1 font-mono-tech text-sm truncate" style={{ color: 'var(--text)' }}>{item.query}</span>
                    <span className="font-mono-tech text-[0.55rem] shrink-0" style={{ color: 'var(--text-dim)' }}>
                      {item.created_date ? format(new Date(item.created_date), "MMM d, h:mm a") : ""}
                    </span>
                    <Clock className="w-3 h-3 shrink-0" style={{ color: 'var(--text-dim)' }} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Sparkles className="w-8 h-8" style={{ color: 'var(--border2)' }} />
                <p className="font-mono-tech text-xs tracking-wider" style={{ color: 'var(--text-dim)' }}>NO INVESTIGATIONS ON RECORD</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button
            onClick={handleLogout}
            className="w-full py-3 border font-mono-tech text-xs tracking-widest uppercase transition-all"
            style={{ background: 'rgba(232,57,74,0.05)', borderColor: 'var(--red)', color: 'var(--red)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(232,57,74,0.15)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(232,57,74,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(232,57,74,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <LogOut className="w-4 h-4 inline-block mr-2" />
            TERMINATE SESSION
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-4" style={{ background: 'var(--panel)' }}>
      <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--text-dim)' }} />
      <div>
        <p className="font-mono-tech text-[0.5rem] tracking-wider mb-0.5" style={{ color: 'var(--text-dim)' }}>{label}</p>
        <p className="font-body text-sm font-medium" style={{ color: 'var(--text)' }}>{value}</p>
      </div>
    </div>
  );
}