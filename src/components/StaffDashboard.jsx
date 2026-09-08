import React, { useState } from 'react';
import { SERVICES, STYLISTS, useAdminDomain } from '../services/store';
import PaymentModal from './PaymentModal';
import RefundModal from './RefundModal';

export default function StaffDashboard({ store }) {
  const { 
    bookings, metrics, getNoShowCount, checkIn, startService, 
    completeService, processPayment, cancelBooking, processRefund, 
    markNoShow, bumpQueueUp 
  } = useAdminDomain(store);

  const [paymentTargetBooking, setPaymentTargetBooking] = useState(null);
  const [refundTargetBooking, setRefundTargetBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1360px] mx-auto w-full space-y-6 pt-4 pb-12">
      
      {/* Top Metrics Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <MetricCard
          title="Total Bookings"
          value={metrics.totalBookingsToday}
          subtitle="Today's Appointments"
          icon="group"
          color="text-[#3b82f6]"
        />

        <MetricCard
          title="Waiting Queue"
          value={metrics.waitingCount}
          subtitle="Guests Checked In"
          icon="schedule"
          color="text-[#b50060]"
          pulse={metrics.waitingCount > 0}
        />

        <MetricCard
          title="In Suite"
          value={metrics.inServiceCount}
          subtitle="Currently in Chairs"
          icon="play_arrow"
          color="text-[#7d2dce]"
          pulse={metrics.inServiceCount > 0}
        />

        <MetricCard
          title="Completed"
          value={metrics.completedCount}
          subtitle="Finished Rituals"
          icon="check_circle"
          color="text-emerald-600"
        />

        <MetricCard
          title="Revenue Collected"
          value={`₹${metrics.totalRevenue}`}
          subtitle="Settled Payments"
          icon="payments"
          color="text-[#ae3115]"
          highlight
        />

      </div>

      {/* Stylist Floor Activity Overview */}
      <div className="bg-white rounded-3xl p-6 border border-[#f2eaff] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b50060]">auto_awesome</span>
            <h3 className="font-headline text-lg font-bold text-[#1e1831]">Artisan Floor Activity</h3>
          </div>
          <span className="text-xs text-[#594047]">3 Active Sanctuary Suites</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STYLISTS.map((stylist) => {
            const currentClient = bookings.find(
              b => b.stylistId === stylist.id && b.status === 'in-service'
            );
            const waitingForStylist = bookings.filter(
              b => b.stylistId === stylist.id && b.status === 'waiting'
            ).length;

            return (
              <div 
                key={stylist.id} 
                className="bg-[#f8f1ff] p-4 rounded-2xl border border-[#e8ddff] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={stylist.avatar} alt={stylist.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-[#b50060]/40" />
                  <div>
                    <div className="text-sm font-bold text-[#1e1831]">{stylist.name}</div>
                    <div className="text-xs text-[#ae3115]">{stylist.role}</div>
                  </div>
                </div>

                <div className="text-right">
                  {currentClient ? (
                    <div className="text-xs font-semibold text-[#7d2dce] bg-[#efdbff] border border-[#974ce9]/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#7d2dce] animate-ping"></span>
                      <span>With {currentClient.customerName.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <div className="text-xs font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                      Suite Available
                    </div>
                  )}
                  <div className="text-[11px] text-[#594047] mt-1">
                    {waitingForStylist} waiting in line
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Real-Time Queue & Bookings Control Table */}
      <div className="bg-white rounded-3xl border border-[#f2eaff] overflow-hidden shadow-xl">
        
        {/* Table Filter Controls Header */}
        <div className="p-5 border-b border-[#f2eaff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8f1ff]">
          <div>
            <h3 className="font-headline text-lg font-bold text-[#1e1831] flex items-center gap-2">
              <span>Live Queue & Operational Floor</span>
              <span className="text-xs font-body font-normal text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Live Auto-Sync
              </span>
            </h3>
            <p className="text-xs text-[#594047]">Execute status transitions, record payments, and manage sanctuary queue order.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2 text-[#594047] text-base">search</span>
              <input
                type="text"
                placeholder="Search guest or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-[#e1bec6] text-xs text-[#1e1831] rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#b50060] w-48"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[#ede4ff] p-1 rounded-full text-xs">
              {['all', 'waiting', 'in-service', 'booked', 'completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full font-medium capitalize transition-all ${
                    statusFilter === st 
                      ? 'bg-[#b50060] text-white font-semibold shadow' 
                      : 'text-[#594047] hover:text-[#1e1831]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8f1ff] text-[#594047] uppercase font-semibold text-[11px] tracking-wider border-b border-[#f2eaff]">
              <tr>
                <th className="py-3.5 px-4">Queue #</th>
                <th className="py-3.5 px-4">Guest</th>
                <th className="py-3.5 px-4">Ritual & Artisan</th>
                <th className="py-3.5 px-4">Slot / Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Amount / Payment</th>
                <th className="py-3.5 px-4 text-right">Floor Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2eaff]">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const service = SERVICES.find(s => s.id === b.serviceId);
                  const stylist = STYLISTS.find(s => s.id === b.stylistId);
                  const noShowCount = getNoShowCount(b.customerPhone);

                  return (
                    <tr key={b.id} className="hover:bg-[#f8f1ff]/60 transition-colors">
                      
                      {/* Queue # */}
                      <td className="py-3.5 px-4 font-headline font-bold text-base text-[#b50060]">
                        {b.status === 'waiting' ? `#${b.queueOrder}` : '-'}
                      </td>

                      {/* Customer Info & No-Show Warning Badge */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1e1831] flex items-center gap-1.5">
                          <span>{b.customerName}</span>
                          {noShowCount >= 2 && (
                            <span 
                              className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold flex items-center gap-1"
                              title={`Warning: Customer has ${noShowCount} recorded prior no-shows!`}
                            >
                              <span className="material-symbols-outlined text-xs text-rose-600">warning</span>
                              <span>{noShowCount} No-Shows</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#594047]">{b.customerPhone}</div>
                      </td>

                      {/* Service & Stylist */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#1e1831]">{service?.name || 'Ritual'}</div>
                        <div className="text-xs text-[#ae3115]">{stylist?.name} • {service?.duration}m</div>
                      </td>

                      {/* Slot / Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1e1831]">{b.slot}</div>
                        {b.checkedInAt && (
                          <div className="text-[11px] text-emerald-700">Checked in {b.checkedInAt}</div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={b.status} />
                      </td>

                      {/* Amount & Payment */}
                      <td className="py-3.5 px-4">
                        <div className="font-headline font-bold text-[#b50060] text-base">₹{b.amount}</div>
                        {b.paymentStatus === 'paid' ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                            PAID ({b.paymentMethod})
                          </span>
                        ) : b.paymentStatus === 'refunded' ? (
                          <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-semibold">
                            REFUNDED (₹{b.refundAmount})
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#f8f1ff] text-[#594047] px-2 py-0.5 rounded-full">
                            Pending Bill
                          </span>
                        )}
                        {b.feedback && (
                          <div className="mt-1 text-[11px] text-[#ae3115] bg-[#ffdad2] border border-[#ae3115]/30 px-2 py-0.5 rounded-full font-medium">
                            {'⭐'.repeat(b.feedback.rating)} {b.feedback.rating}/5 • Tip: ₹{b.feedback.tip}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
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
                            <>
                              <button
                                onClick={() => startService(b.id)}
                                className="px-3 py-1 bg-[#7d2dce] hover:bg-[#6600b7] text-white rounded-full text-xs font-semibold shadow"
                              >
                                Start Ritual
                              </button>

                              <button
                                onClick={() => bumpQueueUp(b.id)}
                                className="p-1.5 bg-[#f8f1ff] hover:bg-[#ede4ff] text-[#b50060] border border-[#b50060]/30 rounded-full text-xs transition-all"
                                title="Bump customer up ahead in waiting queue"
                              >
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                              </button>

                              <button
                                onClick={() => markNoShow(b.id)}
                                className="px-2.5 py-1 bg-[#f8f1ff] hover:bg-rose-100 text-[#594047] hover:text-rose-800 border border-[#e8ddff] rounded-full text-xs font-medium transition-all"
                                title="Mark No-Show"
                              >
                                No-Show
                              </button>
                            </>
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
                              Record Payment
                            </button>
                          )}

                          {(b.paymentStatus === 'paid' || b.status === 'cancelled') && b.paymentStatus !== 'refunded' && (
                            <button
                              onClick={() => setRefundTargetBooking(b)}
                              className="px-2.5 py-1 bg-[#f8f1ff] hover:bg-[#ede4ff] text-[#594047] hover:text-[#1e1831] border border-[#e8ddff] rounded-full text-xs font-medium transition-all"
                            >
                              Refund
                            </button>
                          )}

                          {['booked', 'waiting'].includes(b.status) && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Cancel booking for ${b.customerName}?`)) {
                                  cancelBooking(b.id, 'Staff cancelled booking');
                                }
                              }}
                              className="p-1 text-[#594047] hover:text-rose-600 rounded-full transition-all"
                              title="Cancel Booking"
                            >
                              <span className="material-symbols-outlined text-base">cancel</span>
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
                    No bookings found matching filters.
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

      {refundTargetBooking && (
        <RefundModal
          booking={refundTargetBooking}
          onClose={() => setRefundTargetBooking(null)}
          onProcessRefund={processRefund}
        />
      )}

    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color, pulse, highlight }) {
  return (
    <div className="motion-card animate-fade-in-up bg-white rounded-3xl p-5 border border-[#f2eaff] shadow-lg relative overflow-hidden transition-all hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#594047]">{title}</span>
        <div className="p-2 bg-[#f8f1ff] rounded-xl border border-[#e8ddff]">
          <span className={`material-symbols-outlined text-lg ${color}`}>{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className={`font-headline text-2xl sm:text-3xl font-bold text-[#1e1831] tracking-tight ${pulse ? 'animate-bounce' : ''}`}>
          {value}
        </div>
      </div>
      <div className="text-[11px] text-[#594047] mt-1">{subtitle}</div>
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
  else if (status === 'no-show') badgeStyle = 'bg-gray-100 text-rose-800 border-rose-300';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      {label}
    </span>
  );
}
