import React, { useState } from 'react';
import { Check, ArrowUpRight, Award, Sun, Zap, Compass } from 'lucide-react';
import { programsData } from '../data/programsData';

const CATEGORIES = ['All Programs', 'Beginner', '10K', 'Half Marathon', 'Marathon', 'Ultra Trail', 'Virtual'];

export default function ProgramsSection({ onRegister, currentTheme = 'olympic-clean' }) {
  const [activeCategory, setActiveCategory] = useState('All Programs');

  const filtered = activeCategory === 'All Programs'
    ? programsData
    : programsData.filter((p) => {
        if (activeCategory === 'Marathon') {
          return p.category.toLowerCase() === 'marathon';
        }
        if (activeCategory === 'Half Marathon') {
          return p.category.toLowerCase() === 'half marathon';
        }
        if (activeCategory === '10K') {
          return p.category.toLowerCase().includes('10k') || p.id.includes('10k');
        }
        return p.category.toLowerCase().includes(activeCategory.toLowerCase());
      });

  const handleTabKeyDown = (e, currentIdx) => {
    let nextIdx = null;
    if (e.key === 'ArrowRight') {
      nextIdx = (currentIdx + 1) % CATEGORIES.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (currentIdx - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = CATEGORIES.length - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      setActiveCategory(CATEGORIES[nextIdx]);
      const parent = e.currentTarget.parentElement;
      const tabs = parent.querySelectorAll('button[role="tab"]');
      tabs[nextIdx]?.focus();
    }
  };

  // =========================================================================
  // 1. SWISS CLEAN / SWISS DARK (Minimalist Goal Discovery • Olympic Clean)
  // =========================================================================
  if (currentTheme === 'olympic-clean' || currentTheme === 'street-crew' || currentTheme === 'swiss-light' || currentTheme === 'swiss-dark') {
    const isDark = currentTheme === 'swiss-dark';

    return (
      <div className="space-y-6">
        {/* Category Filter Pills - Sleek Minimalist Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2" role="tablist" aria-label="Filter programs by goal category">
          {CATEGORIES.map((cat, idx) => {
            const isActive = activeCategory === cat;
            const tabId = `tab-${cat.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <button
                key={cat}
                id={tabId}
                role="tab"
                aria-selected={isActive}
                aria-controls="programs-grid"
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 min-h-[44px] text-xs font-bold tracking-wide rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-[#318cdd] text-white shadow-md shadow-[#318cdd]/25'
                    : isDark
                      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className={`md:hidden flex items-center justify-between text-xs font-medium px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#318cdd] animate-pulse" />Swipe to explore</span>
          <span>{filtered.length} Programs</span>
        </div>

        {/* Sleek Swiss Precision Cards Grid */}
        <div
          id="programs-grid"
          role="tabpanel"
          aria-label="Training programs catalog"
          className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-6 md:grid-cols-2 lg:grid-cols-3 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar items-stretch"
        >
          {filtered.map((program) => (
            <div
              key={program.id}
              className={`w-[86vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.25)]'
                  : 'bg-white border-slate-200 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(49,140,221,0.18)] hover:border-[#318cdd]/50'
              }`}
            >
              <div>
                {/* Official JJs Program Image Strip */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={program.image}
                    alt={`${program.outcomeTitle || program.title} - ${program.internalName} training program`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Top Goal Chip & Badge */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-[#d02426] text-white shadow-md">
                      {program.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                      isDark
                        ? 'bg-blue-950/90 text-blue-300 border border-blue-800/60'
                        : 'bg-white/95 text-[#318cdd] border border-blue-100 shadow-sm'
                    }`}>
                      {program.badge}
                    </span>
                  </div>

                  {/* Target race bottom */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold text-[11px] truncate">
                      <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{program.targetRace}</span>
                    </span>
                    <span className={`font-mono text-white px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                      !isDark ? 'bg-[#318cdd]' : 'bg-blue-600/90'
                    }`}>
                      {program.duration}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {program.internalName}
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-snug mt-0.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {program.outcomeTitle || program.title}
                    </h3>
                  </div>

                  {/* Best For Self-Selection Block */}
                  <div className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                    isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}>
                    <span className={`font-black block text-[10px] uppercase tracking-wider mb-0.5 ${isDark ? 'text-[#38bdf8]' : 'text-[#318cdd]'}`}>
                      Best for:
                    </span>
                    <span className="font-medium">{program.bestFor}</span>
                  </div>

                  {/* What You Will Build (3 key benefits) */}
                  <div className="pt-1 space-y-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      What You Will Build:
                    </span>
                    <div className="space-y-1.5">
                      {program.whatYouBuild?.map((benefit, i) => (
                        <div key={i} className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isDark ? 'bg-emerald-950/80 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Structure specs */}
                  <div className={`flex items-center gap-2 text-[11px] font-mono pt-3 border-t ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <span className="font-bold">{program.duration}</span>
                    <span>•</span>
                    <span>{program.frequency}</span>
                    <span>•</span>
                    <span className="truncate">{program.mode}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Register */}
              <div className={`p-5 sm:p-6 pt-4 border-t flex items-center justify-between gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex flex-col">
                  <span className={`text-2xl font-black block leading-tight tabular-num ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {program.price}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                    {program.tax}
                  </span>
                </div>

                <button
                  onClick={() => onRegister(program)}
                  className="py-2.5 px-5 min-h-[44px] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105 flex items-center justify-center gap-1.5 bg-[#d02426] hover:bg-[#b51c1e] shadow-[#d02426]/20 cursor-pointer"
                >
                  <span>VIEW PROGRAM</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SUNRISE STRIDE (Light • Radiant Dawn Milestone Pathway)
  // =========================================================================
  if (currentTheme === 'sunrise-coral' || currentTheme === 'heritage-gold') {
    return (
      <div className="space-y-6">
        {/* Warm Sunrise Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2" role="tablist" aria-label="Filter programs by goal category">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 min-h-[44px] text-xs font-bold tracking-wide rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25'
                    : 'bg-orange-50 hover:bg-orange-100/70 text-zinc-700 border border-orange-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Radiant Dawn Cards Deck */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-6 md:grid-cols-2 lg:grid-cols-3 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar items-stretch">
          {filtered.map((program) => (
            <div
              key={program.id}
              className="w-[86vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center bg-gradient-to-b from-white to-orange-50/30 rounded-3xl border border-orange-200/80 shadow-[0_12px_35px_-8px_rgba(255,72,0,0.12)] hover:shadow-[0_20px_45px_-10px_rgba(255,72,0,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Official Banner Image */}
                <div className="relative h-44 overflow-hidden bg-zinc-950">
                  <img
                    src={program.image}
                    alt={`${program.outcomeTitle || program.title} - ${program.internalName} training program`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-transparent" />

                  {/* Morning Chip */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-orange-600 text-white shadow-md flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-300" />
                      {program.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-orange-700 shadow-md backdrop-blur-md">
                      {program.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold text-[11px] truncate">
                      <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{program.targetRace}</span>
                    </span>
                    <span className="font-mono bg-orange-600 text-white px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 shadow-sm">
                      {program.duration}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider block font-semibold text-orange-700">
                      {program.internalName}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight leading-snug mt-0.5">
                      {program.outcomeTitle || program.title}
                    </h3>
                  </div>

                  {/* Best for Box */}
                  <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/70 text-xs leading-relaxed text-zinc-800">
                    <span className="font-black block text-[10px] uppercase tracking-wider mb-0.5 text-orange-700">
                      Best for:
                    </span>
                    <span className="font-medium">{program.bestFor}</span>
                  </div>

                  {/* What You Will Build */}
                  <div className="pt-1 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-zinc-500">
                      What You Will Build:
                    </span>
                    <div className="space-y-1.5">
                      {program.whatYouBuild?.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-700">
                          <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-orange-600 stroke-[3]" />
                          </div>
                          <span className="font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono pt-3 border-t border-orange-100 text-zinc-500">
                    <span className="font-bold">{program.duration}</span>
                    <span>•</span>
                    <span>{program.frequency}</span>
                    <span>•</span>
                    <span className="truncate">{program.mode}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Register */}
              <div className="p-5 sm:p-6 pt-4 border-t border-orange-100/80 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-zinc-950 block leading-tight tabular-num">{program.price}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">{program.tax}</span>
                </div>

                <button
                  onClick={() => onRegister(program)}
                  className="py-2.5 px-5 min-h-[44px] bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/25 hover:scale-105 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>VIEW PROGRAM</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. KINETIC VOLT (Dark • Asymmetric Bento Cockpit Pods)
  // =========================================================================
  if (currentTheme === 'kinetic') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2" role="tablist" aria-label="Filter programs by goal category">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 min-h-[44px] text-xs font-mono font-bold tracking-wider rounded-xl transition-all flex-shrink-0 flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-5 md:grid-cols-2 lg:grid-cols-3 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar items-stretch">
          {filtered.map((program) => (
            <div
              key={program.id}
              className="w-[86vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center rounded-3xl border border-[#1e2230] bg-[#11131c] hover:border-[#ccff00]/60 transition-all duration-300 flex flex-col justify-between shadow-xl overflow-hidden"
            >
              <div>
                {/* Official JJs Banner Image Pod */}
                <div className="relative h-44 overflow-hidden bg-black">
                  <img
                    src={program.image}
                    alt={`${program.outcomeTitle || program.title} - ${program.internalName} training program`}
                    className="w-full h-full object-cover filter brightness-90 contrast-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/30 to-transparent" />
                  <div className="absolute top-3 left-3 bg-[#ccff00] text-black px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase">
                    {program.category}
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white">
                    <span className="truncate">{program.targetRace}</span>
                    <span className="text-[#ccff00]">{program.badge}</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-3.5">
                  <div>
                    <span className="text-[11px] font-mono text-[#ccff00] uppercase tracking-wider block">
                      {program.internalName}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                      {program.outcomeTitle || program.title}
                    </h3>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-slate-300">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#ccff00] block mb-0.5">Best for:</span>
                    <span className="font-mono">{program.bestFor}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">What You Will Build:</span>
                    {program.whatYouBuild?.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                        <Zap className="w-3 h-3 text-[#ccff00] flex-shrink-0" />
                        <span className="truncate">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span>{program.duration}</span>
                    <span>•</span>
                    <span>{program.frequency}</span>
                    <span>•</span>
                    <span className="truncate">{program.mode}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-white font-mono block leading-none">{program.price}</span>
                  <span className="text-[10px] font-mono text-slate-500">{program.tax}</span>
                </div>
                <button
                  onClick={() => onRegister(program)}
                  className="py-2.5 px-5 min-h-[44px] rounded-xl bg-[#ccff00] text-black text-xs font-mono font-black uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>VIEW PROGRAM</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. CRIMSON VELOCITY (Dark • Speed Runway)
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2" role="tablist" aria-label="Filter programs by goal category">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 min-h-[44px] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex-shrink-0 flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-[#ff1e42] text-white shadow-[0_0_15px_rgba(255,30,66,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-5 md:grid-cols-2 lg:grid-cols-3 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar items-stretch">
        {filtered.map((program) => (
          <div
            key={program.id}
            className="w-[86vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center rounded-2xl border border-[#26161b] bg-[#110e12] hover:border-[#ff1e42] transition-all flex flex-col justify-between relative group shadow-xl overflow-hidden"
          >
            <div>
              {/* Authentic JJs Program Banner */}
              <div className="relative h-44 overflow-hidden bg-black">
                <img
                  src={program.image}
                  alt={`${program.outcomeTitle || program.title} - ${program.internalName} training program`}
                  className="w-full h-full object-cover filter brightness-95 contrast-125 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110e12] via-[#110e12]/40 to-transparent" />
                <div className="absolute top-3 left-3 bg-[#ff1e42] text-white px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase shadow-lg">
                  {program.category}
                </div>
                <div className="absolute top-3 right-3 bg-black/80 border border-white/20 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                  {program.duration}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[11px] font-mono text-[#ff1e42] uppercase tracking-wider block">
                    {program.internalName}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {program.outcomeTitle || program.title}
                  </h3>
                </div>

                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#ff1e42] block mb-0.5">Best for:</span>
                  <span>{program.bestFor}</span>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">What You Will Build:</span>
                  {program.whatYouBuild?.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e42]" />
                      <span className="truncate">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <span>{program.duration}</span>
                  <span>•</span>
                  <span>{program.frequency}</span>
                  <span>•</span>
                  <span className="truncate">{program.mode}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-zinc-800/80 mt-3 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-white font-mono block leading-none">{program.price}</span>
                <span className="text-[10px] font-mono text-zinc-500">{program.tax}</span>
              </div>
              <button
                onClick={() => onRegister(program)}
                className="py-2.5 px-5 min-h-[44px] rounded-lg bg-[#ff1e42] text-white text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,30,66,0.3)] cursor-pointer"
              >
                <span>VIEW PROGRAM</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
