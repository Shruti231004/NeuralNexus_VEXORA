import React, { useState } from 'react';
import { X, CreditCard, Banknote, QrCode, CheckCircle2 } from 'lucide-react';
import { SERVICES } from '../services/store';

export default function PaymentModal({ booking, onClose, onProcessPayment }) {
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  if (!booking) return null;

  const service = SERVICES.find(s => s.id === booking.serviceId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onProcessPayment(booking.id, selectedMethod);
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

        <h3 className="font-serif text-xl font-bold text-white mb-1">Record Payment</h3>
        <p className="text-xs text-gray-400 mb-4">Complete bill settlement for customer booking.</p>

        {/* Bill Summary Box */}
        <div className="bg-[#161A20] p-4 rounded-xl border border-gray-800 mb-5 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-semibold text-white">{booking.customerName}</div>
              <div className="text-xs text-gray-400">{service ? service.name : 'Salon Service'}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-serif font-bold text-amber-400">₹{booking.amount}</div>
              <div className="text-[11px] text-emerald-400 font-medium">Bill Ready</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'UPI'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-[#161A20] border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-medium">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Card')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'Card'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-[#161A20] border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-medium">Card POS</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Cash')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'Cash'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-[#161A20] border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-medium">Cash</span>
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all mt-6"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Mark Paid (₹{booking.amount} via {selectedMethod})</span>
          </button>
        </form>

      </div>
    </div>
  );
}
