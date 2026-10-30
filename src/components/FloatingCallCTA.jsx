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

      {/* Primary Floating Action Pill — clicking opens the popup */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative flex items-center gap-2.5 py-2.5 px-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/20 bg-gradient-to-r from-[#d02426] to-[#b51c1e] text-white select-none"
          aria-expanded={isExpanded}
          aria-label="Open contact helpline options"
        >
          {/* Gentle Pulsing Ring */}
          {!isExpanded && (
            <span className="absolute -inset-1 rounded-full bg-red-500 opacity-30 animate-ping pointer-events-none" />
          )}

          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Phone className="w-3.5 h-3.5 stroke-[2.5] fill-white" />
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-85 leading-tight flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Talk to Us
            </span>
            <span className="text-xs font-black tracking-tight leading-tight whitespace-nowrap">
              +91 98440 93666
            </span>
          </div>

          <div className="pl-0.5 opacity-75 group-hover:opacity-100 transition-opacity">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>

        {/* WhatsApp Icon Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-11 h-11 rounded-full border shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-heading)'
          }}
          aria-label={isExpanded ? 'Collapse call options' : 'More contact options'}
          title="More contact options"
        >
          <MessageCircle className="w-5 h-5 text-emerald-500" />
        </button>
      </div>
    </aside>
  );
}
