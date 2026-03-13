import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle2,
  Search,
  Clock,
  LogOut,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

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
    : "?";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 pt-8 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Link to="/Home" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.full_name || "Loading..."}</h1>
              <p className="text-white/70 text-sm">{user?.email || ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-12">
        {/* Account Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-6"
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Account Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow icon={User} label="Full Name" value={user?.full_name || "N/A"} />
            <InfoRow icon={Mail} label="Email" value={user?.email || "N/A"} />
            <InfoRow icon={Shield} label="Role" value={user?.role || "User"} />
            <InfoRow icon={Calendar} label="Member Since" value={user?.created_date ? format(new Date(user.created_date), "MMM d, yyyy") : "N/A"} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <StatusBadge label="Status" value="Active" color="emerald" />
            <StatusBadge label="Type" value={user?.role || "User"} color="indigo" />
            <StatusBadge label="Verified" value="Yes" color="emerald" />
          </div>
        </motion.div>

        {/* Recent Searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-6"
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Searches</h2>
          {searchHistory.length > 0 ? (
            <div className="space-y-2">
              {searchHistory.map((item) => (
                <Link
                  key={item.id}
                  to={`/SearchResults?q=${encodeURIComponent(item.query)}&cat=${item.category || "all"}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Search className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                      {item.query}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.created_date ? format(new Date(item.created_date), "MMM d, h:mm a") : ""}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No searches yet. Start exploring!</p>
            </div>
          )}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl py-5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80">
      <Icon className="w-4 h-4 text-gray-400" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ label, value, color }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <div className="text-center p-3 rounded-xl bg-gray-50/80">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-semibold inline-block px-2 py-0.5 rounded-md ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}