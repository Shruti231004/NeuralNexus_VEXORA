import React, { useState } from 'react';
import { SERVICES, STYLISTS, TIME_SLOTS, useCustomerDomain } from '../services/store';
import QRCodeModal from './QRCodeModal';
import FeedbackModal from './FeedbackModal';
import VirtualTryOnStudio from './VirtualTryOnStudio';
import WalkInModal from './WalkInModal';
import RazorpayModal from './RazorpayModal';
import FooterSection from './FooterSection';

export default function CustomerView({ store }) {
  // Enforce Clean Domain Abstraction Boundary
  const { 
    bookings, getQueueInfo, bookAppointment, checkIn, 
    cancelBooking, submitFeedback, addToast 
  } = useCustomerDomain(store);

  const [showTryOnStudio, setShowTryOnStudio] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Experiences');
  const [selectedGenderTheme, setSelectedGenderTheme] = useState('all');

  // Booking Form State
  const [selectedServices, setSelectedServices] = useState([SERVICES[0]]);
  const [selectedStylistId, setSelectedStylistId] = useState('elena');
  const [selectedDate, setSelectedDate] = useState('Tue, Oct 22');
  const [selectedSlot, setSelectedSlot] = useState('2:45 PM');
  
  // Customer Profile State
  const [name, setName] = useState('Aarav Mehta');
  const [phone, setPhone] = useState('+1 555-0101');
  const [activeCustomerPhone, setActiveCustomerPhone] = useState('+1 555-0101');

  // Modals
  const [qrModalBooking, setQrModalBooking] = useState(null);
  const [feedbackModalBooking, setFeedbackModalBooking] = useState(null);

  // Customer profile & live queue token tracking
  const customerBookings = bookings.filter(b => b.customerPhone === activeCustomerPhone || b.customerPhone === phone);
  const primaryBooking = customerBookings.find(b => ['booked', 'waiting', 'in-service'].includes(b.status)) || customerBookings[0];
  const queueInfo = primaryBooking ? getQueueInfo(primaryBooking.id) : null;

  const handleBookServiceClick = (service) => {
    setSelectedServices([service]);
    setShowRazorpayModal(true);
  };

  const handleRazorpaySuccess = () => {
    setShowRazorpayModal(false);
    const primaryService = selectedServices[0];
    const created = bookAppointment({
      customerName: name,
      customerPhone: phone,
      customerGender: selectedGenderTheme,
      serviceId: primaryService.id,
      stylistId: selectedStylistId,
      slot: selectedSlot
    });

    setActiveCustomerPhone(phone);
    addToast('Slot Confirmed & ₹99 Deposit Received', 'success');
  };

  const depositAmount = 99;
  const selectedStylist = STYLISTS.find(s => s.id === selectedStylistId);

  return (
    <div className="w-full flex flex-col gap-24 pt-6 pb-16 bg-[#FAF6F0] text-[#2C2725] transition-colors font-sans">
      
      {/* ==============================================================================
         1. HERO SECTION (55/45 SPLIT, EXACT SPECIFICATION)
         ============================================================================== */}
      <section className="relative pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (~55% Split) */}
          <div className="lg:col-span-7 space-y-7 animate-fade-in-up">
            
            {/* Eyebrow Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0DCCF] border border-[#EAE3DA] text-[#C1785A]">
              <span className="text-xs">✦</span>
              <span className="text-[11px] uppercase font-bold tracking-[0.08em]">
                SMART REAL-TIME SALON ENGINE
              </span>
            </div>

            {/* Two-Line Serif Headline */}
            <h1 className="font-serif text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.08] text-[#2C2725]">
              Effortless Styling.{' '}
              <span className="italic font-normal text-[#C1785A] block">
                Zero Waiting Anxiety.
              </span>
            </h1>

            {/* Body Paragraph (max-width ~46 characters, line-height 1.6, muted taupe #8A8078) */}
            <p className="text-base text-[#8A8078] leading-relaxed max-w-[46ch]">
              Immerse yourself in precision hair artistry. Lock in your slot for ₹99, track your live chair queue in real-time, and arrive precisely when your stylist is ready.
            </p>

            {/* Primary Action Button Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleBookServiceClick(SERVICES[0])}
                className="flex items-center gap-2 px-7 py-4 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.08em] shadow-sm hover:shadow-warm-soft transition-all transform hover:-translate-y-0.5"
              >
                <span>BOOK SLOT (₹99 DEPOSIT)</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTryOnStudio(true)}
                className="flex items-center gap-2 px-6 py-4 rounded-full bg-[#1F1B18] hover:bg-[#2C2725] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition-all border border-[#3D3532]"
              >
                <span>📷 VIRTUAL MIRROR TRY-ON</span>
              </button>

              <button
                type="button"
                onClick={() => setShowWalkInModal(true)}
                className="flex items-center gap-2 px-6 py-4 rounded-full bg-[#F0DCCF] hover:bg-[#E8D0C0] text-[#C1785A] text-xs font-bold uppercase tracking-[0.08em] transition-colors"
              >
                <span>⌗ SCAN TO BOOK</span>
              </button>
            </div>

            {/* Secondary Button Row (Ghost/Outline) */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => window.location.hash = '#access-gateways'}
                className="px-5 py-2.5 rounded-full border border-[#EAE3DA] hover:bg-[#F3EAE0] text-[#2C2725] text-[11px] font-bold uppercase tracking-[0.08em] transition-colors"
              >
                STAFF KIOSK
              </button>

              <button
                type="button"
                onClick={() => window.location.hash = '#access-gateways'}
                className="px-5 py-2.5 rounded-full border border-[#EAE3DA] hover:bg-[#F3EAE0] text-[#2C2725] text-[11px] font-bold uppercase tracking-[0.08em] transition-colors"
              >
                TV BOARD
              </button>
            </div>

            {/* Hairline Divider & 3-Up Stat Row */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#EAE3DA]">
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">100%</span>
                <p className="text-[10px] text-[#8A8078] uppercase tracking-[0.08em] mt-1 font-bold">
                  DEPOSIT CREDITED ON BILL
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C1785A]">0 min</span>
                <p className="text-[10px] text-[#8A8078] uppercase tracking-[0.08em] mt-1 font-bold">
                  LOUNGE IDLE DELAY
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">4.98★</span>
                <p className="text-[10px] text-[#8A8078] uppercase tracking-[0.08em] mt-1 font-bold">
                  CLIENT SATISFACTION
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (~45% Split - Arch Photo & Overlapping Badge) */}
          <div className="lg:col-span-5 relative animate-fade-in-scale">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              
              {/* Arch Photo (Rounded arch at top, sharp bottom corners, ~3:4 portrait) */}
              <div className="arch-hero overflow-hidden border-2 border-[#EAE3DA] shadow-warm-lg bg-[#1F1B18] relative">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                  alt="Rose & Rogue Salon Atelier Interior Paris"
                  className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700 opacity-90 filter grayscale contrast-125"
                />
                
                {/* Overlaid Italic Caption at bottom on dark scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B18]/90 via-transparent to-transparent flex flex-col justify-end p-6 text-center">
                  <p className="font-serif italic text-base sm:text-lg text-[#FDF8F2] leading-snug">
                    "Haute couture meets mathematical precision in styling."
                  </p>
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C1785A] mt-2 font-bold">
                    STUDIO RUE DE LA PAIX • PARIS
                  </span>
                </div>
              </div>

              {/* Overlapping Circular Badge in Upper-Right Corner */}
              <div className="absolute -top-5 -right-5 bg-[#FAF6F0] border-2 border-[#C1785A] w-28 h-28 rounded-full shadow-warm-soft flex flex-col items-center justify-center text-center p-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#C1785A]">LIVE QUEUE</span>
                <span className="font-serif font-extrabold text-sm text-[#2C2725] mt-0.5">9 in Lounge</span>
                <span className="text-[9px] text-[#8A8078]">0 in Chair</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
         2. SERVICES SECTION (CURATED MENU, 4-COLUMN CARD GRID)
         ============================================================================== */}
      <section id="curated-menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10 pt-4">
        
        {/* Centered Eyebrow & Titles */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0DCCF] border border-[#EAE3DA] text-[#C1785A]">
            <span className="text-xs">✦</span>
            <span className="text-[11px] uppercase font-bold tracking-[0.08em]">
              CURATED MENU
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2C2725]">
            Signature Hair & Grooming Experiences
          </h2>
          <p className="text-sm text-[#8A8078]">
            Every service is tailored with botanical treatments, scalp diagnostics, and master stylists.
          </p>
        </div>

        {/* 4 Equal Cards, Cream-Beige Fill (#EFE6DA), Rounded Corners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Cut & Style (with POPULAR micro-badge) */}
          <div className="bg-[#EFE6DA] rounded-3xl p-6 border border-[#EAE3DA] hover:border-[#C1785A] shadow-warm-soft motion-card flex flex-col justify-between space-y-5 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {/* Centered icon in small white rounded-square chip */}
                <div className="w-10 h-10 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] flex items-center justify-center text-[#C1785A] text-lg font-bold shadow-sm">
                  ✂️
                </div>
                {/* POPULAR micro-badge */}
                <span className="px-3 py-1 rounded-full bg-[#C1785A] text-[#FAF6F0] text-[9px] font-bold uppercase tracking-[0.08em]">
                  POPULAR
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-[0.08em] text-[#C1785A] block mb-1">
                  CUT & STYLE
                </span>
                <h3 className="font-serif text-xl font-extrabold text-[#2C2725] leading-snug">
                  Signature French Cut & Blow-Dry
                </h3>
                <p className="text-xs text-[#8A8078] mt-2 leading-relaxed truncate">
                  Bespoke consultation, clarifying botanical wash, sculptural hair architecture, and bouncy Parisian...
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#EAE3DA]">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#8A8078]">⏱ 45 mins</span>
                <span className="font-serif text-lg font-extrabold text-[#2C2725]">₹2,400</span>
              </div>

              <button
                type="button"
                onClick={() => handleBookServiceClick(SERVICES[0])}
                className="w-full py-3.5 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>BOOK FOR ₹99</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 2: Color Services (with POPULAR micro-badge) */}
          <div className="bg-[#EFE6DA] rounded-3xl p-6 border border-[#EAE3DA] hover:border-[#C1785A] shadow-warm-soft motion-card flex flex-col justify-between space-y-5 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] flex items-center justify-center text-[#C1785A] text-lg font-bold shadow-sm">
                  ✨
                </div>
                <span className="px-3 py-1 rounded-full bg-[#C1785A] text-[#FAF6F0] text-[9px] font-bold uppercase tracking-[0.08em]">
                  POPULAR
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-[0.08em] text-[#C1785A] block mb-1">
                  COLOR SERVICES
                </span>
                <h3 className="font-serif text-xl font-extrabold text-[#2C2725] leading-snug">
                  Haute Couture Balayage & Glaze
                </h3>
                <p className="text-xs text-[#8A8078] mt-2 leading-relaxed truncate">
                  Hand-painted dimensional French highlights with pH-balancing luminous gloss toner. Includes a...
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#EAE3DA]">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#8A8078]">⏱ 90 mins</span>
                <span className="font-serif text-lg font-extrabold text-[#2C2725]">₹6,800</span>
              </div>

              <button
                type="button"
                onClick={() => handleBookServiceClick(SERVICES[1])}
                className="w-full py-3.5 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>BOOK FOR ₹99</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 3: Hair Treatments */}
          <div className="bg-[#EFE6DA] rounded-3xl p-6 border border-[#EAE3DA] hover:border-[#C1785A] shadow-warm-soft motion-card flex flex-col justify-between space-y-5 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] flex items-center justify-center text-[#C1785A] text-lg font-bold shadow-sm">
                  💆‍♀️
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-[0.08em] text-[#C1785A] block mb-1">
                  HAIR TREATMENTS
                </span>
                <h3 className="font-serif text-xl font-extrabold text-[#2C2725] leading-snug">
                  Caviar & Peptide Restorative Spa
                </h3>
                <p className="text-xs text-[#8A8078] mt-2 leading-relaxed truncate">
                  Intensive cellular repair infusion with micro-mist steam chamber and acupressure scalp rejuvenation.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#EAE3DA]">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#8A8078]">⏱ 60 mins</span>
                <span className="font-serif text-lg font-extrabold text-[#2C2725]">₹3,500</span>
              </div>

              <button
                type="button"
                onClick={() => handleBookServiceClick(SERVICES[2])}
                className="w-full py-3.5 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>BOOK FOR ₹99</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 4: Grooming */}
          <div className="bg-[#EFE6DA] rounded-3xl p-6 border border-[#EAE3DA] hover:border-[#C1785A] shadow-warm-soft motion-card flex flex-col justify-between space-y-5 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] flex items-center justify-center text-[#C1785A] text-lg font-bold shadow-sm">
                  💈
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-[0.08em] text-[#C1785A] block mb-1">
                  GROOMING
                </span>
                <h3 className="font-serif text-xl font-extrabold text-[#2C2725] leading-snug">
                  Executive Grooming & Beard Architecture
                </h3>
                <p className="text-xs text-[#8A8078] mt-2 leading-relaxed truncate">
                  Hot towel herbal steam, razor-sharp contouring, organic argan oil soak & scalp stimulation massage.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#EAE3DA]">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#8A8078]">⏱ 40 mins</span>
                <span className="font-serif text-lg font-extrabold text-[#2C2725]">₹1,800</span>
              </div>

              <button
                type="button"
                onClick={() => handleBookServiceClick(SERVICES[3])}
                className="w-full py-3.5 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>BOOK FOR ₹99</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
         3. PHILOSOPHY / SPLIT BAND (FULL-BLEED ROUNDED RECTANGLE CARD)
         ============================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="rounded-3xl overflow-hidden shadow-warm-lg border border-[#EAE3DA] grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Solid Terracotta Fill (#C1785A), Cream Text (#FAF6F0) */}
          <div className="lg:col-span-6 bg-[#C1785A] text-[#FAF6F0] p-8 sm:p-12 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[11px] uppercase font-bold tracking-[0.08em] text-[#FAF6F0]/80 block">
                THE PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold leading-tight">
                "It's Your Time. It's Your Glow."
              </h2>
              <p className="text-sm text-[#FAF6F0]/90 leading-relaxed">
                We believe exceptional beauty shouldn't come with hours spent idle in a crowded lobby. Rose & Rogue couples haute couture craftsmanship with a real-time queue algorithm that honors your precious calendar.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#FAF6F0]/20 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FAF6F0]/20 flex items-center justify-center text-xs">✓</span>
                <span>Live Dynamic ETA with automated chair-ready alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FAF6F0]/20 flex items-center justify-center text-xs">✓</span>
                <span>Smart Overlap Chair Optimization for 35% faster turnarounds</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FAF6F0]/20 flex items-center justify-center text-xs">✓</span>
                <span>100% Secure ₹99 token-deposit via Razorpay</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Pale Cream Fill (#F3EAE0), Dark Text (#2C2725) */}
          <div className="lg:col-span-6 bg-[#F3EAE0] text-[#2C2725] p-8 sm:p-12 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0DCCF] border border-[#EAE3DA] text-[#C1785A]">
                <span className="text-[11px] uppercase font-bold tracking-[0.08em]">
                  ARTISAN COLLECTIVE
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold">
                Master Stylists from Paris & Milan
              </h2>
              <p className="text-sm text-[#8A8078]">
                Our resident artists specialize in dimensional French balayage, sculptural bobs, and molecular scalp therapies.
              </p>
            </div>

            {/* Stylist Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] shadow-sm">
                <img src={STYLISTS[0].avatar} alt="Antoine Dubois" className="w-12 h-12 rounded-full object-cover border-2 border-[#C1785A]" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C2725]">Antoine Dubois</h4>
                  <span className="text-[11px] text-[#C1785A] font-bold block">Artistic Director</span>
                  <span className="text-[10px] text-[#8A8078]">Station #1</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] shadow-sm">
                <img src={STYLISTS[1].avatar} alt="Camille Laurent" className="w-12 h-12 rounded-full object-cover border-2 border-[#C1785A]" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C2725]">Camille Laurent</h4>
                  <span className="text-[11px] text-[#C1785A] font-bold block">Master Colorist</span>
                  <span className="text-[10px] text-[#8A8078]">Station #2</span>
                </div>
              </div>
            </div>

            {/* Full-width terracotta CTA pill button */}
            <button
              type="button"
              onClick={() => window.location.hash = '#curated-menu'}
              className="w-full py-4 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition-all text-center flex items-center justify-center gap-2"
            >
              <span>EXPLORE ALL ARTISTS & SERVICES</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </section>

      {/* ==============================================================================
         4. DUAL PORTAL SECTION (ACCESS GATEWAYS)
         ============================================================================== */}
      <section id="access-gateways" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10 pt-4">
        
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0DCCF] border border-[#EAE3DA] text-[#C1785A]">
            <span className="text-xs">✦</span>
            <span className="text-[11px] uppercase font-bold tracking-[0.08em]">
              ACCESS GATEWAYS
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">
            Dedicated Portals for Guests & Stylists
          </h2>
          <p className="text-sm text-[#8A8078]">
            Select your destination portal below for personalized token passes or salon queue administration.
          </p>
        </div>

        {/* 2-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card A — VIP Client Lounge (Light Cream #EFE6DA) */}
          <div className="bg-[#EFE6DA] rounded-3xl p-8 sm:p-10 border border-[#EAE3DA] hover:border-[#C1785A] shadow-warm-soft transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden">
            {/* Top Terracotta Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#C1785A]" />

            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] flex items-center justify-center text-[#C1785A] text-2xl font-bold shadow-sm">
                  👑
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FAF6F0] text-[#C1785A] border border-[#EAE3DA] text-[10px] font-bold uppercase tracking-[0.08em]">
                  VIP GUEST ACCESS
                </span>
              </div>

              <div>
                <h3 className="font-serif text-3xl font-extrabold text-[#2C2725]">
                  VIP Client Lounge
                </h3>
                <p className="text-xs sm:text-sm text-[#8A8078] mt-2 leading-relaxed">
                  View your live queue token passes, check real-time chair call times, review past invoices, and rate your stylists.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs font-medium text-[#2C2725]">
                <div className="flex items-center gap-3">
                  <span className="text-[#C1785A] font-bold">✓</span>
                  <span>Real-time digital token pass with scannable QR</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C1785A] font-bold">✓</span>
                  <span>One-tap Google login & verified phone authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C1785A] font-bold">✓</span>
                  <span>Exclusive loyalty points, gift vouchers & styling history</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE3DA] flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleBookServiceClick(SERVICES[0])}
                className="flex-1 py-4 px-6 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition-all text-center"
              >
                SIGN IN AS VIP CLIENT
              </button>

              <button
                type="button"
                onClick={() => handleBookServiceClick(SERVICES[0])}
                className="py-4 px-6 rounded-full bg-[#FAF6F0] hover:bg-[#EAE3DA] text-[#2C2725] border border-[#EAE3DA] text-xs font-bold uppercase tracking-[0.08em] transition-colors text-center"
              >
                BOOK SLOT (₹99)
              </button>
            </div>
          </div>

          {/* Card B — Stylist & Manager Kiosk (Near-Black Espresso #1F1B18) */}
          <div className="bg-[#1F1B18] text-[#FDF8F2] rounded-3xl p-8 sm:p-10 border border-[#3D3532] hover:border-[#C1785A] shadow-warm-lg transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden">
            {/* Top Terracotta Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#C1785A]" />

            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#2C2725] border border-[#3D3532] flex items-center justify-center text-[#C1785A] text-2xl font-bold shadow-sm">
                  ✂️
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#2C2725] text-[#FDF8F2] border border-[#3D3532] text-[10px] font-bold uppercase tracking-[0.08em]">
                  STAFF & MANAGER PORTAL
                </span>
              </div>

              <div>
                <h3 className="font-serif text-3xl font-extrabold text-[#FDF8F2]">
                  Stylist & Manager Kiosk
                </h3>
                <p className="text-xs sm:text-sm text-[#8A8078] mt-2 leading-relaxed">
                  Real-time salon queue engine, station chair rotation, walk-in token injector, and live delay optimization.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs font-medium text-[#FDF8F2]/90">
                <div className="flex items-center gap-3">
                  <span className="text-[#C1785A] font-bold">✓</span>
                  <span>Instant walk-in customer addition & queue token generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C1785A] font-bold">✓</span>
                  <span>Smart Overlap calculation for color processing & wash cycles</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C1785A] font-bold">✓</span>
                  <span>Live TV queue board synchronization & station chimes</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3D3532] flex flex-col sm:flex-row gap-3">
              <a
                href="/staff"
                className="flex-1 py-4 px-6 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition-all text-center"
              >
                SIGN IN AS STAFF ARTISAN
              </a>
              <a
                href="/admin"
                className="py-4 px-6 rounded-full bg-[#2C2725] hover:bg-[#3D3532] text-[#FDF8F2] border border-[#3D3532] text-xs font-bold uppercase tracking-[0.08em] transition-colors text-center"
              >
                MANAGER KIOSK
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
         5. FOOTER (FOUR-COLUMN, CREAM-BEIGE BACKGROUND #F3EAE0)
         ============================================================================== */}
      <FooterSection onNavigate={store.navigateTo} />

      {/* ==============================================================================
         INTERACTIVE MODALS & DIALOGS (RAZORPAY, WALK-IN, TRY-ON, QR, FEEDBACK)
         ============================================================================== */}
      
      {/* AI Try-On Modal */}
      {showTryOnStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B18]/80 backdrop-blur-md animate-fade-in">
          <VirtualTryOnStudio
            onClose={() => setShowTryOnStudio(false)}
            onSelectServiceAndBook={(recService, recStylist) => {
              setSelectedServices([recService]);
              setSelectedStylistId(recStylist.id);
              setShowTryOnStudio(false);
              addToast(`Selected AI Recommended Ritual: ${recService.name}`, 'success');
            }}
          />
        </div>
      )}

      {/* Express Walk-In Modal */}
      {showWalkInModal && (
        <WalkInModal
          isOpen={showWalkInModal}
          onClose={() => setShowWalkInModal(false)}
          onAddWalkIn={(walkIn) => {
            bookAppointment({
              customerName: walkIn.customerName,
              customerPhone: walkIn.customerPhone || '+1 555-9999',
              customerGender: 'all',
              serviceId: SERVICES[0].id,
              stylistId: walkIn.stylistId || 'elena',
              slot: 'Walk-In Now'
            });
            setShowWalkInModal(false);
            addToast(`Walk-In Token Dispensed: ${walkIn.customerName}`, 'success');
          }}
        />
      )}

      {/* Razorpay Indian Payment Modal */}
      {showRazorpayModal && (
        <RazorpayModal
          isOpen={showRazorpayModal}
          onClose={() => setShowRazorpayModal(false)}
          amount={depositAmount}
          customerName={name}
          customerPhone={phone}
          selectedServices={selectedServices}
          selectedStylist={selectedStylist}
          selectedSlot={selectedSlot}
          onSuccess={handleRazorpaySuccess}
        />
      )}

      {/* QR Code Booking Pass Modal */}
      {qrModalBooking && (
        <QRCodeModal
          booking={qrModalBooking}
          onClose={() => setQrModalBooking(null)}
          onCheckIn={checkIn}
        />
      )}

      {/* Feedback Review Modal */}
      {feedbackModalBooking && (
        <FeedbackModal
          booking={feedbackModalBooking}
          onClose={() => setFeedbackModalBooking(null)}
          onSubmitFeedback={submitFeedback}
        />
      )}

    </div>
  );
}
