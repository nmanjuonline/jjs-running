import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import JJsLogo from './JJsLogo';

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
              <JJsLogo className="h-10 sm:h-12 w-auto" />
              <span className="text-xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
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
                title="Follow JJs Running on Instagram"
                className="jjs-media-link jjs-ig-link social-icon-btn social-instagram w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl inline-flex items-center justify-center border shadow-xs cursor-pointer"
                style={{ display: 'inline-flex' }}
              >
                <svg className="w-5 h-5 fill-none stroke-current pointer-events-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/JayanagarJaguars"
                target="_blank"
                rel="noreferrer"
                aria-label="JJs Running on Facebook"
                title="Follow JJs Running on Facebook"
                className="jjs-media-link jjs-fb-link social-icon-btn social-facebook w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl inline-flex items-center justify-center border shadow-xs cursor-pointer"
                style={{ display: 'inline-flex' }}
              >
                <svg className="w-4 h-4 fill-current pointer-events-none" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/jjsrunning"
                target="_blank"
                rel="noreferrer"
                aria-label="JJs Running on X"
                title="Follow JJs Running on X"
                className="jjs-media-link jjs-tw-link social-icon-btn social-x w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl inline-flex items-center justify-center border shadow-xs cursor-pointer"
                style={{ display: 'inline-flex' }}
              >
                <svg className="w-4 h-4 fill-current pointer-events-none" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UC-h6HITYo4vlLq5RxsReWng"
                target="_blank"
                rel="noreferrer"
                aria-label="JJs Running on YouTube"
                title="Subscribe to JJs Running on YouTube"
                className="jjs-media-link jjs-yt-link social-icon-btn social-youtube w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl inline-flex items-center justify-center border shadow-xs cursor-pointer"
                style={{ display: 'inline-flex' }}
              >
                <svg className="w-4 h-4 fill-current pointer-events-none" viewBox="0 0 24 24">
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