import React, { useState } from 'react';
import { STYLISTS } from '../services/store';

export default function StaffLoginModal({ isOpen, onClose, onSelectStaff, currentStaffId }) {
  const [selectedId, setSelectedId] = useState(currentStaffId || 'elena');
  const [pin, setPin] = useState('1234');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    onSelectStaff(selectedId);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-[#2C2725]">
        
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-[#8A8078] hover:text-[#2C2725] p-1.5 rounded-full hover:bg-[#F3EAE0] transition-colors"
          >
            ✕
          </button>
        )}

        {/* Lock Icon Badge */}
        <div className="w-14 h-14 bg-[#F0DCCF] border border-[#C1785A]/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#C1785A] text-2xl font-bold shadow-sm">
          🔒
        </div>

        <h3 className="font-serif text-2xl font-extrabold text-center text-[#2C2725] mb-1">
          Artisan Portal Login
        </h3>
        <p className="text-xs text-center text-[#8A8078] mb-6 leading-relaxed">
          Log in as your artisan profile to access your personal sanctuary suite and assigned rituals queue.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Staff Member Selector Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#C1785A] uppercase tracking-[0.08em]">
              SELECT STAFF PROFILE
            </label>
            
            <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
              
              {/* Front Desk Admin Option */}
              <div
                onClick={() => setSelectedId('admin')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedId === 'admin'
                    ? 'bg-[#F0DCCF] border-[#C1785A] text-[#2C2725] shadow-sm font-bold'
                    : 'bg-[#EFE6DA] border-[#EAE3DA] text-[#2C2725] hover:bg-[#F3EAE0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#EAE3DA] flex items-center justify-center text-[#C1785A] font-bold text-lg">
                    👑
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#2C2725]">Front Desk Manager</div>
                    <div className="text-xs text-[#C1785A] font-bold">Full Floor & All Artisans View</div>
                  </div>
                </div>
                {selectedId === 'admin' && (
                  <span className="w-6 h-6 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
              </div>

              {/* Individual Stylists */}
              {STYLISTS.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedId(st.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedId === st.id
                      ? 'bg-[#F0DCCF] border-[#C1785A] text-[#2C2725] shadow-sm font-bold'
                      : 'bg-[#EFE6DA] border-[#EAE3DA] text-[#2C2725] hover:bg-[#F3EAE0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={st.avatar} 
                      alt={st.name} 
                      className="w-10 h-10 rounded-full object-cover border border-[#C1785A] shrink-0" 
                    />
                    <div>
                      <div className="text-sm font-extrabold text-[#2C2725]">{st.name}</div>
                      <div className="text-xs text-[#8A8078] font-semibold">{st.role}</div>
                    </div>
                  </div>
                  {selectedId === st.id && (
                    <span className="w-6 h-6 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>
              ))}

            </div>
          </div>

          {/* Passcode input */}
          <div>
            <label className="block text-xs font-bold text-[#8A8078] uppercase tracking-[0.08em] mb-1.5">
              STAFF PIN (DEMO: 1234)
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#EAE3DA] rounded-xl px-4 py-3 text-center text-[#2C2725] tracking-widest font-mono text-xl focus:outline-none focus:border-[#C1785A]"
              maxLength={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-4 bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] font-bold text-xs uppercase tracking-[0.08em] rounded-full shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Enter Personal Dashboard</span>
            <span>→</span>
          </button>
        </form>

      </div>
    </div>
  );
}
