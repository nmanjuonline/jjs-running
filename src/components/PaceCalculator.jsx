import React, { useState, useMemo, useEffect } from 'react';
import { Timer, Flame, Award, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const DISTANCES = [
  { label: '5K', km: 5.0, name: '5 Kilometers' },
  { label: '10K', km: 10.0, name: '10 Kilometers' },
  { label: 'Half Marathon (21.1K)', km: 21.0975, name: 'Half Marathon' },
  { label: 'Full Marathon (42.2K)', km: 42.195, name: 'Full Marathon' },
  { label: 'Malnad Ultra (50K)', km: 50.0, name: '50K Ultra' }
];

export default function PaceCalculator({ onSelectProgram, defaultExpanded = false, forceExpand = false }) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [selectedDistance, setSelectedDistance] = useState(DISTANCES[2]); // Half Marathon
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(55);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (forceExpand) {
      const timer = setTimeout(() => setIsOpen(true), 10);
      return () => clearTimeout(timer);
    }
  }, [forceExpand]);

  // Total seconds & calculations
  const totalSeconds = (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60 + (Number(seconds) || 0);
  const km = selectedDistance.km;

  const calculations = useMemo(() => {
    const formatPace = (sec) => {
      const validSec = Math.max(0, sec);
      const m = Math.floor(validSec / 60);
      const s = Math.round(validSec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (totalSeconds <= 0 || km <= 0) {
      return { paceKmStr: '0:00', paceMileStr: '0:00', speedKmH: '0.00', speedMph: '0.00', splits: [], zones: [] };
    }

    const secPerKm = totalSeconds / km;
    const paceKmStr = formatPace(secPerKm);

    const secPerMile = secPerKm * 1.60934;
    const paceMileStr = formatPace(secPerMile);

    const speedKmH = (km / (totalSeconds / 3600)).toFixed(2);
    const speedMph = (km / 1.60934 / (totalSeconds / 3600)).toFixed(2);

    // Splits checkpoints
    const splitPoints = [5, 10, 15, 20, 21.0975, 30, 35, 40, 42.195].filter(p => p <= km);
    if (!splitPoints.includes(km)) splitPoints.push(km);

    const splits = splitPoints.map(point => {
      const splitSec = point * secPerKm;
      const h = Math.floor(splitSec / 3600);
      const m = Math.floor((splitSec % 3600) / 60);
      const s = Math.floor(splitSec % 60);
      const timeStr = `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
      return { distance: `${point} km`, time: timeStr };
    });

    // Mathematically sound pace zones
    const zones = [
      {
        name: 'Zone 2 (Aerobic Base / Easy SLR)',
        pace: `${formatPace(secPerKm + 50)} - ${formatPace(secPerKm + 85)} /km`,
        description: '70% of weekly volume. Builds mitochondrial density and fat adaptation without injury.',
        color: '#10B981'
      },
      {
        name: 'Zone 3 (Marathon Tempo)',
        pace: `${formatPace(secPerKm - 5)} - ${formatPace(secPerKm + 15)} /km`,
        description: 'Steady rhythmic endurance. Trains mental discipline and glycogen pacing for race day.',
        color: '#F59E0B'
      },
      {
        name: 'Zone 4 (Lactate Threshold / 10K)',
        pace: `${formatPace(Math.max(120, secPerKm - 25))} - ${formatPace(Math.max(120, secPerKm - 15))} /km`,
        description: 'Cruise intervals. Pushes lactate clearance speed higher and raises functional threshold.',
        color: '#EF4444'
      },
      {
        name: 'Zone 5 (VO2 Max Intervals)',
        pace: `${formatPace(Math.max(100, secPerKm - 50))} - ${formatPace(Math.max(100, secPerKm - 35))} /km`,
        description: 'Track repeats (400m - 1000m). Boosts stroke volume & speed reserve for the final kick.',
        color: '#8B5CF6'
      }
    ];

    return { paceKmStr, paceMileStr, speedKmH, speedMph, splits, zones };
  }, [totalSeconds, km]);

  const handleSelectProgramCTA = () => {
    if (onSelectProgram) {
      onSelectProgram(selectedDistance.name);
    }
  };

  return (
    <div
      className="rounded-2xl border transition-all duration-200 overflow-hidden text-left shadow-sm"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Sleek, Low-Profile Collapsed Bar with Keyboard Support */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls="calculator-panel"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="py-3 px-4 sm:px-5 cursor-pointer flex items-center justify-between gap-3 select-none hover:opacity-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#318cdd]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--badge-bg)',
              color: 'var(--accent)'
            }}
          >
            <Timer className="w-4 h-4" />
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 truncate">
            <span className="text-xs sm:text-sm font-black uppercase tracking-tight" style={{ color: 'var(--text-heading)' }}>
              Race Pace &amp; Splits Calculator
            </span>
            <span className="text-[11px] opacity-60 hidden sm:inline">
              • Quick tool for 5K, 10K, 21K &amp; 42K target times
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer"
            style={{
              backgroundColor: isOpen ? 'var(--card-inner)' : 'transparent',
              borderColor: 'var(--border-color)',
              color: 'var(--text-heading)'
            }}
          >
            <span>{isOpen ? 'Close' : 'Calculate Pace'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </div>
      </div>

      {/* Expandable Calculator Body */}
      {isOpen && (
        <div
          id="calculator-panel"
          className="p-4 sm:p-6 border-t relative z-10 transition-all space-y-5"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--card-inner)'
          }}
        >
          {/* Distance presets strip */}
          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Target race distance">
            <span className="text-xs font-bold opacity-75 mr-1">Distance:</span>
            {DISTANCES.map((dist) => (
              <button
                key={dist.label}
                role="radio"
                aria-checked={selectedDistance.label === dist.label}
                onClick={() => setSelectedDistance(dist)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedDistance.label === dist.label
                    ? 'shadow-sm scale-102 font-black'
                    : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: selectedDistance.label === dist.label ? 'var(--accent)' : 'var(--card-bg)',
                  color: selectedDistance.label === dist.label ? 'var(--accent-contrast)' : 'var(--text-heading)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {dist.label}
              </button>
            ))}
          </div>

          {/* Inputs & Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Input Columns */}
            <div
              className="lg:col-span-5 p-4 rounded-2xl border space-y-3 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2" style={{ color: 'var(--text-heading)' }}>
                  Target Finish Time
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="pace-hours" className="block text-[10px] font-semibold opacity-70 mb-0.5">Hours</label>
                    <input
                      id="pace-hours"
                      type="number"
                      min="0"
                      max="24"
                      value={hours}
                      onChange={(e) => setHours(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-center text-lg font-black rounded-xl p-2 border focus:outline-none tabular-num"
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="pace-minutes" className="block text-[10px] font-semibold opacity-70 mb-0.5">Minutes</label>
                    <input
                      id="pace-minutes"
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value === '' ? '' : Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full text-center text-lg font-black rounded-xl p-2 border focus:outline-none tabular-num"
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="pace-seconds" className="block text-[10px] font-semibold opacity-70 mb-0.5">Seconds</label>
                    <input
                      id="pace-seconds"
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value === '' ? '' : Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full text-center text-lg font-black rounded-xl p-2 border focus:outline-none tabular-num"
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                  Popular Goal Benchmarks:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Sub-2h 21K', h: 1, m: 59, s: 0, d: DISTANCES[2] },
                    { label: 'Sub-1:45 21K', h: 1, m: 44, s: 30, d: DISTANCES[2] },
                    { label: 'Sub-50m 10K', h: 0, m: 49, s: 30, d: DISTANCES[1] },
                    { label: 'Sub-4h 42K', h: 3, m: 59, s: 0, d: DISTANCES[3] },
                    { label: 'BQ Sub-3:30', h: 3, m: 28, s: 0, d: DISTANCES[3] },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setSelectedDistance(preset.d);
                        setHours(preset.h);
                        setMinutes(preset.m);
                        setSeconds(preset.s);
                      }}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer opacity-85 hover:opacity-100 hover:scale-102"
                      style={{
                        backgroundColor: 'var(--card-inner)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-heading)'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Compact Output Badges */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div
                className="p-3.5 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="text-[11px] opacity-70 font-semibold">Pace / km</span>
                <div className="my-1.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono tabular-num tracking-tight" style={{ color: 'var(--accent)' }}>
                    {calculations.paceKmStr}
                  </span>
                  <span className="text-xs opacity-60 ml-0.5">/km</span>
                </div>
                <span className="text-[10px] opacity-60">Target pace</span>
              </div>

              <div
                className="p-3.5 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="text-[11px] opacity-70 font-semibold">Pace / Mile</span>
                <div className="my-1.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono tabular-num tracking-tight" style={{ color: 'var(--text-heading)' }}>
                    {calculations.paceMileStr}
                  </span>
                  <span className="text-xs opacity-60 ml-0.5">/mi</span>
                </div>
                <span className="text-[10px] opacity-60">Imperial pace</span>
              </div>

              <div
                className="p-3.5 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="text-[11px] opacity-70 font-semibold">Speed</span>
                <div className="my-1.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono tabular-num tracking-tight" style={{ color: 'var(--text-heading)' }}>
                    {calculations.speedKmH}
                  </span>
                  <span className="text-xs opacity-60 ml-0.5">km/h</span>
                </div>
                <span className="text-[10px] opacity-60 tabular-num">{calculations.speedMph} mph</span>
              </div>

              <div
                className="p-3.5 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="text-[11px] opacity-70 font-semibold">Cadence</span>
                <div className="my-1.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono tabular-num tracking-tight text-emerald-500">
                    180
                  </span>
                  <span className="text-xs opacity-60 ml-0.5">spm</span>
                </div>
                <span className="text-[10px] opacity-60">Optimal cadence</span>
              </div>
            </div>
          </div>

          {/* Training Zones & Checkpoints */}
          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-75 mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-heading)' }}>
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Prescribed Heart Rate &amp; Pace Zones
              </span>
              <div className="space-y-2">
                {calculations.zones.map((zone) => (
                  <div
                    key={zone.name}
                    className="p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <span className="font-bold truncate max-w-[200px]" style={{ color: zone.color }}>{zone.name}</span>
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded tabular-num flex-shrink-0" style={{ backgroundColor: 'var(--card-inner)' }}>
                      {zone.pace}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-75 mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-heading)' }}>
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Race Splits for {selectedDistance.name}
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {calculations.splits.map((split) => (
                    <div
                      key={split.distance}
                      className="flex items-center justify-between p-2 rounded-xl border text-xs"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <span className="opacity-75 font-medium">{split.distance}</span>
                      <span className="font-mono font-bold tabular-num" style={{ color: 'var(--accent)' }}>{split.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion CTA to Program */}
              <div className="pt-3 mt-3 border-t flex items-center justify-between gap-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-xs opacity-75 font-medium">Ready to hit this time?</span>
                <button
                  onClick={handleSelectProgramCTA}
                  className="py-2 px-4 rounded-xl text-xs font-black tracking-wider transition-all duration-200 shadow-md hover:scale-105 flex items-center gap-1.5 text-white bg-[#d02426] hover:bg-[#b51c1e] cursor-pointer"
                >
                  <span>Train with JJs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}