import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { centersData } from '../data/centersData';
import { programsData } from '../data/programsData';
import JJSLogo from './JJSLogo';

export default function RegisterModal({ isOpen, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: '',
    program: '',
    experience: 'Beginner (0 - 5 km)',
    promocode: '',
    referral: 'Saw runners / Community'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const timer = setTimeout(() => {
        setFormData(prev => {
        let locValue = prev.location;
        let progValue = prev.program;

        // Match center
        if (initialData.city || initialData.venue || initialData.name) {
          const matchingCenter = centersData.find(c => c.id === initialData.id || c.name === initialData.name);
          if (matchingCenter) {
            locValue = `${matchingCenter.city} - ${matchingCenter.name}`;
          } else if (initialData.name) {
            locValue = `${initialData.city ? initialData.city + ' - ' : ''}${initialData.name}`;
          } else if (initialData.id) {
            locValue = initialData.id;
          }
        }

        // Match program
        if (initialData.title || initialData.duration || initialData.level) {
          const matchingProg = programsData.find(p => p.id === initialData.id || p.title === initialData.title);
          if (matchingProg) {
            progValue = matchingProg.title;
          } else if (initialData.title) {
            progValue = initialData.title;
          }
        } else if (initialData.program) {
          const matchingProg = programsData.find(p => p.id === initialData.program || p.title === initialData.program);
          progValue = matchingProg ? matchingProg.title : initialData.program;
        }

        return {
          ...prev,
          location: locValue,
          program: progValue
        };
      });
    }, 10);
    return () => clearTimeout(timer);
  }
}, [initialData]);

  const handleReset = React.useCallback(() => {
    setSubmitted(false);
    onClose();
  }, [onClose]);

  // Focus management & Escape key listener (WCAG 2.1 Dialog)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleReset]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  // Determine if program is an external race camp
  const isCustomProgram = formData.program && !programsData.some(p => p.title === formData.program);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={dialogRef}
      onClick={(e) => { if (e.target === e.currentTarget) handleReset(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md transition-all overflow-y-auto"
    >
      <div
        className="w-full max-w-xl rounded-3xl p-5 sm:p-7 md:p-8 border shadow-2xl relative overflow-hidden transition-all my-auto max-h-[92vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Prominent High-Contrast Close Button */}
        <button
          onClick={handleReset}
          aria-label="Close registration dialog"
          title="Close dialog"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border shadow-md transition-all duration-200 hover:scale-105 z-30 cursor-pointer"
          style={{
            backgroundColor: 'var(--card-inner)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-heading)'
          }}
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {submitted ? (
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
            >
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
              You're On The Jaguar Roster!
            </h3>
            <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Welcome, <span className="font-bold" style={{ color: 'var(--text-heading)' }}>{formData.name || 'Runner'}</span>! Your registration details have been dispatched to the Training Center Head (TCH).
            </p>

            <div
              className="p-4 rounded-2xl border text-left text-xs space-y-2.5 max-w-sm mx-auto shadow-sm"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Next Trial Run:</span>
                <span className="font-bold font-mono tabular-num" style={{ color: 'var(--text-heading)' }}>Upcoming Tuesday, 5:30 AM</span>
              </div>
              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Selected Ground:</span>
                <span className="font-bold truncate max-w-[180px]" style={{ color: 'var(--text-heading)' }}>
                  {formData.location || 'Bengaluru - Jayanagar (HQ)'}
                </span>
              </div>
              {formData.program && (
                <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Program Track:</span>
                  <span className="font-bold truncate max-w-[180px]" style={{ color: 'var(--accent)' }}>
                    {formData.program}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>TCH Coordination:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> WhatsApp Briefing Sent
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="py-3 px-8 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-contrast)'
                }}
              >
                Done &amp; Return to Site
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 sm:mb-6 pr-10">
              <div className="flex items-center gap-3 mb-2.5">
                <JJSLogo className="h-8 sm:h-9 w-auto" />
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-xs"
                  style={{
                    backgroundColor: 'var(--badge-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent)'
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  100% Free First Trial Run
                </span>
              </div>
              <h3 id="modal-title" className="text-xl sm:text-2xl font-black tracking-tight uppercase" style={{ color: 'var(--text-heading)' }}>
                Join JJs Running / Free Trial
              </h3>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Experience a coached morning session at any of our 20+ grounds across India or remote. Zero commitment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                  Full Name <span className="text-[#d02426]">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-heading)'
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                    Email Address <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="reg-mobile" className="block text-xs font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                    WhatsApp Mobile No <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-mobile"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-location" className="block text-xs font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                    Training Ground
                  </label>
                  <select
                    id="reg-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  >
                    <option value="">Select your preferred ground...</option>
                    {centersData.map((c) => {
                      const optVal = `${c.city} - ${c.name}`;
                      return (
                        <option key={c.id} value={optVal}>
                          {c.city} - {c.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-program" className="block text-xs font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                    Program Track / Race Squad
                  </label>
                  <select
                    id="reg-program"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  >
                    <option value="">Choose program (or decide after trial)...</option>
                    {isCustomProgram && (
                      <option value={formData.program}>
                        {formData.program} (Special Squad Camp)
                      </option>
                    )}
                    <optgroup label="Flagship Programs">
                      {programsData.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title} ({p.price})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-experience" className="block text-xs font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                    Current Running Level
                  </label>
                  <select
                    id="reg-experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  >
                    <option value="Beginner (0 - 5 km)">Beginner (0 - 5 km)</option>
                    <option value="Recreational (5 - 10 km)">Recreational (5 - 10 km)</option>
                    <option value="Half Marathoner (21K)">Half Marathoner (21K)</option>
                    <option value="Full Marathoner / Ultra (42K+)">Full Marathoner / Ultra (42K+)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-promocode" className="block text-xs font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                    Promocode <span className="font-normal opacity-60">(Optional)</span>
                  </label>
                  <input
                    id="reg-promocode"
                    type="text"
                    placeholder="e.g. JAGUARFIRST"
                    value={formData.promocode}
                    onChange={(e) => setFormData({ ...formData, promocode: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm uppercase font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>
              </div>

              <p className="text-[11px] flex items-center gap-1.5 pt-1" style={{ color: 'var(--text-secondary)' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Zero fee for morning trial run. You'll receive a WhatsApp briefing with ground coordinates from your TCH.</span>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] bg-[#d02426] hover:bg-[#b51c1e] text-white shadow-red-500/25 cursor-pointer disabled:opacity-75"
              >
                {loading ? 'Submitting to Roster...' : 'Confirm Registration / Free Trial Run'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}