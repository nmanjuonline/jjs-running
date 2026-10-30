import React, { useState, useRef } from 'react';
import { Calendar, MapPin, Users, Flame, Mountain, CheckCircle2, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function RaceCalendar({ onJoinCamp }) {
  const [selectedId, setSelectedId] = useState(eventsData[0]?.id);
  const scrollRef = useRef(null);

  const selectedEvent = eventsData.find(e => e.id === selectedId) || eventsData[0];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -310 : 310;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Scroll Navigation Header & Directional Controls */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold opacity-75">
          <span className="w-2 h-2 rounded-full bg-[#318cdd] animate-pulse" />
          <span>Click any race card to preview squad details</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll races left"
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll races right"
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track of Race Cards */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Upcoming running events"
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 px-1 no-scrollbar scroll-smooth snap-x"
      >
        {eventsData.map((event) => {
          const isSelected = event.id === selectedEvent.id;

          return (
            <div
              key={event.id}
              role="tab"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => setSelectedId(event.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedId(event.id);
                }
              }}
              className={`group w-[270px] sm:w-[290px] flex-shrink-0 snap-start rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between cursor-pointer select-none ${
                isSelected
                  ? 'border-2 border-[#318cdd] ring-4 ring-[#318cdd]/25 shadow-xl shadow-[#318cdd]/15 scale-[1.01]'
                  : 'hover:border-slate-400/40 hover:-translate-y-0.5'
              }`}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: isSelected ? '#318cdd' : 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div>
                {/* 16:9 Thumbnail Image with Category Badge */}
                <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900 mb-3 shadow-xs">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 inset-x-2">
                    <span className="block px-2.5 py-0.5 rounded-md bg-black/85 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider text-center truncate shadow-sm">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs opacity-75 font-mono tabular-num mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#318cdd]" />
                  <span>{event.date}</span>
                </div>

                {/* Title */}
                <h3
                  className="text-sm sm:text-base font-black tracking-tight leading-snug line-clamp-2 min-h-[2.5rem] mb-2"
                  style={{ color: 'var(--text-heading)' }}
                >
                  {event.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs opacity-70 mb-3 truncate">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Card Footer: Distance + Select Action */}
              <div
                className="pt-2.5 border-t flex items-center justify-between text-xs mt-auto"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span className="font-mono tabular-num text-[11px] opacity-75 truncate max-w-[160px]">
                  {event.targetDistance}
                </span>

                <span
                  className={`font-bold text-xs flex items-center gap-0.5 transition-colors ${
                    isSelected ? 'text-[#318cdd]' : 'opacity-70 group-hover:opacity-100'
                  }`}
                  style={{
                    color: isSelected ? '#318cdd' : 'inherit'
                  }}
                >
                  <span>{isSelected ? 'Selected' : 'Select'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Event Spotlight Banner directly underneath */}
      {selectedEvent && (
        <div
          className="rounded-3xl p-5 sm:p-7 border shadow-xl transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: 'var(--card-inner)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              {/* Meta Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {selectedEvent.status}
                </span>
                <span className="text-xs font-bold opacity-80 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#318cdd]" />
                  <span>{selectedEvent.participants}</span>
                </span>
                <span className="text-xs font-bold opacity-80 flex items-center gap-1.5 font-mono tabular-num">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedEvent.date}</span>
                </span>
                {selectedEvent.elevation && (
                  <span className="text-xs font-bold opacity-80 flex items-center gap-1.5 font-mono tabular-num">
                    <Mountain className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedEvent.elevation}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight"
                style={{ color: 'var(--text-heading)' }}
              >
                {selectedEvent.title} - Official Squad Camp
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                {selectedEvent.description}
              </p>

              {/* Highlights 2-column grid */}
              {selectedEvent.highlights && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  {selectedEvent.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs opacity-90 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
              {selectedEvent.registrationUrl ? (
                <a
                  href={selectedEvent.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>REGISTER ON RACEIQ</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              ) : (
                <button
                  onClick={() => onJoinCamp(selectedEvent)}
                  className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-[#318cdd] hover:bg-[#2573b8] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>JOIN RACE SQUAD</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
