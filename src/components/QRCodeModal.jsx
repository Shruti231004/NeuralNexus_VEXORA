import React from 'react';
import { X, QrCode, CheckCircle, Smartphone } from 'lucide-react';

export default function QRCodeModal({ booking, onClose, onCheckIn }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1E242C] border border-amber-600/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="w-12 h-12 bg-amber-950/80 border border-amber-600/40 rounded-xl flex items-center justify-center mx-auto mb-3 text-amber-400">
          <QrCode className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-bold text-white mb-1">Check-in QR Code</h3>
        <p className="text-xs text-gray-400 mb-5">
          Scan this QR code at the Amaya Salon front-desk scanner or tap below to simulate scan.
        </p>

        {/* Simulated Generated QR Code Graphic */}
        <div className="bg-white p-4 rounded-xl inline-block mb-5 shadow-lg border-2 border-amber-500/30">
          <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
            {/* QR Corner Markers */}
            <rect x="5" y="5" width="28" height="28" fill="#161A20" rx="4" />
            <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
            <rect x="13" y="13" width="12" height="12" fill="#161A20" rx="1" />

            <rect x="67" y="5" width="28" height="28" fill="#161A20" rx="4" />
            <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
            <rect x="75" y="13" width="12" height="12" fill="#161A20" rx="1" />

            <rect x="5" y="67" width="28" height="28" fill="#161A20" rx="4" />
            <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
            <rect x="13" y="75" width="12" height="12" fill="#161A20" rx="1" />

            {/* Random Matrix Dots */}
            <rect x="40" y="8" width="6" height="6" fill="#161A20" />
            <rect x="50" y="8" width="8" height="6" fill="#D97706" />
            <rect x="40" y="20" width="12" height="6" fill="#161A20" />
            <rect x="10" y="40" width="8" height="8" fill="#161A20" />
            <rect x="24" y="40" width="14" height="6" fill="#161A20" />
            <rect x="45" y="38" width="10" height="10" fill="#D97706" />
            <rect x="60" y="42" width="15" height="8" fill="#161A20" />
            <rect x="80" y="40" width="12" height="12" fill="#161A20" />
            <rect x="40" y="55" width="8" height="16" fill="#161A20" />
            <rect x="52" y="55" width="18" height="6" fill="#161A20" />
            <rect x="75" y="60" width="16" height="8" fill="#D97706" />
            <rect x="40" y="75" width="12" height="15" fill="#161A20" />
            <rect x="58" y="75" width="15" height="15" fill="#161A20" />
            <rect x="78" y="75" width="14" height="18" fill="#161A20" />
          </svg>
        </div>

        {/* Booking Info Box */}
        <div className="bg-[#161A20] p-3 rounded-xl border border-gray-800 text-left mb-5">
          <div className="text-xs text-gray-400">Customer</div>
          <div className="text-sm font-semibold text-white">{booking.customerName}</div>
          <div className="text-xs text-amber-400 mt-1">ID: {booking.id} • Slot: {booking.slot}</div>
        </div>

        {/* Action button */}
        {booking.status === 'booked' ? (
          <button
            onClick={() => {
              onCheckIn(booking.id);
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Simulate Front-Desk Scan & Check In</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 p-2.5 rounded-xl text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Already Checked In & In Queue</span>
          </div>
        )}

      </div>
    </div>
  );
}
