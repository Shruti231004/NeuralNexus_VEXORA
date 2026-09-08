'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  Scissors,
  Calendar,
  Lock,
  ArrowRight,
  Info,
  Loader2,
  QrCode,
  Camera,
  CameraOff,
  Zap,
  RefreshCw,
  Award,
  CheckCircle2,
  Star,
  Ticket,
  Home,
  CheckCheck,
  CalendarDays,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_STYLISTS, INITIAL_SALON } from '@/lib/mockData';
import { Service, Stylist, Appointment } from '@/lib/types';
import { formatINR } from '@/lib/queueEngine';
import { RazorpayModal } from '@/components/RazorpayModal';
import { QueueTokenModal } from '@/components/QueueTokenModal';
import { GoogleIcon } from '@/components/GoogleIcon';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';
import { GoogleSecurityGate } from '@/components/GoogleSecurityGate';
import { createAppointment, subscribeToAppointments } from '@/lib/supabaseClient';
import { playChime } from '@/lib/soundEffects';
import { sendWhatsAppBookingConfirmation } from '@/lib/whatsappService';
import { VirtualStyleMirrorModal } from '@/components/VirtualStyleMirrorModal';
import { AtHomeServiceModal } from '@/components/AtHomeServiceModal';
import {
  getAvailableStylistsForSlot,
  getTodayDateString,
  timeToMinutes,
  minutesTo12Hour,
} from '@/lib/stylistAvailability';
import confetti from 'canvas-confetti';

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get('service');

  const [bookingMode, setBookingMode] = useState<'standard' | 'scanner'>('standard');
  const [isVirtualMirrorOpen, setIsVirtualMirrorOpen] = useState(false);
  const [isAtHomeModalOpen, setIsAtHomeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<Service>(
    INITIAL_SERVICES.find((s) => s.id === preselectedServiceId) || INITIAL_SERVICES[0]
  );

  // Time-Wise Appointment Scheduling State
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  const [availableStylists, setAvailableStylists] = useState<Stylist[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [customServiceNote, setCustomServiceNote] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Scanner state inside Book module
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isInstantBooking, setIsInstantBooking] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queueCount, setQueueCount] = useState(2);
  const [createdTokenAppointment, setCreatedTokenAppointment] = useState<Appointment | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Dynamic time-based availability calculation
  useEffect(() => {
    const artisans = getAvailableStylistsForSlot(selectedDate, selectedTimeSlot);
    setAvailableStylists(artisans);
    if (selectedStylist && !artisans.some((st) => st.id === selectedStylist.id)) {
      setSelectedStylist(null);
    }

    const handleScheduleUpdate = () => {
      const fresh = getAvailableStylistsForSlot(selectedDate, selectedTimeSlot);
      setAvailableStylists(fresh);
    };

    window.addEventListener('stylist-availability-updated', handleScheduleUpdate);
    return () => {
      window.removeEventListener('stylist-availability-updated', handleScheduleUpdate);
    };
  }, [selectedDate, selectedTimeSlot]);

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((appointments: Appointment[]) => {
      const waiting = appointments.filter((a) => a.status === 'waiting').length;
      setQueueCount(waiting);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Cut & Style', 'Color Services', 'Spa & Scalp Rituals', 'Hair Treatments', 'Grooming', 'Custom Request'];

  const filteredServices =
    selectedCategory === 'All'
      ? INITIAL_SERVICES
      : INITIAL_SERVICES.filter((s) => s.category === selectedCategory);

  // Date selection options (Next 7 days)
  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayLabel, formattedDate };
  });

  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and mobile number.');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setIsSubmitting(true);
    const now = new Date();

    // Calculate targeted start time from date + time slot
    const assignedStylist = selectedStylist || (availableStylists.length > 0 ? availableStylists[0] : INITIAL_STYLISTS[0]);
    const customReqPrefix = customServiceNote.trim() ? `[CUSTOM SERVICE: ${customServiceNote.trim()}] ` : '';
    const slotNotes = `[SCHEDULED SLOT: ${selectedDate} at ${selectedTimeSlot}] ${customReqPrefix}${notes.trim() || ''}`.trim();

    const newApt = await createAppointment({
      salon_id: INITIAL_SALON.id,
      service_id: selectedService.id,
      stylist_id: assignedStylist.id,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim() || undefined,
      queue_number: '',
      status: 'waiting',
      is_walk_in: false,
      deposit_paid: true,
      deposit_amount_inr: 99,
      razorpay_payment_id: paymentId,
      estimated_start_time: new Date(now.getTime() + 15 * 60000).toISOString(),
      notes: slotNotes,
      service: selectedService,
      stylist: assignedStylist,
    });

    setIsSubmitting(false);
    setIsPaymentModalOpen(false);
    setCreatedTokenAppointment(newApt);
    setIsTokenModalOpen(true);
    playChime('bell');

    if (newApt && newApt.customer_phone) {
      sendWhatsAppBookingConfirmation(newApt, queueCount + 1, (queueCount + 1) * 20);
    }
  };

  // Instant Scan & Book Handler
  const executeScanAndBook = async (customName?: string) => {
    setIsInstantBooking(true);
    playChime('bell');

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C1785A', '#E8D8CE', '#8C462C'],
      });
    } catch (e) {}

    const now = new Date();
    const estStart = new Date(now.getTime() + (queueCount + 1) * 15 * 60000).toISOString();

    const chosenName =
      customName ||
      customerName.trim() ||
      `Express Guest #${Math.floor(100 + Math.random() * 900)}`;

    const assignedStylist = selectedStylist || (availableStylists.length > 0 ? availableStylists[0] : INITIAL_STYLISTS[0]);

    const newApt = await createAppointment({
      salon_id: INITIAL_SALON.id,
      service_id: selectedService.id,
      stylist_id: assignedStylist.id,
      customer_name: chosenName,
      customer_phone: customerPhone.trim() || '+91 98000 00000',
      customer_email: customerEmail.trim() || undefined,
      queue_number: '',
      status: 'waiting',
      is_walk_in: true,
      deposit_paid: true,
      deposit_amount_inr: 0,
      estimated_start_time: estStart,
      notes: `[QR EXPRESS WALK-IN] Scheduled for ${selectedTimeSlot}`,
      service: selectedService,
      stylist: assignedStylist,
    });

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setCameraActive(false);
    setIsScanning(false);
    setIsInstantBooking(false);

    if (newApt) {
      setCreatedTokenAppointment(newApt);
      setIsTokenModalOpen(true);
    }
  };

  const startScannerCamera = async () => {
    setIsScanning(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);

        setTimeout(() => {
          setIsScanning(false);
          executeScanAndBook();
        }, 2200);
      } else {
        triggerSimulatedScan();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      triggerSimulatedScan();
    }
  };

  const stopScannerCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  };

  const triggerSimulatedScan = () => {
    setIsScanning(true);
    playChime('notification');
    setTimeout(() => {
      setIsScanning(false);
      executeScanAndBook();
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C2725] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5E6DF] border border-[#E8D8CE] text-[#8C462C]">
            <Sparkles className="w-4 h-4 text-[#C1785A]" />
            <span className="text-xs uppercase font-extrabold tracking-[0.25em]">
              Bespoke Time-Slot Reservation
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2C2725]">
            Reserve Your Styling Session
          </h1>
          <p className="text-sm sm:text-base text-[#6E6663] max-w-xl mx-auto">
            Book appointments by exact time slot with real-time available master artisans, or use our instant QR scanner.
          </p>

          {/* Quick-Switch Booking Modes */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setBookingMode('standard')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                bookingMode === 'standard'
                  ? 'bg-[#C1785A] text-[#FAF6F0] shadow-warm'
                  : 'bg-[#F3ECE3] text-[#6E6663] hover:text-[#2C2725] border border-[#EAE3DA]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Time-Wise Booking</span>
            </button>

            <button
              type="button"
              onClick={() => setIsVirtualMirrorOpen(true)}
              className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 bg-white hover:bg-[#F5E6DF] border-2 border-[#C1785A] text-[#8C462C] shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-[#C1785A]" />
              <span>Virtual AR Style Try-On</span>
              <span className="w-2 h-2 rounded-full bg-[#C1785A] animate-ping" />
            </button>

            <button
              type="button"
              onClick={() => setIsAtHomeModalOpen(true)}
              className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 bg-[#2C2725] hover:bg-[#3D3532] text-white shadow-warm"
            >
              <Home className="w-3.5 h-3.5 text-[#D48464]" />
              <span>Book At-Home Concierge</span>
            </button>

            <button
              type="button"
              onClick={() => setBookingMode('scanner')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                bookingMode === 'scanner'
                  ? 'bg-[#C1785A] text-[#FAF6F0] shadow-warm'
                  : 'bg-[#F3ECE3] text-[#6E6663] hover:text-[#2C2725] border border-[#EAE3DA]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Quick Add</span>
            </button>
          </div>
        </div>

        {/* 1. SCANNER MODE (QR Express) */}
        {bookingMode === 'scanner' && (
          <div className="bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center mx-auto shadow-warm">
                <QrCode className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725]">
                Scan Salon QR to Book Appointment
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6663] max-w-md mx-auto">
                Point your camera at the salon TV board or standee code to generate your queue ticket and open your live tracker.
              </p>
            </div>

            <div className="relative w-full max-w-sm mx-auto aspect-square bg-[#2C2725] rounded-3xl border-4 border-[#C1785A] overflow-hidden shadow-warm-lg flex flex-col items-center justify-center p-6 text-center text-white">
              {cameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#C1785A] rounded-tl-lg z-20" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#C1785A] rounded-tr-lg z-20" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#C1785A] rounded-bl-lg z-20" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#C1785A] rounded-br-lg z-20" />

              {isScanning && (
                <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#C1785A] to-transparent shadow-[0_0_20px_#C1785A] animate-bounce z-20" />
              )}

              {!cameraActive && (
                <div className="space-y-3 z-10">
                  <div className="w-20 h-20 bg-white p-2 rounded-2xl mx-auto shadow-md">
                    <QrCode className="w-full h-full text-[#2C2725]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#E8D8CE]">
                      {isScanning
                        ? 'Decoding Salon QR...'
                        : isInstantBooking
                        ? 'Booking Confirmed!...'
                        : 'Rose & Rogue QR Ready'}
                    </p>
                    <p className="text-[11px] text-[#DDD3C6] mt-0.5">
                      Aim at Salon QR or tap button below
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-3 z-20">
                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={startScannerCamera}
                    className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#FAF6F0] text-[11px] font-bold tracking-wider uppercase border border-white/20 flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#C1785A]" />
                    <span>Open Live Camera</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopScannerCamera}
                    className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#FAF6F0] text-[11px] font-bold tracking-wider uppercase border border-white/20 flex items-center gap-1.5 transition-colors"
                  >
                    <CameraOff className="w-3.5 h-3.5 text-[#E8D8CE]" />
                    <span>Stop Camera</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#EAE3DA] space-y-4 max-w-lg mx-auto">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-[#C1785A]" />
                  Guest Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Radhika / Express Guest"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] flex items-center gap-1.5 mb-1">
                  <Scissors className="w-3.5 h-3.5 text-[#C1785A]" />
                  Service Selected
                </label>
                <select
                  value={selectedService.id}
                  onChange={(e) => {
                    const found = INITIAL_SERVICES.find((s) => s.id === e.target.value);
                    if (found) setSelectedService(found);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                >
                  {INITIAL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration_minutes}m • {formatINR(s.price_inr)})
                    </option>
                  ))}
                </select>

                {selectedService.name.includes('Other') && (
                  <div className="pt-2 animate-fadeIn">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C462C] block mb-1">
                      Specify Custom Request:
                    </label>
                    <input
                      type="text"
                      required
                      value={customServiceNote}
                      onChange={(e) => setCustomServiceNote(e.target.value)}
                      placeholder="e.g. Extensions, Special Color, Scalp Detox..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#C1785A] bg-[#FAF6F0] text-xs font-bold text-[#2C2725] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={triggerSimulatedScan}
                disabled={isScanning || isInstantBooking}
                className="w-full py-4 px-6 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-sm font-bold uppercase tracking-[0.18em] shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Scanning Salon Code...</span>
                  </>
                ) : isInstantBooking ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Appointment Booked! Loading Tracker...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Scan & Book Appointment Now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setBookingMode('standard')}
                className="w-full py-2 text-center text-xs font-bold text-[#6E6663] hover:text-[#2C2725]"
              >
                Switch to Standard Time-Slot Reservation Form
              </button>
            </div>
          </div>
        )}

        {/* 2. TIME-WISE STANDARD FORM MODE */}
        {bookingMode === 'standard' && (
          <form onSubmit={handleOpenPayment} className="space-y-10">
            
            {/* STEP 1: Select Service */}
            <div className="bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3DA] pb-5">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold block">
                    Step 01
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2C2725] mt-0.5">Select Service</h2>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-[#C1785A] text-[#FAF6F0] shadow-sm'
                          : 'bg-[#FAF6F0] text-[#6E6663] hover:text-[#2C2725] border border-[#EAE3DA]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => {
                  const isSelected = selectedService.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        playChime('tap');
                      }}
                      className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FAF6F0] border-[#C1785A] shadow-warm ring-2 ring-[#C1785A]/25'
                          : 'bg-white/70 border-[#EAE3DA] hover:border-[#DDD3C6]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C462C]">
                            {service.category}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#C1785A] text-white flex items-center justify-center text-xs shadow-sm">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#2C2725]">{service.name}</h3>
                        <p className="text-xs text-[#6E6663] line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#EAE3DA] flex items-center justify-between">
                        <span className="text-xs text-[#6E6663] font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C1785A]" />
                          {service.duration_minutes} mins
                        </span>
                        <span className="font-serif font-extrabold text-base text-[#2C2725]">
                          {formatINR(service.price_inr)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedService.name.includes('Other') && (
                <div className="p-5 rounded-3xl bg-white border-2 border-[#C1785A] shadow-warm space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C462C]">
                    <Sparkles className="w-4 h-4 text-[#C1785A]" />
                    <span>Specify Your Custom Hair &amp; Beauty Service Request:</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={customServiceNote}
                    onChange={(e) => setCustomServiceNote(e.target.value)}
                    placeholder="e.g. Tape-in Extensions, Root Retouch, Special Bridal Consultation, Texture Spa..."
                    className="w-full px-4 py-3 rounded-2xl border border-[#EAE3DA] bg-[#FAF6F0] text-sm font-bold text-[#2C2725] focus:outline-none focus:border-[#C1785A] shadow-inner"
                  />
                  <p className="text-[11px] text-[#6E6663]">
                    Our master artisans will review your custom notes prior to your appointment session.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 2: Pick Appointment Date & Dynamic Time */}
            <div className="bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-6">
              <div className="border-b border-[#EAE3DA] pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold block">
                      Step 02
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#2C2725] mt-0.5">
                      Choose Date &amp; Dynamic Time
                    </h2>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0] text-[#8C462C] border border-[#E8D0C5] text-xs font-mono font-bold self-start sm:self-auto shadow-sm">
                    {selectedTimeSlot} &bull; {selectedDate}
                  </span>
                </div>
                <p className="text-xs text-[#6E6663] mt-1">
                  Choose any arrival time. Master artisans on duty at your exact time will be dynamically matched below.
                </p>
              </div>

              {/* Date Selector Pills */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A423D] flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#C1785A]" />
                  <span>Select Date:</span>
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {dateOptions.map((opt) => {
                    const isSelected = selectedDate === opt.dateStr;
                    return (
                      <button
                        key={opt.dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(opt.dateStr);
                          playChime('tap');
                        }}
                        className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center shrink-0 min-w-[90px] ${
                          isSelected
                            ? 'bg-[#C1785A] text-white shadow-warm border-[#C1785A]'
                            : 'bg-white text-[#6E6663] hover:text-[#2C2725] border-[#EAE3DA] hover:bg-[#FAF6F0]'
                        }`}
                      >
                        <span className="text-xs">{opt.dayLabel}</span>
                        <span className="text-[10px] opacity-80">{opt.formattedDate}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Time Selector & Presets */}
              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-3xl bg-white border border-[#EAE3DA] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C462C] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#C1785A]" />
                      <span>Preferred Dynamic Arrival Time:</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const curr = timeToMinutes(selectedTimeSlot);
                          setSelectedTimeSlot(minutesTo12Hour(curr - 15));
                          playChime('tap');
                        }}
                        className="px-3 py-1 rounded-xl bg-[#F3ECE3] hover:bg-[#EAE3DA] text-xs font-bold text-[#2C2725] border border-[#EAE3DA]"
                      >
                        -15 min
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const curr = timeToMinutes(selectedTimeSlot);
                          setSelectedTimeSlot(minutesTo12Hour(curr + 15));
                          playChime('tap');
                        }}
                        className="px-3 py-1 rounded-xl bg-[#F3ECE3] hover:bg-[#EAE3DA] text-xs font-bold text-[#2C2725] border border-[#EAE3DA]"
                      >
                        +15 min
                      </button>
                    </div>
                  </div>

                  {/* Primary Dynamic Time Display & Input */}
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      placeholder="e.g. 11:30 AM or 02:45 PM"
                      className="w-full px-5 py-3.5 rounded-2xl border-2 border-[#C1785A]/40 focus:border-[#C1785A] bg-[#FAF6F0] font-mono text-base sm:text-lg font-extrabold text-[#2C2725] focus:outline-none shadow-inner"
                    />
                  </div>

                  {/* Quick Dynamic Time Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#6E6663] tracking-wider block">
                      Quick Time Presets:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: '⚡ Next Available', time: '11:00 AM' },
                        { label: '🌅 Morning (11:30 AM)', time: '11:30 AM' },
                        { label: '☀️ Midday (01:30 PM)', time: '01:30 PM' },
                        { label: '🌇 Afternoon (03:45 PM)', time: '03:45 PM' },
                        { label: '✨ Evening (05:30 PM)', time: '05:30 PM' },
                        { label: '🌙 Late (07:30 PM)', time: '07:30 PM' },
                      ].map((preset) => {
                        const isPresetActive = selectedTimeSlot === preset.time;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setSelectedTimeSlot(preset.time);
                              playChime('tap');
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                              isPresetActive
                                ? 'bg-[#C1785A] text-white shadow-warm'
                                : 'bg-[#F3ECE3] hover:bg-[#EAE3DA] text-[#4A423D]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Artisan Availability Status Feedback */}
                  <div className="p-3 rounded-2xl bg-[#F5E6DF] border border-[#E8D0C5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C1785A]" />
                      <span className="font-bold text-[#8C462C]">
                        {availableStylists.length > 0
                          ? `${availableStylists.length} Master Artisan${availableStylists.length > 1 ? 's' : ''} on duty at ${selectedTimeSlot}`
                          : `No artisans on duty at ${selectedTimeSlot} (Please adjust time)`}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8C462C] uppercase font-bold">
                      Dynamic Match
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Choose Available Master Stylist */}
            <div className="bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-6">
              <div className="border-b border-[#EAE3DA] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold block">
                    Step 03
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2C2725] mt-0.5">
                    Available Master Artisans ({selectedTimeSlot})
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF6F0] rounded-full border border-[#E8D0C5] text-xs text-[#8C462C] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{availableStylists.length} Artisans Available</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {/* Any Available Artisan Option */}
                <div
                  onClick={() => {
                    setSelectedStylist(null);
                    playChime('tap');
                  }}
                  className={`cursor-pointer p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                    selectedStylist === null
                      ? 'bg-[#FAF6F0] border-[#C1785A] shadow-warm ring-2 ring-[#C1785A]/25'
                      : 'bg-white/70 border-[#EAE3DA] hover:border-[#DDD3C6]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#F5E6DF] text-[#8C462C] flex items-center justify-center font-bold mb-2 shadow-inner">
                    <Sparkles className="w-5 h-5 text-[#C1785A]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#2C2725]">Any Available</h4>
                    <p className="text-[10px] text-[#8C462C] font-extrabold mt-0.5">Fastest Turn</p>
                  </div>
                  <span className="text-[9px] text-[#6E6663] mt-2 bg-[#EAE3DA] px-2 py-0.5 rounded-full font-bold">
                    Auto-Matched
                  </span>
                </div>

                {/* ONLY Artisans Actually Available at this Slot */}
                {availableStylists.map((stylist) => {
                  const isSelected = selectedStylist?.id === stylist.id;
                  return (
                    <div
                      key={stylist.id}
                      onClick={() => {
                        setSelectedStylist(stylist);
                        playChime('tap');
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#FAF6F0] border-[#C1785A] shadow-warm ring-2 ring-[#C1785A]/25'
                          : 'bg-white/70 border-[#EAE3DA] hover:border-[#DDD3C6]'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={stylist.avatar_url}
                          alt={stylist.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#C1785A] mb-2 shadow-sm"
                        />
                        <span className="absolute bottom-1 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                      </div>

                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#2C2725] line-clamp-1">
                          {stylist.name}
                        </h4>
                        <p className="text-[10px] text-[#6E6663] line-clamp-1">{stylist.title}</p>
                        
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-[#C98A2C] fill-[#C98A2C]" />
                          <span className="text-[10px] font-bold text-[#2C2725]">
                            {stylist.rating || 4.95}
                          </span>
                        </div>
                      </div>

                      <span className="text-[9px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full mt-2">
                        Available at {selectedTimeSlot}
                      </span>
                    </div>
                  );
                })}
              </div>

              {availableStylists.length === 0 && (
                <div className="p-4 rounded-2xl bg-[#F5E6DF] border border-[#E8D0C5] text-center text-xs text-[#8C462C] font-medium">
                  All artisans are currently booked for {selectedTimeSlot}. Please select an adjacent time slot above.
                </div>
              )}
            </div>

            {/* STEP 4: Customer Information */}
            <div className="bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-6">
              <div className="border-b border-[#EAE3DA] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold block">
                    Step 04
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2C2725] mt-0.5">Guest &amp; Notification Details</h2>
                  <p className="text-xs text-[#6E6663] mt-0.5">
                    We dispatch automated WhatsApp confirmations and SMS reminders before your slot.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#FAF6F0] hover:bg-[#F5E6DF] border border-[#EAE3DA] text-xs font-bold text-[#2C2725] transition-all flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Auto-fill with Google</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#4A423D] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C1785A]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Merchant"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#4A423D] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C1785A]" />
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#4A423D] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C1785A]" />
                    Email (for VIP receipt)
                  </label>
                  <input
                    type="email"
                    placeholder="radhika@luxury.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#4A423D] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#C1785A]" />
                    Styling Notes / Hair Preferences
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sensitive scalp, curtain layers preference"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]"
                  />
                </div>
              </div>
            </div>

            {/* SUMMARY & PROCEED CTA */}
            <div className="bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl shadow-card flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#EAE3DA]">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C1785A] font-bold">
                  Lock-in Summary
                </span>
                <h3 className="font-serif text-2xl font-extrabold text-[#2C2725]">{selectedService.name}</h3>
                <p className="text-xs sm:text-sm text-[#6E6663]">
                  Scheduled for <strong className="text-[#2C2725]">{selectedTimeSlot} ({selectedDate})</strong> with{' '}
                  <strong className="text-[#8C462C]">{selectedStylist ? selectedStylist.name : 'First Available Artisan'}</strong>
                  {' '}• Total: {formatINR(selectedService.price_inr)} • Advance Deposit:{' '}
                  <strong className="text-[#8C462C] font-bold text-base">₹99.00</strong>
                </p>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-[0.18em] shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm Slot &amp; Deposit (₹99)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Razorpay Modal */}
        <RazorpayModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          service={selectedService}
          stylist={selectedStylist || undefined}
          customerName={customerName}
          customerPhone={customerPhone}
          onSuccess={handlePaymentSuccess}
        />

        {/* Virtual Style Mirror Modal */}
        <VirtualStyleMirrorModal
          isOpen={isVirtualMirrorOpen}
          onClose={() => setIsVirtualMirrorOpen(false)}
          onSelectService={(serviceId) => {
            const found = INITIAL_SERVICES.find((s) => s.id === serviceId);
            if (found) setSelectedService(found);
            setIsVirtualMirrorOpen(false);
          }}
        />

        {/* Haute At-Home Service Modal */}
        <AtHomeServiceModal
          isOpen={isAtHomeModalOpen}
          onClose={() => setIsAtHomeModalOpen(false)}
        />

        {/* Token Pass Modal */}
        {createdTokenAppointment && (
          <QueueTokenModal
            isOpen={isTokenModalOpen}
            onClose={() => {
              setIsTokenModalOpen(false);
              router.push(`/track/${createdTokenAppointment.id}`);
            }}
            appointment={createdTokenAppointment}
            queuePosition={queueCount + 1}
            estimatedWaitMinutes={(queueCount + 1) * 20}
          />
        )}

        {/* Google Authentication Modal */}
        <GoogleAuthModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          onSuccess={(userData) => {
            if (userData?.name) setCustomerName(userData.name);
            if (userData?.email) setCustomerEmail(userData.email);
            setIsGoogleModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-[#C1785A] animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#8C462C] font-bold">
              Loading Reservation Portal...
            </p>
          </div>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
