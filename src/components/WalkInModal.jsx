import React, { useState } from 'react';
import { SERVICES, STYLISTS } from '../services/store';

export default function WalkInModal({ isOpen, onClose, onRegisterWalkIn, onAddWalkIn }) {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(SERVICES[0].id);
  const [selectedStylistId, setSelectedStylistId] = useState(STYLISTS[0].id);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone) return;

    const payload = {
      customerName: guestName,
      customerPhone: guestPhone,
      serviceId: selectedServiceId,
      stylistId: selectedStylistId,
      slot: 'Immediate Walk-In'
    };

    if (onAddWalkIn) {
      onAddWalkIn(payload);
    } else if (onRegisterWalkIn) {
      onRegisterWalkIn(payload);
    }

    setGuestName('');
    setGuestPhone('');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B18]/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-warm-lg space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#EAE3DA] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-bold shadow-sm text-lg">
              🎫
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#C1785A] uppercase tracking-[0.08em]">Walk-In Express Kiosk</div>
              <h3 className="font-serif font-extrabold text-xl text-[#2C2725]">Issue Instant Walk-In Token</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3EAE0] text-[#8A8078] hover:text-[#2C2725] flex items-center justify-center transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2C2725] uppercase tracking-[0.08em] mb-1">Guest Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-[#F3EAE0] border border-[#EAE3DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2725] uppercase tracking-[0.08em] mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full bg-[#F3EAE0] border border-[#EAE3DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2C2725] uppercase tracking-[0.08em] mb-1">Select Ritual</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full bg-[#F3EAE0] border border-[#EAE3DA] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
              >
                {SERVICES.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (₹{s.price})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2725] uppercase tracking-[0.08em] mb-1">Assigned Artisan</label>
              <select
                value={selectedStylistId}
                onChange={(e) => setSelectedStylistId(e.target.value)}
                className="w-full bg-[#F3EAE0] border border-[#EAE3DA] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
              >
                {STYLISTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] font-bold text-xs uppercase tracking-[0.08em] shadow-md transition-all flex items-center justify-center gap-2 mt-6"
          >
            <span>Issue Digital Token & Add to Live Queue</span>
            <span>→</span>
          </button>
        </form>

      </div>
    </div>
  );
}
