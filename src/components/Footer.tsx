import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F3ECE3] text-[#2C2725] pt-16 pb-12 border-t border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#EAE3DA]">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-serif text-xl font-bold">
                S
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2C2725]">STYLIQ</span>
            </div>
            <p className="text-xs text-[#6E6663] leading-relaxed">
              High-end Parisian hair artistry and real-time smart queue management. Experience flawless timing and bespoke hair architecture.
            </p>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C1785A] font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#6E6663]">
              <li>
                <Link href="/" className="hover:text-[#2C2725] transition-colors">Home Editorial</Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#2C2725] transition-colors">Book Service (₹99 Lock-in)</Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-[#2C2725] transition-colors">Scan-to-Book QR Pass</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#2C2725] transition-colors">Staff Kiosk & Queue Manager</Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#2C2725] transition-colors">Predictions & Statistics</Link>
              </li>
              <li>
                <Link href="/auth/customer-login" className="hover:text-[#2C2725] transition-colors">VIP Client Portal Login</Link>
              </li>
              <li>
                <Link href="/auth/staff-login" className="hover:text-[#2C2725] transition-colors">Staff & Stylist Kiosk Login</Link>
              </li>
              <li>
                <Link href="/tv" className="hover:text-[#2C2725] transition-colors">Smart TV Lounge Board</Link>
              </li>
            </ul>
          </div>

          {/* Salon Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C1785A] font-bold">
              Flagship Studio
            </h4>
            <ul className="space-y-2 text-xs text-[#6E6663]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C1785A] shrink-0 mt-0.5" />
                <span>34 Rue de la Paix / Bandra West Luxury Arcade, Mumbai</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C1785A] shrink-0" />
                <span>+91 98200 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C1785A] shrink-0" />
                <span>concierge@styliqparis.com</span>
              </li>
            </ul>
          </div>

          {/* Hours & Luxury Commitment */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C1785A] font-bold">
              Operating Hours
            </h4>
            <div className="space-y-1 text-xs text-[#6E6663]">
              <p className="flex justify-between">
                <span>Tuesday – Sunday:</span>
                <span className="font-medium text-[#2C2725]">10:00 AM – 9:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Monday:</span>
                <span className="text-[#C1785A] font-medium">Closed for Private Styling</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#EAE3DA] mt-4 shadow-sm">
              <p className="text-[11px] text-[#6E6663] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C1785A]" />
                Zero waiting anxiety with live Realtime Queue Sync.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6E6663] gap-4">
          <p>© {new Date().getFullYear()} Styliq Haute Coiffure. All rights reserved.</p>
          <div className="flex items-center gap-4 uppercase tracking-widest text-[10px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Haute Service</span>
            <span>•</span>
            <span className="text-[#C1785A] font-bold">Built for High-Velocity Salons</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
