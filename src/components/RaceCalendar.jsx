import React, { useState } from 'react';
import { Calendar, MapPin, Users, ArrowUpRight, Flame, Mountain, CheckCircle2 } from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function RaceCalendar({ onJoinCamp }) {
  const [selectedEvent, setSelectedEvent] = useState(eventsData[0]);

  return (
    <div className="space-y-8">
      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {eventsData.map((event) => {
          const isSelected = selectedEvent?.id === event.id;
          return (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`cursor-pointer rounded-3xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between group ${
                isSelected
                  ? 'ring-2 ring-offset-2 scale-[1.01] shadow-2xl'
                  : 'hover:-translate-y-1.5 hover:shadow-xl opacity-90 hover:opacity-100'
              }`}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                ringColor: isSelected ? 'var(--accent)' : 'transparent',
                color: 'var(--text-primary)'
              }}
            >
              <div>
                {/* 16:9 Event Hero Banner */}
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 bg-slate-900">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  {/* Top Status Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-md shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{event.status}</span>
                  </div>

                  {/* Bottom Category Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/75 text-white backdrop-blur-md border border-white/20">
                      {event.category}
                    </span>
                    <span className="text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event.participants.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-3 text-xs opacity-75 mb-2">
                  <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--accent)' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug mb-2"
                  style={{ color: 'var(--text-heading)' }}
                >
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm opacity-80 line-clamp-2 leading-relaxed mb-4">
                  {event.description}
                </p>

                {/* Distance and Elevation Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: 'var(--card-inner)' }}
                  >
                    🎯 {event.targetDistance}
                  </span>
                  {event.elevation && (
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                      style={{ backgroundColor: 'var(--card-inner)' }}
                    >
                      <Mountain className="w-3 h-3 text-amber-500" />
                      {event.elevation}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-xs font-bold" style={{ color: isSelected ? 'var(--accent)' : 'inherit' }}>
                  {isSelected ? '✓ Active View' : 'Click to View Full Details'}
                </span>
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: isSelected ? 'var(--accent)' : 'var(--badge-bg)',
                    color: isSelected ? 'var(--accent-contrast)' : 'var(--accent)'
                  }}
                >
                  Details <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Event Spotlight Banner */}
      {selectedEvent && (
        <div className="rounded-3xl p-6 sm:p-8 border shadow-xl transition-all relative overflow-hidden"
          style={{
            backgroundColor: 'var(--badge-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {selectedEvent.status}
                </span>
                <span className="text-xs font-bold opacity-80 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {selectedEvent.participants}
                </span>
                <span className="text-xs font-bold opacity-80 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                  {selectedEvent.date}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
                {selectedEvent.title}
              </h3>

              <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                {selectedEvent.description}
              </p>

              {/* Highlights 2-column grid */}
              {selectedEvent.highlights && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {selectedEvent.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs opacity-90">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
              <button
                onClick={() => onJoinCamp(selectedEvent)}
                className="py-3 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-contrast)'
                }}
              >
                <Flame className="w-4 h-4" />
                <span>Register for Event Squad</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
