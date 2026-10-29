import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ChevronDown,
  Check,
  Search,
  Calendar,
  Lock,
  MapPin
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

const MONTHS = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' }
];

const DAYS = Array.from({ length: 31 }, (_, i) => {
  const d = i + 1;
  return d < 10 ? `0${d}` : `${d}`;
});

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 75 }, (_, i) => `${CURRENT_YEAR - 12 - i}`);

// =============================================================================
// Sleek Custom Dropdown (No Native OS White Box Clashes in Dark Mode)
// =============================================================================
function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error = false,
  icon: Icon = null,
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

  const selectedOption = options.find((opt) =>
    typeof opt === 'string' ? opt === value : opt.value === value
  );

  const displayLabel = selectedOption
    ? typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption.label
    : placeholder;

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
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-4 h-4 opacity-60 flex-shrink-0" />}
          <span className="truncate">{displayLabel}</span>
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
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border shadow-2xl py-1.5 max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.45)'
          }}
        >
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            const subtitle = typeof opt === 'object' ? opt.subtitle : null;
            const isSelected = val === value;

            return (
              <button
                type="button"
                key={val}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#318cdd]/15 text-[#318cdd] font-bold'
                    : 'hover:bg-slate-500/10'
                }`}
                style={{
                  color: isSelected ? 'var(--accent)' : 'var(--text-heading)'
                }}
              >
                <div className="truncate">
                  <div>{label}</div>
                  {subtitle && (
                    <div
                      className="text-[11px] font-normal truncate opacity-70"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {subtitle}
                    </div>
                  )}
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
// Location Dropdown Grouped by City from centersData with Search
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

  // Filter centers
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

  // Group by City
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
          {/* Quick Search inside Location dropdown */}
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
                        isSelected
                          ? 'bg-[#318cdd]/15 text-[#318cdd] font-bold'
                          : 'hover:bg-slate-500/10'
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
// Elegant Date of Birth Selector (Day / Month / Year Dropdowns)
// Never triggers the ugly native OS popup
// =============================================================================
function DateOfBirthPicker({ value, onChange, error = false }) {
  // Parse incoming YYYY-MM-DD
  const parts = (value || '').split('-');
  const initialYear = parts[0] || '1995';
  const initialMonth = parts[1] || '01';
  const initialDay = parts[2] || '15';

  const [day, setDay] = useState(initialDay);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    if (day && month && year) {
      onChange(`${year}-${month}-${day}`);
    }
  }, [day, month, year, onChange]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {/* Day Select */}
        <div>
          <CustomDropdown
            value={day}
            onChange={setDay}
            options={DAYS.map((d) => ({ value: d, label: d }))}
            placeholder="Day"
            error={error}
          />
        </div>

        {/* Month Select */}
        <div>
          <CustomDropdown
            value={month}
            onChange={setMonth}
            options={MONTHS}
            placeholder="Month"
            error={error}
          />
        </div>

        {/* Year Select */}
        <div>
          <CustomDropdown
            value={year}
            onChange={setYear}
            options={YEARS.map((y) => ({ value: y, label: y }))}
            placeholder="Year"
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Official Program Registration Modal
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

  const [activeProgram, setActiveProgram] = useState(null);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [errors, setErrors] = useState({});

  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  // Synchronize incoming selected program
  useEffect(() => {
    if (selectedProgram) {
      let matched = null;
      if (typeof selectedProgram === 'string') {
        matched = programsData.find(
          (p) => p.id === selectedProgram || p.title === selectedProgram
        );
      } else if (selectedProgram.id) {
        matched =
          programsData.find((p) => p.id === selectedProgram.id) || selectedProgram;
      } else if (selectedProgram.title) {
        matched =
          programsData.find((p) => p.title === selectedProgram.title) || selectedProgram;
      }
      setActiveProgram(matched || programsData[2]); // Default to 21K Half Marathon
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          selectedProgramId: matched.id || matched.title
        }));
      }
    } else {
      setActiveProgram(programsData[2]); // Default to 21K Half Marathon
      setFormData((prev) => ({ ...prev, selectedProgramId: programsData[2].id }));
    }
  }, [selectedProgram]);

  const handleClose = React.useCallback(() => {
    setSubmitted(false);
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoMessage('');
    setPromoError('');
    setErrors({});
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

  if (!isOpen) return null;

  // Pricing calculations
  const parseBasePrice = (priceStr) => {
    if (!priceStr) return 6000;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 6000 : num;
  };

  const baseFee = activeProgram ? parseBasePrice(activeProgram.price) : 6000;
  const discountAmount = promoApplied ? promoDiscount : 0;
  const taxableAmount = Math.max(0, baseFee - discountAmount);
  const gstAmount = Math.round(taxableAmount * 0.05); // 5% GST
  const totalAmount = taxableAmount + gstAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoMessage('');
    const code = (formData.promocode || '').trim().toUpperCase();

    if (!code) {
      setPromoError('Please enter a valid promocode');
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

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errs.email = 'Valid Email is required';
    if (!formData.mobileNo.trim() || formData.mobileNo.replace(/[^0-9]/g, '').length < 10) {
      errs.mobileNo = 'Valid 10-digit mobile number is required';
    }
    const whatsApp = formData.sameAsMobile ? formData.mobileNo : formData.whatsappNo;
    if (!whatsApp.trim() || whatsApp.replace(/[^0-9]/g, '').length < 10) {
      errs.whatsappNo = 'Valid WhatsApp number is required';
    }
    if (!formData.emergencyName.trim()) errs.emergencyName = 'Emergency contact name is required';
    if (!formData.emergencyNo.trim() || formData.emergencyNo.replace(/[^0-9]/g, '').length < 10) {
      errs.emergencyNo = 'Emergency contact number is required';
    }
    if (!formData.dob) errs.dob = 'Date of birth is required';
    if (!formData.bloodGroup || formData.bloodGroup === 'Select Blood Group') {
      errs.bloodGroup = 'Please select your blood group';
    }
    if (!formData.residentialAddress.trim()) errs.residentialAddress = 'Residential address is required';
    if (!formData.pinZipCode.trim()) errs.pinZipCode = 'PIN / Zip Code is required';
    if (!formData.locationPreference) errs.locationPreference = 'Please select a preferred training center';
    if (!formData.acceptedTerms) errs.acceptedTerms = 'You must accept the medical & liability declaration to register';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      if (dialogRef.current) {
        dialogRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegistrationId(`JJS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    }, 1200);
  };

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
        {/* Close Button (Accessible 44x44px Touch Target) */}
        <button
          onClick={handleClose}
          aria-label="Close registration form"
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
                ! Your roster slot for{' '}
                <span className="font-bold text-[#d02426]">
                  {activeProgram?.title || 'Training Program'}
                </span>{' '}
                is secured.
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
              Your Training Center Head (TCH) will add you to the neighborhood batch WhatsApp group
              for morning warmup drills, hydration pacing, and track schedule.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer bg-[#d02426] text-white hover:bg-[#b51c1e]"
              >
                Back to Dashboard
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
              {/* Short warm accent underline matching brand layout */}
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
                    Program:
                  </span>
                  <span className="font-bold text-[#318cdd]">{activeProgram.title}</span>
                  <span className="opacity-40">•</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {activeProgram.price}
                  </span>
                  {activeProgram.tax && (
                    <span className="text-[10px] opacity-70">({activeProgram.tax})</span>
                  )}

                  {/* Switch to Free Trial if not ready */}
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

            {/* Error Banner */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Please complete all required fields highlighted in red below before proceeding to
                  payment.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>
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
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      errors.email ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: errors.email ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* 3. Mobile No */}
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
                    inputMode="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.mobileNo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        mobileNo: val,
                        whatsappNo: prev.sameAsMobile ? val : prev.whatsappNo
                      }));
                    }}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      errors.mobileNo ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: errors.mobileNo ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {errors.mobileNo && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.mobileNo}</p>
                  )}
                </div>

                {/* 4. Whatsapp No */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="reg-whatsapp"
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
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            sameAsMobile: checked,
                            whatsappNo: checked ? prev.mobileNo : prev.whatsappNo
                          }));
                        }}
                        className="rounded accent-[#d02426]"
                      />
                      <span>Same as Mobile</span>
                    </label>
                  </div>
                  <input
                    id="reg-whatsapp"
                    type="tel"
                    inputMode="tel"
                    required
                    placeholder="WhatsApp number"
                    disabled={formData.sameAsMobile}
                    value={formData.sameAsMobile ? formData.mobileNo : formData.whatsappNo}
                    onChange={(e) => setFormData({ ...formData, whatsappNo: e.target.value })}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      errors.whatsappNo ? 'border-red-500 bg-red-500/5' : ''
                    } ${formData.sameAsMobile ? 'opacity-80' : ''}`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: errors.whatsappNo ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {errors.whatsappNo && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.whatsappNo}</p>
                  )}
                </div>

                {/* 5. Emergency Contact Name */}
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
                    required
                    placeholder="Contact person name"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
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
                    <p className="text-[11px] text-red-500 mt-1">{errors.emergencyName}</p>
                  )}
                </div>

                {/* 6. Emergency Contact No */}
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
                    inputMode="tel"
                    required
                    placeholder="Emergency phone number"
                    value={formData.emergencyNo}
                    onChange={(e) => setFormData({ ...formData, emergencyNo: e.target.value })}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      errors.emergencyNo ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: errors.emergencyNo ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {errors.emergencyNo && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.emergencyNo}</p>
                  )}
                </div>

                {/* 7. Gender (Segmented / Radio Options) */}
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
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                          className="w-4 h-4 accent-[#318cdd] cursor-pointer"
                        />
                        <span style={{ color: 'var(--text-heading)' }}>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 9. Date of Birth (Elegant 3-part selector: Day, Month, Year - No Browser Popup!) */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Date of Birth <span className="text-[#d02426]">*</span>
                  </label>
                  <DateOfBirthPicker
                    value={formData.dob}
                    onChange={(newDob) => setFormData((prev) => ({ ...prev, dob: newDob }))}
                    error={Boolean(errors.dob)}
                  />
                  {errors.dob && <p className="text-[11px] text-red-500 mt-1">{errors.dob}</p>}
                </div>

                {/* 10. Blood Group (Custom Styled Dropdown) */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Blood Group <span className="text-[#d02426]">*</span>
                  </label>
                  <CustomDropdown
                    id="reg-bloodgroup"
                    value={formData.bloodGroup}
                    onChange={(bg) => setFormData((prev) => ({ ...prev, bloodGroup: bg }))}
                    options={BLOOD_GROUPS}
                    placeholder="Select Blood Group"
                    error={Boolean(errors.bloodGroup)}
                  />
                  {errors.bloodGroup && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.bloodGroup}</p>
                  )}
                </div>

                {/* 11. Residential Address (Multiline Textarea) */}
                <div className="md:row-span-2">
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
                    required
                    placeholder="House/Flat No, Street, Locality..."
                    value={formData.residentialAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, residentialAddress: e.target.value })
                    }
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
                    <p className="text-[11px] text-red-500 mt-1">{errors.residentialAddress}</p>
                  )}
                </div>

                {/* 12. Pin / Zip Code */}
                <div>
                  <label
                    htmlFor="reg-pin"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Pin / Zip Code <span className="text-[#d02426]">*</span>
                  </label>
                  <input
                    id="reg-pin"
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="e.g. 560003"
                    value={formData.pinZipCode}
                    onChange={(e) => setFormData({ ...formData, pinZipCode: e.target.value })}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40 ${
                      errors.pinZipCode ? 'border-red-500 bg-red-500/5' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: errors.pinZipCode ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                  {errors.pinZipCode && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.pinZipCode}</p>
                  )}
                </div>

                {/* 13. Location Preference (Synchronized from centersData with Ground/City Search) */}
                <div>
                  <label
                    htmlFor="reg-location-pref"
                    className="block text-xs sm:text-sm font-bold mb-1.5"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Location Preference (20+ Training Centers){' '}
                    <span className="text-[#d02426]">*</span>
                  </label>
                  <LocationDropdown
                    value={formData.locationPreference}
                    onChange={(loc) => setFormData((prev) => ({ ...prev, locationPreference: loc }))}
                    error={Boolean(errors.locationPreference)}
                  />
                  {errors.locationPreference && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.locationPreference}</p>
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
                        onChange={(e) =>
                          setFormData({ ...formData, maxDistance1Year: e.target.value })
                        }
                        className="w-4 h-4 accent-[#318cdd] cursor-pointer"
                      />
                      <span style={{ color: 'var(--text-heading)' }}>{dist}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 15. Personal Best Event & Timing (Event select + Timing Input with icon) */}
              <div>
                <label
                  className="block text-xs sm:text-sm font-bold mb-2"
                  style={{ color: 'var(--text-heading)' }}
                >
                  Personal Best Event &amp; Timing <span className="text-[#d02426]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <CustomDropdown
                    value={formData.pbEvent}
                    onChange={(ev) => setFormData((prev) => ({ ...prev, pbEvent: ev }))}
                    options={PB_EVENTS}
                    placeholder="Select PB Event"
                  />

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="HH:MM:SS (e.g. 01:39:44)"
                      value={formData.pbTiming}
                      onChange={(e) => setFormData({ ...formData, pbTiming: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 pr-10 rounded-xl border font-mono text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#318cdd]/40"
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
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
                  onChange={(e) => setFormData({ ...formData, healthProblem: e.target.value })}
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

                {/* Banner from screenshot: "If you don't have promocode, please proceed the Payment." */}
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
                    onChange={(e) => {
                      setFormData({ ...formData, acceptedTerms: e.target.checked });
                      if (errors.acceptedTerms) {
                        setErrors((prev) => ({ ...prev, acceptedTerms: undefined }));
                      }
                    }}
                    className="mt-0.5 w-4 h-4 rounded accent-[#d02426] cursor-pointer flex-shrink-0"
                  />
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      errors.acceptedTerms ? 'text-red-500' : ''
                    }`}
                    style={{ color: errors.acceptedTerms ? '#ef4444' : 'var(--text-heading)' }}
                  >
                    I Accept(Please Select the Checkbox) <span className="text-[#d02426]">*</span>
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <p className="text-[11px] text-red-500">{errors.acceptedTerms}</p>
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
