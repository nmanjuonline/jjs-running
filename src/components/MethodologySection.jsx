import React from 'react';
import { ShieldCheck, Heart, Zap, Activity, Coffee, Users, Calendar, Award, CheckCircle2, ChevronRight, Compass } from 'lucide-react';

export default function MethodologySection({ onExploreCenters }) {
  const pillars = [
    {
      icon: Heart,
      title: 'Zone 2 Aerobic Base',
      subtitle: 'Mitochondrial Conditioning',
      description: 'Systematic low-heart-rate pacing designed to promote mitochondrial development and improve fat-oxidation efficiency without joint stress or burnout.',
      highlight: '70% of weekly volume'
    },
    {
      icon: Activity,
      title: 'Cadence & Biomechanics',
      subtitle: '175-185 SPM Stride',
      description: 'Form correction, posture alignment, a forward lean from the ankles, and midfoot landing under your center of mass to reduce the impact associated with heel striking.',
      highlight: 'Target: 180 SPM rhythm'
    },
    {
      icon: ShieldCheck,
      title: 'Strength, Core & Mobility',
      subtitle: 'Injury-Proofing',
      description: 'Periodized weekday functional strength routines, glute and hip stability drills, dynamic warm-ups, and dedicated post-run stretching circuits.',
      highlight: '98.4% Injury-Free Completion Rate'
    },
    {
      icon: Compass,
      title: 'Supported Weekend SLRs',
      subtitle: 'Slow Long Runs',
      description: 'Progressive weekend distance simulations with dedicated on-route hydration, electrolyte fluids, nutrition stations, and pace mentors.',
      highlight: 'Fully supported routes'
    }
  ];

  const weeklySchedule = [
    {
      day: 'Tuesday',
      time: '05:30 AM',
      focus: 'Intervals & Form',
      description: 'Track workouts, 400m/800m repeats, cadence drills, and neuromuscular speed conditioning.'
    },
    {
      day: 'Thursday',
      time: '05:30 AM',
      focus: 'Tempo & Core',
      description: 'Lactate-threshold tempo runs paired with functional core, glute, and hip stability circuits.'
    },
    {
      day: 'Saturday',
      time: '05:30 AM',
      focus: 'The Signature SLR',
      description: 'Progressive Slow Long Run (SLR) with dedicated on-route hydration, electrolyte fueling, and pace mentors.'
    },
    {
      day: 'Sunday',
      time: '05:30 AM',
      focus: 'Recovery Run & Mobility',
      description: 'Easy aerobic recovery run, joint mobility, cool-down stretching circle, and post-run debrief with filter coffee.'
    }
  ];

  return (
    <section id="methodology" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
          style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
        >
          <Zap className="w-3.5 h-3.5" />
          The Science of Endurance
        </span>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase"
          style={{ color: 'var(--text-heading)' }}
        >
          Run With Science. Not Guesswork.
        </h2>

        <p className="text-xs sm:text-base opacity-75 leading-relaxed">
          How JJs Running achieves a 98%+ injury-free rate across 17,000+ runners, transforming complete beginners into confident marathon finishers and endurance runners.
        </p>
      </div>

      {/* 4 Science Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden group"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: 'var(--badge-bg)',
                      color: 'var(--accent)'
                    }}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="font-mono text-[10px] font-bold opacity-50">
                    PILLAR 0{idx + 1}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--accent)' }}>
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-lg font-black tracking-tight mt-0.5" style={{ color: 'var(--text-heading)' }}>
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-xs opacity-75 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t mt-4" style={{ borderColor: 'var(--border-color)' }}>
                <span
                  className="inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    color: 'var(--text-heading)'
                  }}
                >
                  {pillar.highlight}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Training Blueprint & SLR Protocol */}
      <div
        className="rounded-3xl p-6 sm:p-8 md:p-10 border shadow-xl relative overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
            >
              <Calendar className="w-3.5 h-3.5" />
              Weekly Ground Schedule
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ color: 'var(--text-heading)' }}>
              The 4-Day Training Protocol
            </h3>
            <p className="text-xs sm:text-sm opacity-70 mt-1 max-w-xl">
              Training sessions are led across 20+ neighborhood grounds by designated Training Center Heads (TCHs). Sessions begin at 5:30 AM sharp.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-heading)' }}>
              05:30 AM - 07:00 AM Call-Up
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {weeklySchedule.map((item) => (
            <div
              key={item.day}
              className="p-4 rounded-2xl border space-y-2 transition-all hover:scale-102"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-black text-sm uppercase" style={{ color: 'var(--text-heading)' }}>
                  {item.day}
                </span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px]" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}>
                  {item.time}
                </span>
              </div>

              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {item.focus}
              </h4>

              <p className="text-[11px] opacity-75 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The Jaguar Spirit & Community Culture Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 md:p-10 border shadow-xl relative overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
            >
              <Users className="w-3.5 h-3.5" />
              The Jaguar Spirit & Culture
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight" style={{ color: 'var(--text-heading)' }}>
              No Runner Left Behind. Ever.
            </h3>

            <p className="text-xs sm:text-sm opacity-75 leading-relaxed max-w-2xl">
              Our community includes everyone from college students to runners in their 70s and 80s, as well as software engineers, doctors, teachers, entrepreneurs, and homemakers. Whether your pace is 4:15 min/km or 9:30 min/km, JJs Running welcomes you with dedicated pace mentors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}>
                <Coffee className="w-4 h-4 text-amber-500" />
                <h5 className="text-xs font-bold" style={{ color: 'var(--text-heading)' }}>Post-Run Chai & Debrief</h5>
                <p className="text-[10px] opacity-65">Enjoy our signature Sunday morning recovery run, stretching circle, and filter coffee.</p>
              </div>

              <div className="p-3 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}>
                <Award className="w-4 h-4 text-rose-500" />
                <h5 className="text-xs font-bold" style={{ color: 'var(--text-heading)' }}>Major Race Charters</h5>
                <p className="text-[10px] opacity-65">Travel charters, hospitality tents, and cheer zones for TMM, TCS 10K, and the World Marathon Majors.</p>
              </div>

              <div className="p-3 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h5 className="text-xs font-bold" style={{ color: 'var(--text-heading)' }}>Training Center Heads (TCH)</h5>
                <p className="text-[10px] opacity-65">Certified local ground leaders ensuring form guidance and safety every single session.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-3 pt-2 lg:pt-0">
            <button
              onClick={onExploreCenters}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-contrast)'
              }}
            >
              <span>Find Your Morning Ground</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="text-[11px] opacity-60 text-center lg:text-right w-full sm:w-auto">
              First coached morning trial is 100% free
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
