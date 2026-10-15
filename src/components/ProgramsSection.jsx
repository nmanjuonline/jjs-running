import React, { useState } from 'react';
import { Check, Flame, ArrowUpRight, Calendar, Users, Award, ChevronRight, Zap, Sun, Clock, ShieldCheck, Activity } from 'lucide-react';
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

  // =========================================================================
  // 1. SWISS CLEAN (Light • Swiss Minimalist / High-Performance On Running)
  // =========================================================================
  if (currentTheme === 'olympic-clean' || currentTheme === 'street-crew') {
    return (
      <div className="space-y-6">
        {/* Category Filter Pills - Sleek Minimalist Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-wide rounded-full transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>👈 Swipe horizontally to view all</span>
          <span>{filtered.length} Programs</span>
        </div>

        {/* Sleek Swiss Precision Cards Grid */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-6 md:grid-cols-2 lg:grid-cols-3 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          {filtered.map((program, idx) => (
            <div
              key={program.id}
              className="w-[86vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center bg-white rounded-3xl border border-slate-200 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(0,50,150,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Official JJS Program Image Strip */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                  {/* Top Index & Badge */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md">
                      SPEC 0{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-blue-700 shadow-md backdrop-blur-md">
                      {program.badge}
                    </span>
                  </div>

                  {/* Target race bottom */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold text-[11px] truncate">
                      <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{program.targetRace}</span>
                    </span>
                    <span className="font-mono bg-blue-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0">
                      {program.duration}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="font-semibold text-slate-700">{program.frequency}</span>
                    <span>•</span>
                    <span className="truncate">{program.level}</span>
                  </div>

                  <h3 className="text-xl font-black text-slate-950 tracking-tight leading-snug">
                    {program.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {program.description}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    {program.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-blue-600 stroke-[3]" />
                        </div>
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Register */}
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                <div>
                  <span className="text-2xl font-black text-slate-950 block leading-none">{program.price}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">{program.tax}</span>
                </div>

                <button
                  onClick={() => onRegister(program)}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 hover:scale-105 flex items-center gap-1.5"
                >
                  <span>Register</span>
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
  // 2. SUNRISE STRIDE (Light • Nike Run Club / Radiant Dawn Milestone Pathway)
  // =========================================================================
  if (currentTheme === 'sunrise-coral' || currentTheme === 'heritage-gold') {
    return (
      <div className="space-y-6">
        {/* Warm Sunrise Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-wide rounded-full transition-all duration-200 flex-shrink-0 ${
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

        {/* Milestone Pathway Stepper Header */}
        <div className="hidden lg:grid grid-cols-5 gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
            <span className="font-bold text-zinc-900">Beginner (FTR 5K)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
            <span className="font-bold text-zinc-900">Elevate 10K</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
            <span className="font-bold text-zinc-900">RYF 21K Half</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">4</span>
            <span className="font-bold text-zinc-900">RYF 42K Full</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">5</span>
            <span className="font-bold text-zinc-900">Ultra Trail & Remote</span>
          </div>
        </div>

        {/* Radiant Dawn Cards Deck */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-6 md:grid-cols-2 lg:grid-cols-3 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          {filtered.map((program) => (
            <div
              key={program.id}
              className="w-[86vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center bg-gradient-to-b from-white to-orange-50/30 rounded-3xl border border-orange-200/80 shadow-[0_12px_35px_-8px_rgba(255,72,0,0.12)] hover:shadow-[0_20px_45px_-10px_rgba(255,72,0,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Official Banner Image */}
                <div className="relative h-48 overflow-hidden bg-zinc-950">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-transparent" />

                  {/* Morning Chip */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-orange-600 shadow-md backdrop-blur-md flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
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
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-orange-800 font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-orange-100/80 font-bold text-[10px]">{program.frequency}</span>
                    <span>•</span>
                    <span className="truncate text-zinc-600">{program.level}</span>
                  </div>

                  <h3 className="text-xl font-black text-zinc-950 tracking-tight leading-snug">
                    {program.title}
                  </h3>

                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {program.description}
                  </p>

                  {/* Highlights with warm checkmarks */}
                  <div className="pt-3 border-t border-orange-100 space-y-1.5">
                    {program.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-700">
                        <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-orange-600 stroke-[3]" />
                        </div>
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Register */}
              <div className="p-5 sm:p-6 pt-0 border-t border-orange-100/80 flex items-center justify-between gap-3 mt-4">
                <div>
                  <span className="text-2xl font-black text-zinc-950 block leading-none">{program.price}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-medium">{program.tax}</span>
                </div>

                <button
                  onClick={() => onRegister(program)}
                  className="py-2.5 px-5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/25 hover:scale-105 flex items-center gap-1.5"
                >
                  <span>Start Journey</span>
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
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider rounded-xl transition-all flex-shrink-0 ${
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

        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-5 md:grid-cols-2 lg:grid-cols-3 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          {filtered.map((program, idx) => {
            const isFeatured = idx === 0 && activeCategory === 'All Programs';

            return (
              <div
                key={program.id}
                className={`w-[86vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center rounded-3xl border border-[#1e2230] bg-[#11131c] hover:border-[#ccff00]/60 transition-all duration-300 flex flex-col justify-between shadow-xl overflow-hidden ${
                  isFeatured ? 'md:col-span-2 md:flex-row' : ''
                }`}
              >
                {/* Official JJS Banner Image Pod */}
                <div className={`relative ${isFeatured ? 'md:w-1/2 min-h-[220px]' : 'h-44'} overflow-hidden bg-black`}>
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover filter brightness-90 contrast-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/30 to-transparent" />
                  <div className="absolute top-3 left-3 bg-black/70 border border-[#ccff00]/40 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-mono text-[#ccff00]">
                    TELEMETRY // {program.duration}
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white">
                    <span className="truncate">{program.targetRace}</span>
                    <span className="text-[#ccff00]">{program.badge}</span>
                  </div>
                </div>

                <div className={`p-5 flex flex-col justify-between ${isFeatured ? 'md:w-1/2' : ''}`}>
                  <div>
                    <h3 className="text-xl font-black uppercase text-white tracking-tight">
                      {program.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {program.description}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block">CADENCE</span>
                        <span className="text-white font-bold">175-185 SPM</span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block">ZONE</span>
                        <span className="text-[#ccff00] font-bold">AEROBIC Z2</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-white font-mono block leading-none">{program.price}</span>
                      <span className="text-[10px] font-mono text-slate-500">{program.tax}</span>
                    </div>
                    <button
                      onClick={() => onRegister(program)}
                      className="py-2.5 px-5 rounded-xl bg-[#ccff00] text-black text-xs font-mono font-black uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5"
                    >
                      <span>DEPLOY</span>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. CRIMSON VELOCITY (Dark • Breaking2 Speed Runway & Progressive Timeline)
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex-shrink-0 ${
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

      <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-5 md:grid-cols-2 lg:grid-cols-3 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        {filtered.map((program, idx) => (
          <div
            key={program.id}
            className="w-[86vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center rounded-2xl border border-[#26161b] bg-[#110e12] hover:border-[#ff1e42] transition-all flex flex-col justify-between relative group shadow-xl overflow-hidden"
          >
            <div>
              {/* Authentic JJS Program Banner */}
              <div className="relative h-44 overflow-hidden bg-black">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover filter brightness-95 contrast-125 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110e12] via-[#110e12]/40 to-transparent" />
                <div className="absolute top-3 left-3 bg-[#ff1e42] text-white px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase shadow-lg">
                  SPEED BLOCK 0{idx + 1}
                </div>
                <div className="absolute top-3 right-3 bg-black/80 border border-white/20 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                  {program.duration}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-black uppercase text-white tracking-tight">
                  {program.title}
                </h3>

                <div className="my-2.5 p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center justify-between">
                  <span>TARGET RACE:</span>
                  <strong className="text-[#ff1e42]">{program.targetRace}</strong>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {program.description}
                </p>

                <div className="mt-3 space-y-1 pt-2 border-t border-zinc-800">
                  {program.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e42]" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
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
                className="py-2.5 px-5 rounded-lg bg-[#ff1e42] text-white text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,30,66,0.3)]"
              >
                <span>LOCK SQUAD</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
