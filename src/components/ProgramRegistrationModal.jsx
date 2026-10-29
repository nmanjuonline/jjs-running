import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Select from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
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

const CURRENT_YEAR = new Date().getFullYear();
const REFERENCE_DATE = new Date(2000, 0, 1);

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
    sameAsMobile: z.boolean().default(true),
    emergencyName: z
      .string()
      .min(1, 'Emergency Contact Name is required')
      .min(2, 'Please enter a valid contact name'),
    emergencyNo: z
      .string()
      .min(1, 'Emergency Contact Number is required')
      .regex(/^[0-9]{10}$/, 'Must be a 10-digit emergency number'),
    gender: z.enum(['Male', 'Female']),
    tshirtSize: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
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
// 2. Radix Popover + React Day Picker Calendar Control
// =============================================================================
function RadixCalendarPicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);

  // Parse YYYY-MM-DD
  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, 'yyyy-MM-dd', REFERENCE_DATE);
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

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
          className="z-[9999] rounded-2xl border shadow-2xl p-3 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
            color: 'var(--text-heading)'
          }}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, 'yyyy-MM-dd'));
                setOpen(false);
              }
            }}
            captionLayout="dropdown"
            startMonth={new Date(1940, 0)}
            endMonth={new Date(CURRENT_YEAR - 10, 11)}
            defaultMonth={selectedDate || new Date(1995, 0)}
          />

          <div
            className="flex items-center justify-between pt-2.5 mt-2 border-t text-[11px]"
            style={{ borderColor: 'var(--border-color)' }}
          >
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
                const defaultAdultYear = CURRENT_YEAR - 25;
                onChange(`${defaultAdultYear}-01-15`);
                setOpen(false);
              }}
              className="text-[#318cdd] font-semibold hover:underline cursor-pointer"
            >
              Default (25yo)
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
// 4. Dedicated Masked Race Timing Control (HH : MM : SS)
// =============================================================================
function RaceTimingInput({ value, onChange, disabled = false, error = '' }) {
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
          <span className="text-[9px] uppercase tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
            hrs
          </span>
        </div>

        <span className="font-bold opacity-40 -mt-3">:</span>

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
          <span className="text-[9px] uppercase tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
            min
          </span>
        </div>

        <span className="font-bold opacity-40 -mt-3">:</span>

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
          <span className="text-[9px] uppercase tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
            sec
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 opacity-60" style={{ color: 'var(--text-secondary)' }}>
        <Clock className="w-4 h-4" />
      </div>
    </div>
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
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
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
    if (!activeProgram?.price) return 6300;
    const numeric = parseInt(activeProgram.price.replace(/[^0-9]/g, ''), 10);
    return isNaN(numeric) ? 6300 : numeric;
  }, [activeProgram]);

  const finalFee = Math.max(0, baseFee - promoDiscount);

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

  const handleClose = useCallback(() => {
    setSubmitted(false);
    setPromoDiscount(0);
    setPromoMessage('');
    setPromoError('');
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
        {/* Close Button */}
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
                Congratulations, your slot for{' '}
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

              <div
                className="flex items-center justify-between pt-3 border-t text-sm sm:text-base font-black"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-heading)' }}
              >
                <span>Total Amount Paid:</span>
                <span className="font-mono text-[#d02426]">₹{finalFee.toLocaleString('en-IN')}</span>
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

              {/* Active Program Banner */}
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
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
                        setValue('mobileNo', clean);
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
                      Whatsapp No <span className="text-[#d02426]">*</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] cursor-pointer opacity-80 hover:opacity-100">
                      <input
                        type="checkbox"
                        {...register('sameAsMobile')}
                        className="rounded accent-[#d02426] cursor-pointer"
                      />
                      <span>Same as Mobile</span>
                    </label>
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

              {/* Row 3: Emergency Contact Name & Emergency Contact No */}
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

              {/* Row 4: Gender & T-Shirt Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
                    Gender <span className="text-[#d02426]">*</span>
                  </label>
                  <div className="flex items-center gap-6 pt-1">
                    {['Male', 'Female'].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium">
                        <input
                          type="radio"
                          value={g}
                          {...register('gender')}
                          className="w-4 h-4 accent-[#318cdd] cursor-pointer"
                        />
                        <span style={{ color: 'var(--text-heading)' }}>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
                    T-Shirt Size <span className="text-[#d02426]">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-1">
                    {TSHIRT_SIZES.map((size) => (
                      <label key={size} className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm font-medium">
                        <input
                          type="radio"
                          value={size}
                          {...register('tshirtSize')}
                          className="w-4 h-4 accent-[#318cdd] cursor-pointer"
                        />
                        <span style={{ color: 'var(--text-heading)' }}>{size}</span>
                      </label>
                    ))}
                  </div>
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

              {/* Row 6: Residential Address & Pin Code + Location Preference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-address"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Residential Address <span className="text-[#d02426]">*</span>
                  </label>
                  <textarea
                    id="reg-address"
                    rows={4}
                    placeholder="Enter full postal address"
                    {...register('residentialAddress')}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 resize-none ${
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

                <div className="space-y-4">
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
                      Location Preference <span className="text-[#d02426]">*</span>
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

              {/* Maximum Distance Run in last 1 year */}
              <div className="pt-2">
                <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
                  Maximum Distance Run in last 1 year <span className="text-[#d02426]">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                  {DISTANCE_OPTIONS.map((dist) => (
                    <label key={dist} className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm font-medium">
                      <input
                        type="radio"
                        value={dist}
                        {...register('maxDistance1Year')}
                        className="w-4 h-4 accent-[#318cdd] cursor-pointer"
                      />
                      <span style={{ color: 'var(--text-heading)' }}>{dist}</span>
                    </label>
                  ))}
                </div>
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
                        <RaceTimingInput
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
                  rows={3}
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

              {/* Promocode Section */}
              <div className="pt-2 space-y-2">
                <label
                  htmlFor="reg-promo-input"
                  className="block text-xs sm:text-sm font-bold"
                  style={{ color: 'var(--text-heading)' }}
                >
                  If you have Promocode, Enter your Promocode
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
                  <input
                    id="reg-promo-input"
                    type="text"
                    placeholder="Enter your Promocode"
                    {...register('promocode')}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm uppercase font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-sm active:scale-95 bg-[#2d3748] hover:bg-[#1a202c]"
                  >
                    Apply
                  </button>
                </div>

                {promoMessage && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-4 h-4" /> {promoMessage}
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-4 h-4" /> {promoError}
                  </p>
                )}

                <div className="bg-[#24639c] text-white text-[11px] sm:text-xs font-medium px-4 py-2.5 rounded-lg inline-block w-full sm:w-auto shadow-xs">
                  If you don't have promocode, please proceed the Payment.
                </div>
              </div>

              {/* Terms and Conditions Waiver */}
              <div className="pt-2 space-y-2">
                <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  I declare that, I am not suffering from any health condition that will hamper physical activity that I'm undertaking as part of this training program, and I have clearance from medical practitioner for participating in the said activity. I agree that JJActive Pvt. Ltd. &amp; it's trainers will not be held responsible for any accidents/injuries or complications related to my health while training with JJActive Pvt. Ltd.
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
                    I Accept(Please Select the Checkbox) <span className="text-[#d02426]">*</span>
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.acceptedTerms.message}
                  </p>
                )}
              </div>

              {/* JJs Running Brand Red Pay Button */}
              <div className="pt-4 pb-2 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto min-w-[240px] px-10 py-4 rounded-full text-base sm:text-lg font-black tracking-wider uppercase transition-all duration-300 shadow-xl shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed bg-gradient-to-r from-[#e11d48] via-[#d02426] to-[#b51c1e] text-white border border-red-500/30"
                >
                  <div className="flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Roster Slot...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>PAY ₹{finalFee.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </div>
                </button>

                <p
                  className="text-[11px] mt-2 flex items-center justify-center gap-1.5 opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256–Bit SSL Encrypted • Direct Razorpay Gateway</span>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
