import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Inbox, Send, Star, Trash2, Archive, Clock } from "lucide-react";

const emails = [
  {
    sender: "Mercy AI Team",
    subject: "Welcome to Mercy AI!",
    preview: "Thank you for joining Mercy AI. Here's how to get started...",
    time: "10:30 AM",
    unread: true,
  },
  {
    sender: "AI Updates",
    subject: "New AI features available",
    preview: "We've added powerful AI-driven search capabilities to improve...",
    time: "Yesterday",
    unread: true,
  },
  {
    sender: "Security Alert",
    subject: "Your account is secure",
    preview: "We've verified your recent login from a new device...",
    time: "2 days ago",
    unread: false,
  },
];

export default function Hmail() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 pt-8 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/Home"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hmail</h1>
              <p className="text-white/70 mt-1">Your secure email inbox</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-4"
          >
            <div className="space-y-2">
              <SidebarItem icon={Inbox} label="Inbox" count={2} active />
              <SidebarItem icon={Star} label="Starred" />
              <SidebarItem icon={Send} label="Sent" />
              <SidebarItem icon={Archive} label="Archive" />
              <SidebarItem icon={Trash2} label="Trash" />
            </div>
          </motion.div>

          {/* Email List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6"
          >
            <h2 className="font-semibold text-gray-900 mb-4">Primary</h2>
            <div className="space-y-3">
              {emails.map((email, i) => (
                <EmailRow key={i} email={email} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 mb-12">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 text-center">
          <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Full email functionality coming soon! This is a preview interface.
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, count, active = false }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        active
          ? "bg-red-50 text-red-600 font-medium"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-left text-sm">{label}</span>
      {count && (
        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
          {count}
        </span>
      )}
    </button>
  );
}

function EmailRow({ email }) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all border ${
        email.unread ? "bg-blue-50/30 border-blue-100" : "border-transparent"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
        {email.sender[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={`font-medium text-gray-900 ${email.unread ? "font-semibold" : ""}`}>
            {email.sender}
          </p>
          <span className="text-xs text-gray-400">{email.time}</span>
        </div>
        <p className={`text-sm mb-1 ${email.unread ? "font-medium text-gray-900" : "text-gray-600"}`}>
          {email.subject}
        </p>
        <p className="text-sm text-gray-500 truncate">{email.preview}</p>
      </div>
    </div>
  );
}