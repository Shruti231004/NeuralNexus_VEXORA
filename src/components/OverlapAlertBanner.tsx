'use client';

import React from 'react';
import { Sparkles, Zap, ArrowRight, Clock, Scissors } from 'lucide-react';
import { OverlapAlert } from '@/lib/types';
import { updateAppointment } from '@/lib/supabaseClient';
import { playChime } from '@/lib/soundEffects';

interface OverlapAlertBannerProps {
  alerts: OverlapAlert[];
  onActionTriggered?: () => void;
}

export const OverlapAlertBanner: React.FC<OverlapAlertBannerProps> = ({
  alerts,
  onActionTriggered,
}) => {
  if (!alerts || alerts.length === 0) return null;

  const handleSeatCandidate = async (candidateId: string) => {
    playChime('bell');
    await updateAppointment(candidateId, { status: 'in_chair' });
    if (onActionTriggered) onActionTriggered();
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={`${alert.stylistId}-${alert.processingAppointmentId}`}
          className="relative overflow-hidden p-6 rounded-3xl bg-[#FFF9F2] border-2 border-[#C98A2C] text-[#2C2725] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-warm"
        >
          {/* Left info badge */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FDF2E2] border-2 border-[#C98A2C] flex items-center justify-center text-[#8C462C] shrink-0 shadow-sm">
              <Zap className="w-7 h-7 text-[#C1785A] animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#7A4500] bg-[#FCE9CC] px-3.5 py-1 rounded-full border border-[#ECC98A]">
                  ⚡ Quick Cut Overlap Available
                </span>
                <span className="text-sm font-bold text-[#4A423D] bg-[#F3ECE3] px-3 py-1 rounded-full border border-[#EAE3DA]">
                  Station #{alert.chairNumber} • {alert.stylistName}
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#2C2725] font-medium leading-relaxed">
                Client <strong className="text-[#8C462C] font-extrabold">{alert.processingCustomerName}</strong> is in Color Processing ({alert.windowMinutes} min chair free).
                {alert.overlapCandidateCustomerName ? (
                  <span className="text-[#2C2725]">
                    {' '}Recommended: Seat <strong className="text-[#8C462C] underline decoration-[#C1785A] decoration-2">{alert.overlapCandidateCustomerName}</strong> ({alert.overlapCandidateService})
                  </span>
                ) : (
                  <span className="text-[#6E6663] font-semibold"> Chair is ready for an express walk-in guest right now.</span>
                )}
              </p>
            </div>
          </div>

          {/* Right Action Trigger */}
          {alert.overlapCandidateAppointmentId && (
            <button
              onClick={() => handleSeatCandidate(alert.overlapCandidateAppointmentId!)}
              className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] transition-all shadow-warm hover:shadow-warm-lg transform hover:scale-105"
            >
              <Scissors className="w-4 h-4" />
              <span>Seat Candidate Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
