import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Select from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import { format, isValid } from 'date-fns';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  Calendar as CalendarIcon,
  Lock,
  MapPin,
  User,
  Trophy,
  CreditCard,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { centersData } from '../data/centersData';
import { programsData } from '../data/programsData';
import JJsLogo from './JJsLogo';

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

const CURRENT_YEAR = new Date().getFullYear();

// =============================================================================
// ZOD VALIDATION SCHEMA
// =============================================================================
const registrationSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full Name is required')
      .min(2, 'Please enter at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email Address is required')
      .email('Please enter a valid email address'),
    mobileNo: z
      .string()
      .min(1, 'Mobile Number is required')
      .regex(/^[0-9]{10}$/, 'Must be a 10-digit mobile number'),
    whatsappNo: z
      .string()
      .min(1, 'WhatsApp Number is required')
      .regex(/^[0-9]{10}$/, 'Must be a 10-digit WhatsApp number'),
    sameAsMobile: z.boolean().default(false),
    emergencyName: z
      .string()
      .min(1, 'Emergency Contact Name is required')
      .min(2, 'Please enter a valid contact name'),
    emergencyNo: z
      .string()
      .min(1, 'Emergency Contact Number is required')
      .regex(/^[0-9]{10}$/, 'Must be a 10-digit emergency number'),
    gender: z.string().min(1, 'Please select your Gender'),
    tshirtSize: z.string().min(1, 'Please select your T-Shirt size'),
    dob: z
      .string()
      .min(1, 'Date of Birth is required')
      .refine((val) => {
        const d = new Date(val);
        if (isNaN(d.getTime())) return false;
        const age = new Date().getFullYear() - d.getFullYear();
        return age >= 10 && d <= new Date();
      }, 'Age must be at least 10 years and cannot be in the future'),
    bloodGroup: z.string().min(1, 'Please select your Blood Group'),
    residentialAddress: z
      .string()
      .min(1, 'Residential Address is required')
      .min(5, 'Address must be at least 5 characters'),
    pinZipCode: z
      .string()
      .min(1, 'PIN / Zip Code is required')
      .regex(/^[0-9]{6}$/, 'Must be a 6-digit PIN code'),
    locationPreference: z.string().min(1, 'Please select your training location preference'),
    maxDistance1Year: z.string().min(1, 'Please select your maximum distance'),
    pbEvent: z.string().min(1, 'Please select personal best event'),
    pbTiming: z.string().optional(),
    healthProblem: z.string().optional(),
    promocode: z.string().optional(),
    acceptedTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions waiver' })
    })
  })
  .refine((data) => data.emergencyNo !== data.mobileNo, {
    message: 'Emergency number cannot be identical to your personal mobile number',
    path: ['emergencyNo']
  });

