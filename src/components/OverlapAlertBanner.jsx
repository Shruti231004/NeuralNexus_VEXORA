import React from 'react';

export default function OverlapAlertBanner({ overlaps }) {
  if (!overlaps || overlaps.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 font-sans">
      <div className="bg-[#F3EAE0] border-2 border-[#C1785A] p-4 rounded-3xl shadow-warm-soft flex items-start gap-3.5 relative">
        <div className="w-10 h-10 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-bold shrink-0 text-lg shadow-sm">
          ⚠️
        </div>
        <div className="flex-1 text-xs">
          <div className="font-bold text-[#2C2725] uppercase tracking-[0.08em] mb-1 flex items-center gap-2">
            <span>Stylist Overlap & Conflict Alert</span>
            <span className="bg-[#F0DCCF] text-[#C1785A] px-2.5 py-0.5 rounded-full font-bold text-[10px]">
              {overlaps.length} Conflicts Detected
            </span>
          </div>
          <div className="space-y-1">
            {overlaps.map((conflict, idx) => (
              <p key={idx} className="text-[#8A8078]">
                <strong>{conflict.stylistName}</strong> has overlapping appointments at <strong>{conflict.slot}</strong> ({conflict.guest1} & {conflict.guest2}). Please adjust workstation scheduling!
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
