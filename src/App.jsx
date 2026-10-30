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
import ProgramRegistrationModal from './components/ProgramRegistrationModal';
import Footer from './components/Footer';
import JJsLogo from './components/JJsLogo';
import EventSpotlightBanner from './components/EventSpotlightBanner';
import FloatingCallCTA from './components/FloatingCallCTA';
import { Sparkles, ArrowRight, ShieldCheck, Activity, Award } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('jjs_theme_variant');
    // Default to swiss-dark mode
    if (!saved || saved === 'swiss-light' || saved === 'olympic-clean') {
      return 'swiss-dark';
    }
    return saved;
  });

  // Free Trial Modal State
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialInitialData, setTrialInitialData] = useState(null);

  // Official Program Registration Modal State (from Program card Register button)
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [selectedProgramForRegister, setSelectedProgramForRegister] = useState(null);

  const [calcForceExpand, setCalcForceExpand] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('jjs_theme_variant', theme);
    const isDark = theme === 'swiss-dark' || theme === 'kinetic' || theme === 'crimson';
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', isDark ? '#090d16' : '#ffffff');
    }
  }, [theme]);

  // Open Free Trial flow
  const handleOpenTrial = (data = null) => {
    setTrialInitialData(data);
    setTrialModalOpen(true);
  };

  // Open Official Program Registration flow
  const handleOpenProgramRegister = (program = null) => {
    setSelectedProgramForRegister(program);
    setProgramModalOpen(true);
  };

  const scrollToSection = (id) => {
    if (id === 'calculator') {
      setCalcForceExpand(true);
    }
    const el = document.getElementById(id);
    if (el) {
      const nav = document.querySelector('header');
      const navHeight = nav ? nav.offsetHeight : 72;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight - 16;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 w-full max-w-full overflow-x-hidden"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Skip to Main Content Link for Keyboard and Screen Readers (WCAG 2.1 AA) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Sleek Top Announcement Bar (Above Navbar) */}
      <LiveTicker
        onActionClick={(target) => {
          if (target === 'register') {
            handleOpenTrial();
          } else {
            scrollToSection(target);
          }
        }}
      />

      {/* Navigation */}
      <Navbar
        currentTheme={theme}
        setTheme={setTheme}
        onOpenRegister={() => handleOpenTrial()}
        onOpenProgramRegister={(prog) => handleOpenProgramRegister(prog)}
        onScrollTo={scrollToSection}
      />

      {/* Hero Section */}
      <Hero
        currentTheme={theme}
        onBookTrial={() => handleOpenTrial()}
        onExploreCenters={() => scrollToSection('centers')}
        onOpenCalc={() => scrollToSection('calculator')}
      />

      {/* Main Content Sections - Accessible Anchor with Keyboard Focus */}
      <main id="main-content" tabIndex={-1} className="flex-1 space-y-12 sm:space-y-20 py-4 sm:py-8 w-full max-w-full overflow-hidden focus:outline-none">
        {/* Signature Event Spotlight (e.g., The Saree Run) */}
        <EventSpotlightBanner
          onRegister={(eventData) => handleOpenRegister({ program: eventData.title })}
          onExploreRaces={() => scrollToSection('races')}
        />

        {/* Programs Section */}
        <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border shadow-sm"
              style={{
                backgroundColor: 'var(--badge-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent)'
              }}
            >
              <Award className="w-3.5 h-3.5" />
              Goal-Driven Training
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black tracking-tight uppercase"
              style={{ color: 'var(--text-heading)' }}
            >
              Flagship Training Programs
            </h2>
            <p
              className="text-xs sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Progressive weekly mileage, structured tempo splits, and weekend long-run pacing - tailored for first-time 5K runners to seasoned marathoners.
            </p>
          </div>

          <ProgramsSection
            currentTheme={theme}
            onRegister={(program) => handleOpenProgramRegister(program)}
          />
        </section>

        {/* Science & Methodology Section */}
        <MethodologySection
          currentTheme={theme}
          onExploreCenters={() => scrollToSection('centers')}
        />

        {/* 20+ Training Centers Explorer */}
        <section id="centers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5 border shadow-sm"
                style={{
                  backgroundColor: 'var(--badge-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--accent)'
                }}
              >
                <Activity className="w-3.5 h-3.5" />
                Neighborhood Grounds
              </span>
              <h2
                className="text-2xl sm:text-4xl font-black tracking-tight uppercase"
                style={{ color: 'var(--text-heading)' }}
              >
                20+ Centers &amp; Training Center Heads
              </h2>
              <p
                className="text-xs sm:text-sm mt-1 max-w-xl"
                style={{ color: 'var(--text-secondary)' }}
              >
                Select your city and neighborhood center below to view morning timings and designated grounds, and connect with your Training Center Head.
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
              <span>5:30 AM - 7:00 AM • Tue, Thu, Sat, Sun</span>
            </div>
          </div>

          <CentersExplorer currentTheme={theme} onBookTrial={(center) => handleOpenTrial(center)} />
        </section>

        {/* Discreet Pace & Split Calculator Utility */}
        <section id="calculator" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <PaceCalculator
            forceExpand={calcForceExpand}
            onSelectProgram={(programId) => handleOpenProgramRegister({ id: programId })}
          />
        </section>

        {/* Mobile App Telemetry HUD Section */}
        <section id="app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <OncaAppSection onGetApp={() => handleOpenTrial()} />
        </section>

        {/* Race Calendar & Camp Countdown */}
        <section id="races" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Signature JJs Running Events
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase"
              style={{ color: 'var(--text-heading)' }}
            >
              Flagship Races & Festivals
            </h2>
            <p className="text-xs sm:text-base mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              From high-altitude monsoon hill climbs to iconic women fitness movements, experience running events founded and powered by Jayanagar Jaguars.
            </p>
          </div>

          <RaceCalendar onJoinCamp={(race) => handleOpenProgramRegister({ title: race.title, category: 'Race Camp' })} />
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
              <JJsLogo className="h-12 sm:h-14 w-auto" />
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase"
              style={{ color: 'var(--text-heading)' }}
            >
              Ready to lace up with India’s best?
            </h2>
            <p className="text-xs sm:text-sm max-w-lg mx-auto mb-5 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your first coached morning session with your local Training Center Head is completely free. Meet the squad, find your pace group, and experience the JJs Running magic.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleOpenTrial()}
                className="py-3 px-6 sm:px-8 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2 text-white bg-[#d02426] hover:bg-[#b51c1e] shadow-red-500/25 cursor-pointer"
              >
                <span>Book Free Trial Run</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection('centers')}
                className="py-3 px-5 rounded-xl text-xs sm:text-sm font-bold border transition-all hover:scale-105 shadow-sm cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                Explore 20+ Locations
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onScrollTo={scrollToSection}
        onOpenRegister={() => handleOpenTrial()}
        onOpenProgramRegister={(prog) => handleOpenProgramRegister(prog)}
      />

      {/* 1. Free Trial Modal (Lightweight First Morning Session) */}
      {/* Floating Call & WhatsApp Action Pill */}
      <FloatingCallCTA />

      {/* Interactive Registration Modal */}
      <RegisterModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        initialData={trialInitialData}
        onSwitchToProgram={(data) => handleOpenProgramRegister(data)}
      />

      {/* 2. Official Program Registration Modal (Full Form matching Screenshot) */}
      <ProgramRegistrationModal
        isOpen={programModalOpen}
        onClose={() => setProgramModalOpen(false)}
        selectedProgram={selectedProgramForRegister}
        onSwitchToTrial={() => handleOpenTrial()}
      />
    </div>
  );
}
