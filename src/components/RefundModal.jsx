import React, { useState } from 'react';

export default function RefundModal({ booking, onClose, onProcessRefund, onRefund }) {
  const [customAmount, setCustomAmount] = useState(booking ? booking.amount : 0);
  const [reason, setReason] = useState('Customer dissatisfaction / salon service adjustment');

  if (!booking) return null;

  const isCancelledBeforeCheckIn = booking.status === 'cancelled' && booking.refundStatus === 'full-refund';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onProcessRefund) {
      onProcessRefund(booking.id, customAmount, reason);
    } else if (onRefund) {
      onRefund(booking.id, customAmount, reason);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B18]/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-warm-lg relative text-[#2C2725]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A8078] hover:text-[#2C2725] p-1.5 rounded-full bg-[#F3EAE0] font-bold transition-colors"
        >
          ✕
        </button>

        <div className="w-10 h-10 bg-[#F0DCCF] border border-[#EAE3DA] rounded-full flex items-center justify-center text-[#C1785A] text-lg font-bold mb-3">
          ↩️
        </div>
        <h3 className="font-serif text-xl font-extrabold text-[#2C2725] mb-1">Process Salon Refund</h3>
        <p className="text-xs text-[#8A8078] mb-4">Log refund details and policy compliance for guest pass.</p>

        {/* Policy Rule Banner */}
        <div className="bg-[#F3EAE0] border border-[#EAE3DA] p-3.5 rounded-2xl mb-4 text-xs text-[#2C2725] space-y-1">
          <div className="font-bold text-[#C1785A]">Rose & Rogue Refund Policy Compliance:</div>
          {isCancelledBeforeCheckIn ? (
            <p className="text-[#8A8078]">Booking cancelled prior to check-in $\rightarrow$ 100% full refund eligible (₹{booking.amount}).</p>
          ) : (
            <p className="text-[#8A8078]">Paid booking refund requested by staff $\rightarrow$ adjust amount below if partial.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#8A8078] uppercase tracking-[0.08em] mb-1">Refund Amount (₹)</label>
            <input
              type="number"
              min="0"
              max={booking.amount}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-[#F3EAE0] border border-[#EAE3DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2C2725] font-bold focus:outline-none focus:border-[#C1785A]"
              required
            />
            <div className="text-[10px] text-[#8A8078] mt-1">Original Paid Amount: ₹{booking.amount}</div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8A8078] uppercase tracking-[0.08em] mb-1">Refund Reason / Audit Note</label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#F3EAE0] border border-[#EAE3DA] rounded-2xl px-4 py-2.5 text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] font-bold text-xs uppercase tracking-[0.08em] shadow-md transition-all mt-4"
          >
            <span>Confirm & Issue ₹{customAmount} Refund</span>
          </button>
        </form>

      </div>
    </div>
  );
}
