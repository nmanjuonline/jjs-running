import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, Sparkles } from 'lucide-react';

export default function FloatingCallCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

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

  if (!isVisible || isDismissed) return null;

  return (
    <aside
      aria-label="Quick contact assistance"
      className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2"
    >
      {/* Expanded quick contact drawer */}
      {isExpanded && (
        <div
          className="rounded-2xl p-3.5 sm:p-4 border shadow-2xl backdrop-blur-xl mb-1 w-72 sm:w-80 space-y-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
                JJs Running Helpline
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Close contact drawer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Prefer to speak directly with a coach instead of scrolling? Connect with our morning academy team:
          </p>

          <div className="grid grid-cols-1 gap-2 pt-1">
            <a
              href="tel:+919844093666"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#d02426] hover:bg-[#b51c1e] transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Call +91 98440 93666</span>
            </a>

            <a
              href="https://wa.me/919844093666?text=Hi%20JJs%20Running!%20I%20would%20like%20to%20know%20more%20about%20your%20morning%20training%20sessions%20and%20centers."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>WhatsApp Us Directly</span>
            </a>
          </div>

          <div className="text-[10px] text-center opacity-60 font-mono">
            Mon - Sun • 5:00 AM - 8:00 PM IST
          </div>
        </div>
      )}

      {/* Primary Floating Action Pill with gentle flashing radar ring */}
      <div className="flex items-center gap-2">
        <a
          href="tel:+919844093666"
          className="group relative flex items-center gap-2.5 py-2.5 px-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/20 bg-gradient-to-r from-[#d02426] to-[#b51c1e] text-white"
          aria-label="Direct call JJs Running at +91 98440 93666"
        >
          {/* Gentle Pulsing Ring */}
          <span className="absolute -inset-1 rounded-full bg-red-500 opacity-30 animate-ping pointer-events-none" />

          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Phone className="w-3.5 h-3.5 stroke-[2.5] fill-white animate-bounce" />
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-85 leading-tight flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Talk to Us
            </span>
            <span className="text-xs font-black tracking-tight leading-tight whitespace-nowrap">
              +91 98440 93666
            </span>
          </div>
        </a>

        {/* Expand / Options Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 rounded-full border shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-md"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-heading)'
          }}
          aria-label={isExpanded ? 'Collapse call options' : 'More contact options'}
          title="More contact options"
        >
          <MessageCircle className="w-4 h-4 text-emerald-500" />
        </button>
      </div>
    </aside>
  );
}

