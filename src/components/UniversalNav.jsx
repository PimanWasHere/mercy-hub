import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Search, Image, ScanSearch, User, Settings, Mail, Scale, Users, Network } from "lucide-react";
import MercyLogo from "./MercyLogo";

export default function UniversalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/Home", label: "Home", icon: Home },
    { path: "/SearchResults?q=trending&cat=all", label: "Web Search", icon: Search },
    { path: "/ImageSearch", label: "Image Search", icon: Image },
    { path: "/ReverseSearch", label: "Reverse Search", icon: ScanSearch },
    { path: "/Dashboard", label: "Trial Dashboard", icon: Scale },
    { path: "/Conclave", label: "Justice Conclave", icon: Users },
    { path: "/Nexus", label: "NEXUS Command", icon: Network },
    { path: "/Hmail", label: "Hmail", icon: Mail },
    { path: "/Profile", label: "Profile", icon: User },
    { path: "/Settings", label: "Settings", icon: Settings }
  ];

  const isActive = (path) => {
    if (path === "/Home") return location.pathname === "/" || location.pathname === "/Home";
    return location.pathname === path || location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[999] w-12 h-12 flex items-center justify-center border transition-all"
        style={{
          background: 'var(--panel)',
          borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
          boxShadow: isOpen ? '0 0 20px rgba(0,212,255,0.3)' : 'none'
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        ) : (
          <Menu className="w-5 h-5" style={{ color: 'var(--text)' }} />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[997] bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[998] w-80 border-l transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <MercyLogo size="sm" showSubtext={false} />
          <div className="font-mono-tech text-[0.5rem] tracking-wider mt-2" style={{ color: 'var(--text-dim)' }}>
            SYSTEM NAVIGATION
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 border transition-all group"
                  style={{
                    background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
                    borderColor: active ? 'var(--accent)' : 'var(--border)',
                    color: active ? 'var(--accent)' : 'var(--text)'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--border-bright)';
                      e.currentTarget.style.background = 'rgba(0,212,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-mono-tech text-sm tracking-wider uppercase">
                    {item.label}
                  </span>
                  {active && (
                    <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="font-mono-tech text-[0.48rem] tracking-wider" style={{ color: 'var(--text-dim)' }}>
            MERCY AI JUSTICE SYSTEM · BUILD 7.4.1
          </div>
        </div>
      </div>
    </>
  );
}