import React, { useState, useMemo, useEffect } from 'react';
import { Timer, Zap, Gauge, Flame, Award, ChevronRight, ChevronDown, ChevronUp, Activity, Sparkles } from 'lucide-react';

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
      setIsOpen(true);
    }
  }, [forceExpand]);

  // Computations
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const km = selectedDistance.km;

  const calculations = useMemo(() => {
    if (totalSeconds <= 0 || km <= 0) {
      return { paceKmStr: '0:00', paceMileStr: '0:00', speedKmH: '0.0', speedMph: '0.0', splits: [], zones: [] };
    }

    const secPerKm = totalSeconds / km;
    const paceKmMin = Math.floor(secPerKm / 60);
    const paceKmSec = Math.floor(secPerKm % 60);
    const paceKmStr = `${paceKmMin}:${paceKmSec < 10 ? '0' : ''}${paceKmSec}`;

    const secPerMile = secPerKm * 1.60934;
    const paceMileMin = Math.floor(secPerMile / 60);
    const paceMileSec = Math.floor(secPerMile % 60);
    const paceMileStr = `${paceMileMin}:${paceMileSec < 10 ? '0' : ''}${paceMileSec}`;

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

    const zones = [
      {
        name: 'Zone 2 (Aerobic Base / Easy LSD)',
        pace: `${paceKmMin + 1}:${paceKmSec < 10 ? '0' : ''}${paceKmSec} - ${paceKmMin + 1}:${(paceKmSec + 30) % 60 < 10 ? '0' : ''}${(paceKmSec + 30) % 60} /km`,
        description: '70% of weekly volume. Builds mitochondrial density and fat adaptation.',
        color: '#10B981'
      },
      {
        name: 'Zone 3 (Marathon Tempo)',
        pace: `${paceKmMin}:${(paceKmSec + 15) % 60 < 10 ? '0' : ''}${(paceKmSec + 15) % 60} - ${paceKmMin}:${paceKmSec < 10 ? '0' : ''}${paceKmSec} /km`,
        description: 'Steady rhythmic endurance. Trains mental discipline for race day.',
        color: '#F59E0B'
      },
      {
        name: 'Zone 4 (Lactate Threshold / 10K)',
        pace: `${Math.max(2, paceKmMin - 1)}:${(paceKmSec + 35) % 60 < 10 ? '0' : ''}${(paceKmSec + 35) % 60} /km`,
        description: 'Cruise intervals. Pushes lactate clearance speed higher.',
        color: '#EF4444'
      },
      {
        name: 'Zone 5 (VO2 Max Intervals)',
        pace: `${Math.max(2, paceKmMin - 1)}:${paceKmSec < 10 ? '0' : ''}${paceKmSec} /km`,
        description: 'Track repeats (400m - 1000m). Boosts stroke volume & speed reserve.',
        color: '#8B5CF6'
      }
    ];

    return { paceKmStr, paceMileStr, speedKmH, speedMph, splits, zones };
  }, [totalSeconds, km]);

  return (
    <div
      className="rounded-2xl border transition-all duration-200 overflow-hidden text-left"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Sleek, Low-Profile Collapsed Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="py-3 px-4 sm:px-5 cursor-pointer flex items-center justify-between gap-3 select-none hover:opacity-95 transition-all"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--badge-bg)',
              color: 'var(--accent)'
            }}
          >
            <Timer className="w-4 h-4" />
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 truncate">
            <span className="text-xs sm:text-sm font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>
              Race Pace & Splits Calculator
            </span>
            <span className="text-[11px] opacity-60 hidden sm:inline">
              • Quick tool for 5K, 10K, 21K & 42K target times
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1"
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
          className="p-4 sm:p-6 border-t relative z-10 transition-all space-y-5"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--card-inner)'
          }}
        >
          {/* Distance presets strip */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] opacity-60 mr-1.5 font-medium">Distance:</span>
            {DISTANCES.map((dist) => (
              <button
                key={dist.label}
                onClick={() => setSelectedDistance(dist)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedDistance.label === dist.label
                    ? 'shadow-sm scale-102 font-black'
                    : 'opacity-70 hover:opacity-100'
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Input Columns */}
            <div
              className="lg:col-span-5 p-4 rounded-xl border space-y-3"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 block">
                Target Finish Time
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] opacity-60 mb-0.5">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center text-lg font-black rounded-lg p-1.5 border focus:outline-none"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] opacity-60 mb-0.5">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full text-center text-lg font-black rounded-lg p-1.5 border focus:outline-none"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] opacity-60 mb-0.5">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full text-center text-lg font-black rounded-lg p-1.5 border focus:outline-none"
                    style={{
                      backgroundColor: 'var(--card-inner)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-1.5 flex flex-wrap gap-1">
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
                    className="text-[10px] px-2 py-0.5 rounded border transition-all opacity-75 hover:opacity-100"
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

            {/* Compact Output Badges */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div
                className="p-3 rounded-xl border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="text-[10px] opacity-60 font-medium">Pace / km</span>
                <div className="my-1">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--accent)' }}>
                    {calculations.paceKmStr}
                  </span>
                  <span className="text-[10px] opacity-60 ml-0.5">/km</span>
                </div>
                <span className="text-[10px] opacity-60">Target pace</span>
              </div>

              <div
                className="p-3 rounded-xl border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="text-[10px] opacity-60 font-medium">Pace / Mile</span>
                <div className="my-1">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--text-heading)' }}>
                    {calculations.paceMileStr}
                  </span>
                  <span className="text-[10px] opacity-60 ml-0.5">/mi</span>
                </div>
                <span className="text-[10px] opacity-60">Imperial</span>
              </div>

              <div
                className="p-3 rounded-xl border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="text-[10px] opacity-60 font-medium">Speed</span>
                <div className="my-1">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--text-heading)' }}>
                    {calculations.speedKmH}
                  </span>
                  <span className="text-[10px] opacity-60 ml-0.5">km/h</span>
                </div>
                <span className="text-[10px] opacity-60">{calculations.speedMph} mph</span>
              </div>

              <div
                className="p-3 rounded-xl border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="text-[10px] opacity-60 font-medium">Cadence</span>
                <div className="my-1">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--accent)' }}>
                    180
                  </span>
                  <span className="text-[10px] opacity-60 ml-0.5">spm</span>
                </div>
                <span className="text-[10px] opacity-60">Target spm</span>
              </div>
            </div>
          </div>

          {/* Training Zones & Checkpoints */}
          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-2 block flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                Prescribed Heart Rate & Pace Zones
              </span>
              <div className="space-y-1.5">
                {calculations.zones.map((zone) => (
                  <div
                    key={zone.name}
                    className="p-2 rounded-lg border text-xs flex items-center justify-between"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <span className="font-semibold truncate max-w-[200px]" style={{ color: zone.color }}>{zone.name}</span>
                    <span className="font-mono font-bold text-[11px] px-1.5 py-0.2 rounded" style={{ backgroundColor: 'var(--card-inner)' }}>
                      {zone.pace}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-2 block flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" />
                Race Splits for {selectedDistance.name}
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {calculations.splits.map((split) => (
                  <div
                    key={split.distance}
                    className="flex items-center justify-between p-1.5 rounded-lg border text-[11px]"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <span className="opacity-70">{split.distance}</span>
                    <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>{split.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
