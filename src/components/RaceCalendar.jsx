import React, { useState } from 'react';
import { Calendar, MapPin, Users, Flag, ArrowUpRight, Flame } from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function RaceCalendar({ onJoinCamp }) {
  const [selectedEvent, setSelectedEvent] = useState(eventsData[0]);

  return (
    <div className="space-y-6">
      {/* Mobile Swipe Hint */}
      <div className="md:hidden flex items-center justify-between text-[11px] opacity-60 px-1">
        <span>👈 Swipe races horizontally</span>
        <span>{eventsData.length} Campaigns</span>
      </div>

      {/* Event Cards Grid / Mobile Snap Carousel */}
      <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar md:grid-cols-2 lg:grid-cols-4">
        {eventsData.map((event) => {
          const isSelected = selectedEvent.id === event.id;
          return (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`w-[78vw] sm:w-[300px] md:w-auto flex-shrink-0 snap-center cursor-pointer rounded-3xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'ring-2 ring-offset-1 scale-102 shadow-xl'
                  : 'hover:-translate-y-1 hover:shadow-md opacity-85 hover:opacity-100'
              }`}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                ringColor: isSelected ? 'var(--accent)' : 'transparent',
                color: 'var(--text-primary)'
              }}
            >
              <div>
                <div className="relative h-36 rounded-2xl overflow-hidden mb-3">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                    {event.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] opacity-60 mb-1">
                  <Calendar className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                  <span>{event.date}</span>
                </div>

                <h4 className="text-sm sm:text-base font-black tracking-tight leading-snug mb-1.5"
                  style={{ color: 'var(--text-heading)' }}
                >
                  {event.title}
                </h4>

                <div className="flex items-center gap-1 text-[11px] opacity-60 mb-2">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded opacity-80"
                  style={{ backgroundColor: 'var(--card-inner)' }}
                >
                  {event.targetDistance}
                </span>
                <span className="text-xs font-bold flex items-center gap-0.5" style={{ color: 'var(--accent)' }}>
                  Select <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Event Spotlight Banner */}
      {selectedEvent && (
        <div className="rounded-3xl p-5 sm:p-7 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
          style={{
            backgroundColor: 'var(--badge-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {selectedEvent.status}
              </span>
              <span className="text-xs opacity-70 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {selectedEvent.participants}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
              {selectedEvent.title} - Official Squad Camp
            </h3>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>

          <button
            onClick={() => onJoinCamp(selectedEvent)}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap shadow-md hover:scale-105"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-contrast)'
            }}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Join Race Squad</span>
          </button>
        </div>
      )}
    </div>
  );
}
