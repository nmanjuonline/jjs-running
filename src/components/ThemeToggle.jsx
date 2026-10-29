import React from 'react';
import { Check } from 'lucide-react';
import { THEMES } from '../data/themesData';

export default function ThemeToggle({ currentTheme, setTheme, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-full border shadow-sm backdrop-blur-md"
        style={{
          backgroundColor: 'var(--card-inner)',
          borderColor: 'var(--border-color)'
        }}
      >
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              title={`${theme.name} (${theme.isLight ? 'Light Mode' : 'Dark Mode'}) - ${theme.subtitle}`}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
                isActive
                  ? 'shadow-md scale-105 ring-1'
                  : 'opacity-70 hover:opacity-100 hover:scale-102'
              }`}
              style={{
                backgroundColor: isActive ? theme.accent : 'transparent',
                color: isActive ? theme.contrastText : 'var(--text-primary)',
                ringColor: isActive ? theme.accent : 'transparent'
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{theme.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 text-gray-400 flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent)' }} />
          Aesthetic:
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {THEMES.map((theme) => {
            const Icon = theme.icon;
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  isActive
                    ? 'shadow-lg scale-105'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isActive ? theme.accent : 'transparent',
                  color: isActive ? theme.contrastText : 'inherit',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{theme.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono uppercase ${isActive ? 'bg-black/20 text-current' : 'bg-black/10 dark:bg-white/10 text-gray-400'}`}>
                  {theme.isLight ? 'Light' : 'Dark'}
                </span>
                {isActive && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
