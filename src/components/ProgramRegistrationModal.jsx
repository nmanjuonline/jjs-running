import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  Calendar as CalendarIcon,
  Lock,
  MapPin
} from 'lucide-react';
import { centersData } from '../data/centersData';
import { programsData } from '../data/programsData';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const DISTANCE_OPTIONS = ['5K', '10K', 'HM', 'FM', '25K', '12K', 'None'];

const TSHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const PB_EVENTS = [
  'Half Marathon (21.1K)',
  '10K Run',
  'Full Marathon (42.2K)',
  '5K Run',
  '25K Run',
  '12K Run',
  'None / First-timer'
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CURRENT_CALENDAR_YEAR = new Date().getFullYear();

// =============================================================================
// 1. Bespoke Theme-Aware Calendar Control (No split dropdowns, no OS popup)
// =============================================================================
function CustomCalendarPicker({ value, onChange, error = '' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value (YYYY-MM-DD)
  const parsedDate = useMemo(() => {
    if (!value) return new Date(1995, 0, 15);
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return new Date(1995, 0, 15);
    return new Date(y, m - 1, d);
  }, [value]);

  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth()); // 0-11
  const [prevValue, setPrevValue] = useState(value);

  // Synchronize when value changes externally
  if (value !== prevValue) {
    setPrevValue(value);
    if (value) {
      const [y, m] = value.split('-').map(Number);
      if (y && m) {
        setViewYear(y);
        setViewMonth(m - 1);
      }
    }
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day) => {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mStr}-${dStr}`);
    setOpen(false);
  };

  // Format display string e.g. "15 Jan 1995"
  const formattedDisplay = useMemo(() => {
    if (!value) return '';
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return '';
    const shortMonth = MONTH_NAMES[m - 1]?.slice(0, 3) || '';
    return `${d} ${shortMonth} ${y}`;
  }, [value]);

  // Range of years for rapid birthday selection (from 1940 to 10 years ago)
  const availableYears = useMemo(() => {
    const years = [];
    for (let yr = CURRENT_CALENDAR_YEAR - 10; yr >= 1940; yr--) {
      years.push(yr);
    }
    return years;
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id="reg-dob-btn"
        onClick={() => setOpen(!open)}
        className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
          error ? 'border-red-500 bg-red-500/5' : ''
        }`}
        style={{
          backgroundColor: 'var(--card-inner)',
          borderColor: error ? '#ef4444' : 'var(--border-color)',
          color: value ? 'var(--text-heading)' : 'var(--text-secondary)'
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-4 h-4 opacity-70 text-[#318cdd] flex-shrink-0" />
          <span className="truncate">{formattedDisplay || 'DD / MM / YYYY (Click to pick)'}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 opacity-60 flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Theme-Matched Calendar Popover */}
      {open && (
        <div
          role="dialog"
          aria-label="Choose date of birth"
          className="absolute z-50 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 mt-2 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.5)'
          }}
        >
          {/* Calendar Header with Fast Year / Month Navigation */}
          <div className="flex items-center justify-between gap-1 mb-3 pb-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-heading)' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick Month & Year Selectors */}
            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="text-xs font-bold px-2 py-1 rounded-md border bg-transparent cursor-pointer focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-heading)' }}
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx} className="bg-slate-900 text-white">
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs font-bold px-2 py-1 rounded-md border bg-transparent cursor-pointer focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-heading)' }}
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900 text-white">
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-heading)' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <span
                key={d}
                className="text-[11px] font-bold uppercase tracking-wider opacity-60"
                style={{ color: 'var(--text-secondary)' }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Previous month filler days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const dayNum = prevMonthDays - firstDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="py-1.5 text-xs opacity-25 cursor-default select-none"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected =
                parsedDate &&
                parsedDate.getFullYear() === viewYear &&
                parsedDate.getMonth() === viewMonth &&
                parsedDate.getDate() === dayNum;

              return (
                <button
                  type="button"
                  key={dayNum}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#d02426] text-white font-bold shadow-md shadow-red-500/30 scale-105'
                      : 'hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                  style={{
                    color: isSelected ? '#ffffff' : 'var(--text-heading)'
                  }}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer with Clear & Today shortcuts */}
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t text-[11px]" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="text-[#d02426] font-semibold hover:underline cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const defaultAdultYear = now.getFullYear() - 25; // Sensible default 25-yr-old
                setViewYear(defaultAdultYear);
                setViewMonth(0);
                const dStr = `15`;
                onChange(`${defaultAdultYear}-01-${dStr}`);
                setOpen(false);
              }}
              className="text-[#318cdd] font-semibold hover:underline cursor-pointer"
            >
              Default (25yo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// 2. Dedicated Race Timing Control (HH : MM : SS)
// Blocks alphabetic gibberish like "01:3asdfasdf9:44" entirely!
// =============================================================================
function RaceTimingInput({ value, onChange, disabled = false, error = '' }) {
  // Parse incoming value "HH:MM:SS"
  const [hours, minutes, seconds] = useMemo(() => {
    if (!value) return ['01', '39', '44'];
    const parts = value.split(':');
    return [
      parts[0] !== undefined ? parts[0] : '01',
      parts[1] !== undefined ? parts[1] : '39',
      parts[2] !== undefined ? parts[2] : '44'
    ];
  }, [value]);

  const hRef = useRef(null);
  const mRef = useRef(null);
  const sRef = useRef(null);

  const updateTiming = (h, m, s) => {
    const formatted = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
    onChange(formatted);
  };

  const handleHourChange = (e) => {
    const clean = e.target.value.replace(/[^0-9]/g, '').slice(-2);
    const num = Math.min(99, Number(clean) || 0);
    const val = clean === '' ? '' : String(num).padStart(clean.length, '0');
    updateTiming(val || '00', minutes, seconds);
    if (clean.length === 2 && mRef.current) {
      mRef.current.focus();
      mRef.current.select();
    }
  };

  const handleMinuteChange = (e) => {
    const clean = e.target.value.replace(/[^0-9]/g, '').slice(-2);
    const num = Math.min(59, Number(clean) || 0);
    const val = clean === '' ? '' : String(num).padStart(clean.length, '0');
    updateTiming(hours, val || '00', seconds);
    if (clean.length === 2 && sRef.current) {
      sRef.current.focus();
      sRef.current.select();
    }
  };

  const handleSecondChange = (e) => {
    const clean = e.target.value.replace(/[^0-9]/g, '').slice(-2);
    const num = Math.min(59, Number(clean) || 0);
    const val = clean === '' ? '' : String(num).padStart(clean.length, '0');
    updateTiming(hours, minutes, val || '00');
  };

  const handleKeyDown = (e, currentUnit) => {
    // Navigate backwards on Backspace when empty
    if (e.key === 'Backspace' && e.target.value === '') {
      if (currentUnit === 'seconds' && mRef.current) {
        mRef.current.focus();
      } else if (currentUnit === 'minutes' && hRef.current) {
        hRef.current.focus();
      }
    }
  };

  if (disabled) {
    return (
      <div
        className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-mono opacity-50 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--card-inner)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)'
        }}
      >
        <span>First-Timer / No Prior Timing Required</span>
        <Clock className="w-4 h-4 opacity-50" />
      </div>
    );
  }

  return (
    <div
      className={`w-full px-3 py-1.5 sm:py-2 rounded-xl border flex items-center justify-between transition-all focus-within:ring-2 focus-within:ring-[#318cdd]/40 ${
        error ? 'border-red-500 bg-red-500/5' : ''
      }`}
      style={{
        backgroundColor: 'var(--card-inner)',
        borderColor: error ? '#ef4444' : 'var(--border-color)'
      }}
    >
      <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm">
        {/* Hours Box */}
        <div className="flex flex-col items-center">
          <input
            ref={hRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={hours}
            onChange={handleHourChange}
            onKeyDown={(e) => handleKeyDown(e, 'hours')}
            aria-label="Hours"
            placeholder="01"
            className="w-8 text-center bg-transparent font-bold focus:outline-none focus:bg-white/10 rounded"
            style={{ color: 'var(--text-heading)' }}
          />
          <span className="text-[9px] uppercase tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>hrs</span>
        </div>

        <span className="font-bold opacity-40 -mt-3">:</span>

        {/* Minutes Box */}
        <div className="flex flex-col items-center">
          <input
            ref={mRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={minutes}
            onChange={handleMinuteChange}
            onKeyDown={(e) => handleKeyDown(e, 'minutes')}
            aria-label="Minutes"
            placeholder="39"
            className="w-8 text-center bg-transparent font-bold focus:outline-none focus:bg-white/10 rounded"
            style={{ color: 'var(--text-heading)' }}
          />
          <span className="text-[9px] uppercase tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>min</span>
        </div>

        <span className="font-bold opacity-40 -mt-3">:</span>

        {/* Seconds Box */}
        <div className="flex flex-col items-center">
          <input
            ref={sRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={seconds}
            onChange={handleSecondChange}
            onKeyDown={(e) => handleKeyDown(e, 'seconds')}
            aria-label="Seconds"
            placeholder="44"
            className="w-8 text-center bg-transparent font-bold focus:outline-none focus:bg-white/10 rounded"
            style={{ color: 'var(--text-heading)' }}
          />
          <span className="text-[9px] uppercase tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>sec</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 opacity-60" style={{ color: 'var(--text-secondary)' }}>
        <Clock className="w-4 h-4" />
      </div>
    </div>
  );
}

// =============================================================================
// 3. Custom Dropdown for Blood Group & Events
// =============================================================================
function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error = false,
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
        className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
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
                className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
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
// 4. Location Dropdown Grouped by City from centersData with Search
// =============================================================================
function LocationDropdown({ value, onChange, error = false }) {
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
    ? `${selectedCenter.name} (${selectedCenter.city})`
    : value || 'Select preferred training ground...';

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id="reg-location-pref"
        onClick={() => setOpen(!open)}
        className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
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
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl border shadow-2xl py-2 max-h-72 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
          }}
        >
          <div className="px-3 pb-2 pt-1 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search center, ground, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#318cdd]"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />
            </div>
          </div>

          {Object.keys(groupedCenters).length === 0 ? (
            <div className="px-4 py-3 text-xs text-center opacity-60" style={{ color: 'var(--text-secondary)' }}>
              No grounds matched "{search}"
            </div>
          ) : (
            Object.entries(groupedCenters).map(([city, centers]) => (
              <div key={city} className="pt-2">
                <div
                  className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider opacity-60"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {city} ({centers.length} Grounds)
                </div>
                {centers.map((center) => {
                  const isSelected =
                    value === center.name ||
                    value === `${center.city} - ${center.name}` ||
                    value === center.id;

                  return (
                    <button
                      type="button"
                      key={center.id}
                      onClick={() => {
                        onChange(center.name);
                        setOpen(false);
                        setSearch('');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#318cdd]/15 text-[#318cdd] font-bold' : 'hover:bg-slate-500/10'
                      }`}
                      style={{
                        color: isSelected ? 'var(--accent)' : 'var(--text-heading)'
                      }}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{center.name}</div>
                        {center.venue && (
                          <div
                            className="text-[11px] truncate opacity-70 font-normal"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {center.venue}
                          </div>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 flex-shrink-0 text-[#318cdd] mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main Official Program Registration Modal with Full Control Validations
// =============================================================================
export default function ProgramRegistrationModal({
  isOpen,
  onClose,
  selectedProgram = null,
  onSwitchToTrial
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    whatsappNo: '',
    sameAsMobile: true,
    emergencyName: '',
    emergencyNo: '',
    gender: 'Male',
    tshirtSize: 'M',
    dob: '1995-01-15',
    bloodGroup: 'B+',
    residentialAddress: '',
    pinZipCode: '',
    locationPreference: 'Malleshwaram',
    maxDistance1Year: 'HM',
    pbEvent: 'Half Marathon (21.1K)',
    pbTiming: '01:39:44',
    healthProblem: '',
    promocode: '',
    acceptedTerms: false,
    selectedProgramId: ''
  });

  const resolveProgram = (prog) => {
    if (!prog) return programsData[2];
    if (typeof prog === 'string') {
      return programsData.find((p) => p.id === prog || p.title === prog) || programsData[2];
    }
    if (prog.id) {
      return programsData.find((p) => p.id === prog.id) || prog;
    }
    if (prog.title) {
      return programsData.find((p) => p.title === prog.title) || prog;
    }
    return prog;
  };

  const [prevSelectedProgram, setPrevSelectedProgram] = useState(selectedProgram);
  const [activeProgram, setActiveProgram] = useState(() => resolveProgram(selectedProgram));

  if (selectedProgram !== prevSelectedProgram) {
    setPrevSelectedProgram(selectedProgram);
    const resolved = resolveProgram(selectedProgram);
    setActiveProgram(resolved);
    setFormData((prev) => ({
      ...prev,
      selectedProgramId: resolved?.id || resolved?.title || ''
    }));
  }

  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  const handleClose = useCallback(() => {
    setSubmitted(false);
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoMessage('');
    setPromoError('');
    setErrors({});
    setTouched({});
    onClose();
  }, [onClose]);

  // Focus lock & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 60);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Pricing calculations
  const parseBasePrice = (priceStr) => {
    if (!priceStr) return 6000;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 6000 : num;
  };

  const baseFee = activeProgram ? parseBasePrice(activeProgram.price) : 6000;
  const discountAmount = promoApplied ? promoDiscount : 0;
  const taxableAmount = Math.max(0, baseFee - discountAmount);
  const gstAmount = Math.round(taxableAmount * 0.05);
  const totalAmount = taxableAmount + gstAmount;

  // Promocode Handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoMessage('');
    const code = (formData.promocode || '').trim().toUpperCase();

    if (!code) {
      setPromoError('Please enter a promocode before applying.');
      return;
    }

    if (code === 'JAGUAR10' || code === 'JJS10') {
      const discount = Math.round(baseFee * 0.1);
      setPromoDiscount(discount);
      setPromoApplied(true);
      setPromoMessage('10% Jaguar Athlete Discount Applied!');
    } else if (code === 'EARLYBIRD') {
      setPromoDiscount(500);
      setPromoApplied(true);
      setPromoMessage('₹500 Early Bird Discount Applied!');
    } else if (code === 'JJACTIVE') {
      const discount = Math.round(baseFee * 0.15);
      setPromoDiscount(discount);
      setPromoApplied(true);
      setPromoMessage('15% Club Partner Discount Applied!');
    } else {
      setPromoError(`Code "${code}" is invalid or expired. You can still proceed directly.`);
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  // ===========================================================================
  // Comprehensive Control Validation Rules
  // ===========================================================================
  const validateField = (field, value, allData = formData) => {
    switch (field) {
      case 'fullName':
        if (!value || !value.trim()) return 'Full Name is required';
        if (value.trim().length < 2) return 'Please enter at least 2 characters';
        return '';

      case 'email':
        if (!value || !value.trim()) return 'Email Address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
        return '';

      case 'mobileNo': {
        const clean = (value || '').replace(/[^0-9]/g, '');
        if (!clean) return 'Mobile Number is required';
        if (clean.length !== 10) return 'Must be a 10-digit mobile number';
        return '';
      }

      case 'whatsappNo': {
        const target = allData.sameAsMobile ? allData.mobileNo : value;
        const clean = (target || '').replace(/[^0-9]/g, '');
        if (!clean) return 'WhatsApp Number is required';
        if (clean.length !== 10) return 'Must be a 10-digit WhatsApp number';
        return '';
      }

      case 'emergencyName':
        if (!value || !value.trim()) return 'Emergency Contact Name is required';
        if (value.trim().length < 2) return 'Please enter a valid contact name';
        return '';

      case 'emergencyNo': {
        const clean = (value || '').replace(/[^0-9]/g, '');
        if (!clean) return 'Emergency Contact Number is required';
        if (clean.length !== 10) return 'Emergency contact number must be 10 digits';
        const ownMobile = (allData.mobileNo || '').replace(/[^0-9]/g, '');
        if (clean === ownMobile && ownMobile.length === 10) {
          return 'Emergency contact must be different from your personal mobile';
        }
        return '';
      }

      case 'dob': {
        if (!value) return 'Date of Birth is required';
        const [y, m, d] = value.split('-').map(Number);
        if (!y || !m || !d) return 'Invalid Date of Birth';
        const birthDate = new Date(y, m - 1, d);
        if (birthDate > new Date()) return 'Date of Birth cannot be in the future';
        const ageYears = (Date.now() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000);
        if (ageYears < 10) return 'Runner must be at least 10 years of age';
        if (ageYears > 100) return 'Please check the birth year';
        return '';
      }

      case 'bloodGroup':
        if (!value || value === 'Select Blood Group') return 'Please select your blood group';
        return '';

      case 'residentialAddress':
        if (!value || !value.trim()) return 'Residential Address is required';
        if (value.trim().length < 5) return 'Please enter a complete residential address (min 5 characters)';
        return '';

      case 'pinZipCode': {
        const clean = (value || '').replace(/[^0-9]/g, '');
        if (!clean) return 'PIN / Zip Code is required';
        if (clean.length !== 6) return 'PIN Code must be 6 numeric digits';
        return '';
      }

      case 'locationPreference':
        if (!value || !value.trim()) return 'Please select your preferred training ground';
        return '';

      case 'maxDistance1Year':
        if (!value) return 'Please select your max distance run in the last year';
        return '';

      case 'pbTiming': {
        if (allData.pbEvent === 'None / First-timer') return '';
        if (!value || value === '00:00:00') return 'Please enter your PB finish time';
        return '';
      }

      case 'acceptedTerms':
        if (!value) return 'You must accept the medical clearance & liability waiver to register';
        return '';

      default:
        return '';
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'sameAsMobile' && value === true) {
        next.whatsappNo = next.mobileNo;
      }
      if (field === 'mobileNo' && next.sameAsMobile) {
        next.whatsappNo = value;
      }
      return next;
    });

    // Clear error dynamically if valid
    const err = validateField(field, value, { ...formData, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field], formData);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateAll = () => {
    const fields = [
      'fullName',
      'email',
      'mobileNo',
      'whatsappNo',
      'emergencyName',
      'emergencyNo',
      'dob',
      'bloodGroup',
      'residentialAddress',
      'pinZipCode',
      'locationPreference',
      'maxDistance1Year',
      'pbTiming',
      'acceptedTerms'
    ];

    const newErrors = {};
    let firstInvalidField = null;

    fields.forEach((field) => {
      const err = validateField(field, formData[field], formData);
      if (err) {
        newErrors[field] = err;
        if (!firstInvalidField) firstInvalidField = field;
      }
    });

    setErrors(newErrors);
    setTouched(fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}));

    if (firstInvalidField) {
      // Find element and scroll smoothly to it
      const el = document.getElementById(`reg-${firstInvalidField.toLowerCase()}`) ||
                 document.getElementById('reg-title');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegistrationId(`JJs-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-title"
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md transition-all overflow-y-auto"
    >
      <div
        className="w-full max-w-4xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border shadow-2xl relative my-auto max-h-[94vh] overflow-y-auto transition-all"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        {/* High-Contrast Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close registration dialog"
          title="Close dialog"
          className="absolute top-3.5 right-3.5 sm:top-6 sm:right-6 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border shadow-sm transition-all hover:scale-105 z-30 cursor-pointer"
          style={{
            backgroundColor: 'var(--card-inner)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-heading)'
          }}
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {submitted ? (
          /* =========================================================================
             CONFIRMATION / PAYMENT RECEIPT
             ========================================================================= */
          <div className="text-center py-6 sm:py-10 space-y-6">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-xl animate-bounce"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
            >
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Payment Authorized • Registration Confirmed
              </span>
              <h3
                className="text-2xl sm:text-4xl font-black tracking-tight mt-3 uppercase"
                style={{ color: 'var(--text-heading)' }}
              >
                Welcome to JJs Running!
              </h3>
              <p
                className="text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Congratulations,{' '}
                <span className="font-bold" style={{ color: 'var(--text-heading)' }}>
                  {formData.fullName}
                </span>
                ! Your slot for{' '}
                <span className="font-bold text-[#d02426]">
                  {activeProgram?.title || 'Training Program'}
                </span>{' '}
                is confirmed.
              </p>
            </div>

            {/* Official Registration Receipt Card */}
            <div
              className="p-5 sm:p-6 rounded-2xl border text-left text-xs sm:text-sm space-y-3 max-w-lg mx-auto shadow-md"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span
                  className="text-xs uppercase tracking-wider font-semibold"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Registration ID:
                </span>
                <span className="font-mono font-black text-sm text-[#318cdd]">{registrationId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Program Track:</span>
                <span
                  className="font-bold text-right truncate max-w-[220px]"
                  style={{ color: 'var(--text-heading)' }}
                >
                  {activeProgram?.title || 'Program Registration'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Assigned Ground / Center:</span>
                <span className="font-bold text-right" style={{ color: 'var(--text-heading)' }}>
                  {formData.locationPreference}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>T-Shirt Size / Blood Group:</span>
                <span className="font-mono font-bold" style={{ color: 'var(--text-heading)' }}>
                  Size {formData.tshirtSize} • {formData.bloodGroup}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{totalAmount.toLocaleString('en-IN')} (Incl. 5% GST)
                </span>
              </div>

              <div
                className="flex items-center justify-between pt-2 border-t"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>TCH WhatsApp Onboarding:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Dispatched to{' '}
                  {formData.sameAsMobile ? formData.mobileNo : formData.whatsappNo}
                </span>
              </div>
            </div>

            <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Your Training Center Head (TCH) will add you to the squad WhatsApp group for morning warmup drills, hydration pacing, and track coordinates.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer bg-[#d02426] text-white hover:bg-[#b51c1e]"
              >
                Back to Site
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================================
             OFFICIAL PROGRAM REGISTRATION FORM
             ========================================================================= */
          <div>
            {/* Header: Title + Warm Underline */}
            <div className="text-center mb-6 sm:mb-8 pr-8 sm:pr-0">
              <h2
                id="reg-title"
                className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight"
                style={{ color: 'var(--text-heading)' }}
              >
                Program Registration
              </h2>
              <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-2 rounded-full" />

              {/* Active Program Banner with Option to Switch */}
              {activeProgram && (
                <div
                  className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl border text-xs shadow-xs"
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Selected Program:
                  </span>
                  <span className="font-bold text-[#318cdd]">{activeProgram.title}</span>
                  <span className="opacity-40">•</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {activeProgram.price}
                  </span>
                  {activeProgram.tax && (
                    <span className="text-[10px] opacity-70">({activeProgram.tax})</span>
                  )}

                  {onSwitchToTrial && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onSwitchToTrial();
                      }}
                      className="ml-2 text-[11px] font-bold text-[#d02426] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Looking for Free Trial instead?
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Error Banner when attempting to submit with errors */}
            {Object.keys(errors).some((k) => errors[k]) && Object.keys(touched).length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Please fix the highlighted required fields below before proceeding to payment.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
              {/* Desktop 2-Column Grid / Mobile 1-Column Flow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Full Name */}
                <div>
                  <label
                    htmlFor="reg-fullname"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Full Name <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="reg-fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      touched.fullName && errors.fullName ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.fullName && errors.fullName ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* 2. Email Address */}
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Email Address <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    inputMode="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
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

                {/* 3. Mobile No */}
                <div>
                  <label
                    htmlFor="reg-mobileno"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Mobile No (10 Digits) <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-mobileno"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={formData.mobileNo}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      handleFieldChange('mobileNo', clean);
                    }}
                    onBlur={() => handleBlur('mobileNo')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      touched.mobileNo && errors.mobileNo ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.mobileNo && errors.mobileNo ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.mobileNo && errors.mobileNo && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.mobileNo}
                    </p>
                  )}
                </div>

                {/* 4. Whatsapp No */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="reg-whatsappno"
                      className="text-xs sm:text-sm font-bold"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Whatsapp No <span className="text-[#d02426]">*</span>
                    </label>
                    <label
                      className="flex items-center gap-1.5 text-[11px] cursor-pointer select-none"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sameAsMobile}
                        onChange={(e) => handleFieldChange('sameAsMobile', e.target.checked)}
                        className="rounded accent-[#d02426]"
                      />
                      <span>Same as Mobile</span>
                    </label>
                  </div>
                  <input
                    id="reg-whatsappno"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    disabled={formData.sameAsMobile}
                    value={formData.sameAsMobile ? formData.mobileNo : formData.whatsappNo}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      handleFieldChange('whatsappNo', clean);
                    }}
                    onBlur={() => handleBlur('whatsappNo')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      touched.whatsappNo && errors.whatsappNo ? 'border-red-500 bg-red-500/5' : ''
                    } ${formData.sameAsMobile ? 'opacity-80' : ''}`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.whatsappNo && errors.whatsappNo ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.whatsappNo && errors.whatsappNo && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.whatsappNo}
                    </p>
                  )}
                </div>

                {/* 5. Emergency Contact Name */}
                <div>
                  <label
                    htmlFor="reg-emergencyname"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Emergency Contact Name <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-emergencyname"
                    type="text"
                    placeholder="Contact person name (e.g. Spouse / Parent)"
                    value={formData.emergencyName}
                    onChange={(e) => handleFieldChange('emergencyName', e.target.value)}
                    onBlur={() => handleBlur('emergencyName')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      touched.emergencyName && errors.emergencyName ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.emergencyName && errors.emergencyName ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.emergencyName && errors.emergencyName && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.emergencyName}
                    </p>
                  )}
                </div>

                {/* 6. Emergency Contact No */}
                <div>
                  <label
                    htmlFor="reg-emergencyno"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Emergency Contact No <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-emergencyno"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="e.g. 9811122233"
                    value={formData.emergencyNo}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      handleFieldChange('emergencyNo', clean);
                    }}
                    onBlur={() => handleBlur('emergencyNo')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      touched.emergencyNo && errors.emergencyNo ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.emergencyNo && errors.emergencyNo ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.emergencyNo && errors.emergencyNo && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.emergencyNo}
                    </p>
                  )}
                </div>

                {/* 7. Gender */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-bold mb-2"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Gender <span className="text-[#d02426]">*</span>
                  </label>
                  <div className="flex items-center gap-4 sm:gap-6 pt-1">
                    {['Male', 'Female'].map((gender) => (
                      <label
                        key={gender}
                        className="inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold select-none min-h-[40px] px-2 py-1"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) => handleFieldChange('gender', e.target.value)}
                          className="w-4 h-4 accent-[#318cdd] cursor-pointer"
                        />
                        <span style={{ color: 'var(--text-heading)' }}>{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 8. T-Shirt Size */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-bold mb-2"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    T-Shirt Size <span className="text-[#d02426]">*</span>
                  </label>
                  <div className="flex items-center flex-wrap gap-2 sm:gap-4 pt-1">
                    {TSHIRT_SIZES.map((size) => (
                      <label
                        key={size}
                        className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm font-semibold select-none min-h-[40px] px-1"
                      >
                        <input
                          type="radio"
                          name="tshirtSize"
                          value={size}
                          checked={formData.tshirtSize === size}
                          onChange={(e) => handleFieldChange('tshirtSize', e.target.value)}
                          className="w-4 h-4 accent-[#318cdd] cursor-pointer"
                        />
                        <span style={{ color: 'var(--text-heading)' }}>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 9. Date of Birth (Theme-Aware Calendar Control) */}
                <div>
                  <label
                    htmlFor="reg-dob-btn"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Date of Birth <span className="text-[#d02426]">*</span>
                  </label>
                  <CustomCalendarPicker
                    value={formData.dob}
                    onChange={(newDob) => handleFieldChange('dob', newDob)}
                    error={touched.dob && errors.dob ? errors.dob : ''}
                  />
                  {touched.dob && errors.dob && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.dob}
                    </p>
                  )}
                </div>

                {/* 10. Blood Group */}
                <div>
                  <label
                    htmlFor="reg-bloodgroup"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Blood Group <span className="text-[#d02426]">*</span>
                  </label>
                  <CustomDropdown
                    id="reg-bloodgroup"
                    value={formData.bloodGroup}
                    onChange={(bg) => handleFieldChange('bloodGroup', bg)}
                    options={BLOOD_GROUPS}
                    placeholder="Select Blood Group"
                    error={touched.bloodGroup && Boolean(errors.bloodGroup)}
                  />
                  {touched.bloodGroup && errors.bloodGroup && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.bloodGroup}
                    </p>
                  )}
                </div>

                {/* 11. Residential Address */}
                <div className="md:row-span-2">
                  <label
                    htmlFor="reg-residentialaddress"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Residential Address <span className="text-[#d02426]">*</span>
                  </label>
                  <textarea
                    id="reg-residentialaddress"
                    rows={4}
                    placeholder="House/Flat No, Street, Locality..."
                    value={formData.residentialAddress}
                    onChange={(e) => handleFieldChange('residentialAddress', e.target.value)}
                    onBlur={() => handleBlur('residentialAddress')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 resize-none ${
                      touched.residentialAddress && errors.residentialAddress ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.residentialAddress && errors.residentialAddress ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.residentialAddress && errors.residentialAddress && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.residentialAddress}
                    </p>
                  )}
                </div>

                {/* 12. Pin / Zip Code */}
                <div>
                  <label
                    htmlFor="reg-pinzipcode"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Pin / Zip Code (6 Digits) <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-pinzipcode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="e.g. 560003"
                    value={formData.pinZipCode}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      handleFieldChange('pinZipCode', clean);
                    }}
                    onBlur={() => handleBlur('pinZipCode')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      touched.pinZipCode && errors.pinZipCode ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: touched.pinZipCode && errors.pinZipCode ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {touched.pinZipCode && errors.pinZipCode && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.pinZipCode}
                    </p>
                  )}
                </div>

                {/* 13. Location Preference (from centersData with Ground/City Search) */}
                <div>
                  <label
                    htmlFor="reg-locationpreference"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Location Preference (20+ Training Centers) <span className="text-[#d02426]">*</span>
                  </label>
                  <LocationDropdown
                    value={formData.locationPreference}
                    onChange={(loc) => handleFieldChange('locationPreference', loc)}
                    error={touched.locationPreference && Boolean(errors.locationPreference)}
                  />
                  {touched.locationPreference && errors.locationPreference && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.locationPreference}
                    </p>
                  )}
                </div>
              </div>

              {/* 14. Maximum Distance Run in last 1year (Full Width) */}
              <div className="pt-2">
                <label
                  className="block text-xs sm:text-sm font-bold mb-2.5"
                  style={{ color: 'var(--text-heading)' }}
                >
                  Maximum Distance Run in last 1year <span className="text-[#d02426]">*</span>
                </label>
                <div className="flex items-center flex-wrap gap-3 sm:gap-6">
                  {DISTANCE_OPTIONS.map((dist) => (
                    <label
                      key={dist}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm font-medium select-none min-h-[44px] px-1"
                    >
                      <input
                        type="radio"
                        name="maxDistance1Year"
                        value={dist}
                        checked={formData.maxDistance1Year === dist}
                        onChange={(e) => handleFieldChange('maxDistance1Year', e.target.value)}
                        className="w-4 h-4 accent-[#318cdd] cursor-pointer"
                      />
                      <span style={{ color: 'var(--text-heading)' }}>{dist}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 15. Personal Best Event & Timing (Masked Numeric Time Control) */}
              <div>
                <label
                  className="block text-xs sm:text-sm font-bold mb-2"
                  style={{ color: 'var(--text-heading)' }}
                >
                  Personal Best Event &amp; Timing <span className="text-[#d02426]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Event Dropdown */}
                  <div>
                    <CustomDropdown
                      value={formData.pbEvent}
                      onChange={(ev) => handleFieldChange('pbEvent', ev)}
                      options={PB_EVENTS}
                      placeholder="Select PB Event"
                    />
                  </div>

                  {/* Masked Numeric Race Time Input (HH : MM : SS) */}
                  <div>
                    <RaceTimingInput
                      value={formData.pbTiming}
                      onChange={(t) => handleFieldChange('pbTiming', t)}
                      disabled={formData.pbEvent === 'None / First-timer'}
                      error={touched.pbTiming && errors.pbTiming ? errors.pbTiming : ''}
                    />
                    {touched.pbTiming && errors.pbTiming && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.pbTiming}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 16. Specify health problem */}
              <div>
                <label
                  htmlFor="reg-health"
                  className="block text-xs sm:text-sm font-bold mb-1.5"
                  style={{ color: 'var(--text-heading)' }}
                >
                  Specify health problem (if any) that might hamper physical activities
                </label>
                <textarea
                  id="reg-health"
                  rows={3}
                  placeholder="e.g. Asthma, prior ACL tear, hypertension, cardiac conditions, or write 'None'..."
                  value={formData.healthProblem}
                  onChange={(e) => handleFieldChange('healthProblem', e.target.value)}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 resize-none"
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-heading)'
                  }}
                />
              </div>

              {/* 17. Promocode Section */}
              <div
                className="p-4 sm:p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <label
                  htmlFor="reg-promocode"
                  className="block text-xs sm:text-sm font-bold"
                  style={{ color: 'var(--text-heading)' }}
                >
                  If you have Promocode, Enter your Promocode
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    id="reg-promocode"
                    type="text"
                    placeholder="Enter your Promocode"
                    value={formData.promocode}
                    onChange={(e) => {
                      setFormData({ ...formData, promocode: e.target.value.toUpperCase() });
                      setPromoError('');
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border font-mono text-xs sm:text-sm uppercase transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all cursor-pointer min-h-[44px]"
                  >
                    Apply
                  </button>
                </div>

                {promoMessage && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {promoMessage}
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> {promoError}
                  </p>
                )}

                <div className="bg-[#24639c] text-white text-[11px] sm:text-xs font-medium px-4 py-2.5 rounded-lg inline-block w-full sm:w-auto shadow-xs">
                  If you don't have promocode, please proceed the Payment.
                </div>

                {/* Live Cost Breakdown */}
                <div
                  className="pt-2 border-t text-xs space-y-1.5 font-mono"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>Program Base Fee:</span>
                    <span>₹{baseFee.toLocaleString('en-IN')}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount:</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>GST (5%):</span>
                    <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div
                    className="flex justify-between font-black text-sm pt-1 border-t"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  >
                    <span>Total Payable:</span>
                    <span className="text-[#d02426]">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* 18. Medical & Legal Declaration (Exact Text) */}
              <div className="space-y-3 pt-2">
                <p
                  className="text-xs sm:text-[13px] leading-relaxed text-justify opacity-90"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  I declare that, I am not suffering from any health condition that will hamper
                  physical activity that I'm undertaking as part of this training program, and I have
                  clearance from medical practitioner for participating in the said activity. I agree
                  that JJActive Pvt. Ltd. &amp; it's trainers will not be held responsible for any
                  accidents/injuries or complications related to my health while training with
                  JJActive Pvt. Ltd.
                </p>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.acceptedTerms}
                    onChange={(e) => handleFieldChange('acceptedTerms', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-[#d02426] cursor-pointer flex-shrink-0"
                  />
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      touched.acceptedTerms && errors.acceptedTerms ? 'text-red-500' : ''
                    }`}
                    style={{
                      color: touched.acceptedTerms && errors.acceptedTerms ? '#ef4444' : 'var(--text-heading)'
                    }}
                  >
                    I Accept(Please Select the Checkbox) <span className="text-[#d02426]">*</span>
                  </span>
                </label>
                {touched.acceptedTerms && errors.acceptedTerms && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.acceptedTerms}
                  </p>
                )}
              </div>

              {/* 19. PAY Button - Vibrant Official JJs Running Brand Red */}
              <div className="text-center pt-5 sm:pt-7 space-y-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-80 py-4 px-8 rounded-full text-sm sm:text-base font-black uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2.5 mx-auto bg-gradient-to-r from-[#e11d48] via-[#d02426] to-[#b51c1e] hover:from-[#d02426] hover:to-[#991b1b] shadow-red-600/35 hover:shadow-red-600/55 border border-white/20"
                >
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {loading ? 'Processing Payment...' : `PAY ₹${totalAmount.toLocaleString('en-IN')}`}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <p
                  className="text-[11px] opacity-75 flex items-center justify-center gap-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>256-Bit SSL Encrypted • Direct Razorpay Gateway</span>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
