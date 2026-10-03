import React from 'react';
import CustomerView from './CustomerView';
import StaffDashboard from './StaffDashboard';

export default function SplitDemoView({ store }) {
  return (
    <div className="w-full space-y-6 pt-4 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] text-[#2C2725]">
      
      {/* Proof-of-life banner */}
      <div className="bg-[#F3EAE0] border border-[#EAE3DA] p-4 rounded-3xl flex items-center justify-between shadow-warm-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-bold shrink-0 shadow-sm">
            <span>⚡</span>
          </div>
          <div>
            <div className="text-xs font-bold text-[#C1785A] uppercase tracking-[0.08em] flex items-center gap-2">
              <span>Rose & Rogue Real-Time Live Sync Proof-of-Life</span>
              <span className="w-2 h-2 rounded-full bg-[#C1785A] animate-ping" />
            </div>
            <p className="text-xs text-[#8A8078] mt-0.5">
              Take an action in Customer View (left) or Staff Kiosk (right). Both views re-render live in real time!
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-[#C1785A] bg-[#FAF6F0] px-4 py-1.5 rounded-full border border-[#EAE3DA]">
          <span>✦</span>
          <span>Instant Broadcast Sync</span>
        </div>
      </div>

      {/* Dual Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pane: Customer Mobile Phone Frame */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-md bg-[#FAF6F0] border-4 border-[#EAE3DA] rounded-[40px] shadow-warm-lg p-4 sm:p-5 relative overflow-hidden">
            
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-[#F3EAE0] rounded-b-xl mx-auto mb-4 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#FAF6F0] border border-[#EAE3DA]" />
            </div>

            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA] mb-4 px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#C1785A]">
                <span>📱</span>
                <span>Customer Mobile App</span>
              </div>
              <div className="text-[10px] text-[#8A8078] font-mono">9:41 AM</div>
            </div>

            {/* Customer View Component inside Phone frame */}
            <div className="max-h-[740px] overflow-y-auto pr-1">
              <CustomerView store={store} />
            </div>

          </div>
        </div>

        {/* Right Pane: Staff Kiosk Workstation */}
        <div className="lg:col-span-7">
          <div className="w-full bg-[#FAF6F0] border-4 border-[#EAE3DA] rounded-[32px] shadow-warm-lg p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA] mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C1785A]">
                <span>✂️</span>
                <span>Stylist & Manager Kiosk Workstation</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#8A8078] tracking-[0.08em] bg-[#F0DCCF] px-3 py-1 rounded-full">
                Floor Admin Mode
              </span>
            </div>

            <div className="max-h-[740px] overflow-y-auto">
              <StaffDashboard store={store} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
