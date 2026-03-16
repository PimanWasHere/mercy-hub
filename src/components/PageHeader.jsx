import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({ title, subtitle, backTo = "/Home", icon: Icon }) {
  return (
    <div className="pt-8 pb-20 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, var(--surface), var(--panel))' }}>
      <div className="max-w-4xl mx-auto">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-sm transition-colors mb-6 font-mono-tech tracking-wider hover:text-accent"
          style={{ color: 'var(--text-dim)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO HOME
        </Link>
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-14 h-14 border flex items-center justify-center shrink-0" style={{ background: 'rgba(0,212,255,0.1)', borderColor: 'var(--accent)' }}>
              <Icon className="w-7 h-7" style={{ color: 'var(--accent)' }} />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold font-hud tracking-wider" style={{ color: 'var(--accent)', textShadow: '0 0 10px rgba(0,212,255,0.3)' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 font-mono-tech text-sm tracking-wider" style={{ color: 'var(--text-dim)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}