import React from 'react';
import ThemeFontToggle from './ThemeFontToggle';

export default function Header({ currentRoute, onNavigate, waitingCount = 9, inChairCount = 0, onOpenTryOn }) {
  
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
    <header className="sticky top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all">
      <div className="rounded-full bg-[#FAF6F0]/95 backdrop-blur-md border border-[#EAE3DA] shadow-warm-soft px-5 sm:px-7 py-3 flex items-center justify-between gap-4">
        
        {/* Left Logo Mark & Tagline */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => onNavigate('customer')}
            className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01]"
          >
            {/* Logo Mark: solid terracotta circle with white lowercase "r" */}
            <div className="w-10 h-10 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-serif font-bold text-2xl shadow-sm leading-none pt-0.5">
              r
            </div>
            
            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-xl tracking-tight text-[#2C2725] leading-none">
                ROSE & ROGUE
              </span>
              <span className="text-[9px] uppercase font-bold text-[#8A8078] tracking-[0.2em] mt-0.5">
                PARIS • HAUTE SALON
              </span>
            </div>
          </button>

          {/* Center-left Live Status Mini Pills */}
          <div className="hidden xl:flex items-center gap-1.5 ml-3 pl-3 border-l border-[#EAE3DA] text-[11px] font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-[#F3EAE0] border border-[#EAE3DA] text-[#2C2725] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C1785A] animate-pulse" />
              <span>{inChairCount} In Chair</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#F3EAE0] border border-[#EAE3DA] text-[#8A8078]">
              {waitingCount} Waiting
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {onOpenTryOn && (
            <button
              onClick={onOpenTryOn}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] bg-[#F0DCCF] text-[#C1785A] border border-[#EAE3DA] hover:bg-[#C1785A] hover:text-[#FAF6F0] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>📷</span>
              <span>AI VIRTUAL MIRROR</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('staff')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] transition-all ${
              currentRoute === 'staff'
                ? 'bg-[#C1785A] text-[#FAF6F0]'
                : 'text-[#2C2725] hover:bg-[#F3EAE0]'
            }`}
          >
            DASHBOARD
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] transition-all ${
              currentRoute === 'admin'
                ? 'bg-[#C1785A] text-[#FAF6F0]'
                : 'text-[#2C2725] hover:bg-[#F3EAE0]'
            }`}
          >
            PREDICTIONS
          </button>

          <button
            onClick={() => onNavigate('tv')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] transition-all ${
              currentRoute === 'tv'
                ? 'bg-[#C1785A] text-[#FAF6F0]'
                : 'text-[#2C2725] hover:bg-[#F3EAE0]'
            }`}
          >
            TV BOARD
          </button>

          <button
            onClick={() => handleSectionScroll('curated-menu')}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] text-[#2C2725] hover:bg-[#F3EAE0] transition-all"
          >
            SCAN QR
          </button>
        </div>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-3">
          {/* Solid terracotta BOOK SESSION pill button */}
          <button
            onClick={() => handleSectionScroll('curated-menu')}
            className="px-5 py-2.5 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            BOOK SESSION
          </button>

          {/* User Avatar with Green Online Dot */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#F0DCCF] border border-[#C1785A]/40 flex items-center justify-center text-xs font-bold text-[#C1785A]">
              👤
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#FAF6F0]" />
          </div>

          {/* Theme & Font Toggle */}
          <ThemeFontToggle />
        </div>

      </div>
    </header>
  );
}
