import React from 'react';

export default function QRCodeModal({ booking, onClose, onCheckIn }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B18]/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-3xl p-6 max-w-sm w-full shadow-warm-lg relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A8078] hover:text-[#2C2725] p-1 rounded-full bg-[#F3EAE0] font-bold transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="w-12 h-12 bg-[#F0DCCF] border border-[#EAE3DA] rounded-full flex items-center justify-center mx-auto mb-3 text-[#C1785A] text-xl">
          📱
        </div>
        <h3 className="font-serif text-xl font-extrabold text-[#2C2725] mb-1">Digital Check-In QR Pass</h3>
        <p className="text-xs text-[#8A8078] mb-5">
          Scan this QR code at the Rose & Rogue front-desk lounge scanner or tap below to check in.
        </p>

        {/* Simulated Generated QR Code Graphic */}
        <div className="bg-[#FAF6F0] p-4 rounded-2xl inline-block mb-5 shadow-sm border border-[#EAE3DA]">
          <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
            {/* QR Corner Markers */}
            <rect x="5" y="5" width="28" height="28" fill="#2C2725" rx="4" />
            <rect x="9" y="9" width="20" height="20" fill="#FAF6F0" rx="2" />
            <rect x="13" y="13" width="12" height="12" fill="#2C2725" rx="1" />

            <rect x="67" y="5" width="28" height="28" fill="#2C2725" rx="4" />
            <rect x="71" y="9" width="20" height="20" fill="#FAF6F0" rx="2" />
            <rect x="75" y="13" width="12" height="12" fill="#2C2725" rx="1" />

            <rect x="5" y="67" width="28" height="28" fill="#2C2725" rx="4" />
            <rect x="9" y="71" width="20" height="20" fill="#FAF6F0" rx="2" />
            <rect x="13" y="75" width="12" height="12" fill="#2C2725" rx="1" />

            {/* Random Matrix Dots */}
            <rect x="40" y="8" width="6" height="6" fill="#2C2725" />
            <rect x="50" y="8" width="8" height="6" fill="#C1785A" />
            <rect x="40" y="20" width="12" height="6" fill="#2C2725" />
            <rect x="10" y="40" width="8" height="8" fill="#2C2725" />
            <rect x="24" y="40" width="14" height="6" fill="#2C2725" />
            <rect x="45" y="38" width="10" height="10" fill="#C1785A" />
            <rect x="60" y="42" width="15" height="8" fill="#2C2725" />
            <rect x="80" y="40" width="12" height="12" fill="#2C2725" />
            <rect x="40" y="55" width="8" height="16" fill="#2C2725" />
            <rect x="52" y="55" width="18" height="6" fill="#2C2725" />
            <rect x="75" y="60" width="16" height="8" fill="#C1785A" />
            <rect x="40" y="75" width="12" height="15" fill="#2C2725" />
            <rect x="58" y="75" width="15" height="15" fill="#2C2725" />
            <rect x="78" y="75" width="14" height="18" fill="#2C2725" />
          </svg>
        </div>

        {/* Booking Info Box */}
        <div className="bg-[#F3EAE0] p-3.5 rounded-2xl border border-[#EAE3DA] text-left mb-5">
          <div className="text-xs text-[#8A8078]">Guest Name</div>
          <div className="text-sm font-bold text-[#2C2725]">{booking.customerName}</div>
          <div className="text-xs text-[#C1785A] font-bold mt-0.5">Pass ID: {booking.id} • Slot: {booking.slot}</div>
        </div>

        {/* Action button */}
        {booking.status === 'booked' ? (
          <button
            onClick={() => {
              onCheckIn(booking.id);
              onClose();
            }}
            className="w-full py-3.5 px-4 bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] font-bold text-xs uppercase tracking-[0.08em] rounded-full shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Simulate Front-Desk Scan & Check In</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#C1785A] bg-[#F0DCCF] border border-[#EAE3DA] p-3 rounded-full text-xs font-bold uppercase tracking-[0.08em]">
            <span>✓ Already Checked In & In Queue</span>
          </div>
        )}

      </div>
    </div>
  );
}
