import React from 'react';
import { Sparkles, Calendar, MapPin, Users, ArrowRight, Flame } from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function EventSpotlightBanner({ onRegister, onExploreRaces }) {
  const sareeRun = eventsData.find(e => e.id === 'the-saree-run') || eventsData[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" aria-label="Featured Signature Event">
      <div className="relative rounded-3xl overflow-hidden border border-rose-500/30 bg-gradient-to-r from-rose-950/90 via-slate-950 to-purple-950/80 text-white shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7 md:p-8 items-center">
          {/* Left Column: Event Visual & Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden border border-white/15 shadow-xl group">
              <img
                src={sareeRun.image || '/images/events/the-saree-run.jpg'}
                alt={sareeRun.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to high-energy community image if path differs
                  e.target.src = '/images/jjs/Slider_3.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Pulsing Flash Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-rose-500/90 text-white shadow-md backdrop-blur-md">
                  UPCOMING SIGNATURE EVENT
                </span>
              </div>

              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs font-mono text-white/90">
                <span className="bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                  <Users className="w-3.5 h-3.5 text-rose-400" />
                  <span>3,000+ Runners</span>
                </span>
                <span className="bg-rose-500/80 px-2.5 py-1 rounded-lg font-bold text-[11px] text-white">
                  5K • 3K • Kids Run
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Event Headline, Highlights, & Direct CTAs */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                All-Women Fitness Movement
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-white/80 bg-white/10 border border-white/15">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                Nov 29, 2026
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-white/80 bg-white/10 border border-white/15">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Kanteerava Stadium, Bengaluru
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              THE SAREE RUN <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">2026</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              An iconic nationwide fitness movement founded by Jayanagar Jaguars. Celebrating sisterhood, wellness, and endurance in traditional six-yard sarees and running shoes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs font-medium">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-rose-300 uppercase block font-mono">Timed Race</span>
                <span className="text-white font-bold text-xs">5K Chip-Timed Run</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-rose-300 uppercase block font-mono">Open Category</span>
                <span className="text-white font-bold text-xs">3K Walk-Jog</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-rose-300 uppercase block font-mono">Next Generation</span>
                <span className="text-white font-bold text-xs">Free Kids Run (&lt;10)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://raceiq.in/tsr"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 sm:px-7 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 transition-all shadow-lg shadow-rose-600/30 hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Register on RaceIQ</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onExploreRaces}
                className="py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <span>View Full Race Calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

