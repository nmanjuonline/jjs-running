import React from 'react';
import { Quote, Award, MapPin, TrendingUp } from 'lucide-react';
import { runnerStories } from '../data/eventsData';

export default function Testimonials() {
  return (
    <div className="space-y-4">
      {/* Mobile Swipe Hint */}
      <div className="md:hidden flex items-center justify-between text-[11px] opacity-60 px-1">
        <span>👈 Swipe runner stories</span>
        <span>{runnerStories.length} Stories</span>
      </div>

      <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-4 md:gap-6 pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar md:grid-cols-3">
        {runnerStories.map((story) => (
          <div
            key={story.name}
            className="w-[84vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-center rounded-3xl p-5 sm:p-6 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {/* Subtle quote watermark */}
            <Quote className="w-14 h-14 absolute top-3 right-3 opacity-5 pointer-events-none" />

            <div>
              {/* Header info with runner avatar */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 shadow-sm flex-shrink-0"
                  style={{ borderColor: 'var(--accent)' }}
                />
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-black tracking-tight truncate" style={{ color: 'var(--text-heading)' }}>
                    {story.name}
                  </h4>
                  <p className="text-[11px] opacity-65 truncate">{story.role}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold mt-0.5" style={{ color: 'var(--accent)' }}>
                    <MapPin className="w-2.5 h-2.5" />
                    {story.center}
                  </span>
                </div>
              </div>

              {/* Journey badge */}
              <div className="p-2.5 rounded-xl border mb-3 flex items-start gap-1.5"
                style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-tight" style={{ color: 'var(--text-heading)' }}>{story.journey}</p>
              </div>

              {/* Quote */}
              <p className="text-xs opacity-75 italic leading-relaxed mb-4 line-clamp-3">
                "{story.quote}"
              </p>
            </div>

            {/* Telemetry Stats Bar */}
            <div className="pt-3 border-t grid grid-cols-2 gap-2 text-center text-xs" style={{ borderColor: 'var(--border-color)' }}>
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--card-inner)' }}>
                <span className="text-[9px] uppercase tracking-wider opacity-60 block">Pace Progress</span>
                <span className="font-mono font-bold text-[10px] block truncate" style={{ color: 'var(--text-heading)' }}>
                  {story.stats.initialPace} ➔ {story.stats.currentPace}
                </span>
              </div>
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--card-inner)' }}>
                <span className="text-[9px] uppercase tracking-wider opacity-60 block">Races Finished</span>
                <span className="font-mono font-bold text-[10px] block truncate" style={{ color: 'var(--text-heading)' }}>
                  {story.stats.marathons}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
