import React, { useState } from 'react';
import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';
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
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-all duration-300"
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
                <span className="font-black tracking-tight text-sm sm:text-lg lg:text-xl leading-none"
                  style={{ color: 'var(--text-heading)' }}
                >
                  JJs Running
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black tracking-wider uppercase hidden sm:inline-block bg-[#d02426]/10 text-[#d02426] border border-[#d02426]/30">
                  JJS
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold hidden sm:block mt-0.5 opacity-70">
                India's Largest Running Academy
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold tracking-wide uppercase">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="hover:opacity-100 transition-opacity opacity-75 whitespace-nowrap"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Theme Switcher & Register CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* 2-Option Swiss Theme Switcher */}
            <div
              className="flex items-center p-1 rounded-full border text-[11px] font-bold shadow-sm"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)'
              }}
            >
              <button
                onClick={() => setTheme && setTheme('swiss-light')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  !isDark
                    ? 'bg-[#318cdd] text-white shadow-sm'
                    : 'hover:opacity-80 text-slate-400'
                }`}
                title="Logo Match: Clean Swiss White with Cerulean Blue (#318cdd) & Sprint Red (#d02426) matching the official logo"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Logo Match</span>
              </button>
              <button
                onClick={() => setTheme && setTheme('swiss-dark')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'hover:opacity-80 text-slate-600'
                }`}
                title="Logo Contrast: Deep Midnight Obsidian making the logo pop in high contrast"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Logo Contrast</span>
              </button>
            </div>

            <button
              onClick={() => onOpenRegister()}
              className={`py-2.5 px-5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 flex items-center gap-1.5 whitespace-nowrap text-white ${
                !isDark
                  ? 'bg-[#d02426] hover:bg-[#b51c1e] shadow-red-500/25'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <span>Book Free Trial</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Actions: Contrast Toggle & Trial Button */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={() => setTheme && setTheme(isDark ? 'swiss-light' : 'swiss-dark')}
              className="p-2 rounded-xl border flex-shrink-0"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label="Toggle logo contrast theme"
              title={isDark ? 'Switch to Logo Match' : 'Switch to Logo Contrast'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => onOpenRegister()}
              className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1 ${
                !isDark ? 'bg-[#d02426]' : 'bg-blue-600'
              }`}
            >
              <span>Trial</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border flex-shrink-0"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 border-t space-y-3 shadow-xl max-w-full"
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
                className="text-left py-2 px-3 rounded-xl font-bold text-sm tracking-wide transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-contrast)'
              }}
            >
              Join Squad / Free Trial Run
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
