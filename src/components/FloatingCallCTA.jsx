import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageCircle, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function FloatingCallCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 200px down
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  if (!isVisible || isDismissed) return null;

  return (
    <aside
      ref={drawerRef}
      aria-label="Quick contact assistance"
      className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5"
    >
      {/* Expanded quick contact drawer popup */}
      {isExpanded && (
        <div
          className="rounded-3xl p-5 sm:p-6 border shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl mb-1 w-[88vw] sm:w-84 max-w-sm space-y-3.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
                JJs Running Helpline
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close contact drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Prefer to speak directly with a coach instead of scrolling? Connect with our morning academy team:
          </p>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <a
              href="tel:+919844093666"
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-[#d02426] hover:bg-[#b51c1e] transition-all shadow-lg shadow-red-500/25 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 stroke-[2.5]" />
              <span>CALL +91 98440 93666</span>
            </a>

            <a
              href="https://wa.me/919844093666?text=Hi%20JJs%20Running!%20I%20would%20like%20to%20know%20more%20about%20your%20morning%20training%20sessions%20and%20centers."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/25 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.5]" />
              <span>WHATSAPP US DIRECTLY</span>
            </a>
          </div>

          <div className="text-[10px] text-center opacity-65 font-mono pt-1">
            Mon - Sun • 5:00 AM - 8:00 PM IST
          </div>
        </div>
      )}

      {/* Primary Floating Action Pill — compact, theme-harmonious, and non-intrusive */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex items-center gap-2 py-2 px-3.5 rounded-full shadow-lg backdrop-blur-xl border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-heading)'
        }}
        aria-expanded={isExpanded}
        aria-label="Open JJs Running Helpline"
      >
        <div className="w-6 h-6 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center flex-shrink-0">
          <Phone className="w-3 h-3 stroke-[2.5]" />
        </div>

        <span className="text-xs font-bold tracking-tight">Talk to Us</span>

        <MessageCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 ml-0.5" />

        <div className="opacity-60 group-hover:opacity-100 transition-opacity ml-0.5">
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </div>
      </button>
    </aside>
  );
}
