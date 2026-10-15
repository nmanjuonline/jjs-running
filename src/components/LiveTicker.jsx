import React from 'react';
import { Flame, Trophy, Clock, Smartphone, MapPin, Zap, Award, Activity } from 'lucide-react';

export default function LiveTicker() {
  const items = [
    {
      tag: 'DAILY DISPATCH',
      icon: Flame,
      text: '450+ runners completed morning workouts across Bengaluru, Pune & Kolkata',
      tagColor: '#ef7f1a' // Amber Spark
    },
    {
      tag: 'RACE PREP',
      icon: Trophy,
      text: 'TCS World 10K & Tata Mumbai Marathon (TMM) training blocks now active',
      tagColor: '#d02426' // Sprint Red
    },
    {
      tag: 'WEEKEND LSD',
      icon: Clock,
      text: '5:30 AM Long Slow Distance gathering across all 30+ morning centers',
      tagColor: '#318cdd' // Cerulean Blue
    },
    {
      tag: 'HONOR ROLL',
      icon: Award,
      text: '100+ World Major Marathon finishes: Boston, Berlin, London, Tokyo & Comrades',
      tagColor: '#d02426' // Sprint Red
    },
    {
      tag: 'ONCA APP',
      icon: Smartphone,
      text: 'Real-time stride cadence, heart-rate zones & coach telemetry tracking',
      tagColor: '#318cdd' // Cerulean Blue
    },
    {
      tag: 'EXPANSION',
      icon: MapPin,
      text: 'New training centers open: Baner Balewadi (Pune) & Bellandur (Bengaluru)',
      tagColor: '#ef7f1a' // Amber Spark
    },
    {
      tag: 'RECOVERY',
      icon: Zap,
      text: 'Weekly mobility, strength & physiotherapy clinics every Saturday',
      tagColor: '#318cdd' // Cerulean Blue
    },
    {
      tag: 'PACING',
      icon: Activity,
      text: 'Dedicated mentor-led pace buses from 5:00/km to 7:30/km for all levels',
      tagColor: '#d02426' // Sprint Red
    }
  ];

  return (
    <div
      className="w-full overflow-hidden border-y transition-colors group select-none flex items-stretch"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
      }}
    >
      {/* Static Left "LIVE WIRE" Badge (Never overlaps or chops scrolling text) */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-5 py-2.5 border-r select-none z-20"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d02426]"></span>
        </span>
        <span className="font-mono text-[11px] font-black tracking-widest text-[#d02426] uppercase">
          LIVE
        </span>
        <span className="hidden sm:inline font-mono text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500">
          WIRE
        </span>
      </div>

      {/* Marquee Window (Smooth feather masks at both ends) */}
      <div className="flex-1 overflow-hidden relative flex items-center py-2.5 min-w-0">
        {/* Left Gradient Fade Mask */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10"
          style={{
            background: 'linear-gradient(to right, var(--card-bg), transparent)'
          }}
        />

        {/* Right Gradient Fade Mask */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10"
          style={{
            background: 'linear-gradient(to left, var(--card-bg), transparent)'
          }}
        />

        {/* Seamless Infinite Marquee Track */}
        <div
          className="flex items-center gap-10 whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused] cursor-default"
          style={{ animationDuration: '44s' }}
        >
          {[...items, ...items].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {/* Category Icon */}
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: item.tagColor }} />

                {/* Editorial Category Tag */}
                <span
                  className="font-mono text-[10px] sm:text-[11px] font-black tracking-wider uppercase"
                  style={{ color: item.tagColor }}
                >
                  {item.tag}
                </span>

                {/* Divider Slash */}
                <span className="text-slate-300 dark:text-slate-700 font-normal select-none">/</span>

                {/* Announcement Text - Clean, High Contrast */}
                <span
                  className="font-semibold text-xs sm:text-[13px] tracking-normal"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.text}
                </span>

                {/* Brand Accent Separator */}
                <span
                  className="opacity-35 mx-4 select-none text-[10px]"
                  style={{ color: 'var(--accent)' }}
                >
                  ◆
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


