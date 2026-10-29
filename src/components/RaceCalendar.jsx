import React from 'react';
import { Calendar, MapPin, Users, Flame, Mountain, CheckCircle2 } from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function RaceCalendar({ onJoinCamp }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
      {eventsData.map((event) => (
        <div
          key={event.id}
          className="rounded-3xl p-5 sm:p-7 border transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="space-y-4">
            {/* 16:9 Event Hero Banner */}
            <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Top Status Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white backdrop-blur-md shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{event.status}</span>
              </div>

              {/* Bottom Category & Participants Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 text-white backdrop-blur-md border border-white/20">
                  {event.category}
                </span>
                <span className="text-xs font-bold text-white/95 drop-shadow flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {event.participants.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Date and Location Header */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--accent)' }}>
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.date}</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1 opacity-75 truncate">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Event Title */}
            <h3
              className="text-xl sm:text-2xl font-black tracking-tight leading-snug"
              style={{ color: 'var(--text-heading)' }}
            >
              {event.title}
            </h3>

            {/* Distance and Elevation Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className="text-xs font-mono font-bold tabular-num px-3 py-1 rounded-lg border shadow-xs"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
              >
                Distance: {event.targetDistance}
              </span>
              {event.elevation && (
                <span
                  className="text-xs font-mono font-bold tabular-num px-3 py-1 rounded-lg border shadow-xs flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-heading)'
                  }}
                >
                  <Mountain className="w-3.5 h-3.5 text-amber-500" />
                  {event.elevation}
                </span>
              )}
            </div>

            {/* Complete Description */}
            <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
              {event.description}
            </p>

            {/* Key Event Highlights Bullets */}
            {event.highlights && (
              <div className="pt-2 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60 block">
                  Event Highlights & Amenities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {event.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs opacity-90 leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTA Button */}
          <div className="pt-5 mt-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => onJoinCamp(event)}
              className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-98 cursor-pointer"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-contrast)'
              }}
            >
              <Flame className="w-4 h-4" />
              <span>Register for {event.id === 'the-saree-run' ? 'The Saree Run' : 'Nandi Hills Run'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
