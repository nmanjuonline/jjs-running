import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, Shield, MapPin, Play, Activity, Sparkles, ChevronRight, ChevronLeft, Award, Clock, Compass, Zap, CheckCircle2, Sun, Quote } from 'lucide-react';

const HERO_IMAGES = [
  {
    src: '/images/jjs/login_bg1.jpg',
    alt: 'JJs Running squad start line in morning dawn light'
  },
  {
    src: '/images/jjs/JJS-Slider.png',
    alt: 'JJs Running community stride across Bangalore'
  },
  {
    src: '/images/jjs/SLIDER-JJS_2.png',
    alt: 'Coached marathon training pack on road'
  },
  {
    src: '/images/jjs/Slider_3.png',
    alt: 'JJs marathon finish-line celebrations and team energy'
  },
  {
    src: '/images/jjs/home_2.jpg',
    alt: 'Morning aerobic base conditioning workout'
  },
  {
    src: '/images/jjs/coach_slide_wide.jpg',
    alt: 'Coach Pramod Deshpande, Founder and Chief Coach of Jayanagar Jaguars',
    isCoach: true
  }
];
import JJSLogo from './JJSLogo';

export default function Hero({ currentTheme, onBookTrial, onExploreCenters, onOpenCalc }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);
  // =========================================================================
  // THEME 1: SWISS CLEAN / OLYMPIC MINIMAL (Wide Panoramic Banner • JJs Red & Blue)
  // =========================================================================
  if (currentTheme === 'olympic-clean' || currentTheme === 'street-crew' || currentTheme === 'swiss-light' || currentTheme === 'swiss-dark') {
    const isDark = currentTheme === 'swiss-dark';

    return (
      <section className={`relative overflow-hidden pt-4 pb-12 lg:py-16 transition-colors duration-300 ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-white text-slate-900'}`}>
        {/* Subtle geometric grid background */}
        <div className={`absolute inset-0 -z-10 bg-[size:3.5rem_3.5rem] ${isDark ? 'bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] opacity-30' : 'bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] opacity-70'}`} />
        <div className={`absolute top-0 right-1/4 -z-10 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-blue-900/25' : 'bg-blue-50'}`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Grand Panoramic Hero Card (Wide Image Section) */}
          <div className={`rounded-3xl border overflow-hidden relative group shadow-[0_20px_50px_-15px_rgba(0,50,150,0.18)] ${
            isDark ? 'border-slate-800 bg-slate-950 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]' : 'border-slate-200/90 bg-white'
          }`}>
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative min-h-[540px] sm:min-h-0 sm:h-[420px] md:h-[480px] w-full overflow-hidden bg-slate-950 p-4 sm:p-0 flex flex-col justify-between sm:block"
            >
              {/* Automatic Cross-Fade Carousel Slides */}
              {HERO_IMAGES.map((img, idx) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className={`absolute inset-0 w-full h-full object-cover ${
                    img.isCoach
                      ? 'object-[75%_top] sm:object-[78%_center]'
                      : 'object-center'
                  } transition-all duration-1000 ease-in-out ${
                    activeSlide === idx
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                />
              ))}

              {/* Cinematic multi-stop gradient overlay for crisp contrast */}
              {activeSlide === 5 ? (
                <>
                  {/* Mobile bottom gradient (leaves top 55% open for Coach's face) */}
                  <div className="sm:hidden absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 via-45% to-transparent pointer-events-none z-[1]" />
                  {/* Desktop left-to-right gradient */}
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none z-[1]" />
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none z-[1]" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/25 pointer-events-none z-[1]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent pointer-events-none z-[1]" />
                </>
              )}

              {/* Carousel Indicators & Controls */}
              <div className="absolute z-20 bottom-3 right-4 sm:bottom-4 sm:right-6 flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
                role="tablist"
                aria-label="Carousel slide controls"
              >
                {HERO_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    role="tab"
                    aria-selected={activeSlide === idx}
                    aria-label={`Go to slide ${idx + 1} of ${HERO_IMAGES.length}`}
                    className="p-1 cursor-pointer focus:outline-none"
                  >
                    <span
                      className={`block transition-all duration-300 rounded-full ${
                        activeSlide === idx
                          ? 'w-6 h-2 bg-[#d02426]'
                          : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Navigation Arrows (Visible on Desktop Hover, >= 44x44px Touch Targets) */}
              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
                aria-label="Previous slide"
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/20 cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length)}
                aria-label="Next slide"
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/20 cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Floating Top Pills */}
              {activeSlide === 5 ? (
                <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6 sm:mb-0 sm:absolute sm:top-5 sm:left-6 md:top-6 md:left-8">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#d02426] text-white shadow-lg flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 fill-white" />
                    MESSAGE FROM CHIEF COACH
                  </span>
                  <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-md">
                    Pramod Deshpande • Founder
                  </span>
                  <span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#318cdd]/25 border border-[#318cdd]/50 text-[#4ca6f5] backdrop-blur-md">
                    17,000+ RUNNERS TRANSFORMED
                  </span>
                </div>
              ) : (
                <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6 sm:mb-0 sm:absolute sm:top-5 sm:left-6 md:top-6 md:left-8">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#d02426] text-white shadow-lg flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    AEROBIC PERIODIZATION
                  </span>
                  <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-md">
                    17,000+ Coached Runners
                  </span>
                  <span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#318cdd]/25 border border-[#318cdd]/50 text-[#4ca6f5] backdrop-blur-md">
                    3 CITIES • TUE, THU, SAT &amp; SUN @ 5:30 AM
                  </span>
                </div>
              )}

              {/* Integrated Bottom Hero Content Overlay */}
              {activeSlide === 5 ? (
                <div className="relative z-10 text-white max-w-xl md:max-w-2xl space-y-2.5 sm:space-y-4 mt-auto sm:mt-0 sm:absolute sm:bottom-0 sm:left-0 sm:p-8 md:p-10 px-1 pb-3">
                  <h1 className="text-lg sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight sm:leading-[0.98]">
                    EVERY RUNNER HAS AN
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ca6f5] via-[#318cdd] to-[#ff4d4f]">
                      ATHLETE WAITING WITHIN.
                    </span>
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-snug sm:leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
                    "Running is never about competing with others. It is about discovering what you are truly capable of through science, discipline, and community. Start where you are; our coaches will guide every single stride."
                  </p>

                  <div className="flex items-center gap-3 pt-0.5">
                    <div className="border-l-2 border-[#d02426] pl-2.5">
                      <span className="text-xs sm:text-sm font-black text-white block">Coach Pramod Deshpande</span>
                      <span className="text-[10px] sm:text-xs text-slate-300 font-medium block">Founder &amp; Chief Coach, Jayanagar Jaguars</span>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2 sm:gap-3 pt-1">
                    <button
                      onClick={onBookTrial}
                      className="flex-1 sm:flex-initial py-2.5 sm:py-3 px-4 sm:px-7 rounded-2xl bg-[#d02426] hover:bg-[#b51c1e] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-[0_10px_25px_-5px_rgba(208,36,38,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <span>Book Free Trial</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>

                    <button
                      onClick={onExploreCenters}
                      className="flex-1 sm:flex-initial py-2.5 sm:py-3 px-3.5 sm:px-6 rounded-2xl bg-white/95 hover:bg-white text-slate-900 text-xs sm:text-sm font-bold transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#318cdd] stroke-[2.5]" />
                      <span>Find Grounds</span>
                    </button>
                  </div>
                </div>) : (
                <div className="relative z-10 text-white max-w-4xl space-y-3 sm:space-y-4 mt-auto sm:mt-0 sm:absolute sm:bottom-0 sm:inset-x-0 sm:p-8 md:p-10">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.96]">
                    RUN WITH SCIENCE.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ca6f5] via-[#318cdd] to-[#ff4d4f]">
                      CONQUER EVERY MILE.
                    </span>
                  </h1>

                  <p className="text-xs sm:text-base text-slate-200 max-w-2xl leading-relaxed font-medium">
                    Structured heart-rate zone training, cadence calibration, and injury-free marathon milestones led by certified Training Center Heads (TCH).
                  </p>

                  <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                    <button
                      onClick={onBookTrial}
                      className="py-3 px-6 sm:px-7 rounded-2xl bg-[#d02426] hover:bg-[#b51c1e] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-[0_10px_25px_-5px_rgba(208,36,38,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer"
                    >
                      <span>Book Free Trial Run</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <button
                      onClick={onExploreCenters}
                      className="py-3 px-5 sm:px-6 rounded-2xl bg-white/95 hover:bg-white text-slate-900 text-xs sm:text-sm font-bold transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-[#318cdd] stroke-[2.5]" />
                      <span>Explore Nearby Grounds</span>
                    </button>

                    <button
                      onClick={onOpenCalc}
                      className="py-3 px-4 rounded-2xl bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md text-xs sm:text-sm font-mono font-bold uppercase transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer"
                    >
                      <Activity className="w-4 h-4 text-[#4ca6f5]" />
                      <span>Pace Calculator</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clean Metric Counters Row Beneath Panoramic Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`block text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>17,000+</span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Runners Coached • 12+ Years</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#d02426]/10 flex items-center justify-center text-[#d02426]">
                  <Flame className="w-5 h-5 fill-[#d02426]" />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-[#318cdd]/15 border-[#318cdd]/30' : 'bg-[#318cdd]/8 border-[#318cdd]/25 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`block text-2xl sm:text-3xl font-black ${isDark ? 'text-[#4ca6f5]' : 'text-[#1d72bd]'}`}>20+</span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-[#1d72bd]'}`}>Active Training Grounds</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#318cdd]/20 flex items-center justify-center text-[#318cdd]">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`block text-2xl sm:text-3xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>98.4%</span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Injury-Free Completion Rate</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // THEME 2: SUNRISE STRIDE (Light • Nike Run Club / Radiant Dawn Panoramic Deck)
  // =========================================================================
  if (currentTheme === 'sunrise-coral' || currentTheme === 'heritage-gold') {
    return (
      <section className="relative overflow-hidden pt-4 pb-14 lg:py-16 bg-[#fffaf5] text-zinc-900 transition-colors">
        {/* Soft Golden Hour Glow Background */}
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/50 via-orange-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Morning Callout Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200/80">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md">
                <Sun className="w-4 h-4 animate-spin-slow" />
              </span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-orange-900 block">
                  05:30 AM MORNING RUN CLUB • 20+ NEIGHBORHOOD GROUNDS
                </span>
                <span className="text-[11px] text-zinc-600 font-medium">
                  Led by certified Training Center Heads (TCH) across Bengaluru, Pune, and Kolkata.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold self-start sm:self-auto">
              <span className="px-2.5 py-1 rounded-full bg-white text-orange-700 border border-orange-200 shadow-sm">
                Next Muster: Tomorrow 5:30 AM
              </span>
            </div>
          </div>

          {/* Grand Panoramic Dawn Card with Authentic JJs Pack Photo */}
          <div className="rounded-3xl border border-orange-200/90 bg-white shadow-[0_20px_50px_-15px_rgba(255,72,0,0.15)] overflow-hidden relative group">
            <div className="relative min-h-[520px] sm:min-h-0 sm:h-[420px] md:h-[480px] w-full overflow-hidden bg-zinc-950 p-5 sm:p-0 flex flex-col justify-between sm:block">
              <img
                src="/images/jjs/login_bg1.jpg"
                alt="JJs Running massive squad on morning run"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-zinc-950/15" />

              {/* Floating Top Pill */}
              <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6 sm:mb-0 sm:absolute sm:top-5 sm:left-6 md:top-6 md:left-8">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" />
                  THE SUNRISE STRIDE
                </span>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-zinc-900 backdrop-blur-md shadow-md">
                  17,000+ Coached Runners
                </span>
              </div>

              {/* Integrated Bottom Hero Content Overlay */}
              <div className="relative z-10 text-white max-w-4xl space-y-3 sm:space-y-4 mt-auto sm:mt-0 sm:absolute sm:bottom-0 sm:inset-x-0 sm:p-8 md:p-10">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.96]">
                    WAKE UP WITH PURPOSE.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100">
                      RUN WITH FAMILY.
                    </span>
                  </h1>
                  <p className="text-xs sm:text-base text-zinc-200 max-w-2xl leading-relaxed font-medium">
                    India’s warmest distance running community. Structured 5:30 AM sessions with designated pace mentors, heart-rate zone conditioning, and injury-free marathon milestones.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                    <button
                      onClick={onBookTrial}
                      className="py-3 px-6 sm:px-7 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-[0_10px_25px_-5px_rgba(255,72,0,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
                    >
                      <span>Book Free Sunrise Trial</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <button
                      onClick={onExploreCenters}
                      className="py-3 px-5 sm:px-6 rounded-2xl bg-white/95 hover:bg-white text-zinc-900 text-xs sm:text-sm font-bold transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
                    >
                      <MapPin className="w-4 h-4 text-orange-600 stroke-[2.5]" />
                      <span>Find Your Morning Ground</span>
                    </button>
                  </div>
              </div>
            </div>
          </div>

          {/* Morning Routine 4-Step Stride Pathway */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-orange-100/90 shadow-sm space-y-1">
              <span className="text-[10px] font-mono text-orange-600 font-bold uppercase">05:30 AM • STEP 1</span>
              <h4 className="text-xs sm:text-sm font-black text-zinc-900">Dynamic Warmup</h4>
              <p className="text-[11px] text-zinc-500">Joint activation & stride drills</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-orange-100/90 shadow-sm space-y-1">
              <span className="text-[10px] font-mono text-orange-600 font-bold uppercase">05:45 AM • STEP 2</span>
              <h4 className="text-xs sm:text-sm font-black text-zinc-900">Zone 2 Aerobic Run</h4>
              <p className="text-[11px] text-zinc-500">Guided pacing with pack mentors</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-orange-100/90 shadow-sm space-y-1">
              <span className="text-[10px] font-mono text-orange-600 font-bold uppercase">06:40 AM • STEP 3</span>
              <h4 className="text-xs sm:text-sm font-black text-zinc-900">Core & Flexibility</h4>
              <p className="text-[11px] text-zinc-500">Injury-proofing muscle strength</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-mono text-orange-700 font-bold uppercase">07:00 AM • STEP 4</span>
              <h4 className="text-xs sm:text-sm font-black text-orange-950">Post-Run Chai & Chat</h4>
              <p className="text-[11px] text-zinc-600">The unbreakable JJs runner bond</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // THEME 3: KINETIC VOLT (Dark • Asymmetric Bento Cockpit & Telemetry Hero Image)
  // =========================================================================
  if (currentTheme === 'kinetic') {
    return (
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-[#090a0f] text-white">
        {/* Cockpit Grid & Telemetry Glow Background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1e223015_1px,transparent_1px),linear-gradient(to_bottom,#1e223015_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-1/4 left-1/3 -z-10 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Primary Bento Hero Pod with Telemetry (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl p-6 sm:p-9 border border-[#1e2230] bg-[#11131c]/95 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between pb-5 border-b border-[#1e2230]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-ping" />
                  <span className="font-mono text-xs font-bold tracking-widest text-[#ccff00] uppercase">
                    BIOMETRIC HUD // ONCA SYNC
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 font-bold">
                  LAT 12.9716° N • 20+ HUBS
                </span>
              </div>

              <div className="py-6 space-y-3.5">
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95]">
                  BIOMETRIC MASTERY.
                  <br />
                  <span className="text-[#ccff00]">DECODE SPEED.</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Join 17,000+ runners powered by scientific periodization, heart-rate zone calibration, and certified Training Center Heads (TCH) across 20+ grounds.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1e2230]">
                <button
                  onClick={onBookTrial}
                  className="py-3 px-6 rounded-2xl bg-[#ccff00] text-black text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>INITIALIZE FREE TRIAL</span>
                </button>

                <button
                  onClick={onExploreCenters}
                  className="py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-bold border border-white/10 transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[#ccff00]" />
                  <span>RADAR 20+ CENTERS</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-4 mt-4 border-t border-[#1e2230] text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">TARGET CADENCE</span>
                  <span className="text-white font-black text-base">178 SPM</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">HEART RATE</span>
                  <span className="text-[#ccff00] font-black text-base">ZONE 2 LOCK</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">ACTIVE CREW</span>
                  <span className="text-white font-black text-base">17,000+</span>
                </div>
              </div>
            </div>

            {/* Right Side: High-Impact Hero Runner Image Pod + Telemetry Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="rounded-3xl border border-[#1e2230] bg-[#11131c] overflow-hidden relative shadow-2xl flex-1 min-h-[280px] group">
                <img
                  src="/images/jjs/730731030.jpg"
                  alt="Authentic JJs marathon pack in action"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/40 to-transparent" />

                <div className="absolute top-3 left-3 bg-black/70 border border-[#ccff00]/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#ccff00] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                  <span>VO2 MAX ACCELERATOR</span>
                </div>

                <div className="absolute top-3 right-3 bg-black/70 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-300">
                  GPS SYNC ACTIVE
                </div>

                <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#ccff00] uppercase block">NEXT MORNING MUSTER</span>
                    <span className="text-xs font-bold text-white">05:30 AM • 20+ Hubs with TCH</span>
                  </div>
                  <span className="font-mono text-xs px-2 py-1 rounded bg-[#ccff00] text-black font-black">
                    FREE TRIAL
                  </span>
                </div>
              </div>

              <div className="rounded-2xl p-4 border border-[#1e2230] bg-[#11131c] flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[#ccff00]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Scientific Base Periodization</span>
                    <span className="text-[10px] font-mono text-slate-400">98.4% Injury-Free Longevity Rate</span>
                  </div>
                </div>
                <button
                  onClick={onOpenCalc}
                  className="text-xs font-mono text-[#ccff00] underline underline-offset-4 font-bold hover:text-white"
                >
                  Splits
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // THEME 4: CRIMSON VELOCITY (Dark • Breaking2 Speed Runway Hero Image)
  // =========================================================================
  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-[#070709] text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ff1e42]/20 via-transparent to-black" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff1e42]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Digital Stopwatch Ticker Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-[#110e12] border border-[#ff1e42]/30 rounded-2xl py-2 px-4 flex items-center justify-between text-xs font-mono shadow-[0_0_15px_rgba(255,30,66,0.15)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff1e42] animate-ping" />
            <span className="font-bold tracking-wider text-[#ff1e42] uppercase">BREAKING2 SUB-3H MARATHON PROTOCOL</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-zinc-400">
            <span>PACE: <strong className="text-white">4:15 /KM</strong></span>
            <span>SPLIT: <strong className="text-[#ff1e42]">02:59:59</strong></span>
            <span>20+ CENTERS DEPLOYED</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Aggressive Speed Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff1e42]/15 border border-[#ff1e42]/40 text-[#ff1e42] text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-[#ff1e42]" />
              <span>HIGH-VELOCITY DISTANCE ACADEMY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95]">
              SHATTER LIMITS.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff1e42] via-orange-500 to-amber-400">
                BREAK 42.195 KM.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
              Lactate threshold intervals, high-speed pace squads, and negative-split race tactics engineered by India’s most successful marathon coaching institution.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onBookTrial}
                className="py-3.5 px-8 rounded-xl bg-[#ff1e42] text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-[0_0_25px_rgba(255,30,66,0.4)] flex items-center gap-2"
              >
                <span>JOIN SPEED CAMP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCenters}
                className="py-3.5 px-6 rounded-xl bg-zinc-900 text-white text-xs sm:text-sm font-bold border border-zinc-800 hover:border-[#ff1e42] transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#ff1e42]" />
                <span>20+ Training Camps</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="text-zinc-500 uppercase">OFFICIAL TARGET SPLITS:</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white">5K: <strong>24:59</strong></span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white">10K: <strong>49:59</strong></span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-[#ff1e42]/40 text-[#ff1e42] font-bold">21K: <strong>01:39:59</strong></span>
              <span className="px-2 py-0.5 rounded bg-[#ff1e42]/20 border border-[#ff1e42] text-[#ff1e42] font-black">42K: <strong>02:59:59</strong></span>
            </div>
          </div>

          {/* Right Column: Hero Runner Image */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#26161b] bg-[#110e12] shadow-2xl relative overflow-hidden group">
              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <img
                  src="/images/jjs/956832147.jpg"
                  alt="High-speed marathon pack in redline velocity"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110e12] via-[#110e12]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff1e42]/20 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="bg-[#ff1e42] text-white text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded shadow-lg">
                    RACE DAY GUN TIME
                  </span>
                  <span className="bg-black/70 border border-white/20 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur-md">
                    SUB-3H TARGET
                  </span>
                </div>

                <div className="absolute bottom-3 inset-x-3 p-4 rounded-2xl bg-black/80 border border-[#ff1e42]/40 backdrop-blur-xl">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                    <span className="text-zinc-400 uppercase font-bold">NEXT TARGET MARATHON:</span>
                    <span className="text-[#ff1e42] font-black">TMM &amp; TCS 10K '27</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white font-bold block">45+ Certified TCHs On Ground</span>
                      <span className="text-[10px] text-zinc-400">Tue, Thu, Sat &amp; Sun @ 5:30 AM</span>
                    </div>
                    <button
                      onClick={onBookTrial}
                      className="px-3 py-1.5 rounded-lg bg-[#ff1e42] hover:bg-white hover:text-black text-white text-[11px] font-black uppercase transition-all"
                    >
                      LOCK SPOT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
