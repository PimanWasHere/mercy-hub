import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Inbox, Send, Star, Trash2, Archive, Clock, AlertCircle } from "lucide-react";

const emails = [
  {
    sender: "MERCY Hub Command",
    subject: "SYSTEM INITIALIZATION COMPLETE",
    preview: "All investigative modules are online. Evidence analysis pipeline is ready for new case assignments.",
    time: "10:30",
    unread: true,
    tag: "SYSTEM",
    tagColor: "var(--accent)"
  },
  {
    sender: "AI Analysis Unit",
    subject: "NEW AI CAPABILITIES DEPLOYED",
    preview: "Enhanced pattern recognition algorithms integrated into the NEXUS pipeline. Detection accuracy improved by 34%.",
    time: "Yesterday",
    unread: true,
    tag: "UPDATE",
    tagColor: "var(--accent3)"
  },
  {
    sender: "Security Oversight",
    subject: "ACCOUNT VERIFICATION CONFIRMED",
    preview: "Biometric authentication successful. Agent clearance level validated for LA-04 jurisdiction operations.",
    time: "2d ago",
    unread: false,
    tag: "SECURITY",
    tagColor: "var(--warn)"
  },
];

const sidebarItems = [
  { icon: Inbox, label: "INBOX", count: 2 },
  { icon: Star, label: "FLAGGED" },
  { icon: Send, label: "SENT" },
  { icon: Archive, label: "ARCHIVE" },
  { icon: Trash2, label: "DELETED" },
];

export default function Hmail() {
  const [activeFolder, setActiveFolder] = useState("INBOX");
  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <div className="min-h-screen relative flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="grid-bg"></div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 relative z-10 flex flex-col flex-grow">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/Home" className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-wider transition-colors" style={{ color: 'var(--text-dim)' }}>
            <ArrowLeft className="w-4 h-4" />
            HOME
          </Link>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }}></div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span className="font-hud tracking-[0.2em] text-xl" style={{ color: 'var(--accent)' }}>HMAIL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 flex-grow">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mercy-panel h-fit">
            <div className="mercy-panel-title"><span className="mercy-dot accent"></span><strong>FOLDERS</strong></div>
            <div className="p-2 space-y-0.5">
              {sidebarItems.map(({ icon: Icon, label, count }) => (
                <button
                  key={label}
                  onClick={() => setActiveFolder(label)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 border transition-all"
                  style={{
                    background: activeFolder === label ? 'rgba(0,212,255,0.1)' : 'transparent',
                    borderColor: activeFolder === label ? 'var(--accent)' : 'transparent',
                    color: activeFolder === label ? 'var(--accent)' : 'var(--text-mid)',
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-mono-tech text-xs tracking-wider flex-1 text-left">{label}</span>
                  {count && (
                    <span className="font-mono-tech text-[0.5rem] px-1.5 py-0.5" style={{ background: 'var(--accent)', color: '#000' }}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Email List */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mercy-panel flex flex-col">
            <div className="mercy-panel-title justify-between">
              <div className="flex items-center gap-2"><span className="mercy-dot amber"></span><strong>{activeFolder}</strong></div>
              <span style={{ color: 'var(--text-dim)' }}>{emails.length} MESSAGES</span>
            </div>
            <div className="flex-1">
              {emails.map((email, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedEmail(selectedEmail === i ? null : i)}
                  className="border-b cursor-pointer transition-all"
                  style={{ borderColor: 'var(--border)', background: selectedEmail === i ? 'rgba(0,212,255,0.05)' : email.unread ? 'rgba(0,212,255,0.02)' : 'transparent' }}
                  onMouseEnter={(e) => { if (selectedEmail !== i) e.currentTarget.style.background = 'rgba(0,212,255,0.04)'; }}
                  onMouseLeave={(e) => { if (selectedEmail !== i) e.currentTarget.style.background = email.unread ? 'rgba(0,212,255,0.02)' : 'transparent'; }}
                >
                  <div className="flex items-start gap-4 p-4">
                    <div className="w-10 h-10 border flex items-center justify-center font-hud text-sm shrink-0" style={{ background: 'rgba(0,212,255,0.1)', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                      {email.sender[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-body font-semibold text-sm" style={{ color: email.unread ? 'var(--text)' : 'var(--text-mid)' }}>{email.sender}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="mercy-badge text-[0.45rem]" style={{ color: email.tagColor, borderColor: email.tagColor }}>{email.tag}</span>
                          <span className="font-mono-tech text-[0.55rem]" style={{ color: 'var(--text-dim)' }}>{email.time}</span>
                          {email.unread && <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}></div>}
                        </div>
                      </div>
                      <div className="font-mono-tech text-xs mb-1" style={{ color: email.unread ? 'var(--text-mid)' : 'var(--text-dim)' }}>{email.subject}</div>
                      <div className="font-body text-xs truncate" style={{ color: 'var(--text-dim)' }}>{email.preview}</div>
                    </div>
                  </div>
                  {selectedEmail === i && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{email.preview}</p>
                        <p className="font-body text-sm leading-relaxed mt-2" style={{ color: 'var(--text-mid)' }}>This is a preview of the email interface. Full email functionality will be available in the next system update.</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <div className="p-4 border-t flex items-center gap-3" style={{ borderColor: 'var(--border)', background: 'rgba(255,159,0,0.03)' }}>
              <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--warn)' }} />
              <span className="font-mono-tech text-[0.58rem] tracking-wider" style={{ color: 'var(--text-dim)' }}>
                FULL EMAIL FUNCTIONALITY COMING IN NEXT SYSTEM UPDATE · PREVIEW MODE ACTIVE
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}