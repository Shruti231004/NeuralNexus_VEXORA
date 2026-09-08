import React from 'react';
import { STYLISTS } from '../services/store';

export default function Header({ currentRoute, onNavigate, waitingCount }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/90 backdrop-blur-xl border-b border-[#e8ddff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1360px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); onNavigate('customer'); }}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#b50060] via-[#db2379] to-[#fd6a49] p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#ffffff] rounded-[10px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#b50060] text-xl">spa</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-2xl text-[#b50060] tracking-tight flex items-center gap-1.5">
                Aura <span className="hidden sm:inline-block font-body text-[11px] uppercase text-[#594047] tracking-widest pl-1 font-semibold">Salon & Spa</span>
              </span>
            </div>
          </a>

          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8f1ff] text-[#594047]">
            <span className="material-symbols-outlined text-[#ae3115] text-sm">spa</span>
            <span className="font-body text-[11px] uppercase tracking-wider font-bold text-[#594047]">Sanctuary & Suite</span>
          </div>
        </div>

        {/* Pure Customer Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#f8f1ff] border border-[#e8ddff]">
          <button
            onClick={() => onNavigate('customer')}
            className={`px-4 py-2 rounded-full font-body text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              currentRoute === 'customer'
                ? 'bg-[#db2379] text-white shadow-[0_4px_16px_-2px_rgba(219,35,121,0.35)]'
                : 'text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831]'
            }`}
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>Book Experience</span>
          </button>

          <button
            onClick={() => onNavigate('customer')}
            className="px-4 py-2 rounded-full font-body text-xs font-semibold text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831] transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">schedule</span>
            <span>Live Queue & Waitlist</span>
            {waitingCount > 0 && (
              <span className="bg-[#b50060] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-pink-400/40">
                {waitingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('customer')}
            className="px-4 py-2 rounded-full font-body text-xs font-semibold text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831] transition-all"
          >
            My Appointments & Rewards
          </button>
        </nav>

        {/* Right Actions & Glow Pts */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Glow Pts */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ede4ff] text-[#1e1831] font-body text-xs">
            <span className="material-symbols-outlined text-[#ae3115] text-base">stars</span>
            <span className="font-bold text-[#ae3115]">2,450</span>
            <span className="text-[#594047] font-medium hidden xl:inline">Glow Pts</span>
          </div>

          {/* Concierge Button */}
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f8f1ff] text-[#594047] hover:bg-[#ede4ff] hover:text-[#1e1831] transition-colors"
            title="Concierge Service"
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
          </button>

          {/* Reserve Now CTA Button */}
          <button
            onClick={() => onNavigate('customer')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#b50060] hover:bg-[#8e004a] text-white font-body text-xs font-semibold shadow-md transition-all"
          >
            <span>Reserve Now</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>

        </div>

      </div>
    </header>
  );
}
