import React, { useState } from 'react';
import { X, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RefundModal({ booking, onClose, onProcessRefund }) {
  const [customAmount, setCustomAmount] = useState(booking ? booking.amount : 0);
  const [reason, setReason] = useState('Customer dissatisfaction / salon service adjustment');

  if (!booking) return null;

  // Refund policy preview check
  const isCancelledBeforeCheckIn = booking.status === 'cancelled' && booking.refundStatus === 'full-refund';

  const handleSubmit = (e) => {
    e.preventDefault();
    onProcessRefund(booking.id, customAmount, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1E242C] border border-amber-600/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 bg-amber-950 border border-amber-700/50 rounded-xl flex items-center justify-center text-amber-400 mb-3">
          <RefreshCw className="w-5 h-5" />
        </div>
        <h3 className="font-serif text-xl font-bold text-white mb-1">Process Refund</h3>
        <p className="text-xs text-gray-400 mb-4">Log refund details and policy compliance for customer.</p>

        {/* Policy Rule Banner */}
        <div className="bg-amber-950/40 border border-amber-800/40 p-3 rounded-xl mb-4 text-xs text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Refund Policy Rule:</span>
            {isCancelledBeforeCheckIn ? (
              <span> Booking cancelled prior to check-in $\rightarrow$ 100% full refund eligible (${booking.amount}).</span>
            ) : (
              <span> Paid booking refund requested by staff $\rightarrow$ adjust amount below if partial.</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Refund Amount ($)</label>
            <input
              type="number"
              min="0"
              max={booking.amount}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-[#161A20] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm font-semibold"
              required
            />
            <div className="text-[11px] text-gray-400 mt-1">Original Paid Amount: ${booking.amount}</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Refund Reason / Audit Note</label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#161A20] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all mt-4"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Confirm & Issue ${customAmount} Refund</span>
          </button>
        </form>

      </div>
    </div>
  );
}
