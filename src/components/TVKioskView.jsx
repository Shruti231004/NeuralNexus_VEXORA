import React from 'react';
import { SERVICES, STYLISTS } from '../services/store';

export default function TVKioskView({ store }) {
  const bookings = store.bookings || [];
  const inServiceBookings = bookings.filter(b => b.status === 'in-service');
  const waitingList = bookings.filter(b => b.status === 'waiting').sort((a, b) => (a.queueOrder || 0) - (b.queueOrder || 0));

  return (
    <div className="min-h-screen bg-[#1F1B18] text-[#FDF8F2] flex flex-col justify-between font-sans p-6 md:p-10">
      
      {/* 1. TOP BRANDING BAR */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D3532] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-serif font-bold text-2xl shadow-md">
            r
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#C1785A] uppercase tracking-[0.2em]">PARIS • HAUTE SALON</div>
            <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#FDF8F2] tracking-tight flex items-center gap-2">
              ROSE & ROGUE <span className="text-[#C1785A] font-normal italic">TV Lounge Board</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-full bg-[#2C2725] border border-[#3D3532] text-xs font-bold text-[#C1785A] flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A] animate-ping" />
            <span>LIVE CHAIR SYNC ACTIVE</span>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-[#8A8078] uppercase tracking-[0.08em] font-bold">Current Time</div>
            <div className="font-serif font-bold text-xl text-[#FDF8F2]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </header>

      {/* 2. MAIN TWO-COLUMN TV DISPLAY */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 flex-1 items-stretch">
        
        {/* LEFT COLUMN: CURRENTLY IN CHAIR (6 cols) */}
        <div className="lg:col-span-6 bg-[#2C2725] rounded-3xl border border-[#3D3532] p-6 md:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#3D3532] mb-6">
              <div className="flex items-center gap-3">
                <span className="text-[#C1785A] text-2xl">✂️</span>
                <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#FDF8F2]">
                  IN CHAIR NOW
                </h2>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-[#3D3532] text-[#C1785A] border border-[#3D3532] text-xs font-bold uppercase tracking-[0.08em]">
                {inServiceBookings.length} Active Suites
              </span>
            </div>

            <div className="space-y-4">
              {inServiceBookings.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#1F1B18] border border-[#3D3532] text-center text-[#8A8078]">
                  <span className="text-4xl mb-2 block">💺</span>
                  <p className="text-lg font-bold text-[#FDF8F2]">All styling chairs ready</p>
                  <p className="text-xs mt-1 text-[#8A8078]">Next waiting guest can enter Sanctuary Suite #1</p>
                </div>
              ) : (
                inServiceBookings.map((b) => {
                  const srv = SERVICES.find(s => s.id === b.serviceId);
                  const st = STYLISTS.find(s => s.id === b.stylistId);
                  return (
                    <div key={b.id} className="p-5 rounded-2xl bg-[#1F1B18] border border-[#C1785A]/50 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-4">
                        <img src={st?.avatar || STYLISTS[0].avatar} alt={st?.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#C1785A]" />
                        <div>
                          <div className="text-xs text-[#C1785A] font-bold uppercase tracking-[0.08em]">Suite • {st?.name}</div>
                          <h3 className="font-serif text-xl font-bold text-[#FDF8F2]">{b.customerName}</h3>
                          <div className="text-xs text-[#8A8078]">{srv?.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full bg-[#C1785A] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.08em] shadow">
                          IN SERVICE
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[#3D3532] text-xs text-[#8A8078] flex items-center justify-between">
            <span>Automated Chair Allocation System</span>
            <span className="font-bold text-[#C1785A]">Rose & Rogue Queue Engine v2.4</span>
          </div>
        </div>

        {/* RIGHT COLUMN: UPCOMING LOUNGE QUEUE (6 cols) */}
        <div className="lg:col-span-6 bg-[#2C2725] rounded-3xl border border-[#3D3532] p-6 md:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#3D3532] mb-6">
              <div className="flex items-center gap-3">
                <span className="text-[#C1785A] text-2xl">👑</span>
                <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#FDF8F2]">
                  LOUNGE QUEUE
                </h2>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-[#F0DCCF] text-[#C1785A] text-xs font-bold uppercase tracking-[0.08em]">
                {waitingList.length} Guests Waiting
              </span>
            </div>

            <div className="space-y-3">
              {waitingList.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#1F1B18] border border-[#3D3532] text-center text-[#8A8078]">
                  <p className="text-lg font-bold text-[#FDF8F2]">No guests currently waiting in lounge</p>
                  <p className="text-xs mt-1 text-[#8A8078]">Walk-in passes available at front concierge</p>
                </div>
              ) : (
                waitingList.map((b, index) => {
                  const srv = SERVICES.find(s => s.id === b.serviceId);
                  const st = STYLISTS.find(s => s.id === b.stylistId);
                  const isNextUp = index === 0;

                  return (
                    <div 
                      key={b.id} 
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isNextUp 
                          ? 'bg-[#1F1B18] border-[#C1785A] shadow-md ring-2 ring-[#C1785A]/30 scale-[1.01]' 
                          : 'bg-[#1F1B18]/60 border-[#3D3532]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-extrabold text-sm ${
                          isNextUp ? 'bg-[#C1785A] text-[#FAF6F0]' : 'bg-[#3D3532] text-[#8A8078]'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-serif font-bold text-base text-[#FDF8F2] flex items-center gap-2">
                            <span>{b.customerName}</span>
                            {isNextUp && (
                              <span className="px-2 py-0.5 rounded-full bg-[#F0DCCF] text-[#C1785A] text-[9px] font-bold uppercase tracking-[0.08em]">
                                NEXT UP
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#8A8078]">{srv?.name} • Artisan {st?.name}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-[#C1785A]">Est: ~{12 * (index + 1)} mins</div>
                        <div className="text-[10px] text-[#8A8078]">{b.slot}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[#3D3532] text-xs text-[#8A8078] flex items-center justify-between">
            <span>Scan QR code at reception to check in</span>
            <span className="font-bold text-[#C1785A]">Zero Waiting Anxiety</span>
          </div>
        </div>

      </main>

      {/* 3. BOTTOM MARQUEE TICKER */}
      <footer className="bg-[#2C2725] rounded-2xl p-4 border border-[#3D3532] text-xs text-[#FDF8F2] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#C1785A] text-[#FAF6F0] text-[10px] font-bold uppercase tracking-[0.08em]">
            ANNOUNCEMENT
          </span>
          <span className="truncate">
            Welcome to Rose & Rogue Haute Coiffure. Lock in your slot with ₹99 deposit and enjoy zero lounge waiting delay.
          </span>
        </div>

        <span className="font-mono text-[#C1785A] hidden md:inline font-bold">
          RUE DE LA PAIX • PARIS
        </span>
      </footer>

    </div>
  );
}
