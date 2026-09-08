import React, { useState } from 'react';
import { STYLISTS } from '../services/store';

export default function StaffLoginModal({ isOpen, onClose, onSelectStaff, currentStaffId }) {
  const [selectedId, setSelectedId] = useState(currentStaffId || 'elena');
  const [pin, setPin] = useState('1234');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    onSelectStaff(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1831]/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-[#e8ddff] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#594047] hover:text-[#1e1831] p-1 rounded-full hover:bg-[#f8f1ff] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}

        <div className="w-12 h-12 bg-[#ffd9e2] border border-[#db2379]/40 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#b50060]">
          <span className="material-symbols-outlined text-2xl">lock</span>
        </div>

        <h3 className="font-headline text-2xl font-bold text-center text-[#1e1831] mb-1">
          Artisan Portal Login
        </h3>
        <p className="text-xs text-center text-[#594047] mb-6">
          Log in as your artisan profile to access your personal sanctuary suite and assigned rituals queue.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Staff Member Selector Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#594047] uppercase tracking-wider">
              Select Staff Profile
            </label>
            
            <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
              
              {/* Front Desk Admin Option */}
              <div
                onClick={() => setSelectedId('admin')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedId === 'admin'
                    ? 'bg-[#f8f1ff] border-[#b50060] text-[#b50060] shadow-md ring-2 ring-[#b50060]'
                    : 'bg-[#ffffff] border-[#e8ddff] text-[#1e1831] hover:bg-[#f8f1ff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffd9e2] border border-[#db2379]/40 flex items-center justify-center text-[#b50060]">
                    <span className="material-symbols-outlined text-xl">verified_user</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1e1831]">Front Desk Manager</div>
                    <div className="text-xs text-[#b50060] font-medium">Full Floor & All Artisans View</div>
                  </div>
                </div>
                {selectedId === 'admin' && (
                  <span className="material-symbols-outlined text-[#b50060] text-xl">check_circle</span>
                )}
              </div>

              {/* Individual Stylists */}
              {STYLISTS.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedId(st.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedId === st.id
                      ? 'bg-[#f8f1ff] border-[#b50060] text-[#b50060] shadow-md ring-2 ring-[#b50060]'
                      : 'bg-[#ffffff] border-[#e8ddff] text-[#1e1831] hover:bg-[#f8f1ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={st.avatar} 
                      alt={st.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#b50060]/30 shrink-0" 
                    />
                    <div>
                      <div className="text-sm font-bold text-[#1e1831]">{st.name}</div>
                      <div className="text-xs text-[#ae3115] font-medium">{st.role}</div>
                    </div>
                  </div>
                  {selectedId === st.id && (
                    <span className="material-symbols-outlined text-[#b50060] text-xl">check_circle</span>
                  )}
                </div>
              ))}

            </div>
          </div>

          {/* Passcode input */}
          <div>
            <label className="block text-xs font-semibold text-[#594047] uppercase tracking-wider mb-1.5">
              Staff PIN (Demo: 1234)
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-[#f8f1ff] border border-[#e1bec6] rounded-xl px-4 py-2.5 text-center text-[#1e1831] tracking-widest font-mono text-lg focus:outline-none focus:border-[#b50060]"
              maxLength={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-[#b50060] hover:bg-[#8e004a] text-white font-headline font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Enter Personal Dashboard</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

      </div>
    </div>
  );
}
