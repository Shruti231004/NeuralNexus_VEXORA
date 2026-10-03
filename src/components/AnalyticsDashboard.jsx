import React from 'react';

export default function AnalyticsDashboard({ store }) {
  const bookings = store.bookings || [];
  const completedBookings = bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const avgRating = 4.98;

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pt-4 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] text-[#2C2725]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#F3EAE0] border border-[#EAE3DA] shadow-warm-soft">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0DCCF] text-[#C1785A] text-[11px] font-bold uppercase tracking-[0.08em] mb-1">
            <span>✦</span>
            <span>Business Intelligence & Predictions</span>
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-[#2C2725]">Salon Analytics Dashboard</h2>
          <p className="text-xs text-[#8A8078] mt-1">Real-time revenue metrics, capacity utilization, and waiting time benchmarks.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#EAE3DA] text-[#8A8078] text-xs font-bold">
            Today's Operating Benchmarks
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-3xl bg-[#EFE6DA] border border-[#EAE3DA] space-y-1 shadow-warm-soft">
          <div className="text-[10px] text-[#8A8078] font-bold uppercase tracking-[0.08em]">Total Gross Revenue</div>
          <div className="font-serif font-extrabold text-3xl text-[#C1785A]">₹{totalRevenue}</div>
          <div className="text-[11px] text-[#C1785A] font-bold">↑ +18% vs last week</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#EFE6DA] border border-[#EAE3DA] space-y-1 shadow-warm-soft">
          <div className="text-[10px] text-[#8A8078] font-bold uppercase tracking-[0.08em]">Rituals Completed</div>
          <div className="font-serif font-extrabold text-3xl text-[#2C2725]">{completedBookings.length}</div>
          <div className="text-[11px] text-[#8A8078]">Across 3 Active Artisans</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#EFE6DA] border border-[#EAE3DA] space-y-1 shadow-warm-soft">
          <div className="text-[10px] text-[#8A8078] font-bold uppercase tracking-[0.08em]">Average Guest Rating</div>
          <div className="font-serif font-extrabold text-3xl text-[#C1785A] flex items-center gap-1">
            <span>{avgRating}</span>
            <span className="text-xl">★</span>
          </div>
          <div className="text-[11px] text-[#8A8078]">99.2% Satisfaction Index</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#EFE6DA] border border-[#EAE3DA] space-y-1 shadow-warm-soft">
          <div className="text-[10px] text-[#8A8078] font-bold uppercase tracking-[0.08em]">Average Lounge Idle Time</div>
          <div className="font-serif font-extrabold text-3xl text-[#2C2725]">0 min</div>
          <div className="text-[11px] text-[#C1785A] font-bold">↓ -12m vs Industry Avg</div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Service Popularity */}
        <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#EAE3DA] space-y-4 shadow-warm-soft">
          <h3 className="font-serif text-xl font-extrabold text-[#2C2725]">Popular Service Distribution</h3>
          <div className="space-y-3">
            <ProgressBar label="Signature French Cut & Blow-Dry" percentage="42%" count="18 Completed" color="bg-[#C1785A]" />
            <ProgressBar label="Haute Couture Balayage & Glaze" percentage="34%" count="14 Completed" color="bg-[#A8613F]" />
            <ProgressBar label="Caviar & Peptide Restorative Spa" percentage="16%" count="7 Completed" color="bg-[#C1785A]/70" />
            <ProgressBar label="Executive Grooming & Beard Architecture" percentage="8%" count="3 Completed" color="bg-[#8A8078]" />
          </div>
        </div>

        {/* Operational Performance & Overlap Efficiency */}
        <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#EAE3DA] space-y-4 shadow-warm-soft">
          <h3 className="font-serif text-xl font-extrabold text-[#2C2725]">Queue Engine Optimization</h3>
          
          <div className="p-4 rounded-2xl bg-[#F3EAE0] border border-[#EAE3DA] space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#2C2725]">
              <span>Smart Overlap Capacity Utilization</span>
              <span className="text-[#C1785A]">88% Optimized</span>
            </div>
            <p className="text-xs text-[#8A8078]">
              Parallel wash and processing cycles saved <strong className="text-[#2C2725]">1.4 lounge chair hours</strong> today.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0DCCF] border border-[#EAE3DA] space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#C1785A]">
              <span>Deposit Retention & No-Show Rate</span>
              <span>0% No-Shows</span>
            </div>
            <p className="text-xs text-[#C1785A]/90">
              ₹99 Razorpay pre-deposit protocol reduced no-shows to 0% across all stations.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

function ProgressBar({ label, percentage, count, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold text-[#2C2725]">
        <span>{label}</span>
        <span className="text-[#8A8078]">{count} ({percentage})</span>
      </div>
      <div className="h-2 w-full bg-[#EAE3DA] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: percentage }} />
      </div>
    </div>
  );
}
