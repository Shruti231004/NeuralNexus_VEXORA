import React, { useState } from 'react';

export default function RazorpayModal({ 
  isOpen, 
  amount = 99, 
  customerName = 'Aarav Mehta', 
  customerPhone = '+1 555-0101', 
  booking, 
  onClose, 
  onSuccess 
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const payAmount = booking ? booking.amount : amount;
  const payName = booking ? booking.customerName : customerName;
  const payPhone = booking ? booking.customerPhone : customerPhone;

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (onSuccess) onSuccess(selectedMethod.toUpperCase());
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B18]/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-[#2C2725] shadow-warm-lg space-y-6 relative overflow-hidden">
        
        {/* Razorpay Brand Top Ribbon */}
        <div className="flex items-center justify-between border-b border-[#EAE3DA] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-bold shadow-sm text-lg">
              💳
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#C1785A] uppercase tracking-[0.08em]">Razorpay 100% Secure Checkout</div>
              <h3 className="font-serif font-extrabold text-xl text-[#2C2725]">₹{payAmount} Pre-Deposit Token Settlement</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3EAE0] text-[#8A8078] hover:text-[#2C2725] flex items-center justify-center transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Bill Summary Box */}
        <div className="p-4 rounded-2xl bg-[#F3EAE0] border border-[#EAE3DA] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8A8078]">Guest Reservation</div>
            <div className="font-serif font-bold text-base text-[#2C2725]">{payName}</div>
            <div className="text-xs text-[#C1785A] font-bold mt-0.5">{payPhone}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#8A8078]">Deposit Amount</div>
            <div className="font-serif font-extrabold text-2xl text-[#C1785A]">₹{payAmount}</div>
          </div>
        </div>

        {/* Payment Options (UPI QR / Netbanking / Card) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#2C2725] uppercase tracking-[0.08em]">Select Payment Option</label>
          <div className="grid grid-cols-3 gap-3">
            
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                selectedMethod === 'upi'
                  ? 'bg-[#F0DCCF] border-[#C1785A] text-[#C1785A] font-bold shadow-sm'
                  : 'bg-[#F3EAE0] border-[#EAE3DA] text-[#8A8078] hover:text-[#2C2725]'
              }`}
            >
              <span className="text-lg">📲</span>
              <span className="text-xs">UPI / GPay</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                selectedMethod === 'card'
                  ? 'bg-[#F0DCCF] border-[#C1785A] text-[#C1785A] font-bold shadow-sm'
                  : 'bg-[#F3EAE0] border-[#EAE3DA] text-[#8A8078] hover:text-[#2C2725]'
              }`}
            >
              <span className="text-lg">💳</span>
              <span className="text-xs">Credit/Debit</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                selectedMethod === 'netbanking'
                  ? 'bg-[#F0DCCF] border-[#C1785A] text-[#C1785A] font-bold shadow-sm'
                  : 'bg-[#F3EAE0] border-[#EAE3DA] text-[#8A8078] hover:text-[#2C2725]'
              }`}
            >
              <span className="text-lg">🏛️</span>
              <span className="text-xs">NetBanking</span>
            </button>

          </div>
        </div>

        {/* UPI QR Code Preview if UPI selected */}
        {selectedMethod === 'upi' && (
          <div className="p-4 rounded-2xl bg-[#EFE6DA] border border-[#EAE3DA] flex items-center justify-between gap-4">
            <div className="w-24 h-24 bg-[#FAF6F0] p-1.5 rounded-xl border border-[#EAE3DA] shrink-0 flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=roseandrogue@razorpay&pn=RoseAndRogueSalon&am=${payAmount}&cu=INR`}
                alt="UPI Razorpay QR"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 text-xs space-y-1">
              <div className="font-bold text-[#2C2725]">Scan with Google Pay / PhonePe / Paytm</div>
              <p className="text-[#8A8078]">VPA: <strong className="text-[#2C2725]">roseandrogue.salon@razorpay</strong></p>
              <p className="text-[#C1785A] font-bold">✓ 100% Credited on Final Bill</p>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full py-4 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] font-bold text-xs uppercase tracking-[0.08em] shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Processing Razorpay Settlement...</span>
            </div>
          ) : (
            <>
              <span>Confirm & Lock Slot (₹{payAmount})</span>
              <span>→</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