// =============================================================================
// 1. Radix UI Select Dropdown (Theme-Aware, Portaled)
// =============================================================================
function RadixSelect({ value, onValueChange, options = [], placeholder = 'Select...', error, id }) {
  return (
    <Select.Root value={value || undefined} onValueChange={onValueChange}>
      <Select.Trigger
        id={id}
        className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
          error ? 'border-red-500 bg-red-500/5' : ''
        }`}
        style={{
          backgroundColor: 'var(--card-inner)',
          borderColor: error ? '#ef4444' : 'var(--border-color)',
          color: value ? 'var(--text-heading)' : 'var(--text-secondary)'
        }}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon asChild>
          <ChevronDown className="w-4 h-4 opacity-60 flex-shrink-0" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-[9999] min-w-[var(--radix-select-trigger-width)] max-h-60 rounded-xl border shadow-2xl p-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 overflow-y-auto"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
            color: 'var(--text-heading)'
          }}
        >
          <Select.ScrollUpButton className="flex items-center justify-center p-1 cursor-default opacity-60">
            <ChevronUp className="w-4 h-4" />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item
                key={opt}
                value={opt}
                className="relative flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg cursor-pointer outline-none select-none transition-colors hover:bg-slate-500/10 data-[highlighted]:bg-[#318cdd]/15 data-[highlighted]:text-[#318cdd] data-[state=checked]:font-bold data-[state=checked]:text-[#318cdd]"
                style={{ color: 'var(--text-heading)' }}
              >
                <Select.ItemText>{opt}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="w-4 h-4 text-[#318cdd]" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center p-1 cursor-default opacity-60">
            <ChevronDown className="w-4 h-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// =============================================================================
// 2. Bespoke Themed Sports Calendar Control (Option 2)
// =============================================================================
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CALENDAR_YEARS = Array.from(
  { length: CURRENT_YEAR - 10 - 1940 + 1 },
  (_, i) => CURRENT_YEAR - 10 - i
);

function RadixCalendarPicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);

  // Parse YYYY-MM-DD
  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    const parts = value.split('-');
    if (parts.length !== 3) return undefined;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    return isValid(date) ? date : undefined;
  }, [value]);

  const [prevValue, setPrevValue] = useState(value);
  const [viewYear, setViewYear] = useState(() => (selectedDate ? selectedDate.getFullYear() : 1995));
  const [viewMonth, setViewMonth] = useState(() => (selectedDate ? selectedDate.getMonth() : 0));

  if (value !== prevValue) {
    setPrevValue(value);
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => Math.max(1940, y - 1));
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    const maxYear = CURRENT_YEAR - 10;
    if (viewMonth === 11) {
      if (viewYear < maxYear) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      }
    } else {
      if (viewYear === maxYear && viewMonth >= new Date().getMonth()) return;
      setViewMonth((m) => m + 1);
    }
  };

  // Days calculations
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const maxAllowedDate = useMemo(() => new Date(CURRENT_YEAR - 10, 11, 31), []);

  const displayDate = selectedDate
    ? format(selectedDate, 'dd MMM yyyy')
    : 'Select Date of Birth...';

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id="reg-dob-btn"
          className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
            error ? 'border-red-500 bg-red-500/5' : ''
          }`}
          style={{
            backgroundColor: 'var(--card-inner)',
            borderColor: error ? '#ef4444' : 'var(--border-color)',
            color: selectedDate ? 'var(--text-heading)' : 'var(--text-secondary)'
          }}
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="w-4 h-4 opacity-70 text-[#318cdd] flex-shrink-0" />
            <span className="truncate">{displayDate}</span>
          </div>
          <ChevronDown className="w-4 h-4 opacity-60 flex-shrink-0" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          className="z-[9999] rounded-2xl border shadow-2xl p-4 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 w-[290px] sm:w-[310px]"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            color: 'var(--text-heading)'
          }}
        >
          <Popover.Arrow
            className="fill-current"
            style={{ color: 'var(--border-color)' }}
            width={12}
            height={6}
          />

          {/* Calendar Header: Month, Year, and Navigation */}
          <div
            className="flex items-center justify-between pb-3 mb-2 border-b"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <select
                aria-label="Select month"
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="bg-transparent font-bold text-xs sm:text-sm rounded-lg px-2 py-1 transition-colors hover:bg-[#318cdd]/10 outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#318cdd]/50 cursor-pointer"
                style={{ color: 'var(--text-heading)' }}
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option
                    key={name}
                    value={idx}
                    style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-heading)' }}
                  >
                    {name}
                  </option>
                ))}
              </select>

              <select
                aria-label="Select year"
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="bg-transparent font-bold text-xs sm:text-sm rounded-lg px-2 py-1 transition-colors hover:bg-[#318cdd]/10 outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#318cdd]/50 cursor-pointer"
                style={{ color: 'var(--text-heading)' }}
              >
                {CALENDAR_YEARS.map((year) => (
                  <option
                    key={year}
                    value={year}
                    style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-heading)' }}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Chevrons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className="w-7 h-7 flex items-center justify-center rounded-lg border transition-all hover:bg-[#318cdd]/15 hover:border-[#318cdd]/40 cursor-pointer active:scale-95 text-[var(--text-heading)] outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#318cdd]/50"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <ChevronLeft className="w-4 h-4 opacity-75 hover:opacity-100" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className="w-7 h-7 flex items-center justify-center rounded-lg border transition-all hover:bg-[#318cdd]/15 hover:border-[#318cdd]/40 cursor-pointer active:scale-95 text-[var(--text-heading)] outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#318cdd]/50"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <ChevronRight className="w-4 h-4 opacity-75 hover:opacity-100" />
              </button>
            </div>
          </div>

          {/* Weekday Row */}
          <div className="grid grid-cols-7 gap-1 text-center py-1 mb-1 font-sans">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span
                key={d}
                className="text-[11px] font-bold uppercase tracking-wider opacity-60"
                style={{ color: 'var(--text-secondary)' }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-sans select-none">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8" />
            ))}

            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getDate() === day;

              const thisDate = new Date(viewYear, viewMonth, day);
              const isFuture = thisDate > maxAllowedDate;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isFuture}
                  onClick={() => {
                    const m = String(viewMonth + 1).padStart(2, '0');
                    const d = String(day).padStart(2, '0');
                    onChange(`${viewYear}-${m}-${d}`);
                    setOpen(false);
                  }}
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#318cdd] text-white font-black shadow-md shadow-[#318cdd]/40 scale-105'
                      : isFuture
                      ? 'opacity-20 cursor-not-allowed'
                      : 'hover:bg-[#318cdd]/15 hover:text-[#318cdd] active:scale-90'
                  }`}
                  style={{
                    color: isSelected ? '#ffffff' : 'var(--text-heading)'
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Popover Footer */}
          <div
            className="flex items-center justify-between pt-3 mt-3 border-t text-xs font-semibold"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="text-[#d02426] hover:underline cursor-pointer px-1 py-0.5"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#318cdd] hover:bg-[#256eb0] transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Done
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// =============================================================================
// 3. Themed Location Dropdown with Grouping & Live Search
// =============================================================================
function RadixLocationSelect({ value, onChange, error }) {
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
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
          }}
        >
          {/* Search Header */}
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
              placeholder="Search by center, venue or city..."
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
                No training centers match "{search}"
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
                    const isSelected =
                      value === c.name || value === c.id || value === `${c.city} - ${c.name}`;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(c.name);
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
// 4. Popover Race Timing Spinner Control (HH : MM : SS)
// =============================================================================
function PopoverTimePicker({ value, onChange, disabled = false, error = '' }) {
  const [open, setOpen] = useState(false);

  // Parse incoming value "HH:MM:SS"
  const [hours, minutes, seconds] = useMemo(() => {
    if (!value) return ['00', '00', '00'];
    const parts = value.split(':');
    return [
      parts[0] !== undefined ? parts[0].padStart(2, '0') : '00',
      parts[1] !== undefined ? parts[1].padStart(2, '0') : '00',
      parts[2] !== undefined ? parts[2].padStart(2, '0') : '00'
    ];
  }, [value]);

  const updateTiming = useCallback(
    (h, m, s) => {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const ss = String(s).padStart(2, '0');
      onChange(`${hh}:${mm}:${ss}`);
    },
    [onChange]
  );

  const adjustHours = (delta) => {
    const cur = parseInt(hours, 10) || 0;
    const next = (cur + delta + 100) % 100;
    updateTiming(next, minutes, seconds);
  };

  const adjustMinutes = (delta) => {
    const cur = parseInt(minutes, 10) || 0;
    const next = (cur + delta + 60) % 60;
    updateTiming(hours, next, seconds);
  };

  const adjustSeconds = (delta) => {
    const cur = parseInt(seconds, 10) || 0;
    const next = (cur + delta + 60) % 60;
    updateTiming(hours, minutes, next);
  };

  const handleDirectChange = (unit, val) => {
    const clean = val.replace(/[^0-9]/g, '').slice(-2);
    if (unit === 'hours') {
      const num = Math.min(99, Number(clean) || 0);
      updateTiming(num, minutes, seconds);
    } else if (unit === 'minutes') {
      const num = Math.min(59, Number(clean) || 0);
      updateTiming(hours, num, seconds);
    } else if (unit === 'seconds') {
      const num = Math.min(59, Number(clean) || 0);
      updateTiming(hours, minutes, num);
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
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id="reg-pb-timing-btn"
          className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
            error ? 'border-red-500 bg-red-500/5' : ''
          }`}
          style={{
            backgroundColor: 'var(--card-inner)',
            borderColor: error ? '#ef4444' : 'var(--border-color)',
            color: value ? 'var(--text-heading)' : 'var(--text-secondary)'
          }}
        >
          {value ? (
            <span className="font-mono font-bold tracking-wider">{value}</span>
          ) : (
            <span className="font-normal opacity-75">Select PB Timing (HH:MM:SS)</span>
          )}
          <Clock className="w-4 h-4 opacity-60 text-[#318cdd] flex-shrink-0" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="end"
          className="z-[9999] rounded-2xl border shadow-2xl p-4 sm:p-5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            color: 'var(--text-heading)'
          }}
        >
          <Popover.Arrow
            className="fill-current"
            style={{ color: 'var(--border-color)' }}
            width={12}
            height={6}
          />

          {/* Popover Header */}
          <div
            className="flex items-center justify-between pb-3 mb-3 border-b"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#318cdd]" />
              <span className="text-xs font-bold tracking-wide" style={{ color: 'var(--text-heading)' }}>
                Personal Best
              </span>
            </div>
            <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-[#318cdd]/15 text-[#318cdd] tracking-wider">
              {value || `${hours}:${minutes}:${seconds}`}
            </span>
          </div>

          {/* Time Spinner Columns */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 font-mono select-none">
            {/* Hours Column */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustHours(1)}
                className="w-10 h-8 flex items-center justify-center rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer hover:bg-[#318cdd]/15 text-[#318cdd]"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
                aria-label="Increment hours"
              >
                <ChevronUp className="w-5 h-5 stroke-[2.5]" />
              </button>

              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={hours}
                onChange={(e) => handleDirectChange('hours', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') adjustHours(1);
                  if (e.key === 'ArrowDown') adjustHours(-1);
                }}
                className="w-12 h-11 text-center text-lg sm:text-xl font-black rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
                aria-label="Hours"
              />

              <button
                type="button"
                onClick={() => adjustHours(-1)}
                className="w-10 h-8 flex items-center justify-center rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer hover:bg-[#318cdd]/15 text-[#318cdd]"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
                aria-label="Decrement hours"
              >
                <ChevronDown className="w-5 h-5 stroke-[2.5]" />
              </button>

              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                Hours
              </span>
            </div>

            <span className="text-xl sm:text-2xl font-black opacity-40 -mt-5">:</span>

            {/* Minutes Column */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustMinutes(1)}
                className="w-10 h-8 flex items-center justify-center rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer hover:bg-[#318cdd]/15 text-[#318cdd]"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
                aria-label="Increment minutes"
              >
                <ChevronUp className="w-5 h-5 stroke-[2.5]" />
              </button>

              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={minutes}
                onChange={(e) => handleDirectChange('minutes', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') adjustMinutes(1);
                  if (e.key === 'ArrowDown') adjustMinutes(-1);
                }}
                className="w-12 h-11 text-center text-lg sm:text-xl font-black rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
                aria-label="Minutes"
              />

              <button
                type="button"
                onClick={() => adjustMinutes(-1)}
                className="w-10 h-8 flex items-center justify-center rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer hover:bg-[#318cdd]/15 text-[#318cdd]"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
                aria-label="Decrement minutes"
              >
                <ChevronDown className="w-5 h-5 stroke-[2.5]" />
              </button>

              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                Mins
              </span>
            </div>

            <span className="text-xl sm:text-2xl font-black opacity-40 -mt-5">:</span>

            {/* Seconds Column */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustSeconds(1)}
                className="w-10 h-8 flex items-center justify-center rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer hover:bg-[#318cdd]/15 text-[#318cdd]"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
                aria-label="Increment seconds"
              >
                <ChevronUp className="w-5 h-5 stroke-[2.5]" />
              </button>

              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={seconds}
                onChange={(e) => handleDirectChange('seconds', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') adjustSeconds(1);
                  if (e.key === 'ArrowDown') adjustSeconds(-1);
                }}
                className="w-12 h-11 text-center text-lg sm:text-xl font-black rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-heading)'
                }}
                aria-label="Seconds"
              />

              <button
                type="button"
                onClick={() => adjustSeconds(-1)}
                className="w-10 h-8 flex items-center justify-center rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer hover:bg-[#318cdd]/15 text-[#318cdd]"
                style={{
                  backgroundColor: 'var(--card-inner)',
                  borderColor: 'var(--border-color)'
                }}
                aria-label="Decrement seconds"
              >
                <ChevronDown className="w-5 h-5 stroke-[2.5]" />
              </button>

              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                Secs
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div
            className="pt-3 mt-3 border-t flex items-center justify-between"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="text-xs font-semibold px-2 py-1 rounded-md text-[#d02426] hover:bg-[#d02426]/10 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                if (!value) {
                  updateTiming(hours, minutes, seconds);
                }
                setOpen(false);
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#318cdd] hover:bg-[#256eb0] transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Done
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// =============================================================================
// MAIN COMPONENT: ProgramRegistrationModal
// =============================================================================
export default function ProgramRegistrationModal({
  isOpen,
  onClose,
  selectedProgram = null,
  onSwitchToTrial = null
}) {
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
  }

  // React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNo: '',
      whatsappNo: '',
      sameAsMobile: false,
      emergencyName: '',
      emergencyNo: '',
      gender: '',
      tshirtSize: '',
      dob: '',
      bloodGroup: '',
      residentialAddress: '',
      pinZipCode: '',
      locationPreference: '',
      maxDistance1Year: '',
      pbEvent: '',
      pbTiming: '',
      healthProblem: '',
      promocode: '',
      acceptedTerms: false
    },
    mode: 'onTouched'
  });

  const watchSameAsMobile = useWatch({ control, name: 'sameAsMobile' });
  const watchMobileNo = useWatch({ control, name: 'mobileNo' });
  const watchPbEvent = useWatch({ control, name: 'pbEvent' });
  const watchPromocode = useWatch({ control, name: 'promocode' });

  // Sync WhatsApp when "Same as Mobile" is true
  useEffect(() => {
    if (watchSameAsMobile && watchMobileNo) {
      setValue('whatsappNo', watchMobileNo, { shouldValidate: true });
    }
  }, [watchMobileNo, watchSameAsMobile, setValue]);

  // Pricing & Promocode State
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const dialogRef = useRef(null);

  const baseFee = useMemo(() => {
    if (!activeProgram?.price) return 6000;
    const numeric = parseInt(activeProgram.price.replace(/[^0-9]/g, ''), 10);
    return isNaN(numeric) ? 6000 : numeric;
  }, [activeProgram]);

  const taxableAmount = Math.max(0, baseFee - promoDiscount);
  // 5% GST as specified across training programs
  const gstAmount = Math.round(taxableAmount * 0.05);
  const totalAmount = taxableAmount + gstAmount;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoMessage('');
    const code = (watchPromocode || '').trim().toUpperCase();

    if (!code) {
      setPromoError('Please enter a promocode before applying.');
      return;
    }

    if (code === 'JAGUAR10' || code === 'JJS10') {
      const discount = Math.round(baseFee * 0.1);
      setPromoDiscount(discount);
      setPromoMessage('10% Jaguar Athlete Discount Applied!');
    } else if (code === 'EARLYBIRD') {
      setPromoDiscount(500);
      setPromoMessage('₹500 Early Bird Discount Applied!');
    } else if (code === 'JJACTIVE') {
      const discount = Math.round(baseFee * 0.15);
      setPromoDiscount(discount);
      setPromoMessage('15% Club Partner Discount Applied!');
    } else {
      setPromoError(`Code "${code}" is invalid or expired. You can still proceed directly.`);
      setPromoDiscount(0);
    }
  };

  // Layout View Mode & Stepper State
  const [viewMode, setViewMode] = useState('wizard'); // 'wizard' | 'all-in-one'
  const [currentStep, setCurrentStep] = useState(1); // 1: Profile, 2: Ground, 3: Checkout

  const handleNextStep = async () => {
    let fields = [];
    if (currentStep === 1) {
      fields = [
        'fullName',
        'email',
        'mobileNo',
        'whatsappNo',
        'emergencyName',
        'emergencyNo',
        'gender',
        'tshirtSize',
        'dob',
        'bloodGroup'
      ];
    } else if (currentStep === 2) {
      fields = [
        'residentialAddress',
        'pinZipCode',
        'locationPreference',
        'maxDistance1Year',
        'pbEvent'
      ];
    }
    const valid = await trigger(fields);
    if (valid) {
      setCurrentStep((s) => Math.min(3, s + 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handleClose = useCallback(() => {
    setSubmitted(false);
    setPromoDiscount(0);
    setPromoMessage('');
    setPromoError('');
    setCurrentStep(1);
    reset();
    onClose();
  }, [onClose, reset]);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // On form submit
  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegistrationId(
        `JJs-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
      );
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
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6 bg-black/80 backdrop-blur-md transition-all overflow-hidden"
    >
      <div
        className="w-full max-w-6xl rounded-t-3xl lg:rounded-3xl border shadow-2xl relative h-[94vh] lg:h-[88vh] max-h-[920px] flex flex-col lg:flex-row overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        {submitted ? (
          /* =========================================================================
             CONFIRMATION / PAYMENT RECEIPT
             ========================================================================= */
          <div className="w-full h-full overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6">
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
                Congratulations, your slot for{' '}
                <span className="font-bold text-[#d02426]">
                  {activeProgram?.title || 'Training Program'}
                </span>{' '}
                is confirmed.
              </p>
            </div>

            {/* Official Registration Receipt Card */}
            <div
              className="p-5 sm:p-6 rounded-2xl border text-left text-xs sm:text-sm space-y-3 w-full max-w-lg mx-auto shadow-md"
              style={{
                backgroundColor: 'var(--card-inner)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Registration ID:
                </span>
                <span className="font-mono font-bold text-sm text-[#318cdd]">{registrationId}</span>
              </div>

              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Program Track:</span>
                <span className="font-bold" style={{ color: 'var(--text-heading)' }}>
                  {activeProgram?.title}
                </span>
              </div>

              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Program Duration:</span>
                <span className="font-bold" style={{ color: 'var(--text-heading)' }}>
                  {activeProgram?.duration || '12 Weeks'}
                </span>
              </div>

              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Base Enrollment Fee:</span>
                <span className="font-mono font-bold" style={{ color: 'var(--text-heading)' }}>
                  ₹{baseFee.toLocaleString('en-IN')}
                </span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Promocode Discount:</span>
                  <span className="font-mono">-₹{promoDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>GST (5%):</span>
                <span className="font-mono font-bold" style={{ color: 'var(--text-heading)' }}>
                  +₹{gstAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div
                className="flex items-center justify-between pt-3 border-t text-sm sm:text-base font-black"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-heading)' }}
              >
                <span>Total Amount Paid:</span>
                <span className="font-mono text-[#d02426]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              An official PDF receipt and WhatsApp training briefing with coach contacts have been dispatched.
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
          <>
            {/* =========================================================================
               DESKTOP EDITORIAL LEFT PANE (42% width)
               ========================================================================= */}
            <div
              className="hidden lg:flex lg:w-[42%] lg:max-w-[430px] flex-shrink-0 flex-col justify-between p-8 border-r overflow-y-auto no-scrollbar"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.015)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <JJsLogo className="h-7 w-auto" />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#d02426]/10 text-[#d02426] border border-[#d02426]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d02426] animate-pulse" />
                    Official Roster
                  </span>
                </div>

                <h2
                  id="reg-title"
                  className="text-2xl lg:text-3xl font-black tracking-tight"
                  style={{ color: 'var(--text-heading)' }}
                >
                  {activeProgram?.title || 'Program Registration'}
                </h2>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {activeProgram?.category && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#318cdd]/15 text-[#318cdd]">
                      {activeProgram.category}
                    </span>
                  )}
                  {activeProgram?.level && (
                    <span className="text-xs opacity-75" style={{ color: 'var(--text-secondary)' }}>
                      {activeProgram.level}
                    </span>
                  )}
                </div>

                {activeProgram?.description && (
                  <p className="text-xs mt-3 leading-relaxed opacity-85" style={{ color: 'var(--text-secondary)' }}>
                    {activeProgram.description}
                  </p>
                )}

                {/* Specs 4-Box Grid */}
                <div className="grid grid-cols-2 gap-2.5 my-5">
                  <div
                    className="p-3 rounded-xl border"
                    style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
                  >
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                      Duration
                    </span>
                    <span className="text-xs font-black" style={{ color: 'var(--text-heading)' }}>
                      {activeProgram?.duration || '12 Weeks'}
                    </span>
                  </div>
                  <div
                    className="p-3 rounded-xl border"
                    style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
                  >
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                      Schedule
                    </span>
                    <span className="text-xs font-black" style={{ color: 'var(--text-heading)' }}>
                      {activeProgram?.frequency || '3-4 Days/wk'}
                    </span>
                  </div>
                  <div
                    className="p-3 rounded-xl border"
                    style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
                  >
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                      Target
                    </span>
                    <span className="text-xs font-black truncate block" style={{ color: 'var(--text-heading)' }}>
                      {activeProgram?.targetRace || 'Race Finish Line'}
                    </span>
                  </div>
                  <div
                    className="p-3 rounded-xl border"
                    style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
                  >
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                      Format
                    </span>
                    <span className="text-xs font-black" style={{ color: 'var(--text-heading)' }}>
                      Ground + App Sync
                    </span>
                  </div>
                </div>

                {/* Highlights List */}
                {activeProgram?.highlights && activeProgram.highlights.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <span className="block text-[11px] font-bold uppercase tracking-wider opacity-70" style={{ color: 'var(--text-secondary)' }}>
                      Included In This Track:
                    </span>
                    <div className="space-y-1.5">
                      {activeProgram.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-heading)' }}>
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Anchored Left Pane Cost Breakdown */}
              <div>
                <div
                  className="p-4 rounded-2xl border space-y-2.5 shadow-xs"
                  style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>Base Fee:</span>
                    <span className="font-mono font-bold" style={{ color: 'var(--text-heading)' }}>
                      ₹{baseFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount:</span>
                      <span className="font-mono">-₹{promoDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>GST (5%):</span>
                    <span className="font-mono font-bold" style={{ color: 'var(--text-heading)' }}>
                      +₹{gstAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between pt-2.5 border-t text-sm font-black"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-heading)' }}
                  >
                    <span>Total Payable:</span>
                    <span className="font-mono text-[#d02426] text-base">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between text-[11px] opacity-75" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      256-Bit SSL Secured
                    </span>
                    <span className="font-mono text-[10px]">Direct Gateway</span>
                  </div>
                  {onSwitchToTrial && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onSwitchToTrial();
                      }}
                      className="text-[11px] font-bold text-[#d02426] hover:underline cursor-pointer flex items-center justify-center gap-1.5 py-1"
                    >
                      <Sparkles className="w-3 h-3" /> Looking for Free Trial instead?
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* =========================================================================
               RIGHT PANE: FORM & CONTROLS
               ========================================================================= */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {/* Mobile Grab Handle */}
              <div className="lg:hidden flex items-center justify-center pt-2.5 pb-1 flex-shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-slate-500/30" />
              </div>

              {/* Right Header Bar with View Switcher */}
              <div
                className="h-14 sm:h-16 px-4 sm:px-6 lg:px-8 border-b flex items-center justify-between flex-shrink-0 gap-2"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="lg:hidden font-black text-xs sm:text-sm uppercase tracking-tight truncate" style={{ color: 'var(--text-heading)' }}>
                    {activeProgram?.title || 'Program Registration'}
                  </span>
                  <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                    Athlete Registration
                  </span>
                </div>

                {/* Interactive Mode Switcher Pill */}
                <div
                  className="flex items-center p-0.5 rounded-full border text-[11px] font-bold"
                  style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode('wizard')}
                    className={`px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'wizard'
                        ? 'bg-[#d02426] text-white shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ color: viewMode === 'wizard' ? '#ffffff' : 'var(--text-heading)' }}
                  >
                    <span>3-Step Wizard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('all-in-one')}
                    className={`px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'all-in-one'
                        ? 'bg-[#318cdd] text-white shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ color: viewMode === 'all-in-one' ? '#ffffff' : 'var(--text-heading)' }}
                  >
                    <span>All-in-One</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {/* Close X Button */}
                  <button
                    onClick={handleClose}
                    aria-label="Close registration dialog"
                    title="Close dialog"
                    className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full border shadow-sm transition-all hover:scale-105 cursor-pointer outline-none focus:outline-none"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar pb-28 lg:pb-8">
                {/* Mobile Program Summary Banner */}
                <div
                  className="lg:hidden p-3.5 rounded-xl border flex items-center justify-between text-xs"
                  style={{ backgroundColor: 'var(--card-inner)', borderColor: 'var(--border-color)' }}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block" style={{ color: 'var(--text-secondary)' }}>
                      Selected Track
                    </span>
                    <span className="font-bold text-[#318cdd] text-sm">{activeProgram?.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-[#d02426]">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] block opacity-60" style={{ color: 'var(--text-secondary)' }}>
                      Incl. 5% GST
                    </span>
                  </div>
                </div>

                {/* 3-Step Wizard Stepper Tabs */}
                {viewMode === 'wizard' && (
                  <div className="space-y-3 mb-2">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { step: 1, label: 'Runner Profile' },
                        { step: 2, label: 'Training Ground' },
                        { step: 3, label: 'Waiver & Pay' }
                      ].map(({ step, label }) => {
                        const isActive = currentStep === step;
                        const isPassed = currentStep > step;

                        return (
                          <button
                            key={step}
                            type="button"
                            onClick={async () => {
                              if (step < currentStep) {
                                setCurrentStep(step);
                              } else if (step > currentStep) {
                                await handleNextStep();
                              }
                            }}
                            className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                              isActive
                                ? 'border-[#318cdd] ring-1 ring-[#318cdd]/40'
                                : isPassed
                                ? 'border-emerald-500/40'
                                : 'opacity-60 hover:opacity-90'
                            }`}
                            style={{
                              backgroundColor: isActive
                                ? 'rgba(49, 140, 221, 0.08)'
                                : isPassed
                                ? 'rgba(16, 185, 129, 0.06)'
                                : 'var(--card-inner)',
                              borderColor: isActive
                                ? '#318cdd'
                                : isPassed
                                ? 'rgba(16, 185, 129, 0.4)'
                                : 'var(--border-color)'
                            }}
                          >
                            <div
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-black flex-shrink-0"
                              style={{
                                backgroundColor: isActive
                                  ? '#318cdd'
                                  : isPassed
                                  ? '#10b981'
                                  : 'var(--card-inner)',
                                color: isActive || isPassed ? '#ffffff' : 'var(--text-secondary)'
                              }}
                            >
                              {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : `0${step}`}
                            </div>
                            <div className="truncate min-w-0">
                              <span className="text-[9px] uppercase font-bold tracking-wider opacity-60 block truncate" style={{ color: 'var(--text-secondary)' }}>
                                Step 0{step}
                              </span>
                              <span className="text-[11px] sm:text-xs font-bold truncate block" style={{ color: 'var(--text-heading)' }}>
                                {label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Stepper Progress Line */}
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--card-inner)' }}>
                      <div
                        className="h-full bg-gradient-to-r from-[#318cdd] to-[#d02426] transition-all duration-300 rounded-full"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <form id="reg-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* =========================================================================
                 SECTION 1: RUNNER PROFILE
                 ========================================================================= */}
              {(viewMode === 'all-in-one' || currentStep === 1) && (
              <div
                className="p-4 sm:p-6 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div
                  className="flex items-center gap-2 pb-2.5 border-b"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <User className="w-4 h-4 text-[#318cdd]" />
                  <span
                    className="text-xs sm:text-sm font-black uppercase tracking-wider"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    1. Runner Profile
                  </span>
                </div>

                {/* Row 1: Full Name & Email Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="reg-fullName"
                      className="block text-xs sm:text-sm font-bold mb-1.5"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Full Name <span className="text-[#d02426]">*</span>
                    </label>
                    <input
                      id="reg-fullName"
                      type="text"
                      placeholder="Enter full name"
                      {...register('fullName')}
                      className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                        errors.fullName ? 'border-red-500 bg-red-500/5' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: errors.fullName ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName.message}
                      </p>
                    )}
                  </div>

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
                      placeholder="name@example.com"
                      {...register('email')}
                      className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                        errors.email ? 'border-red-500 bg-red-500/5' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: errors.email ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Mobile No & WhatsApp No */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="reg-mobile"
                      className="block text-xs sm:text-sm font-bold mb-1.5"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Mobile No <span className="text-[#d02426]">*</span>
                    </label>
                    <input
                      id="reg-mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      {...register('mobileNo', {
                        onChange: (e) => {
                          const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                          setValue('mobileNo', clean, { shouldValidate: true });
                        }
                      })}
                      className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border font-mono text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                        errors.mobileNo ? 'border-red-500 bg-red-500/5' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: errors.mobileNo ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    {errors.mobileNo && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.mobileNo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="reg-whatsapp"
                        className="block text-xs sm:text-sm font-bold"
                        style={{ color: 'var(--text-heading)' }}
                      >
                        WhatsApp No <span className="text-[#d02426]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !watchSameAsMobile;
                          setValue('sameAsMobile', next, { shouldValidate: true });
                          if (next && watchMobileNo) {
                            setValue('whatsappNo', watchMobileNo, { shouldValidate: true });
                          }
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                          watchSameAsMobile
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: watchSameAsMobile ? undefined : 'var(--card-inner)',
                          borderColor: watchSameAsMobile ? undefined : 'var(--border-color)',
                          color: watchSameAsMobile ? undefined : 'var(--text-secondary)'
                        }}
                      >
                        <Check className={`w-3 h-3 ${watchSameAsMobile ? 'opacity-100' : 'opacity-30'}`} />
                        <span>Same as Mobile</span>
                      </button>
                    </div>
                    <input
                      id="reg-whatsapp"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit WhatsApp number"
                      disabled={watchSameAsMobile}
                      {...register('whatsappNo', {
                        onChange: (e) => {
                          const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                          setValue('whatsappNo', clean);
                        }
                      })}
                      className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border font-mono text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                        watchSameAsMobile ? 'opacity-60 cursor-not-allowed' : ''
                      } ${errors.whatsappNo ? 'border-red-500 bg-red-500/5' : ''}`}
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: errors.whatsappNo ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    {errors.whatsappNo && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.whatsappNo.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Emergency Contact Name & Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="reg-emergency-name"
                      className="block text-xs sm:text-sm font-bold mb-1.5"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Emergency Contact Name <span className="text-[#d02426]">*</span>
                    </label>
                    <input
                      id="reg-emergency-name"
                      type="text"
                      placeholder="Relative, spouse, or friend"
                      {...register('emergencyName')}
                      className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                        errors.emergencyName ? 'border-red-500 bg-red-500/5' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: errors.emergencyName ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    {errors.emergencyName && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.emergencyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-emergency-no"
                      className="block text-xs sm:text-sm font-bold mb-1.5"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Emergency Contact No <span className="text-[#d02426]">*</span>
                    </label>
                    <input
                      id="reg-emergency-no"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit emergency number"
                      {...register('emergencyNo', {
                        onChange: (e) => {
                          const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                          setValue('emergencyNo', clean);
                        }
                      })}
                      className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border font-mono text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                        errors.emergencyNo ? 'border-red-500 bg-red-500/5' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: errors.emergencyNo ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    {errors.emergencyNo && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.emergencyNo.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 4: Gender & T-Shirt Size (Sports Pill Selectors) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-1.5" style={{ color: 'var(--text-heading)' }}>
                      Gender <span className="text-[#d02426]">*</span>
                    </label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                          {['Male', 'Female'].map((g) => {
                            const isSelected = field.value === g;
                            return (
                              <button
                                type="button"
                                key={g}
                                onClick={() => field.onChange(g)}
                                className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#318cdd] text-white border-[#318cdd] shadow-md shadow-[#318cdd]/30 scale-[1.02]'
                                    : 'hover:bg-[var(--card-inner)] opacity-70 hover:opacity-100'
                                }`}
                                style={{
                                  backgroundColor: isSelected ? '#318cdd' : 'var(--card-inner)',
                                  borderColor: isSelected ? '#318cdd' : errors.gender ? '#ef4444' : 'var(--border-color)',
                                  color: isSelected ? '#ffffff' : 'var(--text-heading)'
                                }}
                              >
                                <span>{g}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-1.5" style={{ color: 'var(--text-heading)' }}>
                      T-Shirt Size <span className="text-[#d02426]">*</span>
                    </label>
                    <Controller
                      name="tshirtSize"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-0.5">
                          {TSHIRT_SIZES.map((size) => {
                            const isSelected = field.value === size;
                            return (
                              <button
                                type="button"
                                key={size}
                                onClick={() => field.onChange(size)}
                                className={`py-2.5 rounded-xl border text-xs sm:text-sm font-black transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#318cdd] text-white border-[#318cdd] shadow-md shadow-[#318cdd]/30 scale-[1.04]'
                                    : 'hover:bg-[var(--card-inner)] opacity-70 hover:opacity-100'
                                }`}
                                style={{
                                  backgroundColor: isSelected ? '#318cdd' : 'var(--card-inner)',
                                  borderColor: isSelected ? '#318cdd' : errors.tshirtSize ? '#ef4444' : 'var(--border-color)',
                                  color: isSelected ? '#ffffff' : 'var(--text-heading)'
                                }}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.tshirtSize && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.tshirtSize.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 5: Date of Birth & Blood Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-1.5" style={{ color: 'var(--text-heading)' }}>
                      Date of Birth <span className="text-[#d02426]">*</span>
                    </label>
                    <Controller
                      name="dob"
                      control={control}
                      render={({ field }) => (
                        <RadixCalendarPicker
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.dob?.message}
                        />
                      )}
                    />
                    {errors.dob && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.dob.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-1.5" style={{ color: 'var(--text-heading)' }}>
                      Blood Group <span className="text-[#d02426]">*</span>
                    </label>
                    <Controller
                      name="bloodGroup"
                      control={control}
                      render={({ field }) => (
                        <RadixSelect
                          id="reg-blood-group"
                          value={field.value}
                          onValueChange={field.onChange}
                          options={BLOOD_GROUPS}
                          placeholder="Select Blood Group"
                          error={errors.bloodGroup?.message}
                        />
                      )}
                    />
                    {errors.bloodGroup && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.bloodGroup.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 1 Next Action (Wizard Desktop) */}
                {viewMode === 'wizard' && (
                  <div className="hidden lg:flex items-center justify-end pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all shadow-md bg-[#318cdd] hover:bg-[#256eb0] text-white flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Continue to Training Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              )}

              {/* =========================================================================
                 SECTION 2: TRAINING GROUND & ADDRESS (Step 2)
                 ========================================================================= */}
              {(viewMode === 'all-in-one' || currentStep === 2) && (
              <>
              <div
                className="p-4 sm:p-6 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div
                  className="flex items-center gap-2 pb-2.5 border-b"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <MapPin className="w-4 h-4 text-[#318cdd]" />
                  <span
                    className="text-xs sm:text-sm font-black uppercase tracking-wider"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    2. Training Ground &amp; Address
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  <div className="flex flex-col h-full">
                    <label
                      htmlFor="reg-address"
                      className="block text-xs sm:text-sm font-bold mb-1.5"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Residential Address <span className="text-[#d02426]">*</span>
                    </label>
                    <textarea
                      id="reg-address"
                      placeholder="Enter full postal address"
                      {...register('residentialAddress')}
                      className={`w-full flex-1 min-h-[115px] px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 resize-none ${
                        errors.residentialAddress ? 'border-red-500 bg-red-500/5' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: errors.residentialAddress ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    {errors.residentialAddress && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.residentialAddress.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-3 sm:gap-3.5">
                    <div>
                      <label
                        htmlFor="reg-pincode"
                        className="block text-xs sm:text-sm font-bold mb-1.5"
                        style={{ color: 'var(--text-heading)' }}
                      >
                        Pin / Zip Code <span className="text-[#d02426]">*</span>
                      </label>
                      <input
                        id="reg-pincode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="6-digit PIN code (e.g. 560003)"
                        {...register('pinZipCode', {
                          onChange: (e) => {
                            const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                            setValue('pinZipCode', clean);
                          }
                        })}
                        className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border font-mono text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                          errors.pinZipCode ? 'border-red-500 bg-red-500/5' : ''
                        }`}
                        style={{
                          backgroundColor: 'var(--card-inner)',
                          borderColor: errors.pinZipCode ? '#ef4444' : 'var(--border-color)',
                          color: 'var(--text-heading)'
                        }}
                      />
                      {errors.pinZipCode && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.pinZipCode.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold mb-1.5" style={{ color: 'var(--text-heading)' }}>
                        Training Ground Preference <span className="text-[#d02426]">*</span>
                      </label>
                      <Controller
                        name="locationPreference"
                        control={control}
                        render={({ field }) => (
                          <RadixLocationSelect
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.locationPreference?.message}
                          />
                        )}
                      />
                      {errors.locationPreference && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.locationPreference.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                 SECTION 3: RUNNING BACKGROUND & PERSONAL BEST
                 ========================================================================= */}
              <div
                className="p-4 sm:p-6 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div
                  className="flex items-center gap-2 pb-2.5 border-b"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <Trophy className="w-4 h-4 text-[#318cdd]" />
                  <span
                    className="text-xs sm:text-sm font-black uppercase tracking-wider"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    3. Running Background &amp; Personal Best
                  </span>
                </div>

                {/* Maximum Distance Run in last 1 year (Interactive Athletic Chips) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
                    Maximum Distance Run in last 1 year <span className="text-[#d02426]">*</span>
                  </label>
                  <Controller
                    name="maxDistance1Year"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {DISTANCE_OPTIONS.map((dist) => {
                          const isSelected = field.value === dist;
                          const label =
                            dist === 'HM'
                              ? 'Half Marathon (21K)'
                              : dist === 'FM'
                              ? 'Full Marathon (42K)'
                              : dist;
                          return (
                            <button
                              type="button"
                              key={dist}
                              onClick={() => field.onChange(dist)}
                              className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#318cdd] text-white border-[#318cdd] shadow-sm shadow-[#318cdd]/30 scale-105'
                                  : 'hover:bg-[var(--card-inner)] opacity-75 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: isSelected ? '#318cdd' : 'var(--card-inner)',
                                borderColor: isSelected
                                  ? '#318cdd'
                                  : errors.maxDistance1Year
                                  ? '#ef4444'
                                  : 'var(--border-color)',
                                color: isSelected ? '#ffffff' : 'var(--text-heading)'
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.maxDistance1Year && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.maxDistance1Year.message}
                    </p>
                  )}
                </div>

                {/* Personal Best Event & Timing */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5" style={{ color: 'var(--text-heading)' }}>
                    Personal Best Event &amp; Timing <span className="text-[#d02426]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Controller
                        name="pbEvent"
                        control={control}
                        render={({ field }) => (
                          <RadixSelect
                            id="reg-pb-event"
                            value={field.value}
                            onValueChange={(val) => {
                              field.onChange(val);
                              if (val === 'None / First-timer') {
                                setValue('pbTiming', '');
                              }
                            }}
                            options={PB_EVENTS}
                            placeholder="Select PB Event"
                            error={errors.pbEvent?.message}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Controller
                        name="pbTiming"
                        control={control}
                        render={({ field }) => (
                          <PopoverTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            disabled={watchPbEvent === 'None / First-timer'}
                            error={errors.pbTiming?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 Navigation Actions (Wizard Desktop) */}
                {viewMode === 'wizard' && (
                  <div className="hidden lg:flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 cursor-pointer hover:bg-slate-500/10 active:scale-95"
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all shadow-md bg-[#318cdd] hover:bg-[#256eb0] text-white flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Continue to Review &amp; Pay</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              </>
              )}

              {/* =========================================================================
                 SECTION 4: HEALTH, WAIVER & CHECKOUT (Step 3)
                 ========================================================================= */}
              {(viewMode === 'all-in-one' || currentStep === 3) && (
              <div
                className="p-4 sm:p-6 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div
                  className="flex items-center gap-2 pb-2.5 border-b"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <CreditCard className="w-4 h-4 text-[#318cdd]" />
                  <span
                    className="text-xs sm:text-sm font-black uppercase tracking-wider"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    4. Medical Waiver &amp; Checkout
                  </span>
                </div>

                {/* Health Problem */}
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
                    rows={2}
                    placeholder="e.g. Asthma, prior ACL tear, hypertension, cardiac conditions, or write 'None'..."
                    {...register('healthProblem')}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 resize-none"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>

                {/* Promocode Input */}
                <div>
                  <label
                    htmlFor="reg-promo-input"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Promo / Athlete Code
                  </label>
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      id="reg-promo-input"
                      type="text"
                      placeholder="ENTER PROMOCODE"
                      {...register('promocode')}
                      className="flex-1 px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm uppercase font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-sm active:scale-95 bg-[#2d3748] hover:bg-[#1a202c]"
                    >
                      Apply
                    </button>
                  </div>

                  {promoMessage && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 pt-1.5">
                      <CheckCircle2 className="w-4 h-4" /> {promoMessage}
                    </p>
                  )}
                  {promoError && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5 pt-1.5">
                      <AlertCircle className="w-4 h-4" /> {promoError}
                    </p>
                  )}
                </div>

                {/* Live Order Summary Card */}
                <div
                  className="p-4 sm:p-5 rounded-2xl border space-y-2.5 shadow-sm"
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Selected Track:
                    </span>
                    <span className="font-bold" style={{ color: 'var(--text-heading)' }}>
                      {activeProgram?.title || 'Training Program'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Program Base Fee:
                    </span>
                    <span className="font-mono font-bold" style={{ color: 'var(--text-heading)' }}>
                      ₹{baseFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Promo Discount ({watchPromocode?.toUpperCase()}):</span>
                      <span className="font-mono">-₹{promoDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      GST (5%):
                    </span>
                    <span className="font-mono font-bold" style={{ color: 'var(--text-heading)' }}>
                      +₹{gstAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between pt-2.5 border-t text-sm sm:text-base font-black"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-heading)' }}
                  >
                    <span>Total Amount Payable:</span>
                    <span className="font-mono text-[#d02426] text-lg sm:text-xl">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Terms and Conditions Waiver */}
                <div className="pt-1 space-y-2">
                  <p className="text-[11px] sm:text-xs leading-relaxed opacity-75" style={{ color: 'var(--text-secondary)' }}>
                    I declare that I am not suffering from any health condition that hampers physical activity undertaken in this program, and I have clearance from a medical practitioner. I agree that JJs Running &amp; its trainers will not be held responsible for any accidents or health complications while training.
                  </p>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      {...register('acceptedTerms')}
                      className="mt-0.5 w-4 h-4 rounded accent-[#d02426] cursor-pointer flex-shrink-0"
                    />
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        errors.acceptedTerms ? 'text-red-500' : ''
                      }`}
                      style={{
                        color: errors.acceptedTerms ? '#ef4444' : 'var(--text-heading)'
                      }}
                    >
                      I accept the terms &amp; conditions waiver <span className="text-[#d02426]">*</span>
                    </span>
                  </label>
                  {errors.acceptedTerms && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.acceptedTerms.message}
                    </p>
                  )}
                </div>

                {/* JJs Running Brand Red Pay Button (Desktop - Option B Rounded-XL) */}
                <div className="hidden lg:block pt-3">
                  <div className={`flex items-center gap-3 ${viewMode === 'wizard' ? 'justify-between' : 'justify-center'}`}>
                    {viewMode === 'wizard' && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3.5 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 cursor-pointer hover:bg-slate-500/10 active:scale-95"
                        style={{
                          backgroundColor: 'var(--card-inner)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-heading)'
                        }}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`min-w-[260px] px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold tracking-wider uppercase transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/35 hover:scale-[1.01] active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed bg-gradient-to-r from-[#e11d48] via-[#d02426] to-[#b51c1e] text-white border border-red-500/30 ${
                        viewMode === 'wizard' ? 'flex-1 max-w-[360px]' : 'w-full sm:w-auto'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2.5">
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Authorizing Slot...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>CONFIRM &amp; PAY ₹{totalAmount.toLocaleString('en-IN')}</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  <p
                    className="text-[11px] mt-2.5 flex items-center justify-center gap-1.5 opacity-70"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>256–Bit SSL Encrypted • Direct Razorpay Gateway</span>
                  </p>
                </div>
              </div>
              )}
            </form>
          </div>

          {/* Mobile Sticky Bottom Action Bar (Option B Rounded-XL) */}
          <div
            className="lg:hidden p-3 sm:p-3.5 border-t backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 flex-shrink-0 z-30"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block" style={{ color: 'var(--text-secondary)' }}>
                {viewMode === 'wizard' ? `Step 0${currentStep} of 03` : 'Total Payable'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-base sm:text-lg text-[#d02426]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] opacity-70" style={{ color: 'var(--text-secondary)' }}>
                  (incl. 5% GST)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {viewMode === 'wizard' && currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="p-2.5 rounded-xl border text-xs font-bold cursor-pointer"
                  style={{
                    backgroundColor: 'var(--card-inner)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-heading)'
                  }}
                  aria-label="Previous step"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              {viewMode === 'wizard' && currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="py-2.5 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-[#318cdd]/20 flex items-center gap-1.5 cursor-pointer bg-[#318cdd] hover:bg-[#256eb0] text-white active:scale-95"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="reg-form"
                  disabled={loading}
                  className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-75 bg-gradient-to-r from-[#e11d48] via-[#d02426] to-[#b51c1e] text-white active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>CONFIRM &amp; PAY</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    )}
      </div>
    </div>
  );
}
