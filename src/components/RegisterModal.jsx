import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, MapPin, Calendar } from 'lucide-react';
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

  useEffect(() => {
    if (initialData) {
      if (initialData.city || initialData.venue) {
        setFormData(prev => ({ ...prev, location: initialData.id || `${initialData.city} - ${initialData.name}` }));
      }
      if (initialData.duration || initialData.level) {
        setFormData(prev => ({ ...prev, program: initialData.id }));
      }
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleReset(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all"
    >
      <div
        className="w-full max-w-xl rounded-3xl p-6 md:p-8 border shadow-2xl relative overflow-hidden transition-all max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Prominent High-Contrast Close Button */}
        <button
          onClick={handleReset}
          aria-label="Close dialog"
          title="Close dialog"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-[#d02426] border border-slate-700/90 shadow-lg transition-all duration-200 hover:scale-105 z-30 cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}
            >
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black tracking-tight">You're On The Jaguar Roster!</h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              Welcome, <span className="font-bold text-white">{formData.name}</span>! Your registration details have been dispatched to the Training Center Head (TCH).
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex items-center justify-between text-gray-400">
                <span>Next Trial Run:</span>
                <span className="font-bold text-white">Upcoming Tuesday, 5:30 AM</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Selected Location:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{formData.location || 'Jayanagar HQ'}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>TCH Coordination:</span>
                <span className="font-bold text-emerald-400">WhatsApp Alert Sent</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleReset}
                className="py-3 px-8 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-contrast)'
                }}
              >
                Done & Return to Site
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pr-10">
                <div className="flex items-center gap-3">
                  <JJSLogo className="h-8 sm:h-9 w-auto" />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-[#d02426] border border-red-200/80">
                    <Sparkles className="w-3.5 h-3.5" />
                    Zero Obligation
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                Join JJs Running / Book Free Trial Run
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Experience a coached morning session at any of our 20+ grounds across India or remote.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-1"
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile / WhatsApp No</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-1"
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Training Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-sm focus:outline-none focus:ring-1 text-white"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <option value="">Select your preferred ground...</option>
                    {centersData.map((c) => (
                      <option key={c.id} value={`${c.city} - ${c.name}`}>
                        {c.city} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Program Track</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-sm focus:outline-none focus:ring-1 text-white"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <option value="">Choose program (or decide after trial)...</option>
                    {programsData.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} ({p.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Current Running Level</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-sm focus:outline-none focus:ring-1 text-white"
                  >
                    <option value="Beginner (0 - 5 km)">Beginner (0 - 5 km)</option>
                    <option value="Recreational (5 - 10 km)">Recreational (5 - 10 km)</option>
                    <option value="Half Marathoner (21K)">Half Marathoner (21K)</option>
                    <option value="Full Marathoner / Ultra (42K+)">Full Marathoner / Ultra (42K+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Promocode (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. JAGUARFIRST"
                    value={formData.promocode}
                    onChange={(e) => setFormData({ ...formData, promocode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-1 uppercase"
                  />
                </div>
              </div>

              <p className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Zero fee for trial run. No spam. You'll receive a WhatsApp briefing with ground coordinates.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] bg-[#d02426] hover:bg-[#b51c1e] text-white shadow-red-500/25"
              >
                {loading ? 'Registering on Roster...' : 'Confirm Registration / Free Trial'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
