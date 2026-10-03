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
    <div className="max-w-7xl mx-auto w-full space-y-8 pt-4 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] text-[#2C2725]">
      
      {/* Header Banner */}
      <div className="bg-[#F3EAE0] rounded-3xl p-6 border border-[#EAE3DA] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-warm-soft">
        <div className="flex items-center gap-4">
          <img src={stylist?.avatar} alt={stylist?.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#C1785A]" />
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#C1785A] uppercase tracking-[0.08em]">
              <span>✦</span>
              <span>Artisan Personal Workstation</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725]">
              {stylist?.name || 'Artisan Portal'}
            </h2>
            <p className="text-xs text-[#8A8078] mt-0.5">
              {stylist?.role} • Viewing your personal appointments & sanctuary suite.
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchStaff}
          className="px-4 py-2 bg-[#FAF6F0] hover:bg-[#EFE6DA] text-[#2C2725] border border-[#EAE3DA] rounded-full text-xs font-bold uppercase tracking-[0.08em] flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <span className="text-[#C1785A]">⇄</span>
          <span>Switch Artisan Profile</span>
        </button>
      </div>

      {/* Active Chair Monitor Card */}
      <div className="bg-[#EFE6DA] border border-[#EAE3DA] rounded-3xl p-6 shadow-warm-soft space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE3DA] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C1785A] uppercase tracking-[0.08em]">
            <span>✦</span>
            <span>My Active Sanctuary Suite #1 Monitor</span>
          </div>
          {currentClientInChair ? (
            <span className="px-3 py-1 rounded-full bg-[#C1785A] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.08em] flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FAF6F0] animate-ping" />
              <span>Guest In Suite Now</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[#F0DCCF] border border-[#EAE3DA] text-[#C1785A] text-xs font-bold uppercase tracking-[0.08em]">
              Suite Available
            </span>
          )}
        </div>

        {currentClientInChair ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 space-y-1">
              <div className="text-xs text-[#8A8078]">Current Guest</div>
              <div className="text-2xl font-serif font-extrabold text-[#2C2725] flex items-center gap-2">
                <span>{currentClientInChair.customerName}</span>
                <span className="text-xs font-sans text-[#8A8078] font-normal">({currentClientInChair.customerPhone})</span>
              </div>
              <div className="text-xs text-[#C1785A] font-bold">
                Ritual: {SERVICES.find(s => s.id === currentClientInChair.serviceId)?.name} (₹{currentClientInChair.amount})
              </div>
              <div className="text-[11px] text-[#8A8078]">Ritual Started At: {currentClientInChair.startedAt || 'Just Now'}</div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => completeService(currentClientInChair.id)}
                className="w-full sm:w-auto px-6 py-3 bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] font-bold text-xs uppercase tracking-[0.08em] rounded-full shadow-md transition-all"
              >
                <span>Complete Ritual</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-base font-bold text-[#2C2725]">No guest currently in your sanctuary suite.</div>
              <p className="text-xs text-[#8A8078]">
                {nextWaitingGuest 
                  ? `Next waiting in your line: ${nextWaitingGuest.customerName} (${nextWaitingGuest.slot})`
                  : 'No guests currently waiting in your line.'}
              </p>
            </div>

            {nextWaitingGuest && (
              <button
                onClick={() => startService(nextWaitingGuest.id)}
                className="px-5 py-2.5 bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] font-bold text-xs uppercase tracking-[0.08em] rounded-full shadow-md transition-all"
              >
                <span>Call & Start Ritual for {nextWaitingGuest.customerName.split(' ')[0]}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="My Appointments" value={myTotalBookings} icon="person" color="text-[#2C2725]" />
        <MetricCard title="My Waiting Line" value={myWaitingCount} icon="schedule" color="text-[#C1785A]" pulse={myWaitingCount > 0} />
        <MetricCard title="Completed Today" value={myCompletedCount} icon="check_circle" color="text-[#C1785A]" />
        <MetricCard title="My Revenue" value={`₹${myRevenue}`} icon="payments" color="text-[#2C2725]" />
      </div>

      {/* Personal Queue Table */}
      <div className="bg-[#FAF6F0] rounded-3xl border border-[#EAE3DA] overflow-hidden shadow-warm-soft">
        <div className="p-4 border-b border-[#EAE3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F3EAE0]">
          <div>
            <h3 className="font-serif text-lg font-extrabold text-[#2C2725] flex items-center gap-2">
              <span>My Personal Appointments & Queue</span>
              <span className="text-xs font-sans text-[#C1785A] bg-[#F0DCCF] px-3 py-0.5 rounded-full font-bold">
                {stylist?.name}'s Schedule
              </span>
            </h3>
            <p className="text-xs text-[#8A8078]">Exclusive view of rituals assigned to you today.</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search my guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FAF6F0] border border-[#EAE3DA] text-xs text-[#2C2725] rounded-full px-4 py-1.5 focus:outline-none focus:border-[#C1785A] w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3EAE0] text-[#8A8078] uppercase font-bold text-[10px] tracking-[0.08em] border-b border-[#EAE3DA]">
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
            <tbody className="divide-y divide-[#EAE3DA]">
              {filteredMyBookings.length > 0 ? (
                filteredMyBookings.map((b) => {
                  const service = SERVICES.find(s => s.id === b.serviceId);
                  const noShowCount = getNoShowCount(b.customerPhone);

                  return (
                    <tr key={b.id} className="hover:bg-[#F3EAE0]/50 transition-colors">
                      
                      <td className="py-3.5 px-4 font-serif font-bold text-[#C1785A]">
                        {b.status === 'waiting' ? `#${b.queueOrder}` : '-'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#2C2725] flex items-center gap-1.5">
                          <span>{b.customerName}</span>
                          {noShowCount >= 2 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#F0DCCF] text-[#C1785A] text-[10px] font-bold">
                              {noShowCount} No-Shows
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#8A8078]">{b.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#2C2725]">{service?.name}</div>
                        <div className="text-[10px] text-[#8A8078]">{service?.duration}m</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#2C2725]">
                        {b.slot}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={b.status} />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-serif font-bold text-[#C1785A]">₹{b.amount}</div>
                        <div className="text-[10px] text-[#8A8078]">{b.paymentStatus}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {b.status === 'booked' && (
                            <button
                              onClick={() => checkIn(b.id)}
                              className="px-3 py-1 bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] rounded-full text-[10px] font-bold uppercase tracking-[0.08em]"
                            >
                              Check In
                            </button>
                          )}

                          {b.status === 'waiting' && (
                            <button
                              onClick={() => startService(b.id)}
                              className="px-3 py-1 bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] rounded-full text-[10px] font-bold uppercase tracking-[0.08em]"
                            >
                              Start Ritual
                            </button>
                          )}

                          {b.status === 'in-service' && (
                            <button
                              onClick={() => completeService(b.id)}
                              className="px-3 py-1 bg-[#2C2725] hover:bg-[#3D3532] text-[#FDF8F2] rounded-full text-[10px] font-bold uppercase tracking-[0.08em]"
                            >
                              Complete
                            </button>
                          )}

                          {b.status === 'completed' && b.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => setPaymentTargetBooking(b)}
                              className="px-3 py-1 bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] rounded-full text-[10px] font-bold uppercase tracking-[0.08em]"
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
                  <td colSpan="7" className="py-8 text-center text-[#8A8078] italic">
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
    <div className="bg-[#FAF6F0] p-4 rounded-3xl border border-[#EAE3DA]">
      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#8A8078] mb-1 tracking-[0.08em]">
        <span>{title}</span>
        <span className={`material-symbols-outlined text-base ${color}`}>{icon}</span>
      </div>
      <div className={`font-serif text-2xl font-extrabold text-[#2C2725] ${pulse ? 'animate-bounce' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let badgeStyle = 'bg-[#F3EAE0] text-[#8A8078] border-[#EAE3DA]';
  let label = status.toUpperCase();

  if (status === 'booked') badgeStyle = 'bg-[#FAF6F0] text-[#2C2725] border-[#EAE3DA]';
  else if (status === 'waiting') badgeStyle = 'bg-[#F0DCCF] text-[#C1785A] border-[#EAE3DA] animate-pulse';
  else if (status === 'in-service') badgeStyle = 'bg-[#C1785A] text-[#FAF6F0] border-[#C1785A] animate-pulse';
  else if (status === 'completed') badgeStyle = 'bg-[#F3EAE0] text-[#2C2725] border-[#EAE3DA]';
  else if (status === 'cancelled') badgeStyle = 'bg-[#F3EAE0] text-[#8A8078] border-[#EAE3DA]';

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] border ${badgeStyle}`}>
      {label}
    </span>
  );
}
