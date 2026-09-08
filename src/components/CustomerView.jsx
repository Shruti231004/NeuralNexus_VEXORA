import React, { useState } from 'react';
import { SERVICES, STYLISTS, TIME_SLOTS, useCustomerDomain } from '../services/store';
import QRCodeModal from './QRCodeModal';
import FeedbackModal from './FeedbackModal';
import VirtualTryOnStudio from './VirtualTryOnStudio';

export default function CustomerView({ store }) {
  // Enforce Clean Domain Abstraction Boundary
  const { 
    bookings, getQueueInfo, bookAppointment, checkIn, 
    cancelBooking, submitFeedback, addToast 
  } = useCustomerDomain(store);

  const [showTryOnStudio, setShowTryOnStudio] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Experiences');
  const [selectedGenderTheme, setSelectedGenderTheme] = useState('all');

  // Booking Form State
  const [selectedServices, setSelectedServices] = useState([SERVICES[0], SERVICES[1]]);
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
  const [showPushNotificationMockup, setShowPushNotificationMockup] = useState(false);

  // Get active booking for current phone
  const customerBookings = bookings.filter(b => b.customerPhone === activeCustomerPhone || b.customerPhone === phone);
  const primaryBooking = customerBookings.find(b => ['booked', 'waiting', 'in-service'].includes(b.status)) || customerBookings[0];

  const queueInfo = primaryBooking ? getQueueInfo(primaryBooking.id) : null;

  // Filter services based on category and search query
  const filteredServices = SERVICES.filter(s => {
    const matchesCategory = selectedCategory === 'All Experiences' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGenderTheme === 'all' || s.gender === 'all' || s.gender === selectedGenderTheme;
    return matchesCategory && matchesSearch && matchesGender;
  });

  const toggleServiceSelection = (service) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      if (exists) {
        if (prev.length === 1) {
          addToast('Please keep at least one service selected for your ritual', 'warning');
          return prev;
        }
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleReservation = () => {
    if (!name || !phone) {
      addToast('Please provide your name and phone number', 'warning');
      return;
    }

    if (selectedServices.length === 0) {
      addToast('Please pick at least one ritual to proceed', 'warning');
      return;
    }

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
    setShowPushNotificationMockup(true);
    setTimeout(() => setShowPushNotificationMockup(false), 6000);
  };

  // Cart Calculations
  const cartTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const depositAmount = cartTotal * 0.20;
  const balanceDue = cartTotal - depositAmount;
  const selectedStylist = STYLISTS.find(s => s.id === selectedStylistId);

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      
      {/* 1. Hero Banner */}
      <section className="max-w-[1360px] mx-auto px-4 md:px-8 w-full pt-4">
        <div className="relative rounded-3xl p-6 md:p-10 bg-white border border-[#f2eaff] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Details */}
          <div className="lg:col-span-7 relative z-10 flex flex-col items-start gap-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b50060] text-white shadow-sm text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>Atelier Collection • For Every Texture & Identity</span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-[#1e1831] tracking-tight font-extrabold leading-tight">
              Crafted Hair & Scalp <span className="text-[#b50060]">Artistry</span>
            </h1>

            <p className="font-body text-xs sm:text-sm lg:text-base text-[#594047] max-w-2xl leading-relaxed">
              Immerse yourself in sensory luxury. Precision cutting, restorative scalp spas, and customized color tone rituals tailored for all genders and hair textures.
            </p>

            {/* Search & Category Filter Chips */}
            <div className="w-full mt-2 flex flex-col gap-4">
              
              {/* Search Bar */}
              <div className="relative w-full max-w-xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#594047] text-xl">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search cuts, beard sculpts, scalp rituals, or tone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-28 py-3 bg-[#f8f1ff] border border-[#e8ddff] rounded-full text-[#1e1831] font-body text-xs sm:text-sm placeholder:text-[#594047]/60 focus:outline-none focus:border-[#b50060] shadow-sm transition-all"
                />
                <button
                  type="button"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#b50060] text-white font-body text-xs font-semibold hover:bg-[#8e004a] transition-colors"
                >
                  Explore
                </button>
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full scrollbar-none">
                {['All Experiences', 'Precision Haircuts', 'Scalp & Head Spa', 'Beard & Texture Sculpt', 'Color Glaze & Tone'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full font-body text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#1e1831] text-[#fdf7ff] shadow-md font-bold'
                        : 'bg-[#ffffff] text-[#1e1831] border border-[#e8ddff] hover:bg-[#ede4ff]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Try On & Booking Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTryOnStudio(true)}
                  className="px-5 py-2.5 bg-[#f8f1ff] hover:bg-[#ede4ff] text-[#b50060] border border-[#db2379]/40 font-headline font-bold text-xs rounded-full shadow flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-base">face</span>
                  <span>Virtual Try-On & AI Matcher</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e8ddff] text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#594047]">Gender Theme:</span>
                  <button
                    onClick={() => setSelectedGenderTheme('all')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${selectedGenderTheme === 'all' ? 'bg-[#b50060] text-white' : 'bg-[#f8f1ff] text-[#594047]'}`}
                  >
                    ✨ All
                  </button>
                  <button
                    onClick={() => setSelectedGenderTheme('male')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${selectedGenderTheme === 'male' ? 'bg-[#3b82f6] text-white' : 'bg-[#f8f1ff] text-[#594047]'}`}
                  >
                    💈 Gentlemen
                  </button>
                  <button
                    onClick={() => setSelectedGenderTheme('female')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${selectedGenderTheme === 'female' ? 'bg-[#b50060] text-white' : 'bg-[#f8f1ff] text-[#594047]'}`}
                  >
                    💅 Ladies
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#594047]">Active Guest Profile:</span>
                  {Array.from(new Set(bookings.map(b => b.customerPhone))).map((ph) => {
                    const b = bookings.find(item => item.customerPhone === ph);
                    const isActive = activeCustomerPhone === ph;
                    return (
                      <button
                        key={ph}
                        onClick={() => {
                          setActiveCustomerPhone(ph);
                          if (b?.customerName) setName(b.customerName);
                          setPhone(ph);
                        }}
                        className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold transition-all ${
                          isActive 
                            ? 'bg-[#b50060] border-[#b50060] text-white shadow' 
                            : 'bg-[#f8f1ff] border-[#e8ddff] text-[#594047] hover:text-[#1e1831]'
                        }`}
                      >
                        {b?.customerName || ph}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Right Hero Showcase Image Card */}
          <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#f2eaff] group">
            <img 
              src="/hero_salon_interior.png" 
              alt="Aura Salon Atelier Interior" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1831]/80 via-transparent to-black/10"></div>
            
            {/* Floating Luxury Badges */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/60 text-[#1e1831] text-xs font-bold flex items-center gap-1.5 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse"></span>
              <span>Sanctuary Suite • Active Floor</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e8ddff] shadow-xl flex items-center justify-between">
              <div>
                <div className="text-[11px] font-extrabold text-[#b50060] uppercase tracking-wider">Aura Salon & Spa Sanctuary</div>
                <div className="text-xs font-headline font-bold text-[#1e1831]">Illuminated Petal Booths & Scalp Spa</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#f8f1ff] text-[#b50060] flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-xl">spa</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Push Notification Theater */}
      {showPushNotificationMockup && (
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 w-full">
          <div className="bg-[#f8f1ff] border-2 border-[#b50060] p-4 rounded-2xl shadow-xl animate-fade-in flex items-start gap-3.5 relative">
            <div className="w-10 h-10 rounded-xl bg-[#b50060] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <span className="material-symbols-outlined text-xl">notifications_active</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-[#b50060] font-bold mb-0.5">
                <span>AURA SALON PUSH NOTIFICATION</span>
                <span className="text-[10px] text-[#594047]">Just Now</span>
              </div>
              <p className="text-sm font-medium text-[#1e1831]">
                {queueInfo?.position <= 2 
                  ? `⚡ You're Next! Position #${queueInfo?.position} in line. Please enter Sanctuary Suite #1!` 
                  : `✨ Ritual reserved & confirmed! Track your live wait time here.`}
              </p>
            </div>
            <button onClick={() => setShowPushNotificationMockup(false)} className="text-[#594047] hover:text-[#1e1831] p-1">×</button>
          </div>
        </div>
      )}

      {/* Active Booking Tracker Card */}
      {primaryBooking && (
        <section id="my-appointments-section" className="max-w-[1360px] mx-auto px-4 md:px-8 w-full">
          <div className="bg-white border border-[#b50060]/30 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">

            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f2eaff] pb-4">
              <div>
                <div className="text-xs text-[#594047] font-medium">Active Sanctuary Reservation</div>
                <h3 className="font-headline text-xl font-bold text-[#1e1831] flex items-center gap-2">
                  <span>{primaryBooking.customerName}</span>
                  <span className="text-xs font-body text-[#594047] font-normal">({primaryBooking.customerPhone})</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={primaryBooking.status} />
                
                {primaryBooking.status === 'booked' && (
                  <button
                    onClick={() => setQrModalBooking(primaryBooking)}
                    className="p-2 text-[#b50060] hover:bg-[#f8f1ff] border border-[#e8ddff] rounded-xl transition-all"
                    title="Show Check-in QR Code"
                  >
                    <span className="material-symbols-outlined text-lg">qr_code_2</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Queue Position Box */}
              <div className="bg-[#f8f1ff] rounded-2xl p-5 border border-[#e8ddff] text-center flex flex-col items-center justify-center min-h-[160px]">
                <div className="text-xs font-semibold text-[#594047] uppercase tracking-wider mb-1">
                  Live Sanctuary Queue Position
                </div>
                {primaryBooking.status === 'waiting' ? (
                  <div className="font-serif text-6xl font-bold text-[#b50060] tracking-tight animate-bounce">
                    #{queueInfo?.position || 1}
                  </div>
                ) : primaryBooking.status === 'in-service' ? (
                  <div className="font-headline text-2xl font-bold text-[#7d2dce]">
                    In Suite
                  </div>
                ) : (
                  <div className="text-[#594047] text-xs font-medium">
                    Check in on arrival to join live line
                  </div>
                )}

                {primaryBooking.status === 'waiting' && (
                  <div className="mt-2 text-[11px] text-[#b50060] font-medium bg-[#ffd9e2] px-3 py-0.5 rounded-full border border-[#db2379]/30">
                    {queueInfo?.totalWaiting} guests total in line
                  </div>
                )}
              </div>

              {/* Wait Time Estimate */}
              <div className="md:col-span-2 bg-[#f8f1ff] rounded-2xl p-5 border border-[#e8ddff] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-[#b50060] font-bold uppercase tracking-wider mb-1">
                      Real-Time Wait Estimate
                    </div>
                    <div className="text-lg font-headline font-bold text-[#1e1831] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#b50060]">schedule</span>
                      <span>{queueInfo?.text || 'Scheduled appointment'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-[#594047]">Assigned Artisan</div>
                    <div className="text-sm font-semibold text-[#ae3115]">
                      {STYLISTS.find(s => s.id === primaryBooking.stylistId)?.name || 'Artisan Team'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  
                  {['completed', 'paid'].includes(primaryBooking.status) && (
                    <button
                      onClick={() => setFeedbackModalBooking(primaryBooking)}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#b50060] to-[#7d2dce] text-white font-semibold text-xs sm:text-sm rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02] animate-pulse"
                    >
                      <span className="material-symbols-outlined text-sm">stars</span>
                      <span>Rate Experience & Scan Feedback QR</span>
                    </button>
                  )}

                  {primaryBooking.status === 'booked' && (
                    <button
                      onClick={() => checkIn(primaryBooking.id)}
                      className="px-5 py-2.5 bg-[#b50060] hover:bg-[#8e004a] text-white font-semibold text-xs sm:text-sm rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <span className="material-symbols-outlined text-sm">how_to_reg</span>
                      <span>Check In Now (Enter Queue)</span>
                    </button>
                  )}

                  {['booked', 'waiting'].includes(primaryBooking.status) && (
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this ritual reservation? Refund policy will apply.')) {
                          cancelBooking(primaryBooking.id, 'Customer cancelled ritual');
                        }
                      }}
                      className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-semibold text-xs rounded-full flex items-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      <span>Cancel Reservation</span>
                    </button>
                  )}

                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* Main Experience Grid (Services + Cart) */}
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Services, Stylists & Time Slots (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Step 01 • Select Rituals */}
          <section id="services-section" className="flex flex-col gap-6">

            <div className="flex items-end justify-between">
              <div>
                <span className="font-body text-xs font-bold uppercase text-[#ae3115] tracking-widest">
                  Step 01 • Select Rituals
                </span>
                <h2 className="font-headline text-3xl font-bold text-[#1e1831]">Curated Signatures</h2>
              </div>
              <span className="hidden sm:inline-block font-body text-xs text-[#594047]">
                Tap to append multiple therapies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.some(s => s.id === service.id);

                return (
                  <div 
                    key={service.id}
                    className="group relative rounded-2xl bg-white border border-[#f2eaff] p-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-[#f8f1ff]">
                        <img 
                          src={service.image} 
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-[#e8ddff]">
                          <span className={`font-body text-[11px] uppercase font-bold flex items-center gap-1 ${service.badgeColor || 'text-[#b50060]'}`}>
                            <span className="material-symbols-outlined text-xs">{service.icon}</span>
                            <span>{service.badge}</span>
                          </span>
                        </div>
                      </div>

                      <h3 className="font-headline text-lg font-bold text-[#1e1831] mb-1">
                        {service.name}
                      </h3>
                      <p className="font-body text-xs text-[#594047] leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#f2eaff] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-headline text-2xl font-extrabold text-[#b50060]">
                          ₹{service.price}
                        </span>
                        <span className="text-[#594047] font-body text-xs">• {service.duration}m</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleServiceSelection(service)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#b50060] text-white shadow-md'
                            : 'bg-[#f8f1ff] text-[#1e1831] hover:bg-[#b50060] hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isSelected ? 'check' : 'add'}
                        </span>
                        <span>{isSelected ? 'Selected' : 'Add to Ritual'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Step 02 • Match with Talent */}
          <section className="flex flex-col gap-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-body text-xs font-bold uppercase text-[#b50060] tracking-widest">
                  Step 02 • Match with Talent
                </span>
                <h2 className="font-headline text-3xl font-bold text-[#1e1831]">Curated Artisans</h2>
              </div>
              <span className="font-body text-xs text-[#594047]">Guaranteed 1-on-1 dedicated attention</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STYLISTS.map((stylist) => {
                const isSelected = selectedStylistId === stylist.id;

                return (
                  <div
                    key={stylist.id}
                    onClick={() => setSelectedStylistId(stylist.id)}
                    className={`cursor-pointer group relative rounded-2xl p-5 border transition-all text-center flex flex-col items-center ${
                      isSelected
                        ? 'bg-[#f8f1ff] border-[#b50060] shadow-md ring-2 ring-[#b50060]'
                        : 'bg-white border-[#f2eaff] hover:bg-[#f8f1ff]'
                    }`}
                  >
                    <div className="relative w-20 h-20 mb-3">
                      <img 
                        src={stylist.avatar} 
                        alt={stylist.name} 
                        className="w-full h-full object-cover rounded-full shadow-inner ring-2 ring-[#b50060]/40"
                      />
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#fd6a49] ring-2 ring-white" title="Available Today"></span>
                    </div>

                    <h4 className="font-headline text-base font-bold text-[#1e1831]">{stylist.name}</h4>
                    <span className="font-body text-[11px] text-[#ae3115] uppercase font-semibold mt-0.5">
                      {stylist.role}
                    </span>

                    <div className="flex items-center gap-1 mt-1 text-[#ae3115]">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span className="font-body text-xs font-bold">{stylist.rating}</span>
                      <span className="text-[#594047] text-[11px]">({stylist.reviewsCount} reviews)</span>
                    </div>

                    <div className="mt-3 px-3 py-1 rounded-full bg-[#f8f1ff] text-[#594047] font-body text-[10px] uppercase font-semibold">
                      {stylist.nextSlot}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Step 03 • Select Moment */}
          <section className="flex flex-col gap-6">
            <div>
              <span className="font-body text-xs font-bold uppercase text-[#7d2dce] tracking-widest">
                Step 03 • Select Moment
              </span>
              <h2 className="font-headline text-3xl font-bold text-[#1e1831]">Time Sanctuary</h2>
            </div>

            {/* Calendar Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['Mon, Oct 21', 'Tue, Oct 22', 'Wed, Oct 23', 'Thu, Oct 24', 'Fri, Oct 25', 'Sat, Oct 26', 'Sun, Oct 27'].map((d) => {
                const dayName = d.split(',')[0];
                const dayNum = d.split(' ')[2];
                const isSelected = selectedDate === d;

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`min-w-[76px] py-3 px-2 rounded-2xl flex flex-col items-center transition-all ${
                      isSelected
                        ? 'bg-[#1e1831] text-[#fdf7ff] font-bold shadow-md'
                        : 'bg-white border border-[#f2eaff] text-[#1e1831] hover:bg-[#f8f1ff]'
                    }`}
                  >
                    <span className="font-body text-[10px] uppercase">{dayName}</span>
                    <span className="font-headline text-lg font-bold">{dayNum}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fd6a49] mt-1"></span>
                  </button>
                );
              })}
            </div>

            {/* Time Blocks */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-[#f2eaff]">
              
              {/* Morning */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-48">
                  <span className="material-symbols-outlined text-[#ae3115] text-lg">light_mode</span>
                  <span className="font-body text-xs text-[#1e1831] font-bold">Morning Sunshine</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['10:00 AM', '11:30 AM'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedSlot(t)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedSlot === t
                          ? 'bg-[#1e1831] text-[#fdf7ff] shadow-md font-bold'
                          : 'bg-[#f8f1ff] text-[#1e1831] hover:bg-[#ede4ff]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-[#f2eaff]"></div>

              {/* Afternoon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-48">
                  <span className="material-symbols-outlined text-[#fd6a49] text-lg">wb_sunny</span>
                  <span className="font-body text-xs text-[#1e1831] font-bold">Afternoon Energy</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['1:15 PM', '2:45 PM', '4:00 PM'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedSlot(t)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedSlot === t
                          ? 'bg-[#1e1831] text-[#fdf7ff] shadow-md font-bold'
                          : 'bg-[#f8f1ff] text-[#1e1831] hover:bg-[#ede4ff]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-[#f2eaff]"></div>

              {/* Twilight */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-48">
                  <span className="material-symbols-outlined text-[#7d2dce] text-lg">bedtime</span>
                  <span className="font-body text-xs text-[#1e1831] font-bold">Twilight Glow</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['5:30 PM', '6:45 PM'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedSlot(t)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedSlot === t
                          ? 'bg-[#1e1831] text-[#fdf7ff] shadow-md font-bold'
                          : 'bg-[#f8f1ff] text-[#1e1831] hover:bg-[#ede4ff]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Column: Sticky Reservation Cart & Guarantee (4 cols) */}
        <aside id="booking-section" className="lg:col-span-4 lg:sticky lg:top-28 w-full">

          <div className="rounded-3xl p-6 bg-white border border-[#f2eaff] shadow-xl flex flex-col gap-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#f2eaff] pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b50060] text-xl">spa</span>
                <h3 className="font-headline text-xl font-bold text-[#1e1831]">Your Ritual</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ffd9e2] text-[#b50060] font-body text-xs font-bold">
                {selectedServices.length} Selected
              </span>
            </div>

            {/* Guest Form Fields */}
            <div className="space-y-2 bg-[#f8f1ff] p-3.5 rounded-2xl border border-[#e8ddff]">
              <div className="text-[11px] text-[#594047] font-semibold uppercase tracking-wider">Guest Information</div>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  placeholder="Guest Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#e1bec6] rounded-xl px-3 py-2 text-xs text-[#1e1831] focus:outline-none focus:border-[#b50060]"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number (+1...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#e1bec6] rounded-xl px-3 py-2 text-xs text-[#1e1831] focus:outline-none focus:border-[#b50060]"
                  required
                />
              </div>
            </div>

            {/* Summary Details Chip */}
            <div className="p-3.5 rounded-xl bg-[#f8f1ff] border border-[#e8ddff] flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-[#594047]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Schedule:
                </span>
                <span className="font-semibold text-[#1e1831]">{selectedDate} • {selectedSlot}</span>
              </div>
              <div className="flex items-center justify-between text-[#594047]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">person</span>
                  Artisan:
                </span>
                <span className="font-semibold text-[#ae3115]">{selectedStylist?.name || 'Elena Vance'}</span>
              </div>
            </div>

            {/* Line items */}
            <div className="flex flex-col gap-3">
              {selectedServices.map(service => (
                <div key={service.id} className="flex items-start justify-between gap-2 pb-2 border-b border-[#f2eaff]">
                  <div>
                    <p className="font-headline text-sm font-bold text-[#1e1831]">{service.name}</p>
                    <span className="font-body text-[11px] text-[#594047]">{service.duration} mins</span>
                  </div>
                  <span className="font-headline text-base font-extrabold text-[#b50060]">₹{service.price}</span>
                </div>
              ))}
            </div>

            {/* Total Calculations */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#594047]">
                <span>Experience Total</span>
                <span className="font-bold text-[#1e1831] text-base">₹{cartTotal.toFixed(2)}</span>
              </div>

              {/* Flexible Deposit Card */}
              <div className="p-3.5 rounded-xl bg-[#f2eaff] flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#b50060]">20% Flexible Deposit</span>
                  <span className="font-headline font-extrabold text-[#b50060]">₹{depositAmount.toFixed(2)}</span>
                </div>
                <p className="font-body text-[11px] text-[#594047]">
                  Balance of <span className="font-semibold text-[#1e1831]">₹{balanceDue.toFixed(2)}</span> paid in-salon after ritual completion.
                </p>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#f8f1ff] text-xs text-[#594047] border border-[#e8ddff]">
              <span className="material-symbols-outlined text-[#ae3115] text-base">verified</span>
              <p className="text-[11px] leading-tight">
                <strong className="text-[#1e1831] font-semibold">Aura Assurance:</strong> 100% deposit refund prior to check-in. 1-click live self-service reschedule.
              </p>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleReservation}
              className="w-full py-3.5 rounded-full bg-[#b50060] hover:bg-[#8e004a] text-white font-headline font-bold text-sm shadow-md hover:opacity-95 flex items-center justify-center gap-2 transition-all"
            >
              <span>Confirm & Reserve Ritual</span>
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
            </button>

            <p className="text-center font-body text-[10px] text-[#594047] uppercase tracking-wider">
              Secured via 256-Bit Encrypted Concierge
            </p>

          </div>
        </aside>

      </div>

      {/* Virtual Try On Studio Modal */}
      {showTryOnStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1831]/70 backdrop-blur-md animate-fade-in">
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

      {/* Modals */}
      {qrModalBooking && (
        <QRCodeModal
          booking={qrModalBooking}
          onClose={() => setQrModalBooking(null)}
          onCheckIn={checkIn}
        />
      )}

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

function StatusBadge({ status }) {
  let badgeStyle = 'bg-[#f8f1ff] text-[#594047] border-[#e8ddff]';
  let label = status;

  if (status === 'booked') badgeStyle = 'bg-blue-100 text-blue-800 border-blue-300';
  else if (status === 'waiting') badgeStyle = 'bg-[#ffd9e2] text-[#b50060] border-[#db2379]/40 animate-pulse';
  else if (status === 'in-service') badgeStyle = 'bg-[#efdbff] text-[#7d2dce] border-[#974ce9]/40 animate-pulse';
  else if (status === 'completed') badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  else if (status === 'cancelled') badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      {label}
    </span>
  );
}
