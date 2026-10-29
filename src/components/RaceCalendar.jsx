import React, { useState } from 'react';
import { Calendar, MapPin, Users, Flame, Mountain, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function RaceCalendar({ onJoinCamp }) {
  const [selectedId, setSelectedId] = useState(eventsData[0]?.id);

  const selectedEvent = eventsData.find(e => e.id === selectedId) || eventsData[0];

  return (
    <div
      className="rounded-3xl border overflow-hidden shadow-xl transition-all duration-300"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Top Mobile Quick Switcher (< lg) */}
      <div
        className="lg:hidden p-3 border-b flex items-center gap-2 overflow-x-auto no-scrollbar"
        role="tablist"
        aria-label="Select event"
        style={{
          backgroundColor: 'var(--card-inner)',
          borderColor: 'var(--border-color)'
        }}
      >
        {eventsData.map((event) => {
          const isSelected = event.id === selectedEvent.id;
          return (
            <button
              key={event.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedId(event.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                isSelected
                  ? 'shadow-md scale-[1.02]'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isSelected ? 'var(--accent)' : 'var(--card-bg)',
                color: isSelected ? 'var(--accent-contrast)' : 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <span className="font-mono tabular-num text-[11px] opacity-90">{event.date.split(',')[0]}</span>
              <span className="truncate max-w-[150px]">{event.title.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Master-Detail Cockpit Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left Column: Events Directory List (Desktop) */}
        <div
          className="hidden lg:flex lg:col-span-5 border-r flex-col"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--card-inner)'
          }}
        >
          {/* Directory Header */}
          <div
            className="p-4 border-b flex items-center justify-between text-xs font-bold uppercase tracking-wider"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <span className="flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <Trophy className="w-4 h-4 text-[#318cdd]" />
              Event Calendar ({eventsData.length})
            </span>
            <span className="text-[10px] opacity-60 font-mono">SELECT TO VIEW</span>
          </div>

          {/* Scrollable Events List (Scales cleanly to any number of events) */}
          <div
            role="listbox"
            aria-label="Upcoming running events list"
            className="overflow-y-auto max-h-[520px] divide-y"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {eventsData.map((event) => {
              const isSelected = event.id === selectedEvent.id;
              const dateParts = event.date.split(' ');
              const month = dateParts[0];
              const day = dateParts[1]?.replace(',', '');

              return (
                <div
                  key={event.id}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => setSelectedId(event.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(event.id);
                    }
                  }}
                  className={`p-4 cursor-pointer transition-all flex items-center gap-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset ${
                    isSelected
                      ? 'border-l-4 border-[#318cdd] shadow-sm'
                      : 'border-l-4 border-transparent opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--card-bg)' : 'transparent',
                    ringColor: 'var(--accent)'
                  }}
                >
                  {/* Date Badge */}
                  <div
                    className="w-12 h-13 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border font-mono shadow-xs"
                    style={{
                      backgroundColor: isSelected ? 'var(--badge-bg)' : 'var(--card-bg)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                      color: isSelected ? 'var(--accent)' : 'var(--text-heading)'
                    }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">{month}</span>
                    <span className="text-base font-black tabular-num leading-none">{day}</span>
                  </div>

                  {/* Event Summary */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: isSelected ? 'var(--card-inner)' : 'transparent',
                          borderColor: 'var(--border-color)',
                          color: 'var(--accent)'
                        }}
                      >
                        {event.category.split(' ')[0]}
                      </span>
                    </div>

                    <h4 className="text-sm font-black tracking-tight truncate leading-snug" style={{ color: 'var(--text-heading)' }}>
                      {event.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] opacity-70 mt-1">
                      <span className="truncate">{event.location.split(',')[0]}</span>
                      <span>•</span>
                      <span className="font-mono tabular-num font-bold">{event.targetDistance.split('/')[0]}</span>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isSelected ? 'text-[#318cdd] translate-x-0.5' : 'opacity-30'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Featured Event Showcase */}
        <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between">
          <div className="space-y-5">
            {/* 16:9 Hero Banner */}
            <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Top Status Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white backdrop-blur-md shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{selectedEvent.status}</span>
              </div>

              {/* Bottom Category & Participants Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 text-white backdrop-blur-md border border-white/20">
                  {selectedEvent.category}
                </span>
                <span className="text-xs font-bold text-white/95 drop-shadow flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {selectedEvent.participants.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Event Header Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--accent)' }}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedEvent.date}</span>
                </div>
                <span className="opacity-40">•</span>
                <div className="flex items-center gap-1 opacity-75 truncate">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{selectedEvent.location}</span>
                </div>
              </div>

              <h3
                className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight"
                style={{ color: 'var(--text-heading)' }}
              >
                {selectedEvent.title}
              </h3>
            </div>

            {/* Target Distance & Elevation Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className="text-xs font-mono font-bold tabular-num px-3 py-1 rounded-lg border shadow-xs"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
              >
                Distance: {selectedEvent.targetDistance}
              </span>
              {selectedEvent.elevation && (
                <span
                  className="text-xs font-mono font-bold tabular-num px-3 py-1 rounded-lg border shadow-xs flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-heading)'
                  }}
                >
                  <Mountain className="w-3.5 h-3.5 text-amber-500" />
                  {selectedEvent.elevation}
                </span>
              )}
            </div>

            {/* Event Description */}
            <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
              {selectedEvent.description}
            </p>

            {/* Highlights Grid */}
            {selectedEvent.highlights && (
              <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60 block">
                  Event Highlights & Amenities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedEvent.highlights.map((item, idx) => (
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
          <div className="pt-5 mt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-xs opacity-70 hidden sm:inline">
              Coached training block & official squad support included.
            </span>
            <button
              onClick={() => onJoinCamp(selectedEvent)}
              className="w-full sm:w-auto py-3.5 px-7 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
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
    </div>
  );
}
