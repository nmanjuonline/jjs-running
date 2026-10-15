import React from 'react';
import { Flame, Trophy, Clock, Smartphone, MapPin, Zap, Award, Activity } from 'lucide-react';

export default function LiveTicker() {
  const items = [
    {
      tag: 'MILESTONE',
      icon: Flame,
      text: '450+ Runners Completed Morning Workout Across Bengaluru, Pune & Kolkata',
      color: '#ef7f1a' // Amber Spark
    },
    {
      tag: 'RACE PREP',
      icon: Trophy,
      text: 'TCS World 10K & Tata Mumbai Marathon (TMM) Training Blocks Now Active',
      color: '#d02426' // Sprint Red
    },
    {
      tag: 'COMMUNITY',
      icon: Clock,
      text: 'Weekend Long Slow Distance (LSD): 5:30 AM Across All 30+ Morning Centers',
      color: '#318cdd' // Cerulean Blue
    },
    {
      tag: 'HONOR ROLL',
      icon: Award,
      text: '100+ World Major Marathons Finished: Boston, Berlin, London, Tokyo & Comrades',
      color: '#d02426' // Sprint Red
    },
    {
      tag: 'TECH',
      icon: Smartphone,
      text: 'ONCA Run App: Real-Time Stride Cadence, Heart Rate & Coach Telemetry',
      color: '#318cdd' // Cerulean Blue
    },
    {
      tag: 'EXPANSION',
      icon: MapPin,
      text: 'New Training Centers Open: Baner Balewadi (Pune) & Bellandur (Bengaluru)',
      color: '#ef7f1a' // Amber Spark
    },
    {
      tag: 'RECOVERY',
      icon: Zap,
      text: 'Weekly Mobility, Strength & Physiotherapy Clinics Every Saturday',
      color: '#318cdd' // Cerulean Blue
    },
    {
      tag: 'PACING',
      icon: Activity,
      text: 'Dedicated Mentor-Led Pace Buses from 5:00/km to 7:30/km for All Levels',
      color: '#d02426' // Sprint Red
    }
  ];

  return (
    <div
      className="relative w-full overflow-hidden border-y py-2.5 transition-colors group select-none"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Pinned Left "LIVE INTEL" Badge */}
      <div
        className="absolute left-0 top-0 bottom-0 z-20 flex items-center gap-2 px-3 sm:px-4 border-r backdrop-blur-md shadow-sm"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#d02426' }}></span>
        </span>
        <span
          className="font-mono text-[10px] sm:text-[11px] font-black tracking-widest uppercase"
          style={{ color: '#d02426' }}
        >
          LIVE
        </span>
        <span
          className="hidden sm:inline font-mono text-[11px] font-bold tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          WIRE
        </span>
      </div>

      {/* Left Gradient Fade Mask (Feathers text as it emerges past the pinned badge) */}
      <div
        className="pointer-events-none absolute left-[74px] sm:left-[116px] top-0 bottom-0 w-8 sm:w-16 z-10"
        style={{
          background: 'linear-gradient(to right, var(--card-bg), transparent)'
        }}
      />

      {/* Right Gradient Fade Mask */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10"
        style={{
          background: 'linear-gradient(to left, var(--card-bg), transparent)'
        }}
      />

      {/* Infinite Scrolling Ticker Track */}
      <div
        className="flex items-center gap-8 whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused] cursor-default"
        style={{ animationDuration: '46s' }}
      >
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 text-xs font-medium tracking-wide">
              {/* Category Pill */}
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase tracking-wider border"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  borderColor: `${item.color}35`
                }}
              >
                {item.tag}
              </span>

              {/* Icon */}
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: item.color }} />

              {/* Text - High Contrast */}
              <span
                className="font-semibold text-xs sm:text-[13px] tracking-normal"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.text}
              </span>

              {/* Separator */}
              <span
                className="opacity-30 mx-4 select-none text-[10px]"
                style={{ color: 'var(--accent)' }}
              >
                ◆
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

