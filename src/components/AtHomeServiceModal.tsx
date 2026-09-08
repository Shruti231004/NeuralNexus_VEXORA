'use client';

import React, { useState } from 'react';
import {
  Home,
  X,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  Truck,
  Scissors,
  Check,
  Zap,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_STYLISTS } from '@/lib/mockData';
import { Service, Stylist, formatINR, Appointment } from '@/lib/types';
import { sendWhatsAppAppointmentMessage } from '@/lib/whatsappService';
import { createAppointment } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/authContext';
import { getAvailableStylistsForSlot, getTodayDateString } from '@/lib/stylistAvailability';

interface AtHomeServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appointment: Appointment) => void;
}

export const AtHomeServiceModal: React.FC<AtHomeServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();

  const [selectedService, setSelectedService] = useState<Service>(INITIAL_SERVICES[0]);
  const [customerName, setCustomerName] = useState(user?.full_name || 'Natasha Kapoor');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98200 88888');
  
  // Address details
  const [addressLine, setAddressLine] = useState('Flat 802, Palazzo Royale, 14th Road, Bandra West');
  const [landmark, setLandmark] = useState('Near Khar Gymkhana / Olive Bistro');
  const [cityArea, setCityArea] = useState('Mumbai - Bandra / Khar');
  const [pincode, setPincode] = useState('400050');
  const [gateNotes, setGateNotes] = useState('Please announce at security gate as Rose & Rogue Concierge');

  // Time & Equipment
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(INITIAL_STYLISTS[0]);
  const [includePortableChair, setIncludePortableChair] = useState(true);
  const [includeDysonVanity, setIncludeDysonVanity] = useState(true);

  // Dynamic available stylists
  const availableArtisans = getAvailableStylistsForSlot(selectedDate, timeSlot);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const DOORSTEP_KIT_FEE = 299;
  const totalCost = selectedService.price_inr + DOORSTEP_KIT_FEE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !addressLine) {
      alert('Please provide your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const newAppointment: Appointment = {
        id: `home-apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        salon_id: 'a0000000-0000-0000-0000-000000000001',
        service_id: selectedService.id,
        stylist_id: selectedStylist ? selectedStylist.id : INITIAL_STYLISTS[0].id,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        status: 'waiting',
        is_walk_in: false,
        deposit_paid: true,
        deposit_amount_inr: 99,
        queue_number: `HOME-${Math.floor(100 + Math.random() * 900)}`,
        estimated_start_time: new Date(now.getTime() + 30 * 60000).toISOString(),
        notes: `[DOORSTEP AT-HOME SERVICE] Address: ${addressLine}, ${landmark}, ${cityArea} (${pincode}). Gate: ${gateNotes}. Vanity Kit: ${includeDysonVanity ? 'Dyson Airwrap' : ''}, ${includePortableChair ? 'Portable Chair' : ''}. Slot: ${timeSlot}`,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        service: selectedService,
        stylist: selectedStylist || INITIAL_STYLISTS[0],
      };

      // Add to shared appointment database
      await createAppointment(newAppointment);

      // Automated WhatsApp Confirmation Dispatch
      const waOrigin = typeof window !== 'undefined' ? window.location.origin : undefined;
      const waResult = sendWhatsAppAppointmentMessage(
        customerPhone.trim(),
        customerName.trim(),
        newAppointment,
        1,
        30,
        waOrigin
      );

      setBookingSuccess(newAppointment);
      if (onSuccess) {
        onSuccess(newAppointment);
      }
    } catch (err) {
      console.error('At-home booking error:', err);
      alert('Could not complete at-home booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141110]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF6F0] dark:bg-[#181413] rounded-[36px] border-2 border-[#C1785A]/40 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#2C2725] dark:text-[#FAF6F0]">
        {/* HEADER */}
        <div className="bg-[#F3ECE3] dark:bg-[#201A18] px-6 py-4 border-b border-[#EAE3DA] dark:border-[#382E28] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8C462C] to-[#C1785A] text-white flex items-center justify-center shadow-warm">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#2C2725] dark:text-[#FAF6F0]">
                  Haute At-Home Concierge
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-[10px] font-mono font-bold uppercase tracking-wider">
                  Doorstep Paris Luxury
                </span>
              </div>
              <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                Certified Rose &amp; Rogue master stylists with portable vanity kits dispatched to your residence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6E6663] dark:text-[#B5ABA2] hover:bg-[#EAE3DA] dark:hover:bg-[#2C2420] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {bookingSuccess ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-warm animate-bounce">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#8C462C] dark:text-[#F2A585] bg-[#F5E6DF] dark:bg-[#38251E] px-3 py-1 rounded-full border border-[#E8D0C5] inline-block">
                  Concierge Dispatched • Token {bookingSuccess.queue_number}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
                  At-Home Session Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6663] dark:text-[#B5ABA2]">
                  Lead artisan <strong>{bookingSuccess.stylist?.name}</strong> has been scheduled for <strong>{selectedService.name}</strong> at your residence.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-[#F3ECE3] dark:bg-[#201A18] border border-[#EAE3DA] dark:border-[#382E28] max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#EAE3DA] dark:border-[#332A26] pb-2">
                  <span className="text-[#6E6663] dark:text-[#B5ABA2]">Destination:</span>
                  <span className="font-bold text-[#2C2725] dark:text-[#FAF6F0] text-right truncate max-w-[220px]">
                    {addressLine}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#EAE3DA] dark:border-[#332A26] pb-2">
                  <span className="text-[#6E6663] dark:text-[#B5ABA2]">Scheduled Window:</span>
                  <span className="font-bold text-[#8C462C] dark:text-[#F2A585]">{timeSlot}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#6E6663] dark:text-[#B5ABA2]">WhatsApp Dispatch:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sent to {customerPhone}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-white text-xs font-bold uppercase tracking-wider shadow-warm"
                >
                  Done &amp; Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. SERVICE & STYLIST SELECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-[#C1785A]" />
                    Select Service
                  </label>
                  <select
                    value={selectedService.id}
                    onChange={(e) => {
                      const s = INITIAL_SERVICES.find((serv) => serv.id === e.target.value);
                      if (s) setSelectedService(s);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#201A18] text-xs font-bold text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                  >
                    {INITIAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.duration_minutes}m • {formatINR(s.price_inr)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C1785A]" />
                    Preferred Stylist
                  </label>
                  <select
                    value={selectedStylist ? selectedStylist.id : ''}
                    onChange={(e) => {
                      const sty = INITIAL_STYLISTS.find((st) => st.id === e.target.value);
                      setSelectedStylist(sty || null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#201A18] text-xs font-bold text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                  >
                    <option value="">Any Available Artisan ({availableArtisans.length} on duty)</option>
                    {availableArtisans.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} — {st.title} ({st.specialties[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. CLIENT CONTACT DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C1785A]" />
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Natasha Kapoor"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#201A18] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C1785A]" />
                    WhatsApp Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98200 88888"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#201A18] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                  />
                </div>
              </div>

              {/* 3. RESIDENTIAL ADDRESS & LANDMARK */}
              <div className="space-y-3 p-4 rounded-3xl bg-[#F3ECE3] dark:bg-[#201A18] border border-[#EAE3DA] dark:border-[#382E28]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#F2A585]">
                  <MapPin className="w-4 h-4 text-[#C1785A]" />
                  <span>Doorstep Destination Details</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6663] dark:text-[#B5ABA2] block mb-1">
                      Apartment / Flat / Villa Address
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. Penthouse 802, Palazzo Royale, 14th Road"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#181413] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#6E6663] dark:text-[#B5ABA2] block mb-1">
                        Landmark / Society Name
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Khar Gymkhana"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#181413] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#6E6663] dark:text-[#B5ABA2] block mb-1">
                        Neighborhood &amp; Pincode
                      </label>
                      <input
                        type="text"
                        value={cityArea}
                        onChange={(e) => setCityArea(e.target.value)}
                        placeholder="Mumbai - Bandra / Khar (400050)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#181413] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6E6663] dark:text-[#B5ABA2] block mb-1">
                      Gate / Entry Instructions
                    </label>
                    <input
                      type="text"
                      value={gateNotes}
                      onChange={(e) => setGateNotes(e.target.value)}
                      placeholder="e.g. Inform intercom 802 for visitor parking"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#181413] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. DATE, TIME WINDOW & LUXURY EQUIPMENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C1785A]" />
                      Dynamic Arrival Time
                    </span>
                    <span className="text-[10px] text-[#C1785A] font-bold">
                      {availableArtisans.length} Artisans Available
                    </span>
                  </label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="e.g. 11:30 AM or 03:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#201A18] text-xs font-mono font-bold text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['11:00 AM', '01:30 PM', '04:00 PM', '06:30 PM'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeSlot(t)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          timeSlot === t
                            ? 'bg-[#C1785A] text-white'
                            : 'bg-[#F3ECE3] dark:bg-[#2C2420] text-[#6E6663] dark:text-[#B5ABA2]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C1785A]" />
                    Complimentary Vanity Kits
                  </label>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeDysonVanity}
                        onChange={(e) => setIncludeDysonVanity(e.target.checked)}
                        className="rounded accent-[#C1785A]"
                      />
                      <span>Dyson Airwrap &amp; Micro-Mist Steam Station</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includePortableChair}
                        onChange={(e) => setIncludePortableChair(e.target.checked)}
                        className="rounded accent-[#C1785A]"
                      />
                      <span>Hydraulic Styling Chair &amp; Floor Protection Mat</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 5. PRICING BREAKDOWN & SUBMIT CTA */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#F5E6DF] to-[#EAE3DA] dark:from-[#2C211D] dark:to-[#201A18] border border-[#E0D0C5] dark:border-[#3D2E27] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
                      {formatINR(totalCost)}
                    </span>
                    <span className="text-xs text-[#8C462C] dark:text-[#F2A585] font-semibold">
                      ({formatINR(selectedService.price_inr)} Service + {formatINR(DOORSTEP_KIT_FEE)} Travel Kit)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">
                    Includes certified sanitation seal, disposable silk capes &amp; live GPS tracking link.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-white text-xs font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  {isSubmitting ? (
                    <span>Dispatching Concierge...</span>
                  ) : (
                    <>
                      <Home className="w-4 h-4" />
                      <span>Confirm At-Home Booking</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
