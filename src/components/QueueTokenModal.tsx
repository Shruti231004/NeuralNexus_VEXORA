'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  QrCode,
  Share2,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Scissors,
  Clock,
  MapPin,
  Sparkles,
  X,
  Phone,
  Calendar,
  Award,
} from 'lucide-react';
import { Appointment } from '@/lib/types';
import { formatINR } from '@/lib/queueEngine';

interface QueueTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  queuePosition?: number;
  estimatedWaitMinutes?: number;
}

export const QueueTokenModal: React.FC<QueueTokenModalProps> = ({
  isOpen,
  onClose,
  appointment,
  queuePosition = 1,
  estimatedWaitMinutes = 15,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !appointment) return null;

  const trackerUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/queue/${appointment.id}`
    : `/queue/${appointment.id}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Bonjour! Here is my Styliq Salon Queue Token: ${appointment.queue_number}\nService: ${appointment.service?.name}\nTrack live wait status here: ${trackerUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    trackerUrl
  )}&color=2C2725&bgcolor=FAF6F0&margin=1`;

  const formattedTime = appointment.estimated_start_time
    ? new Date(appointment.estimated_start_time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'In ~15 mins';

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2725]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative max-w-md w-full my-6 animate-fadeIn">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-2 sm:-right-4 z-20 p-2.5 rounded-full bg-[#2C2725] text-[#FAF6F0] hover:bg-[#8C462C] transition-all shadow-lg print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LUXURY TICKET / QUEUE TOKEN CARD */}
        <div className="bg-[#FAF6F0] rounded-[32px] border-2 border-[#C1785A]/40 shadow-2xl overflow-hidden relative print:shadow-none print:border-none">
          {/* Top Gold Foil Strip */}
          <div className="bg-gradient-to-r from-[#8C462C] via-[#C1785A] to-[#8C462C] p-4 text-[#FAF6F0] text-center relative">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FAF6F0]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] font-extrabold">
                Styliq Haute Coiffure • Paris
              </span>
              <Sparkles className="w-4 h-4 text-[#FAF6F0]" />
            </div>
            <p className="text-[10px] text-[#F5E6DF] uppercase tracking-wider font-semibold mt-0.5">
              Official Digital Priority Queue Token
            </p>
          </div>

          {/* MAIN TICKET BODY */}
          <div className="p-6 sm:p-7 space-y-5">
            {/* Token Number Header */}
            <div className="flex items-center justify-between border-b border-[#EAE3DA] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C462C] block">
                  Queue Priority Token
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725] tracking-tight">
                  {appointment.queue_number || 'SQ-101'}
                </h2>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5E6DF] border border-[#C1785A]/50 shadow-sm">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#8C462C]">
                    Token
                  </span>
                  <span className="font-mono text-xs font-black text-[#8C462C] tracking-tight bg-white/60 px-1.5 py-0.5 rounded border border-[#E8D0C5]">
                    #{appointment.queue_number || 'SQ-101'}
                  </span>
                </div>
                <span className="text-[10px] text-[#6E6663] block mt-1 font-mono">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • Pos #{queuePosition}
                </span>
              </div>
            </div>

            {/* Guest & Appointment Details */}
            <div className="bg-[#F3ECE3] p-4 rounded-2xl border border-[#EAE3DA] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6663] block">
                    Guest Name
                  </span>
                  <p className="font-serif font-bold text-base text-[#2C2725]">
                    {appointment.customer_name}
                  </p>
                  <p className="text-xs text-[#6E6663] font-mono">
                    {appointment.customer_phone}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6663] block">
                    Assigned Stylist
                  </span>
                  <p className="font-serif font-bold text-sm text-[#2C2725]">
                    {appointment.stylist?.name || 'Artisan Lead'}
                  </p>
                  <span className="text-[10px] font-extrabold text-[#C1785A] uppercase tracking-wider block">
                    Chair #{appointment.stylist?.chair_number || 1}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#EAE3DA]/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6663] block">
                    Service
                  </span>
                  <p className="font-semibold text-[#2C2725] line-clamp-1">
                    {appointment.service?.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6663] block">
                    Deposit Paid
                  </span>
                  <span className="font-bold text-[#8C462C] font-mono">
                    ₹99 Paid ✓
                  </span>
                </div>
              </div>
            </div>

            {/* Timing & Wait Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#F3ECE3] p-3 rounded-2xl border border-[#EAE3DA]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6E6663] block">
                  Est. Chair Call
                </span>
                <span className="font-serif text-lg font-bold text-[#2C2725]">
                  {formattedTime}
                </span>
              </div>
              <div className="bg-[#F3ECE3] p-3 rounded-2xl border border-[#EAE3DA]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6E6663] block">
                  Estimated Wait
                </span>
                <span className="font-serif text-lg font-bold text-[#C1785A]">
                  ~{estimatedWaitMinutes} mins
                </span>
              </div>
            </div>

            {/* PERFORATED TEAR-OFF LINE WITH NOTCHES */}
            <div className="relative py-2 flex items-center justify-center">
              {/* Left Cutout */}
              <div className="absolute -left-10 w-8 h-8 rounded-full bg-[#2C2725] print:hidden" />
              {/* Dashed Line */}
              <div className="w-full border-t-2 border-dashed border-[#DDD3C6]" />
              {/* Right Cutout */}
              <div className="absolute -right-10 w-8 h-8 rounded-full bg-[#2C2725] print:hidden" />
            </div>

            {/* LIVE SCANNABLE QR PASS */}
            <div className="text-center space-y-3">
              <div className="inline-block p-3 bg-white rounded-2xl border-2 border-[#EAE3DA] shadow-sm">
                <img
                  src={qrImageUrl}
                  alt="Token Tracker QR"
                  className="w-32 h-32 mx-auto rounded-lg"
                />
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#2C2725]">
                  Scan for Live Status & Real-time Alerts
                </p>
                <p className="text-[11px] text-[#6E6663]">
                  Keep this token handy when your number is announced.
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (Hidden on Print) */}
          <div className="p-5 bg-[#F3ECE3] border-t border-[#EAE3DA] space-y-2.5 print:hidden">
            <Link
              href={`/queue/${appointment.id}`}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Track Live Wait Status</span>
            </Link>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#EAE3DA] border border-[#EAE3DA] text-[11px] font-bold text-[#2C2725] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                title="Print Token Pass"
              >
                <Printer className="w-3.5 h-3.5 text-[#C1785A]" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={shareWhatsApp}
                className="py-2.5 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#EAE3DA] border border-[#EAE3DA] text-[11px] font-bold text-[#2C2725] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                title="Share via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C1785A]" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#EAE3DA] border border-[#EAE3DA] text-[11px] font-bold text-[#2C2725] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                title="Copy Live Tracker Link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C1785A]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
