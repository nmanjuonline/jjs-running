import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import JJSLogo from './JJSLogo';

const CURRENT_YEAR = 2026;

export default function Footer({ onScrollTo, onOpenRegister }) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer
      className="border-t transition-colors duration-300"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-12">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <JJSLogo className="h-10 sm:h-12 w-auto" />
              <span className="text-xl font-black tracking-tight uppercase" style={{ color: 'var(--text-heading)' }}>
                JJs Running
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              At JJs Running, we recognize that goals for fitness or endurance sports are achieved only by scientific planning and dedicated community training. As India’s largest running academy with 20+ centers across Bengaluru, Pune, Kolkata, and beyond, our mission is to empower everyday individuals into lifelong endurance athletes.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/jjsrunning"
                target="_blank"
                rel="noreferrer"
                aria-label="JJs Running on Instagram"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all border shadow-xs hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/JayanagarJaguars"
                target="_blank"
                rel="noreferrer"
                aria-label="JJs Running on Facebook"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all border shadow-xs hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/jjsrunning"
                target="_blank"
                rel="noreferrer"
                aria-label="JJs Running on Twitter"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all border shadow-xs hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UC-h6HITYo4vlLq5RxsReWng"
                target="_blank"
                rel="noreferrer"
                aria-label="JJs Running on YouTube"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all border shadow-xs hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>
              Training Programs
            </h4>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <button
                  onClick={() => onScrollTo('programs')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Fitness Thru Running (FTR)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('programs')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Elevate 10K Speed Camp
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('programs')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  RYF 21K Half Marathon
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('programs')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  RYF 42K Full Marathon
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('programs')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Malnad &amp; Extreme Ultra Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('programs')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Global Virtual Academy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Centers */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>
              Featured Centers
            </h4>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <button
                  onClick={() => onScrollTo('centers')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Jayanagar HQ (Bengaluru)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('centers')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  HSR Layout (Agara Lake)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('centers')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Whitefield &amp; Indiranagar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('centers')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Pune University (SPPU)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('centers')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Rabindra Sarovar (Kolkata)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('centers')}
                  className="hover:underline transition-all text-left cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Airoli (Navi Mumbai)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>
              Morning Run Briefing
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Receive weekly endurance science, nutrition strategies, and marathon race calendar alerts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
              />
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs font-bold rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-contrast)'
                }}
              >
                {subscribed ? 'Subscribed!' : 'Subscribe Briefing'}
              </button>
            </form>

            {subscribed && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Welcome to the JJs Running squad!
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          <div>
            &copy; {CURRENT_YEAR} JJs Running (Jayanagar Jaguars). All rights reserved.
          </div>

          <div className="flex items-center gap-5 sm:gap-6 font-semibold">
            <button
              onClick={() => onScrollTo('programs')}
              className="hover:underline cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Programs
            </button>
            <button
              onClick={() => onScrollTo('centers')}
              className="hover:underline cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Centers
            </button>
            <button
              onClick={() => onScrollTo('races')}
              className="hover:underline cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Races
            </button>
            <button
              onClick={() => onOpenRegister && onOpenRegister()}
              className="font-bold cursor-pointer hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Free Trial
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}