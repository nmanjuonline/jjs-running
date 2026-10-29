import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronDown,
  MapPin,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { centersData } from '../data/centersData';
import { programsData } from '../data/programsData';
import JJsLogo from './JJsLogo';

const EXPERIENCE_LEVELS = [
  'Beginner (0 - 5 km)',
  'Recreational (5 - 10 km)',
  'Half Marathoner (21K)',
  'Full Marathoner / Ultra (42K+)'
];

// =============================================================================
// 1. Custom Themed Dropdown (General options)
// =============================================================================
function ThemedSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error = '',
  id = ''
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayLabel = value || placeholder;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
          error ? 'border-red-500 bg-red-500/5' : ''
        }`}
        style={{
          backgroundColor: 'var(--card-inner)',
          borderColor: error ? '#ef4444' : 'var(--border-color)',
          color: value ? 'var(--text-heading)' : 'var(--text-secondary)'
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`w-4 h-4 opacity-60 flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border shadow-2xl py-1.5 max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.45)'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                type="button"
                key={opt}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#318cdd]/15 text-[#318cdd] font-bold' : 'hover:bg-slate-500/10'
                }`}
                style={{
                  color: isSelected ? 'var(--accent)' : 'var(--text-heading)'
                }}
              >
                <span className="truncate">{opt}</span>
                {isSelected && <Check className="w-4 h-4 flex-shrink-0 text-[#318cdd]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// 2. Themed Training Ground (Location) Dropdown with City Groups & Live Search
// =============================================================================
function ThemedLocationSelect({ value, onChange, error = '' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCenters = useMemo(() => {
    if (!search.trim()) return centersData;
    const q = search.toLowerCase();
    return centersData.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.venue && c.venue.toLowerCase().includes(q))
    );
  }, [search]);

  const groupedCenters = useMemo(() => {
    const groups = {};
    filteredCenters.forEach((c) => {
      const city = c.city || 'Other';
      if (!groups[city]) groups[city] = [];
      groups[city].push(c);
    });
    return groups;
  }, [filteredCenters]);

  const selectedCenter = centersData.find(
    (c) => c.name === value || c.id === value || `${c.city} - ${c.name}` === value
  );

  const displayTitle = selectedCenter
    ? `${selectedCenter.city} - ${selectedCenter.name}`
    : value || 'Select your preferred ground...';

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id="reg-location-btn"
        onClick={() => setOpen(!open)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
          error ? 'border-red-500 bg-red-500/5' : ''
        }`}
        style={{
          backgroundColor: 'var(--card-inner)',
          borderColor: error ? '#ef4444' : 'var(--border-color)',
          color: value ? 'var(--text-heading)' : 'var(--text-secondary)'
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 opacity-70 text-[#d02426] flex-shrink-0" />
          <span className="truncate">{displayTitle}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 opacity-60 flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.45)'
          }}
        >
          {/* Quick Search */}
          <div
            className="p-2 border-b flex items-center gap-2"
            style={{
              backgroundColor: 'var(--card-inner)',
              borderColor: 'var(--border-color)'
            }}
          >
            <Search className="w-4 h-4 opacity-50 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by ground, area, or city..."
              className="w-full text-xs bg-transparent focus:outline-none"
              style={{ color: 'var(--text-heading)' }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-[10px] opacity-60 hover:opacity-100 px-1 cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Grouped Centers List */}
          <div className="max-h-56 overflow-y-auto py-1">
            {Object.keys(groupedCenters).length === 0 ? (
              <div className="py-6 text-center text-xs opacity-60" style={{ color: 'var(--text-secondary)' }}>
                No training grounds match "{search}"
              </div>
            ) : (
              Object.entries(groupedCenters).map(([city, centers]) => (
                <div key={city}>
                  <div
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider opacity-60 sticky top-0 backdrop-blur-md"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {city} ({centers.length})
                  </div>
                  {centers.map((c) => {
                    const optionVal = `${c.city} - ${c.name}`;
                    const isSelected =
                      value === optionVal || value === c.name || value === c.id;

                    return (
                      <button
                        type="button"
                        key={c.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(optionVal);
                          setOpen(false);
                          setSearch('');
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#318cdd]/15 text-[#318cdd] font-bold' : 'hover:bg-slate-500/10'
                        }`}
                        style={{
                          color: isSelected ? 'var(--accent)' : 'var(--text-heading)'
                        }}
                      >
                        <div className="truncate">
                          <span className="font-semibold">{c.name}</span>
                          {c.venue && (
                            <span
                              className="text-[11px] opacity-60 ml-1.5 truncate hidden sm:inline"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              • {c.venue}
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 flex-shrink-0 text-[#318cdd]" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// 3. Themed Program Dropdown with Pricing, Duration & Custom Camps
// =============================================================================
function ThemedProgramSelect({ value, onChange, customProgram = null, error = '' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProg = programsData.find((p) => p.title === value || p.id === value);
  const displayLabel = value
    ? (selectedProg ? selectedProg.title : value)
    : 'Choose program (or decide after trial)...';

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id="reg-program-btn"
        onClick={() => setOpen(!open)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
          error ? 'border-red-500 bg-red-500/5' : ''
        }`}
        style={{
          backgroundColor: 'var(--card-inner)',
          borderColor: error ? '#ef4444' : 'var(--border-color)',
          color: value ? 'var(--text-heading)' : 'var(--text-secondary)'
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`w-4 h-4 opacity-60 flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border shadow-2xl py-1.5 max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.45)'
          }}
        >
          {/* Decide after trial option */}
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
              !value ? 'bg-[#318cdd]/15 text-[#318cdd] font-bold' : 'hover:bg-slate-500/10'
            }`}
            style={{ color: !value ? 'var(--accent)' : 'var(--text-heading)' }}
          >
            <span className="italic opacity-80">Decide after trial run</span>
            {!value && <Check className="w-4 h-4 flex-shrink-0 text-[#318cdd]" />}
          </button>

          {/* Custom Special Squad Camp */}
          {customProgram && (
            <button
              type="button"
              role="option"
              aria-selected={value === customProgram}
              onClick={() => {
                onChange(customProgram);
                setOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                value === customProgram ? 'bg-[#318cdd]/15 text-[#318cdd] font-bold' : 'hover:bg-slate-500/10'
              }`}
              style={{ color: value === customProgram ? 'var(--accent)' : 'var(--text-heading)' }}
            >
              <div>
                <span className="font-bold">{customProgram}</span>
                <span className="ml-2 text-[10px] uppercase font-bold text-[#d02426] bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                  Special Camp
                </span>
              </div>
              {value === customProgram && <Check className="w-4 h-4 flex-shrink-0 text-[#318cdd]" />}
            </button>
          )}

          <div
            className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider opacity-50 border-t mt-1 pt-1.5"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            Flagship Training Programs
          </div>

          {programsData.map((p) => {
            const isSelected = value === p.title || value === p.id;
            return (
              <button
                type="button"
                key={p.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(p.title);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#318cdd]/15 text-[#318cdd] font-bold' : 'hover:bg-slate-500/10'
                }`}
                style={{ color: isSelected ? 'var(--accent)' : 'var(--text-heading)' }}
              >
                <div className="truncate">
                  <div className="font-semibold truncate">{p.title}</div>
                  <div className="text-[10px] opacity-60 flex items-center gap-1.5">
                    <span>{p.duration || 'Program'}</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.price}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 flex-shrink-0 text-[#318cdd]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN MODAL: Book Free Trial
// =============================================================================
export default function RegisterModal({ isOpen, onClose, initialData = null, onSwitchToProgram }) {
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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);

  // Synchronize incoming initialData
  useEffect(() => {
    if (initialData) {
      const timer = setTimeout(() => {
        setFormData((prev) => {
          let locValue = prev.location;
          let progValue = prev.program;

          // Match center
          if (initialData.city || initialData.venue || initialData.name) {
            const matchingCenter = centersData.find(
              (c) => c.id === initialData.id || c.name === initialData.name
            );
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
            const matchingProg = programsData.find(
              (p) => p.id === initialData.id || p.title === initialData.title
            );
            if (matchingProg) {
              progValue = matchingProg.title;
            } else if (initialData.title) {
              progValue = initialData.title;
            }
          } else if (initialData.program) {
            const matchingProg = programsData.find(
              (p) => p.id === initialData.program || p.title === initialData.program
            );
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

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setErrors({});
    setTouched({});
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

  // Validation logic
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value || !value.trim()) return 'Full Name is required';
        if (value.trim().length < 2) return 'Please enter at least 2 characters';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email Address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
        return '';
      case 'mobile': {
        const clean = (value || '').replace(/[^0-9]/g, '');
        if (!clean) return 'WhatsApp Mobile No is required';
        if (clean.length !== 10) return 'Must be a 10-digit mobile number';
        return '';
      }
      default:
        return '';
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      mobile: validateField('mobile', formData.mobile)
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, mobile: true });

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  if (!isOpen) return null;

  // Determine if program is an external race camp
  const isCustomProgram =
    formData.program && !programsData.some((p) => p.title === formData.program);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleReset();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md transition-all overflow-y-auto"
    >
      <div
        className="w-full max-w-xl rounded-3xl p-5 sm:p-7 md:p-8 border shadow-2xl relative transition-all my-auto max-h-[92vh] overflow-y-auto"
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

            <h3
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: 'var(--text-heading)' }}
            >
              You're On The Jaguar Roster!
            </h3>
            <p
              className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Welcome,{' '}
              <span className="font-bold" style={{ color: 'var(--text-heading)' }}>
                {formData.name || 'Runner'}
              </span>
              ! Your registration details have been dispatched to the Training Center Head (TCH).
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
                <span className="font-bold font-mono tabular-num" style={{ color: 'var(--text-heading)' }}>
                  Upcoming Tuesday, 5:30 AM
                </span>
              </div>
              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Selected Ground:</span>
                <span
                  className="font-bold truncate max-w-[180px]"
                  style={{ color: 'var(--text-heading)' }}
                >
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
              <div
                className="flex items-center justify-between pt-1 border-t"
                style={{ borderColor: 'var(--border-color)' }}
              >
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
                <JJsLogo className="h-8 sm:h-9 w-auto" />
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
              <h3
                id="modal-title"
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: 'var(--text-heading)' }}
              >
                Join JJs Running / Free Trial
              </h3>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Experience a coached morning session at any of our 20+ grounds across India or remote. Zero commitment.
              </p>
              {onSwitchToProgram && (
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    onSwitchToProgram(initialData);
                  }}
                  className="mt-2 text-xs font-bold text-[#318cdd] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Ready to join full training squad directly? Register for Program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-bold mb-1"
                  style={{ color: 'var(--text-heading)' }}
                >
                  Full Name <span className="text-[#d02426]">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                    touched.name && errors.name ? 'border-red-500 bg-red-500/5' : ''
                  }`}
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    borderColor: touched.name && errors.name ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-heading)'
                  }}
                />
                {touched.name && errors.name && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-bold mb-1"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Email Address <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      touched.email && errors.email ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.email && errors.email ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.email && errors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-mobile"
                    className="block text-xs font-bold mb-1"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    WhatsApp Mobile No <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      handleFieldChange('mobile', clean);
                    }}
                    onBlur={() => handleFieldBlur('mobile')}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      touched.mobile && errors.mobile ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.mobile && errors.mobile ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.mobile && errors.mobile && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.mobile}
                    </p>
                  )}
                </div>
              </div>

              {/* Training Ground & Program Track */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-location-btn"
                    className="block text-xs font-bold mb-1"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Training Ground
                  </label>
                  <ThemedLocationSelect
                    value={formData.location}
                    onChange={(loc) => handleFieldChange('location', loc)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-program-btn"
                    className="block text-xs font-bold mb-1"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Program Track / Race Squad
                  </label>
                  <ThemedProgramSelect
                    value={formData.program}
                    onChange={(prog) => handleFieldChange('program', prog)}
                    customProgram={isCustomProgram ? formData.program : null}
                  />
                </div>
              </div>

              {/* Current Running Level & Promocode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-experience-btn"
                    className="block text-xs font-bold mb-1"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Current Running Level
                  </label>
                  <ThemedSelect
                    id="reg-experience-btn"
                    value={formData.experience}
                    onChange={(val) => handleFieldChange('experience', val)}
                    options={EXPERIENCE_LEVELS}
                    placeholder="Select running level..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-promocode"
                    className="block text-xs font-bold mb-1"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Promocode <span className="font-normal opacity-60">(Optional)</span>
                  </label>
                  <input
                    id="reg-promocode"
                    type="text"
                    placeholder="e.g. JAGUARFIRST"
                    value={formData.promocode}
                    onChange={(e) =>
                      handleFieldChange('promocode', e.target.value.toUpperCase())
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm uppercase font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>
              </div>

              <p
                className="text-[11px] flex items-center gap-1.5 pt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
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
