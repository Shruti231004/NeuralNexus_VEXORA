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
    <div className="max-w-7xl mx-auto w-full space-y-8 pt-4 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] text-[#2C2725]">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#F3EAE0] border border-[#EAE3DA]">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.08em] text-[#C1785A]">
            STAFF KIOSK & QUEUE MANAGER
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#2C2725] mt-1">
            Salon Floor Operations
          </h1>
          <p className="text-xs text-[#8A8078] mt-1">
            Real-time station control, chair rotation, and guest queue management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#EAE3DA] text-[#C1785A] text-xs font-bold">
            Live Floor Sync Active
          </span>
        </div>
      </div>

      {/* Top Metrics Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Bookings"
          value={metrics.totalBookingsToday}
          subtitle="Today's Appointments"
          icon="group"
          color="text-[#2C2725]"
        />

        <MetricCard
          title="Waiting Queue"
          value={metrics.waitingCount}
          subtitle="Guests Checked In"
          icon="schedule"
          color="text-[#C1785A]"
          pulse={metrics.waitingCount > 0}
        />

        <MetricCard
          title="In Suite"
          value={metrics.inServiceCount}
          subtitle="Currently in Chairs"
          icon="play_arrow"
          color="text-[#8C462C]"
          pulse={metrics.inServiceCount > 0}
        />

        <MetricCard
          title="Completed"
          value={metrics.completedCount}
          subtitle="Finished Rituals"
          icon="check_circle"
          color="text-[#C1785A]"
        />

        <MetricCard
          title="Revenue Collected"
          value={`₹${metrics.totalRevenue}`}
          subtitle="Settled Payments"
          icon="payments"
          color="text-[#2C2725]"
          highlight
        />
      </div>

      {/* Stylist Floor Activity Overview */}
      <div className="bg-[#EFE6DA] rounded-3xl p-6 border border-[#EAE3DA] space-y-4 shadow-warm-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#C1785A]">✦</span>
            <h3 className="font-serif text-lg font-extrabold text-[#2C2725]">Artisan Floor Activity</h3>
          </div>
          <span className="text-xs text-[#8A8078] font-semibold">3 Active Sanctuary Suites</span>
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
                className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] flex flex-col justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={stylist.avatar} 
                      alt={stylist.name} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#C1785A]"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#2C2725]">{stylist.name}</h4>
                      <span className="text-[10px] text-[#C1785A] font-bold block uppercase tracking-[0.08em]">{stylist.role}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] ${
                    currentClient ? 'bg-[#C1785A] text-[#FAF6F0]' : 'bg-[#F0DCCF] text-[#C1785A]'
                  }`}>
                    {currentClient ? 'BUSY IN CHAIR' : 'AVAILABLE'}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EAE3DA] text-xs">
                  {currentClient ? (
                    <div className="flex items-center justify-between text-[#2C2725]">
                      <span>In Chair: <strong>{currentClient.customerName}</strong></span>
                      <span className="text-[10px] text-[#C1785A] font-bold">Active</span>
                    </div>
                  ) : (
                    <span className="text-[#8A8078] italic">No active client in chair</span>
                  )}
                  <div className="mt-1 text-[11px] text-[#8A8078]">
                    Lounge Queue: <strong>{waitingForStylist} guests waiting</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Queue Management Section */}
      <div className="bg-[#FAF6F0] rounded-3xl p-6 border border-[#EAE3DA] space-y-6 shadow-warm-soft">
        
        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <h3 className="font-serif text-xl font-extrabold text-[#2C2725]">Guest Ledger</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F0DCCF] text-[#C1785A] text-xs font-bold">
              {filteredBookings.length}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search guest name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-[#FAF6F0] border border-[#EAE3DA] text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            {/* Status Filter Tabs */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-[#F3EAE0] border border-[#EAE3DA] text-xs font-bold text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
            >
              <option value="all">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="waiting">Waiting</option>
              <option value="in-service">In Chair</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#EAE3DA] bg-[#FAF6F0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3EAE0] border-b border-[#EAE3DA] text-[#8A8078] uppercase text-[10px] font-bold tracking-[0.08em]">
              <tr>
                <th className="p-4">Pass ID / Guest</th>
                <th className="p-4">Service Ritual</th>
                <th className="p-4">Artisan</th>
                <th className="p-4">Slot Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3DA]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#8A8078] italic">
                    No guest passes found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const service = SERVICES.find(s => s.id === b.serviceId);
                  const stylist = STYLISTS.find(s => s.id === b.stylistId);

                  return (
                    <tr key={b.id} className="hover:bg-[#F3EAE0]/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#2C2725]">{b.customerName}</div>
                        <div className="text-[10px] text-[#8A8078] font-mono">{b.id} • {b.customerPhone}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-[#2C2725]">{service?.name || b.serviceId}</div>
                        <div className="text-[10px] text-[#8A8078]">₹{service?.price} • {service?.duration}m</div>
                      </td>

                      <td className="p-4 font-semibold text-[#C1785A]">
                        {stylist?.name || b.stylistId}
                      </td>

                      <td className="p-4 font-bold text-[#2C2725]">
                        {b.slot}
                      </td>

                      <td className="p-4">
                        <StatusBadge status={b.status} />
                      </td>

                      <td className="p-4 text-right space-x-2">
                        {b.status === 'booked' && (
                          <button
                            onClick={() => checkIn(b.id)}
                            className="px-3 py-1.5 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-[10px] font-bold uppercase tracking-[0.08em]"
                          >
                            Check In
                          </button>
                        )}

                        {b.status === 'waiting' && (
                          <button
                            onClick={() => startService(b.id)}
                            className="px-3 py-1.5 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-[10px] font-bold uppercase tracking-[0.08em]"
                          >
                            Start Chair
                          </button>
                        )}

                        {b.status === 'in-service' && (
                          <button
                            onClick={() => setPaymentTargetBooking(b)}
                            className="px-3 py-1.5 rounded-full bg-[#2C2725] hover:bg-[#3D3532] text-[#FDF8F2] text-[10px] font-bold uppercase tracking-[0.08em]"
                          >
                            Settle & Complete
                          </button>
                        )}

                        {b.status === 'completed' && (
                          <button
                            onClick={() => setRefundTargetBooking(b)}
                            className="px-3 py-1.5 rounded-full bg-[#F0DCCF] text-[#C1785A] text-[10px] font-bold uppercase tracking-[0.08em]"
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {paymentTargetBooking && (
        <PaymentModal
          booking={paymentTargetBooking}
          onClose={() => setPaymentTargetBooking(null)}
          onComplete={completeService}
          onProcessPayment={processPayment}
        />
      )}

      {refundTargetBooking && (
        <RefundModal
          booking={refundTargetBooking}
          onClose={() => setRefundTargetBooking(null)}
          onRefund={processRefund}
        />
      )}

    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color, pulse, highlight }) {
  return (
    <div className={`p-5 rounded-3xl border transition-all ${
      highlight 
        ? 'bg-[#F3EAE0] border-[#C1785A] shadow-warm-soft' 
        : 'bg-[#FAF6F0] border-[#EAE3DA]'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8A8078]">{title}</span>
        <span className={`material-symbols-outlined text-lg ${color}`}>{icon}</span>
      </div>
      <div className="mt-2 font-serif text-2xl font-extrabold text-[#2C2725] flex items-center gap-1.5">
        <span>{value}</span>
        {pulse && <span className="w-2 h-2 rounded-full bg-[#C1785A] animate-pulse" />}
      </div>
      <p className="text-[10px] text-[#8A8078] mt-1 font-semibold">{subtitle}</p>
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
