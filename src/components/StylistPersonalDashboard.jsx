import React, { useState } from 'react';
import { STYLISTS, SERVICES, useStylistDomain } from '../services/store';
import PaymentModal from './PaymentModal';
import RefundModal from './RefundModal';

export default function StylistPersonalDashboard({ staffId, store, onSwitchStaff }) {
  const { 
    myBookings, getNoShowCount, checkIn, startService, 
    completeService, processPayment, cancelBooking 
  } = useStylistDomain(store, staffId);

  const [paymentTargetBooking, setPaymentTargetBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stylist = STYLISTS.find(s => s.id === staffId);

  const filteredMyBookings = myBookings.filter(b => 
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.customerPhone.includes(searchQuery) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentClientInChair = myBookings.find(b => b.status === 'in-service');
  const nextWaitingGuest = myBookings
    .filter(b => b.status === 'waiting')
    .sort((a, b) => (a.queueOrder || 0) - (b.queueOrder || 0))[0];

  const myTotalBookings = myBookings.length;
  const myWaitingCount = myBookings.filter(b => b.status === 'waiting').length;
  const myCompletedCount = myBookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid').length;
  const myRevenue = myBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="max-w-[1360px] mx-auto w-full space-y-6 pt-4 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#f2eaff] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img src={stylist?.avatar} alt={stylist?.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-[#b50060]" />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#b50060] uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>Artisan Personal Workstation</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#1e1831]">
              {stylist?.name || 'Artisan Portal'}
            </h2>
            <p className="text-xs sm:text-sm text-[#594047]">
              {stylist?.role} • Viewing your personal appointments & sanctuary suite.
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchStaff}
          className="px-4 py-2 bg-[#f8f1ff] hover:bg-[#ede4ff] text-[#1e1831] border border-[#e8ddff] rounded-full text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm text-[#b50060]">logout</span>
          <span>Switch Artisan Profile</span>
        </button>
      </div>

      {/* Active Chair Monitor Card */}
      <div className="bg-white border border-[#b50060]/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#f2eaff] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#b50060] uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">spa</span>
            <span>My Active Sanctuary Suite #1 Monitor</span>
          </div>
          {currentClientInChair ? (
            <span className="px-3 py-1 rounded-full bg-[#efdbff] border border-[#974ce9]/50 text-[#7d2dce] text-xs font-bold animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7d2dce] animate-ping"></span>
              <span>Guest In Suite Now</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
              Suite Available
            </span>
          )}
        </div>

        {currentClientInChair ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 space-y-1">
              <div className="text-xs text-[#594047]">Current Guest</div>
              <div className="text-2xl font-headline font-bold text-[#1e1831] flex items-center gap-2">
                <span>{currentClientInChair.customerName}</span>
                <span className="text-xs font-body text-[#594047] font-normal">({currentClientInChair.customerPhone})</span>
              </div>
              <div className="text-xs text-[#b50060] font-medium">
                Ritual: {SERVICES.find(s => s.id === currentClientInChair.serviceId)?.name} (₹{currentClientInChair.amount})
              </div>
              <div className="text-[11px] text-[#594047]">Ritual Started At: {currentClientInChair.startedAt || 'Just Now'}</div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => completeService(currentClientInChair.id)}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-full shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Complete Ritual</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-base font-semibold text-[#1e1831]">No guest currently in your sanctuary suite.</div>
              <p className="text-xs text-[#594047]">
                {nextWaitingGuest 
                  ? `Next waiting in your line: ${nextWaitingGuest.customerName} (${nextWaitingGuest.slot})`
                  : 'No guests currently waiting in your line.'}
              </p>
            </div>

            {nextWaitingGuest && (
              <button
                onClick={() => startService(nextWaitingGuest.id)}
                className="px-5 py-2.5 bg-[#7d2dce] hover:bg-[#6600b7] text-white font-semibold text-xs sm:text-sm rounded-full shadow-lg flex items-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Call & Start Ritual for {nextWaitingGuest.customerName.split(' ')[0]}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="My Appointments" value={myTotalBookings} icon="person" color="text-[#3b82f6]" />
        <MetricCard title="My Waiting Line" value={myWaitingCount} icon="schedule" color="text-[#b50060]" pulse={myWaitingCount > 0} />
        <MetricCard title="Completed Today" value={myCompletedCount} icon="check_circle" color="text-emerald-600" />
        <MetricCard title="My Revenue" value={`₹${myRevenue}`} icon="payments" color="text-[#ae3115]" />
      </div>

      {/* Personal Queue Table */}
      <div className="bg-white rounded-3xl border border-[#f2eaff] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#f2eaff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8f1ff]">
          <div>
            <h3 className="font-headline text-lg font-bold text-[#1e1831] flex items-center gap-2">
              <span>My Personal Appointments & Queue</span>
              <span className="text-xs font-body text-[#b50060] bg-[#ffd9e2] px-3 py-0.5 rounded-full border border-[#db2379]/40">
                {stylist?.name}'s Schedule
              </span>
            </h3>
            <p className="text-xs text-[#594047]">Exclusive view of rituals assigned to you today.</p>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-[#594047] text-base">search</span>
            <input
              type="text"
              placeholder="Search my guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-[#e1bec6] text-xs text-[#1e1831] rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#b50060] w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8f1ff] text-[#594047] uppercase font-semibold text-[11px] tracking-wider border-b border-[#f2eaff]">
              <tr>
                <th className="py-3.5 px-4">Queue #</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Ritual</th>
                <th className="py-3.5 px-4">Time Slot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Bill Amount</th>
                <th className="py-3.5 px-4 text-right">My Suite Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2eaff]">
              {filteredMyBookings.length > 0 ? (
                filteredMyBookings.map((b) => {
                  const service = SERVICES.find(s => s.id === b.serviceId);
                  const noShowCount = getNoShowCount(b.customerPhone);

                  return (
                    <tr key={b.id} className="hover:bg-[#f8f1ff]/60 transition-colors">
                      
                      <td className="py-3.5 px-4 font-headline font-bold text-[#b50060]">
                        {b.status === 'waiting' ? `#${b.queueOrder}` : '-'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1e1831] flex items-center gap-1.5">
                          <span>{b.customerName}</span>
                          {noShowCount >= 2 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs text-rose-600">warning</span>
                              <span>{noShowCount} No-Shows</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#594047]">{b.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#1e1831]">{service?.name}</div>
                        <div className="text-xs text-[#594047]">{service?.duration}m</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#1e1831]">
                        {b.slot}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={b.status} />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-headline font-bold text-[#b50060]">₹{b.amount}</div>
                        <div className="text-[10px] text-[#594047]">{b.paymentStatus}</div>
                        {b.feedback && (
                          <div className="mt-1 text-[11px] text-[#ae3115] bg-[#ffdad2] border border-[#ae3115]/30 px-2 py-0.5 rounded-full font-medium">
                            {'⭐'.repeat(b.feedback.rating)} {b.feedback.rating}/5 • Tip: ₹{b.feedback.tip}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {b.status === 'booked' && (
                            <button
                              onClick={() => checkIn(b.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow"
                            >
                              Check In
                            </button>
                          )}

                          {b.status === 'waiting' && (
                            <button
                              onClick={() => startService(b.id)}
                              className="px-3 py-1 bg-[#7d2dce] hover:bg-[#6600b7] text-white rounded-full text-xs font-semibold shadow"
                            >
                              Start Ritual
                            </button>
                          )}

                          {b.status === 'in-service' && (
                            <button
                              onClick={() => completeService(b.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow"
                            >
                              Complete
                            </button>
                          )}

                          {b.status === 'completed' && b.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => setPaymentTargetBooking(b)}
                              className="px-3 py-1 bg-[#b50060] hover:bg-[#8e004a] text-white rounded-full text-xs font-semibold shadow"
                            >
                              Collect ₹{b.amount}
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-[#594047]">
                    No rituals assigned to {stylist?.name} today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paymentTargetBooking && (
        <PaymentModal
          booking={paymentTargetBooking}
          onClose={() => setPaymentTargetBooking(null)}
          onProcessPayment={processPayment}
        />
      )}

    </div>
  );
}

function MetricCard({ title, value, icon, color, pulse }) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-[#f2eaff] shadow-md">
      <div className="flex items-center justify-between text-xs text-[#594047] mb-1">
        <span>{title}</span>
        <span className={`material-symbols-outlined text-lg ${color}`}>{icon}</span>
      </div>
      <div className={`font-headline text-2xl font-bold text-[#1e1831] ${pulse ? 'animate-bounce' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let badgeStyle = 'bg-[#f8f1ff] text-[#594047] border-[#e8ddff]';
  let label = status;

  if (status === 'booked') badgeStyle = 'bg-blue-100 text-blue-800 border-blue-300';
  else if (status === 'waiting') badgeStyle = 'bg-[#ffd9e2] text-[#b50060] border-[#db2379]/40 animate-pulse';
  else if (status === 'in-service') badgeStyle = 'bg-[#efdbff] text-[#7d2dce] border-[#974ce9]/40 animate-pulse';
  else if (status === 'completed') badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  else if (status === 'cancelled') badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      {label}
    </span>
  );
}
