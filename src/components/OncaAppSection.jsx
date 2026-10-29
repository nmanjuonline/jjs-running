import React from 'react';
import { Smartphone, Activity, Heart, Trophy, ShieldCheck, ArrowRight } from 'lucide-react';

export default function OncaAppSection({ onGetApp }) {
  return (
    <div
      className="rounded-3xl p-5 sm:p-8 md:p-12 border relative overflow-hidden transition-all shadow-2xl max-w-full"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Background ambient gradient glow safely constrained */}
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: 'var(--accent)' }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center relative z-10">
        {/* Left Column: Text & Features */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border shadow-xs"
            style={{
              backgroundColor: 'var(--badge-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent)'
            }}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Official Mobile Companion
          </div>

          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase"
            style={{ color: 'var(--text-heading)' }}
          >
            Meet the Onca Run App. Your pocket running coach.
          </h2>

          <p className="text-xs sm:text-base opacity-75 leading-relaxed max-w-xl">
            The digital gateway to the JJs Running structured training ecosystem. Sync seamlessly with your Garmin, Apple Watch, Coros, or phone GPS. Get audio pace cues, track your weekly SLR mileage, log nutrition, and stay in direct sync with your Training Center Head.
          </p>

          {/* Key pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div
              className="p-3.5 rounded-2xl border space-y-1.5"
              style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
            >
              <Activity className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>
                Structured Training
              </h4>
              <p className="text-[11px] opacity-70">Daily prescribed workouts, pace bands, and cadence drills.</p>
            </div>

            <div
              className="p-3.5 rounded-2xl border space-y-1.5"
              style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>
                Nutrition &amp; Health
              </h4>
              <p className="text-[11px] opacity-70">Pre-race carb loading protocols, hydration guides &amp; gut training.</p>
            </div>

            <div
              className="p-3.5 rounded-2xl border space-y-1.5"
              style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>
                Jaguar Network
              </h4>
              <p className="text-[11px] opacity-70">Weekend group run meetups, cheer squads &amp; inter-center leaderboard.</p>
            </div>
          </div>

          {/* App download buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://itunes.apple.com/in/app/onca-run/id1313795414?mt=8"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all hover:scale-105 shadow-sm"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)'
              }}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.36-.58.67-1.09 1.74-.95 2.77.99.08 2.06-.52 2.68-1.28z"/>
              </svg>
              <div className="text-left">
                <span className="block text-[9px] opacity-60 uppercase tracking-wider">Download on the</span>
                <span className="text-xs font-bold leading-none" style={{ color: 'var(--text-heading)' }}>Apple App Store</span>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=exarcplus.com.jayanagarajaguars"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all hover:scale-105 shadow-sm"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)'
              }}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.03 2.03 0 0 1-.22-.924V2.738c0-.34.08-.654.22-.924zm11.306 11.307l2.257 2.256-11.83 6.78 9.573-9.036zm2.256-2.256l-2.256 2.256L5.342 4.085l11.83 6.78zm1.093 1.093l2.87 1.644c.82.47.82 1.238 0 1.708l-2.87 1.644-2.029-2.029 2.029-1.967z"/>
              </svg>
              <div className="text-left">
                <span className="block text-[9px] opacity-60 uppercase tracking-wider">Get it on</span>
                <span className="text-xs font-bold leading-none" style={{ color: 'var(--text-heading)' }}>Google Play</span>
              </div>
            </a>

            {onGetApp && (
              <button
                onClick={onGetApp}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 shadow-sm text-white bg-[#318cdd] hover:bg-[#2573b8] cursor-pointer"
              >
                <span>Connect with Coach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: App HUD UI Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-xs sm:max-w-sm rounded-[2.2rem] p-3.5 bg-gradient-to-b from-slate-900 to-black border-4 border-slate-700 shadow-2xl relative">
            {/* Notch */}
            <div className="w-28 h-4 bg-black rounded-b-xl mx-auto mb-3" />

            {/* Inner Phone Screen */}
            <div className="rounded-2xl p-4 bg-[#080B11] border border-white/10 space-y-3.5 text-white">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-emerald-400 font-bold">LIVE SLR WORKOUT</span>
                </div>
                <span className="font-mono text-[10px]">Shalini Grounds</span>
              </div>

              {/* Main Metric */}
              <div className="text-center py-1 border-b border-white/5">
                <span className="text-4xl sm:text-5xl font-black font-mono tabular-num tracking-tight" style={{ color: 'var(--accent)' }}>
                  18.42
                </span>
                <span className="text-[10px] text-gray-400 block font-mono mt-0.5">KILOMETERS COMPLETED</span>
              </div>

              {/* Splits Row */}
              <div className="grid grid-cols-3 gap-1.5 text-center py-1">
                <div className="p-1.5 rounded-xl bg-white/5">
                  <span className="block text-[9px] text-gray-400">AVG PACE</span>
                  <span className="text-xs font-black font-mono tabular-num">5:18 /km</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white/5">
                  <span className="block text-[9px] text-gray-400">TIME</span>
                  <span className="text-xs font-black font-mono tabular-num">1:37:40</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white/5">
                  <span className="block text-[9px] text-gray-400">CADENCE</span>
                  <span className="text-xs font-black font-mono tabular-num" style={{ color: 'var(--accent)' }}>180 spm</span>
                </div>
              </div>

              {/* Elevation graph SVG */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between text-[9px] text-gray-400 mb-1">
                  <span>ELEVATION PROFILE</span>
                  <span className="font-mono tabular-num text-amber-400">+142m GAIN</span>
                </div>
                <svg className="w-full h-11" viewBox="0 0 200 60">
                  <defs>
                    <linearGradient id="appElevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,50 Q20,40 40,45 T80,30 T120,38 T160,18 T200,32 L200,60 L0,60 Z"
                    fill="url(#appElevGrad)"
                  />
                  <path
                    d="M0,50 Q20,40 40,45 T80,30 T120,38 T160,18 T200,32"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* TCH Feedback Note */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>TCH Kumar: "Smooth cadence at km 15! Hydrate with electrolyte at km 20."</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}