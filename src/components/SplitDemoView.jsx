import React from 'react';
import CustomerView from './CustomerView';
import StaffDashboard from './StaffDashboard';

export default function SplitDemoView({ store }) {
  return (
    <div className="w-full space-y-6 pt-4 pb-12">
      
      {/* Proof-of-life banner */}
      <div className="bg-[#f8f1ff] border border-[#db2379]/40 p-4 rounded-3xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#b50060] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <span className="material-symbols-outlined text-xl">bolt</span>
          </div>
          <div>
            <div className="text-xs font-bold text-[#b50060] uppercase tracking-wider flex items-center gap-2">
              <span>Aura Two-View Live Sync Proof-of-Life</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <p className="text-xs text-[#594047] mt-0.5">
              Take an action in Customer Phone (left) or Staff Dashboard (right). Both views re-render live in real time!
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#b50060] bg-white px-4 py-1.5 rounded-full border border-[#e1bec6]">
          <span className="material-symbols-outlined text-sm text-[#b50060]">auto_awesome</span>
          <span>Instant Broadcast Sync</span>
        </div>
      </div>

      {/* Dual Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pane: Customer Mobile Phone Frame */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-md bg-[#fdf7ff] border-4 border-[#e8ddff] rounded-[40px] shadow-2xl p-4 sm:p-5 relative overflow-hidden">
            
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-[#ede4ff] rounded-b-xl mx-auto mb-4 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#fdf7ff] border border-[#e8ddff]"></div>
            </div>

            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e8ddff] mb-4 px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#b50060]">
                <span className="material-symbols-outlined text-base">smartphone</span>
                <span>Customer Mobile App</span>
              </div>
              <div className="text-[10px] text-[#594047] font-mono">9:41 AM</div>
            </div>

            {/* Customer View Component inside Phone frame */}
            <div className="max-h-[740px] overflow-y-auto pr-1 phone-scroll-area">
              <CustomerView store={store} />
            </div>

          </div>
        </div>

        {/* Right Pane: Staff Floor Dashboard */}
        <div className="lg:col-span-7">
          <div className="bg-[#fdf7ff] border-2 border-[#e8ddff] rounded-3xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e8ddff] mb-4 text-xs font-bold text-[#b50060]">
              <span className="material-symbols-outlined text-base">dashboard</span>
              <span>Front Desk & Artisan Floor Dashboard</span>
            </div>

            <StaffDashboard store={store} />
          </div>
        </div>

      </div>

    </div>
  );
}
