import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Clock, Smartphone, MapPin, Award, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export default function LiveTicker({ onActionClick }) {
  const updates = [
    {
      badge: 'FEATURED EVENT',
      badgeColor: '#d02426',
      icon: Trophy,
      text: 'The Saree Run (Bengaluru Edition): Registrations now open for 3,000+ women at Kanteerava Stadium!',
      mobileText: 'The Saree Run: Registrations Open at Kanteerava',
      actionText: 'Register on RaceIQ',
      actionUrl: 'https://raceiq.in/tsr',
      actionTarget: 'external'
    },
    {
      badge: 'LIVE WIRE',
      badgeColor: '#d02426',
      icon: Flame,
      text: '450+ runners completed morning workout across 20+ centers today',
      mobileText: '450+ runners completed morning workout across 20+ centers',
      actionText: 'Find Squad',
      actionTarget: 'centers'
    },
    {
      badge: 'RACE PREP',
      badgeColor: '#d02426',
      icon: Trophy,
      text: 'TCS World 10K & Tata Mumbai Marathon (TMM) training blocks now active',
      mobileText: 'TCS 10K & Mumbai Marathon training blocks active',
      actionText: 'Programs',
      actionTarget: 'programs'
    },
    {
      badge: 'WEEKEND SLR',
      badgeColor: '#318cdd',
      icon: Clock,
      text: '5:30 AM Slow Long Run (SLR) gathering across all 20+ morning centers',
      mobileText: '5:30 AM Slow Long Run (SLR) at 20+ grounds',
      actionText: 'Centers',
      actionTarget: 'centers'
    },
    {
      badge: 'ONCA APP',
      badgeColor: '#318cdd',
      icon: Smartphone,
      text: 'Track real-time stride cadence, heart-rate zones & coach telemetry',
      mobileText: 'Track stride cadence, heart-rate & coach sync',
      actionText: 'Get App',
      actionTarget: 'app'
    },
    {
      badge: 'HONOR ROLL',
      badgeColor: '#ef7f1a',
      icon: Award,
      text: 'Hundreds of World Major Marathon finishes: Boston, Berlin, London, Tokyo, Chicago & NYC',
      mobileText: 'Hundreds of World Major finishes: Boston, Berlin, London & NYC',
      actionText: 'Stories',
      actionTarget: 'stories'
    },
    {
      badge: 'NEW SQUADS',
      badgeColor: '#ef7f1a',
      icon: MapPin,
      text: 'New centers now open: Baner Balewadi (Pune) & Bellandur (Bengaluru)',
      mobileText: 'New centers: Baner (Pune) & Bellandur (Bengaluru)',
      actionText: 'Book Trial',
      actionTarget: 'register'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animating, setAnimating] = useState(false);

  const changeSlide = React.useCallback((nextIndex) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setAnimating(false);
    }, 200);
  }, []);

  const handleNext = React.useCallback(() => {
    changeSlide((currentIndex + 1) % updates.length);
  }, [currentIndex, changeSlide, updates.length]);

  const handlePrev = React.useCallback(() => {
    changeSlide((currentIndex - 1 + updates.length) % updates.length);
  }, [currentIndex, changeSlide, updates.length]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  const current = updates[currentIndex];
  const Icon = current.icon;

  const handleAction = (e) => {
    if (e) e.stopPropagation();
    if (current.actionUrl) {
      window.open(current.actionUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (onActionClick && current.actionTarget) {
      onActionClick(current.actionTarget);
    }
  };

  return (
    <div
      role="region"
      aria-label="Live announcements ticker"
      className="w-full bg-[#090d16] text-white border-b border-white/10 text-xs select-none transition-colors duration-300 z-50 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between min-h-[38px]">
        {/* Dynamic Live Update */}
        <div
          onClick={handleAction}
          className="flex-1 flex items-center justify-start gap-2 sm:gap-3 min-w-0 pr-2 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAction();
            }
          }}
          aria-label={`${current.badge}: ${current.text}. Tap to navigate to ${current.actionText}`}
        >
          {/* Pulsing Live Pill */}
          <div className="flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d02426]"></span>
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] font-black tracking-widest text-red-400 uppercase">
              {current.badge}
            </span>
          </div>

          {/* Rotating Message with Smooth Transition */}
          <div
            aria-live="polite"
            className={`flex items-center gap-2 truncate transition-all duration-300 ease-out ${
              animating ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0 hidden md:inline-block text-[#318cdd]" />
            <span className="text-slate-200 text-[11px] sm:text-xs font-medium truncate group-hover:text-white transition-colors">
              <span className="sm:hidden">{current.mobileText || current.text}</span>
              <span className="hidden sm:inline">{current.text}</span>
            </span>

            {/* Clickable Action Link */}
            {current.actionText && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#318cdd] group-hover:text-white transition-colors underline underline-offset-2 flex-shrink-0 ml-1">
                <span>{current.actionText}</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </div>
        </div>

        {/* Right Controls: Index indicator & Prev/Next Arrows */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0 text-slate-400 pl-3 border-l border-white/10">
          <span className="font-mono text-[10px] text-slate-400 mr-1 tracking-wider tabular-num">
            {currentIndex + 1}/{updates.length}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous update"
            title="Previous update"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Next update"
            title="Next update"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}