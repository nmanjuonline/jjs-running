import React, { useState, useMemo } from 'react';
import { MapPin, Clock, UserCheck, Search, ShieldCheck, ChevronRight, ChevronDown, Navigation, Award, Zap, Flame, Sun, Activity, Compass, Radio } from 'lucide-react';
import { centersData } from '../data/centersData';

const CITIES = ['All Cities', 'Bengaluru', 'Pune', 'Kolkata', 'Remote'];

export default function CentersExplorer({ onBookTrial, currentTheme = 'olympic-clean' }) {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenterId, setSelectedCenterId] = useState(centersData[0].id);

  const filteredCenters = useMemo(() => {
    return centersData.filter((center) => {
      const matchesCity = selectedCity === 'All Cities' || center.city === selectedCity;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        center.name.toLowerCase().includes(q) ||
        center.venue.toLowerCase().includes(q) ||
        center.city.toLowerCase().includes(q) ||
        (center.vicinity && center.vicinity.toLowerCase().includes(q)) ||
        (center.tch && center.tch.toLowerCase().includes(q));
      return matchesCity && matchesSearch;
    });
  }, [selectedCity, searchQuery]);

  const currentCenter = useMemo(() => {
    const found = filteredCenters.find(c => c.id === selectedCenterId);
    return found || filteredCenters[0] || centersData[0];
  }, [filteredCenters, selectedCenterId]);

  const mapUrl = currentCenter ? (currentCenter.mapUrl || currentCenter.mapLink) : '';

  // =========================================================================
  // 1. SWISS CLEAN (Light Logo Match & Dark Logo Contrast)
  // =========================================================================
  if (currentTheme === 'olympic-clean' || currentTheme === 'street-crew' || currentTheme === 'swiss-light' || currentTheme === 'swiss-dark') {
    const isDark = currentTheme === 'swiss-dark';

    return (
      <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
        isDark
          ? 'border-slate-800 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] bg-slate-900'
          : 'border-slate-200 shadow-[0_15px_35px_-10px_rgba(0,50,150,0.08)] bg-white'
      }`}>
        {/* Top Minimalist Filter Bar */}
        <div className={`px-4 py-3 sm:px-5 sm:py-3.5 border-b flex flex-col md:flex-row items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50/70'
        }`}>
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {CITIES.map((city) => {
              const count = city === 'All Cities'
                ? centersData.length
                : centersData.filter(c => c.city === city).length;
              const isActive = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    const firstInCity = centersData.find(c => city === 'All Cities' || c.city === city);
                    if (firstInCity) setSelectedCenterId(firstInCity.id);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#318cdd] text-white shadow-md shadow-[#318cdd]/25'
                      : isDark
                        ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{city}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-400 bg-slate-100'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search neighborhood or TCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#318cdd]/30 ${
                isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500'
                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>
        </div>

        {/* Master Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:h-[530px]">
          {/* Left Column: Center List with Distinct Directory Styling */}
          <div className={`lg:col-span-5 border-b-2 lg:border-b-0 lg:border-r flex flex-col h-full ${
            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/50'
          }`}>
            {/* Scrollable Directory Header */}
            <div className={`px-4 py-2.5 border-b flex-shrink-0 flex items-center justify-between text-[11px] font-mono tracking-wider ${
              isDark ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-slate-200 bg-slate-100/80 text-slate-500'
            }`}>
              <span className="font-bold uppercase tracking-wider">Training Centers ({filteredCenters.length})</span>
              <span className="hidden lg:inline text-[10px] text-slate-400 font-mono">
                SELECT A GROUND
              </span>
              <span className="lg:hidden flex items-center gap-1 text-[10px] text-[#318cdd] font-bold">
                <span>Scroll list</span>
                <ChevronDown className="w-3 h-3 animate-bounce" />
              </span>
            </div>

            <div className={`max-h-56 sm:max-h-64 lg:max-h-none flex-1 min-h-0 overflow-y-auto divide-y ${
              isDark ? 'divide-slate-800/70' : 'divide-slate-200/80'
            }`}>
              {filteredCenters.map((center) => {
                const isSelected = currentCenter && currentCenter.id === center.id;
                return (
                  <div
                    key={center.id}
                    onClick={() => setSelectedCenterId(center.id)}
                    className={`p-3.5 sm:px-4 sm:py-3 cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                      isSelected
                        ? isDark
                          ? 'bg-gradient-to-r from-[#318cdd]/20 via-[#318cdd]/10 to-transparent border-l-4 border-[#318cdd]'
                          : 'bg-gradient-to-r from-[#318cdd]/10 via-[#318cdd]/5 to-transparent border-l-4 border-[#318cdd]'
                        : isDark
                          ? 'border-l-4 border-transparent hover:bg-slate-800/50 text-slate-300'
                          : 'border-l-4 border-transparent hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-black truncate ${
                          isSelected
                            ? isDark ? 'text-white' : 'text-slate-950 font-black'
                            : isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {center.name}
                        </h4>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          isSelected
                            ? isDark ? 'bg-[#318cdd]/30 text-[#60a5fa]' : 'bg-[#318cdd]/20 text-[#1d72bd]'
                            : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200/80 text-slate-600'
                        }`}>
                          {center.city}
                        </span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${
                        isSelected
                          ? isDark ? 'text-slate-300' : 'text-slate-600'
                          : isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {center.venue}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        TCH: <strong className="text-[#d02426]">{center.tch}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-[#318cdd]' : 'text-slate-400'}`}>
                        5:30 AM
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#318cdd] translate-x-0.5' : 'text-slate-400/60'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Distinct Ground Details Spotlight */}
          <div className={`lg:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-between h-full relative overflow-y-auto ${
            isDark ? 'bg-slate-900' : 'bg-white'
          }`}>
            {/* Mobile Distinct Section Banner */}
            <div className={`flex items-center justify-between pb-2 mb-2 border-b lg:hidden ${
              isDark ? 'border-slate-800/90 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#318cdd] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#318cdd] animate-pulse" />
                Selected Ground Details
              </span>
              <span className="text-[10px] font-mono">Tap list above to change</span>
            </div>

            {currentCenter && (
              <div className="flex flex-col justify-between h-full space-y-3.5">
                {/* Header */}
                <div className="pb-3 border-b flex flex-wrap items-center justify-between gap-3 flex-shrink-0"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isDark
                          ? 'bg-[#318cdd]/15 text-[#4ca6f5] border border-[#318cdd]/30'
                          : 'bg-[#318cdd]/10 text-[#1d72bd] border border-[#318cdd]/20'
                      }`}>
                        <MapPin className="w-3 h-3" />
                        {currentCenter.id === 'bengaluru-jayanagar'
                          ? `${currentCenter.city} • Academy HQ`
                          : currentCenter.city === 'Remote'
                          ? 'Global • Virtual Campus'
                          : `${currentCenter.city} Chapter`}
                      </span>
                    </div>
                    <h3 className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {currentCenter.name}
                    </h3>
                  </div>

                  <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 flex-shrink-0 ${
                    isDark ? 'bg-slate-950/80 border-slate-800 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold">{currentCenter.runnersCount}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 py-1">
                  <div className={`p-3 lg:p-3.5 rounded-2xl border transition-all ${
                    isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-200/80 bg-slate-50/70'
                  }`}>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Compass className="w-3.5 h-3.5 text-[#318cdd]" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Training Ground</span>
                    </div>
                    <p className={`text-xs sm:text-sm font-bold leading-snug ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {currentCenter.venue}
                    </p>
                  </div>

                  <div className={`p-3 lg:p-3.5 rounded-2xl border transition-all ${
                    isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-200/80 bg-slate-50/70'
                  }`}>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#d02426]" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Training Center Head (TCH)</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#d02426]">
                      {currentCenter.tch}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      Certified Running Coach &amp; Pacing Lead
                    </span>
                  </div>

                  <div className={`p-3 lg:p-3.5 rounded-2xl border transition-all ${
                    isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-200/80 bg-slate-50/70'
                  }`}>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Morning Schedule</span>
                    </div>
                    <p className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      Tue, Thu, Sat &amp; Sun @ 5:30 AM
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      75–90 min drills &amp; endurance mileage
                    </span>
                  </div>

                  <div className={`p-3 lg:p-3.5 rounded-2xl border transition-all ${
                    isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-200/80 bg-slate-50/70'
                  }`}>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Pace Cohorts</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-emerald-500">
                      Walk-Run to Ultra Runners
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      Structured pace clusters led by pacers
                    </span>
                  </div>

                  {currentCenter.vicinity && (
                    <div className={`p-3 lg:p-3.5 rounded-2xl border sm:col-span-2 ${
                      isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-200/80 bg-slate-50/70'
                    }`}>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
                        Vicinity &amp; Nearby Neighborhoods
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentCenter.vicinity.split(/,\s*/).map((area, idx) => (
                          <span
                            key={idx}
                            className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                              isDark ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-700 border border-slate-200 shadow-xs'
                            }`}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className={`pt-3 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-auto flex-shrink-0 ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        isDark
                          ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700/80 hover:border-slate-600'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-sm'
                      }`}
                      title="Open Google Maps location"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#318cdd]" />
                      <span>Directions on Maps</span>
                    </a>
                  ) : <div />}

                  <button
                    onClick={() => onBookTrial(currentCenter)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-[#d02426] to-[#b51c1e] hover:from-[#b51c1e] hover:to-[#9a1719] shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Book Free Trial Run</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SUNRISE STRIDE (Light • Compact Radiant Dawn Ground Hub)
  // =========================================================================
  if (currentTheme === 'sunrise-coral' || currentTheme === 'heritage-gold') {
    return (
      <div className="rounded-3xl border border-orange-200/90 bg-white shadow-[0_15px_35px_-10px_rgba(255,72,0,0.1)] overflow-hidden">
        {/* Warm Dawn Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-orange-100 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {CITIES.map((city) => {
              const count = city === 'All Cities'
                ? centersData.length
                : centersData.filter(c => c.city === city).length;
              const isActive = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    const firstInCity = centersData.find(c => city === 'All Cities' || c.city === city);
                    if (firstInCity) setSelectedCenterId(firstInCity.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25'
                      : 'bg-white hover:bg-orange-50 text-zinc-700 border border-orange-200/80'
                  }`}
                >
                  <span>{city}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/25 text-white' : 'text-zinc-500 bg-orange-50'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Filter ground or TCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-orange-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
            />
          </div>
        </div>

        {/* Compact Dual-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[420px]">
          {/* Left Column: Scrollable Ground Directory */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-orange-100 max-h-48 sm:max-h-60 lg:max-h-[420px] overflow-y-auto divide-y divide-orange-100/70">
            {filteredCenters.map((center) => {
              const isSelected = currentCenter && currentCenter.id === center.id;
              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenterId(center.id)}
                  className={`p-3.5 sm:p-4 cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-50 to-amber-50/50 border-l-4 border-orange-600'
                      : 'hover:bg-orange-50/40 text-zinc-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black truncate text-zinc-950">
                        {center.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-100/80 text-orange-800">
                        {center.city}
                      </span>
                    </div>
                    <p className="text-xs truncate text-zinc-500 mt-0.5">
                      {center.venue}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      TCH: <strong className="text-orange-700 font-bold">{center.tch}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-orange-600' : 'text-zinc-400'}`}>
                      05:30 AM
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-600' : 'text-zinc-300'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Ground Spotlight */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-white relative">
            {currentCenter && (
              <div className="space-y-3.5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
                        {currentCenter.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 border border-orange-200/80 text-orange-700">
                        <Sun className="w-3 h-3 text-amber-500" />
                        {currentCenter.id === 'bengaluru-jayanagar'
                          ? `${currentCenter.city} • Academy HQ`
                          : currentCenter.city === 'Remote'
                          ? 'Global • Virtual Campus'
                          : currentCenter.city}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1 flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {currentCenter.runnersCount}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Training Ground</span>
                    <p className="text-xs font-bold text-zinc-900 mt-0.5 leading-snug">{currentCenter.venue}</p>
                  </div>

                  <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Training Center Head (TCH)</span>
                    <p className="text-xs font-bold mt-0.5 flex items-center gap-1.5 text-orange-700">
                      <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      {currentCenter.tch}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Morning Timings</span>
                    <p className="text-xs font-bold text-zinc-900 mt-0.5">{currentCenter.timings || 'Tue, Thu, Sat & Sun @ 5:30 AM'}</p>
                  </div>

                  <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Pace Groups</span>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">Walk-Run to Ultra Runners</p>
                  </div>

                  {currentCenter.vicinity && (
                    <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/40 sm:col-span-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Vicinity &amp; Access Radius</span>
                      <p className="text-xs font-semibold text-zinc-700 mt-0.5 leading-relaxed">{currentCenter.vicinity}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-orange-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-orange-100/80 hover:bg-orange-200 text-orange-800 transition-colors border border-orange-200 shadow-sm"
                      title="Open Google Maps location"
                    >
                      <Navigation className="w-3.5 h-3.5 text-orange-600" />
                      <span>Directions on Maps</span>
                    </a>
                  ) : <div />}

                  <button
                    onClick={() => onBookTrial(currentCenter)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Book Sunrise Trial</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. KINETIC VOLT (Dark • Radar Tactical Cockpit & GPS Telemetry Grid)
  // =========================================================================
  if (currentTheme === 'kinetic') {
    return (
      <div className="rounded-3xl border border-[#1e2230] bg-[#11131c] shadow-2xl overflow-hidden">
        {/* Cockpit Header */}
        <div className="p-4 sm:p-5 border-b border-[#1e2230] bg-[#090a0f] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {CITIES.map((city) => {
              const count = city === 'All Cities'
                ? centersData.length
                : centersData.filter(c => c.city === city).length;
              const isActive = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    const firstInCity = centersData.find(c => city === 'All Cities' || c.city === city);
                    if (firstInCity) setSelectedCenterId(firstInCity.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{city}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-black/20 text-current' : 'opacity-60 bg-white/10'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Radio className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#ccff00]" />
            <input
              type="text"
              placeholder="RADAR SCAN GROUND / TCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-white/10 bg-black text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
            />
          </div>
        </div>

        {/* Tactical Cockpit Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[440px]">
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#1e2230] max-h-48 sm:max-h-60 lg:max-h-[420px] overflow-y-auto divide-y divide-[#1e2230]">
            {filteredCenters.map((center) => {
              const isSelected = currentCenter && currentCenter.id === center.id;
              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenterId(center.id)}
                  className={`p-4 cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? 'bg-[#ccff00]/10 border-l-4 border-[#ccff00]'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold truncate text-white">
                        {center.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-[#ccff00]">
                        {center.city}
                      </span>
                    </div>
                    <p className="text-xs truncate text-slate-400 mt-0.5">
                      {center.venue}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      TCH: <strong className="text-white">{center.tch}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-[#ccff00] font-bold' : 'text-slate-500'}`}>
                      05:30
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ccff00]' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#11131c]">
            {currentCenter && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
                      {currentCenter.name}
                    </h3>
                    <span className="text-xs font-mono text-[#ccff00] flex items-center gap-1 flex-shrink-0 pt-1 sm:pt-0">
                      <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                      {currentCenter.runnersCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#ccff00]/10 border border-[#ccff00]/30 text-xs font-mono text-[#ccff00]">
                      <Radio className="w-3.5 h-3.5" />
                      SECTOR {currentCenter.city.toUpperCase()} // ACTIVE
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase block">GROUND VENUE</span>
                    <p className="text-xs font-bold text-white mt-1">{currentCenter.venue}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase block">CENTER DIRECTOR (TCH)</span>
                    <p className="text-xs font-bold text-[#ccff00] mt-1">{currentCenter.tch}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase block">MUSTER PROTOCOL</span>
                    <p className="text-xs font-bold text-white mt-1">{currentCenter.timings || 'Tue, Thu, Sat, Sun @ 05:30 AM'}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase block">ZONE DISCIPLINE</span>
                    <p className="text-xs font-bold text-emerald-400 mt-1">{currentCenter.level || 'Zone 2 Aerobic Compounding'}</p>
                  </div>

                  {currentCenter.vicinity && (
                    <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 sm:col-span-2">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">RADAR VICINITY &amp; CORRIDORS</span>
                      <p className="text-xs font-medium text-slate-300 mt-1 leading-relaxed font-mono">{currentCenter.vicinity}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono">
                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-mono font-bold bg-[#ccff00]/15 hover:bg-[#ccff00]/25 text-[#ccff00] transition-colors border border-[#ccff00]/40"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#ccff00]" />
                      <span>GPS TELEMETRY MAP</span>
                    </a>
                  ) : <div />}

                  <button
                    onClick={() => onBookTrial(currentCenter)}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 flex items-center justify-center gap-2 bg-[#ccff00] text-black"
                  >
                    <span>INITIALIZE TRIAL RUN</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. CRIMSON VELOCITY (Dark • Breaking2 Staging Matrix & Tactical Dispatch)
  // =========================================================================
  return (
    <div className="rounded-3xl border border-[#26161b] bg-[#110e12] shadow-2xl overflow-hidden">
      {/* Top Velocity Dispatch Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-black flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {CITIES.map((city) => {
            const count = city === 'All Cities'
              ? centersData.length
              : centersData.filter(c => c.city === city).length;
            const isActive = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  const firstInCity = centersData.find(c => city === 'All Cities' || c.city === city);
                  if (firstInCity) setSelectedCenterId(firstInCity.id);
                }}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#ff1e42] text-white shadow-[0_0_12px_rgba(255,30,66,0.4)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>{city}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-black/30 text-white' : 'opacity-60 bg-white/10'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Flame className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#ff1e42]" />
          <input
            type="text"
            placeholder="STAGING DISPATCH SCAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-zinc-800 bg-zinc-950 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#ff1e42]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[440px]">
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-zinc-800 max-h-48 sm:max-h-60 lg:max-h-[420px] overflow-y-auto divide-y divide-zinc-900">
          {filteredCenters.map((center) => {
            const isSelected = currentCenter && currentCenter.id === center.id;
            return (
              <div
                key={center.id}
                onClick={() => setSelectedCenterId(center.id)}
                className={`p-4 cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                  isSelected
                    ? 'bg-[#ff1e42]/15 border-l-4 border-[#ff1e42]'
                    : 'hover:bg-zinc-900/50 text-zinc-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black truncate text-white">
                      {center.name}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-[#ff1e42] border border-[#ff1e42]/30">
                      {center.city}
                    </span>
                  </div>
                  <p className="text-xs truncate text-zinc-400 mt-0.5">
                    {center.venue}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                    TCH LEAD: <strong className="text-zinc-200">{center.tch}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-[#ff1e42] font-black' : 'text-zinc-600'}`}>
                    05:30
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ff1e42]' : 'text-zinc-700'}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#110e12]">
          {currentCenter && (
            <div className="space-y-6">
              <div>
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                    {currentCenter.name}
                  </h3>
                  <span className="text-xs font-mono text-[#ff1e42] font-black flex items-center gap-1 flex-shrink-0 pt-1 sm:pt-0">
                    <span className="w-2 h-2 rounded-full bg-[#ff1e42] animate-ping" />
                    {currentCenter.runnersCount}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#ff1e42]/20 border border-[#ff1e42]/40 text-xs font-mono font-bold text-[#ff1e42]">
                    <Flame className="w-3.5 h-3.5 fill-[#ff1e42]" />
                    STAGING BASE // {currentCenter.city.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">DEPLOYED GROUND</span>
                  <p className="text-xs font-bold text-white mt-1">{currentCenter.venue}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">TCH CALLSIGN</span>
                  <p className="text-xs font-bold text-[#ff1e42] mt-1">{currentCenter.tch}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">LAUNCH WINDOW</span>
                  <p className="text-xs font-bold text-white mt-1">{currentCenter.timings || '05:30 AM – 07:00 AM (4 Days/Wk)'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">SPEED TARGETS</span>
                  <p className="text-xs font-bold text-amber-400 mt-1">{currentCenter.level || 'Sub-3h Full & Sub-90m Half'}</p>
                </div>

                {currentCenter.vicinity && (
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 sm:col-span-2">
                    <span className="text-[10px] text-zinc-500 uppercase block font-mono">SECTOR VICINITY RADIUS</span>
                    <p className="text-xs font-medium text-zinc-300 mt-1 leading-relaxed font-mono">{currentCenter.vicinity}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono">
                {mapUrl ? (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-xs font-mono font-bold bg-[#ff1e42]/20 hover:bg-[#ff1e42]/30 text-white transition-colors border border-[#ff1e42]/50 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#ff1e42]" />
                    <span>GPS MAP DISPATCH</span>
                  </a>
                ) : <div />}

                <button
                  onClick={() => onBookTrial(currentCenter)}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,30,66,0.35)] hover:bg-white hover:text-black flex items-center justify-center gap-2 bg-[#ff1e42] text-white"
                >
                  <span>LOCK TRIAL SPOT</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
