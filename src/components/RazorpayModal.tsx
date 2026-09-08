'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, CheckCircle, Lock, Sparkles, Loader2 } from 'lucide-react';
import { Service, Stylist } from '@/lib/types';
import { formatINR } from '@/lib/queueEngine';
import confetti from 'canvas-confetti';
import { playChime } from '@/lib/soundEffects';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  stylist?: Stylist;
  customerName: string;
  customerPhone: string;
  onSuccess: (paymentId: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  service,
  stylist,
  customerName,
  customerPhone,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      playChime('success');
      
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C1785A', '#E8D8CE', '#8C462C'],
        });
      } catch (e) {}

      const mockPaymentId = `pay_Rzp_${Date.now().toString().slice(-8)}`;
      setTimeout(() => {
        onSuccess(mockPaymentId);
      }, 1400);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2725]/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FAF6F0] rounded-3xl border border-[#EAE3DA] shadow-2xl overflow-hidden text-[#2C2725]">
        {/* Razorpay Brand Header */}
        <div className="bg-[#F3ECE3] text-[#2C2725] p-6 pb-5 flex items-center justify-between border-b border-[#EAE3DA]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C1785A] flex items-center justify-center font-bold text-white shadow-warm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-tight text-lg text-[#2C2725]">Razorpay Secured</span>
                <span className="text-[10px] bg-[#F5E6DF] text-[#8C462C] border border-[#E8D0C5] px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-[#6E6663]">Rose &amp; Rogue Salon • Advance Slot Lock-In</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-full text-[#6E6663] hover:text-[#2C2725] hover:bg-[#EAE3DA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Service & Deposit Summary Card */}
          <div className="p-4.5 rounded-2xl bg-[#F3ECE3] border border-[#EAE3DA] flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6E6663] font-bold">
                Selected Service
              </p>
              <h4 className="font-serif font-bold text-base text-[#2C2725] mt-0.5">{service.name}</h4>
              <p className="text-xs text-[#6E6663] mt-0.5">
                Stylist: <strong className="text-[#2C2725]">{stylist ? stylist.name : 'First Available Artist'}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#C1785A] font-bold block">
                Advance Deposit
              </span>
              <span className="text-3xl font-serif font-extrabold text-[#C1785A]">
                ₹99
              </span>
              <span className="text-xs text-[#6E6663] block line-through">
                {formatINR(service.price_inr)}
              </span>
            </div>
          </div>

          <div className="text-xs text-[#6E6663] bg-[#F5E6DF]/60 p-3.5 rounded-xl border border-[#E8D0C5] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#C1785A] shrink-0 mt-0.5" />
            <p>
              Your ₹99 deposit guarantees your spot in the live queue and will be <strong>100% credited</strong> against your final styling bill.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2C2725]">
              Select Payment Method
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#C1785A] bg-[#F5E6DF] text-[#8C462C] shadow-sm'
                    : 'border-[#EAE3DA] bg-white text-[#6E6663] hover:border-[#DDD3C6]'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#C1785A]" />
                <span>Instant UPI (GPay/PhonePe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#C1785A] bg-[#F5E6DF] text-[#8C462C] shadow-sm'
                    : 'border-[#EAE3DA] bg-white text-[#6E6663] hover:border-[#DDD3C6]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#C1785A]" />
                <span>Credit / Debit Card</span>
              </button>
            </div>

            {/* Input field based on selection */}
            {paymentMethod === 'upi' ? (
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-[#4A423D]">UPI ID / Handle</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="mobile@upi / username@okhdfcbank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                />
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-[#4A423D]">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 •••• •••• 8821"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handlePay}
              disabled={isProcessing || isSuccess}
              className={`w-full py-4 px-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-warm ${
                isSuccess
                  ? 'bg-[#8C462C] text-white'
                  : 'bg-[#C1785A] hover:bg-[#A86347] text-white hover:shadow-warm-lg'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing ₹99 via Razorpay...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Deposit Confirmed! Loading Tracker...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹99 Deposit & Join Queue</span>
                </>
              )}
            </button>
          </div>

          {/* Trust Footer */}
          <div className="flex items-center justify-center gap-4 text-xs text-[#6E6663] pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C462C]" />
              Verified Razorpay Merchant
            </span>
            <span>•</span>
            <span>Instant Cancellation Refund</span>
          </div>
        </div>
      </div>
    </div>
  );
};
