import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveTicker from './components/LiveTicker';
import ProgramsSection from './components/ProgramsSection';
import MethodologySection from './components/MethodologySection';
import PaceCalculator from './components/PaceCalculator';
import CentersExplorer from './components/CentersExplorer';
import OncaAppSection from './components/OncaAppSection';
import RaceCalendar from './components/RaceCalendar';
import Testimonials from './components/Testimonials';
import RegisterModal from './components/RegisterModal';
import Footer from './components/Footer';
import JJSLogo from './components/JJSLogo';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity, Flame, Sun } from 'lucide-react';

export default function App() {
  const theme = 'olympic-clean';

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [calcForceExpand, setCalcForceExpand] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', 'olympic-clean');
    localStorage.removeItem('jjs_theme');
  }, []);

  const handleOpenRegister = (data = null) => {
    setModalInitialData(data);
    setRegisterModalOpen(true);
  };

  const scrollToSection = (id) => {
    if (id === 'calculator') {
      setCalcForceExpand(true);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 w-full max-w-full overflow-x-hidden bg-white text-slate-900">
      {/* Navigation */}
      <Navbar
        onOpenRegister={() => handleOpenRegister()}
        onScrollTo={scrollToSection}
      />

      {/* Animated Live Milestones Ticker (Constrained to 100% width) */}
      <div className="w-full max-w-full overflow-hidden">
        <LiveTicker />
      </div>

      {/* Hero Section */}
      <Hero
        currentTheme={theme}
        onBookTrial={() => handleOpenRegister()}
        onExploreCenters={() => scrollToSection('centers')}
        onOpenCalc={() => scrollToSection('calculator')}
      />

      {/* Main Content Sections - Compact spacing for effortless mobile scrolling */}
      <main className="flex-1 space-y-12 sm:space-y-20 py-4 sm:py-8 w-full max-w-full overflow-hidden">
        {/* Programs Section */}
        <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              Scientific Periodization
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-slate-950">
              Flagship Training Programs
            </h2>
            <p className="text-xs sm:text-base mt-2 text-slate-600">
              From couch-to-5K beginners to sub-3-hour Boston Qualifiers. Backed by 12 years of empirical sports science and certified Training Center Heads (TCH).
            </p>
          </div>

          <ProgramsSection
            currentTheme={theme}
            onRegister={(program) => handleOpenRegister(program)}
          />
        </section>

        {/* Science & Methodology Section */}
        <MethodologySection
          currentTheme={theme}
          onExploreCenters={() => scrollToSection('centers')}
        />

        {/* 30+ Training Centers Explorer */}
        <section id="centers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1.5 shadow-sm">
                <Activity className="w-3.5 h-3.5" />
                Neighborhood Grounds
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-slate-950">
                30+ Centers &amp; Training Center Heads
              </h2>
              <p className="text-xs sm:text-sm mt-1 max-w-xl text-slate-600">
                Select your city and neighborhood center below to view morning timings, designated grounds, and connect with your Training Center Head (TCH).
              </p>
            </div>

            <div className="text-xs font-mono px-3.5 py-1.5 rounded-xl border flex items-center gap-2 self-start md:self-auto shadow-sm"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>5:30 AM – 7:00 AM • Tue, Thu, Sat, Sun</span>
            </div>
          </div>

          <CentersExplorer currentTheme={theme} onBookTrial={(center) => handleOpenRegister(center)} />
        </section>

        {/* Discreet Pace & Split Calculator Utility */}
        <section id="calculator" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <PaceCalculator
            forceExpand={calcForceExpand}
            onSelectProgram={(programId) => handleOpenRegister({ id: programId })}
          />
        </section>

        {/* Mobile App Telemetry HUD Section */}
        <section id="app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <OncaAppSection onGetApp={() => handleOpenRegister()} />
        </section>

        {/* Race Calendar & Camp Countdown */}
        <section id="races" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Target Race Calendar
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase"
              style={{ color: 'var(--text-heading)' }}
            >
              Marathon Campaigns & Squads
            </h2>
            <p className="text-xs sm:text-base mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              Train with our official target race squads with supported weekend LSD simulations, pacing groups, and finish-line hospitality.
            </p>
          </div>

          <RaceCalendar onJoinCamp={(race) => handleOpenRegister({ program: race.title })} />
        </section>

        {/* Runner Stories / Transformations */}
        <section id="stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Proven Transformations
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase"
              style={{ color: 'var(--text-heading)' }}
            >
              Stories from the Tarmac
            </h2>
            <p className="text-xs sm:text-base mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              Doctors, software engineers, homemakers, and grandparents who discovered the athlete within.
            </p>
          </div>

          <Testimonials />
        </section>

        {/* Final Conversion Callout */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <div className="rounded-3xl p-6 sm:p-10 md:p-12 border relative overflow-hidden shadow-2xl transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="mx-auto flex items-center justify-center mb-4">
              <JJSLogo className="h-12 sm:h-14 w-auto" />
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase"
              style={{ color: 'var(--text-heading)' }}
            >
              Ready to lace up with India’s best?
            </h2>
            <p className="text-xs sm:text-sm max-w-lg mx-auto mb-5 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your first coached morning session with your local Training Center Head (TCH) is completely free. Meet the squad, find your pace group, and experience the JJs Running magic.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleOpenRegister()}
                className="py-3 px-6 sm:px-8 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-contrast)'
                }}
              >
                <span>Book Free Trial Run</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection('centers')}
                className="py-3 px-5 rounded-xl text-xs sm:text-sm font-bold border transition-all hover:scale-105 shadow-sm"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                Explore 30+ Locations
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onScrollTo={scrollToSection} onOpenRegister={() => handleOpenRegister()} />

      {/* Interactive Registration Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        initialData={modalInitialData}
      />
    </div>
  );
}
