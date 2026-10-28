import React, { useState, useMemo } from 'react';
import { MapPin, Clock, UserCheck, Search, ShieldCheck, ChevronRight, Navigation, Award, Zap, Flame, Sun, Activity, Compass, Radio, ExternalLink } from 'lucide-react';
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
        <div className={`p-4 sm:p-5 border-b flex flex-col md:flex-row items-center justify-between gap-4 ${
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
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
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
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search neighborhood or TCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#318cdd]/30 ${
                isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500'
                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>
        </div>

        {/* Master Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          {/* Left Column: Center List */}
          <div className={`lg:col-span-5 border-b lg:border-b-0 lg:border-r max-h-[460px] overflow-y-auto divide-y ${
            isDark ? 'border-slate-800 divide-slate-800/80' : 'border-slate-100 divide-slate-100'
          }`}>
            {filteredCenters.map((center) => {
              const isSelected = currentCenter && currentCenter.id === center.id;
              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenterId(center.id)}
                  className={`p-4 cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? isDark
                        ? 'bg-[#318cdd]/15 border-l-4 border-[#318cdd]'
                        : 'bg-[#318cdd]/10 border-l-4 border-[#318cdd]'
                      : isDark
                        ? 'hover:bg-slate-800/60 text-slate-300'
                        : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>
                        {center.name}
                      </h4>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {center.city}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#318cdd]' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sleek Spec Sheet */}
          <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {currentCenter && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      isDark
                        ? 'bg-[#318cdd]/15 text-[#4ca6f5] border border-[#318cdd]/30'
                        : 'bg-[#318cdd]/10 text-[#1d72bd] border border-[#318cdd]/20'
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                      {currentCenter.city} • Active Training Ground
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {currentCenter.runnersCount}
                    </span>
                  </div>

                  <h3 className={`text-2xl sm:text-3xl font-black tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {currentCenter.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className={`p-4 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50/80'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Training Ground</span>
                      {mapUrl && (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${
                            isDark ? 'text-[#4ca6f5] hover:text-white' : 'text-[#318cdd] hover:text-[#1d72bd]'
                          }`}
                          title="Open Google Maps location"
                        >
                          <span>Open Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className={`text-xs font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentCenter.venue}</p>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50/80'}`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Training Center Head (TCH)</span>
                    <p className="text-xs font-bold mt-1 flex items-center gap-1.5 text-[#d02426]">
                      <UserCheck className="w-4 h-4 stroke-[2.5]" />
                      {currentCenter.tch}
                    </p>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50/80'}`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Morning Timings</span>
                    <p className={`text-xs font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tue, Thu, Sat &amp; Sun @ 5:30 AM</p>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50/80'}`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Pace Groups</span>
                    <p className="text-xs font-bold text-emerald-500 mt-1">Walk-Run to Boston Qualifier</p>
                  </div>

                  {currentCenter.vicinity && (
                    <div className={`p-4 rounded-2xl border sm:col-span-2 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50/80'}`}>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Vicinity &amp; Nearby Areas</span>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{currentCenter.vicinity}</p>
                    </div>
                  )}
                </div>

                <div className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                          isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-[#4ca6f5] border-slate-700'
                            : 'bg-blue-50 hover:bg-blue-100 text-[#1d72bd] border-blue-200'
                        }`}
                        title="Open Google Maps location"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#318cdd]" />
                        <span>Google Maps</span>
                      </a>
                    )}
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>Coached by </span>
                      <strong className="text-[#d02426]">{currentCenter.tch} (TCH)</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookTrial(currentCenter)}
                    className="w-full sm:w-auto py-3 px-6 rounded-2xl text-xs font-black uppercase tracking-wider transition-all hover:scale-105 flex items-center justify-center gap-2 text-white shadow-md bg-[#d02426] hover:bg-[#b51c1e] shadow-red-500/25"
                  >
                    <span>Book Free Trial Run at {currentCenter.name}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          {/* Left Column: Scrollable Ground Directory */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-orange-100 max-h-[440px] overflow-y-auto divide-y divide-orange-100/70">
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
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white relative">
            {currentCenter && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 border border-orange-200/80 text-orange-700">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      {currentCenter.city} • Morning Stride Ground
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {currentCenter.runnersCount}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 mt-1">
                    {currentCenter.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Training Ground</span>
                      {mapUrl && (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 transition-colors"
                        >
                          <span>Open Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs font-bold text-zinc-900 leading-snug">{currentCenter.venue}</p>
                  </div>

                  <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Training Center Head (TCH)</span>
                    <p className="text-xs font-bold mt-1 flex items-center gap-1.5 text-orange-700">
                      <UserCheck className="w-4 h-4 stroke-[2.5]" />
                      {currentCenter.tch}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Morning Timings</span>
                    <p className="text-xs font-bold text-zinc-900 mt-1">{currentCenter.timings || 'Tue, Thu, Sat & Sun @ 5:30 AM'}</p>
                  </div>

                  <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Pace Groups</span>
                    <p className="text-xs font-bold text-emerald-600 mt-1">{currentCenter.level || 'Walk-Run to Marathon PBs'}</p>
                  </div>

                  {currentCenter.vicinity && (
                    <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40 sm:col-span-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Vicinity &amp; Access Radius</span>
                      <p className="text-xs font-semibold text-zinc-700 mt-1 leading-relaxed">{currentCenter.vicinity}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-orange-100/80 hover:bg-orange-200 text-orange-800 transition-colors border border-orange-200 shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5 text-orange-600" />
                        <span>Google Maps</span>
                      </a>
                    )}
                    <div className="text-xs text-zinc-500">
                      <span>Mentored by </span>
                      <strong className="text-zinc-900">{currentCenter.tch} (TCH)</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookTrial(currentCenter)}
                    className="w-full sm:w-auto py-3 px-6 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-orange-500/25 hover:scale-105 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white"
                  >
                    <span>Book Sunrise Trial at {currentCenter.name}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#1e2230] max-h-[460px] overflow-y-auto divide-y divide-[#1e2230]">
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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#ccff00]/10 border border-[#ccff00]/30 text-xs font-mono text-[#ccff00]">
                      <Radio className="w-3.5 h-3.5" />
                      SECTOR {currentCenter.city.toUpperCase()} // ACTIVE
                    </span>
                    <span className="text-xs font-mono text-[#ccff00] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                      {currentCenter.runnersCount}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                    {currentCenter.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500 uppercase">GROUND VENUE</span>
                      {mapUrl && (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#ccff00] hover:underline flex items-center gap-1"
                        >
                          <span>Open Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
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

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 font-mono">
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#ccff00]/15 hover:bg-[#ccff00]/25 text-[#ccff00] transition-colors border border-[#ccff00]/40"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>GPS MAP</span>
                      </a>
                    )}
                    <div className="text-xs font-mono text-slate-400">
                      <span>DIRECTOR: </span>
                      <strong className="text-white">{currentCenter.tch} (TCH)</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookTrial(currentCenter)}
                    className="w-full sm:w-auto py-3 px-6 rounded-2xl text-xs font-mono font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 flex items-center justify-center gap-2 bg-[#ccff00] text-black"
                  >
                    <span>INITIALIZE TRIAL AT {currentCenter.name}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-zinc-800 max-h-[460px] overflow-y-auto divide-y divide-zinc-900">
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
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#ff1e42]/20 border border-[#ff1e42]/40 text-xs font-mono font-bold text-[#ff1e42]">
                    <Flame className="w-3.5 h-3.5 fill-[#ff1e42]" />
                    STAGING BASE // {currentCenter.city.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-[#ff1e42] font-black flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#ff1e42] animate-ping" />
                    {currentCenter.runnersCount}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
                  {currentCenter.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-500 uppercase">DEPLOYED GROUND</span>
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#ff1e42] hover:underline flex items-center gap-1"
                      >
                        <span>Open Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
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

              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 font-mono">
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#ff1e42]/20 hover:bg-[#ff1e42]/30 text-white transition-colors border border-[#ff1e42]/50 shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#ff1e42]" />
                      <span>GPS MAP</span>
                    </a>
                  )}
                  <div className="text-xs font-mono text-zinc-400">
                    <span>COMMANDER: </span>
                    <strong className="text-white">{currentCenter.tch} (TCH)</strong>
                  </div>
                </div>

                <button
                  onClick={() => onBookTrial(currentCenter)}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,30,66,0.35)] hover:bg-white hover:text-black flex items-center justify-center gap-2 bg-[#ff1e42] text-white"
                >
                  <span>LOCK TRIAL AT {currentCenter.name}</span>
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
