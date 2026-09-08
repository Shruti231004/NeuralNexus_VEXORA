import React from 'react';

export default function Header({ currentRoute, onNavigate, waitingCount }) {
  
  const handleSectionScroll = (sectionId) => {
    if (currentRoute !== 'customer') {
      onNavigate('customer');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-xl border-b border-[#e8ddff] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="h-20 max-w-[1360px] mx-auto px-4 md:px-8 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => onNavigate('customer')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#b50060] via-[#db2379] to-[#fd6a49] p-0.5 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#ffffff] rounded-[10px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#b50060] text-xl">spa</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-2xl text-[#b50060] tracking-tight flex items-center gap-1.5">
                Aura <span className="hidden sm:inline-block font-body text-[10px] uppercase text-[#594047] tracking-widest pl-1 font-semibold">Salon Atelier</span>
              </span>
            </div>
          </button>
        </div>

        {/* Portal Switcher Tabs (Customer, Staff, Admin, Split Demo) */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#f8f1ff] border border-[#e8ddff] shadow-inner">
          <button
            onClick={() => onNavigate('customer')}
            className={`px-3.5 py-1.5 rounded-full font-body text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentRoute === 'customer'
                ? 'bg-[#b50060] text-white shadow-md'
                : 'text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">spa</span>
            <span>Customer View</span>
          </button>

          <button
            onClick={() => onNavigate('staff')}
            className={`px-3.5 py-1.5 rounded-full font-body text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentRoute === 'staff'
                ? 'bg-[#7d2dce] text-white shadow-md'
                : 'text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">content_cut</span>
            <span>Staff Portal (`/staff`)</span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-1.5 rounded-full font-body text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentRoute === 'admin'
                ? 'bg-[#1e1831] text-white shadow-md'
                : 'text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span>Admin Portal (`/admin`)</span>
          </button>

          <button
            onClick={() => onNavigate('split')}
            className={`hidden md:flex px-3.5 py-1.5 rounded-full font-body text-xs font-bold transition-all items-center gap-1.5 ${
              currentRoute === 'split'
                ? 'bg-gradient-to-r from-[#b50060] to-[#7d2dce] text-white shadow-md'
                : 'text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">splitscreen</span>
            <span>Split Demo (`/split`)</span>
          </button>
        </div>

        {/* Quick Action Navigation & Reserve CTA */}
        <div className="flex items-center gap-2">
          
          {/* Quick Sub-navigation links for Customer experience */}
          <button
            onClick={() => handleSectionScroll('services-section')}
            className="hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#594047] hover:bg-[#f8f1ff] hover:text-[#b50060] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
            <span>Services</span>
          </button>

          <button
            onClick={() => handleSectionScroll('my-appointments-section')}
            className="hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#594047] hover:bg-[#f8f1ff] hover:text-[#b50060] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Live Queue</span>
            {waitingCount > 0 && (
              <span className="bg-[#b50060] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {waitingCount}
              </span>
            )}
          </button>

          {/* Concierge Support Button */}
          <button
            type="button"
            onClick={() => alert("📞 Aura Concierge Hotline: +1 (555) 019-2872\nAvailable 9 AM - 9 PM for VIP reservations & scalp consultations.")}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f8f1ff] border border-[#e8ddff] text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831] transition-colors shadow-sm"
            title="Concierge VIP Support"
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
          </button>

          {/* Reserve Now CTA Button */}
          <button
            onClick={() => handleSectionScroll('booking-section')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#b50060] to-[#db2379] hover:from-[#8e004a] hover:to-[#b50060] text-white font-body text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>Reserve Now</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>

        </div>

      </div>
    </header>
  );
}
