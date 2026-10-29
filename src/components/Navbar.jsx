import React, { useState } from 'react';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import JJSLogo from './JJSLogo';

export default function Navbar({ currentTheme = 'swiss-light', setTheme, onOpenRegister, onScrollTo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = currentTheme === 'swiss-dark';

  const navItems = [
    { label: 'Programs', id: 'programs' },
    { label: 'The Science', id: 'methodology' },
    { label: 'Centers & TCHs', id: 'centers' },
    { label: 'Onca App', id: 'app' },
    { label: 'Race Calendar', id: 'races' },
    { label: 'Stories', id: 'stories' },
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    // Allow drawer collapse to settle before calculating scroll position
    setTimeout(() => {
      if (onScrollTo) onScrollTo(id);
    }, 120);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-all duration-300"
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Brand with high visibility */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Transparent Logo */}
            <div className="flex items-center transition-transform group-hover:scale-105 flex-shrink-0">
              <JJSLogo className="h-10 sm:h-12 w-auto" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="font-black tracking-tight text-sm sm:text-lg lg:text-xl leading-none uppercase"
                  style={{ color: 'var(--text-heading)' }}
                >
                  JJs Running
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black tracking-wider hidden sm:inline-block bg-[#d02426]/10 text-[#d02426] border border-[#d02426]/30">
                  JJs
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold hidden sm:block mt-0.5 opacity-70">
                India's Largest Running Academy
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold tracking-wide uppercase">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="hover:opacity-100 transition-opacity opacity-75 whitespace-nowrap cursor-pointer hover:text-[#318cdd]"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Theme Switcher & Register CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Sleek Light / Dark Segmented Switcher */}
            <div
              className="flex items-center p-1 rounded-full border shadow-xs transition-colors flex-shrink-0"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)'
              }}
              role="radiogroup"
              aria-label="Theme mode"
            >
              <button
                onClick={() => setTheme && setTheme('swiss-light')}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap text-xs font-bold select-none cursor-pointer ${
                  !isDark
                    ? 'bg-[#318cdd] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Light Mode"
                aria-checked={!isDark}
                role="radio"
              >
                <Sun className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${!isDark ? 'text-white' : 'text-slate-400'}`} />
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme && setTheme('swiss-dark')}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap text-xs font-bold select-none cursor-pointer ${
                  isDark
                    ? 'bg-[#318cdd] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Dark Mode"
                aria-checked={isDark}
                role="radio"
              >
                <Moon className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isDark ? 'text-white' : 'text-slate-500'}`} />
                <span>Dark</span>
              </button>
            </div>

            {/* Desktop CTA Button */}
            <button
              onClick={() => { if (onOpenRegister) onOpenRegister(); }}
              className="py-2.5 px-4 lg:px-5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 flex items-center gap-1.5 text-white bg-[#d02426] hover:bg-[#b51c1e] shadow-red-500/20 cursor-pointer flex-shrink-0 whitespace-nowrap"
            >
              <span>Book Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Actions: Contrast Toggle & Accessible Menu Button (>=44x44px Touch Targets) */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setTheme && setTheme(isDark ? 'swiss-light' : 'swiss-dark')}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border flex-shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border flex-shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden p-4 border-t space-y-3 shadow-xl max-w-full"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left py-2.5 px-3 rounded-xl font-bold text-sm tracking-wide transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); if (onOpenRegister) onOpenRegister(); }}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-[#d02426] text-white hover:bg-[#b51c1e]"
            >
              <span>Join Squad / Book Free Trial</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}