'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  QrCode,
  Camera,
  CameraOff,
  Sparkles,
  Scissors,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Zap,
  User,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Flame,
  Award,
  Clock,
  Tv,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_STYLISTS, INITIAL_SALON } from '@/lib/mockData';
import { createAppointment, subscribeToAppointments } from '@/lib/supabaseClient';
import { playChime } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';
import { formatINR } from '@/lib/queueEngine';
import { QueueTokenModal } from '@/components/QueueTokenModal';
import { GoogleSecurityGate } from '@/components/GoogleSecurityGate';
import { sendWhatsAppBookingConfirmation } from '@/lib/whatsappService';
import { Appointment } from '@/lib/types';

function ScanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoBook = searchParams.get('auto') === 'true';
  const serviceIdParam = searchParams.get('service');

  const [guestName, setGuestName] = useState('Walk-in Guest');
  const [guestPhone, setGuestPhone] = useState('+91 98000 00000');
  const [selectedServiceId, setSelectedServiceId] = useState(
    serviceIdParam || INITIAL_SERVICES[0].id
  );
  const [selectedStylistId, setSelectedStylistId] = useState(INITIAL_STYLISTS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
  const [queueCount, setQueueCount] = useState(2);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showSalonQrModal, setShowSalonQrModal] = useState(false);
  const [createdTokenApt, setCreatedTokenApt] = useState<Appointment | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Subscribe to live queue count
  useEffect(() => {
    const unsubscribe = subscribeToAppointments((appointments) => {
      const waiting = appointments.filter((a) => a.status === 'waiting').length;
      setQueueCount(waiting);
    });
    return () => unsubscribe();
  }, []);

  // Main booking execution function
  const executeInstantBooking = async (
    name: string,
    phone: string,
    serviceId: string,
    stylistId: string
  ) => {
    setIsBooking(true);
    playChime('bell');

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#C1785A', '#E8D8CE', '#8C462C', '#F3ECE3'],
      });
    } catch (e) {}

    const selectedService =
      INITIAL_SERVICES.find((s) => s.id === serviceId) || INITIAL_SERVICES[0];
    const selectedStylist =
      INITIAL_STYLISTS.find((s) => s.id === stylistId) || INITIAL_STYLISTS[0];
    const now = new Date();
    const estStart = new Date(
      now.getTime() + (queueCount + 1) * 15 * 60000
    ).toISOString();

    const newApt = await createAppointment({
      salon_id: INITIAL_SALON.id,
      service_id: selectedService.id,
      stylist_id: selectedStylist.id,
      customer_name:
        name.trim() || `Express Guest #${Math.floor(100 + Math.random() * 900)}`,
      customer_phone: phone.trim() || '+91 98000 00000',
      customer_email: '',
      queue_number: '',
      status: 'waiting',
      is_walk_in: true,
      deposit_paid: true,
      deposit_amount_inr: 0,
      estimated_start_time: estStart,
      service: selectedService,
      stylist: selectedStylist,
      notes: 'Booked via Instant QR Lounge Scanner',
    });

    // Stop camera stream if active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsBooking(false);
    setCreatedTokenApt(newApt);
    setIsTokenModalOpen(true);

    // Auto-dispatch Meta WhatsApp confirmation pass
    if (newApt && newApt.customer_phone) {
      sendWhatsAppBookingConfirmation(newApt, queueCount + 1, (queueCount + 1) * 15);
    }
  };

  // Auto-book if accessed via scanned URL (e.g., from TV Flight Board QR code)
  useEffect(() => {
    if (autoBook && !hasAutoTriggered) {
      setHasAutoTriggered(true);
      executeInstantBooking(
        'QR Express Guest',
        '+91 98000 00000',
        selectedServiceId,
        selectedStylistId
      );
    }
  }, [autoBook, hasAutoTriggered, selectedServiceId, selectedStylistId]);

  // Start live device camera for real scanning
  const startCamera = async () => {
    setCameraError(null);
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
        setIsScanning(true);

        // Auto-detect & simulate code trigger after pointing camera for 2.2s
        setTimeout(() => {
          setIsScanning(false);
          executeInstantBooking(
            guestName,
            guestPhone,
            selectedServiceId,
            selectedStylistId
          );
        }, 2200);
      } else {
        setCameraError('Camera access not supported in this browser.');
      }
    } catch (err: any) {
      console.warn('Camera permission denied or not available:', err);
      setCameraError('Camera permission not granted. Using simulated laser scanner.');
      handleSimulateScan();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  };

  // Simulate scanning action
  const handleSimulateScan = () => {
    setIsScanning(true);
    playChime('notification');
    setTimeout(() => {
      setIsScanning(false);
      executeInstantBooking(
        guestName,
        guestPhone,
        selectedServiceId,
        selectedStylistId
      );
    }, 1500);
  };

  const selectedService =
    INITIAL_SERVICES.find((s) => s.id === selectedServiceId) ||
    INITIAL_SERVICES[0];
  const selectedStylist =
    INITIAL_STYLISTS.find((s) => s.id === selectedStylistId) ||
    INITIAL_STYLISTS[0];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C2725] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#6E6663] hover:text-[#2C2725] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSalonQrModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#EAE3DA] text-xs font-bold text-[#8C462C] hover:bg-[#F3ECE3] transition-colors shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5 text-[#C1785A]" />
              <span>Show Salon QR</span>
            </button>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE3] border border-[#EAE3DA] text-xs font-bold text-[#8C462C]">
              <Sparkles className="w-3.5 h-3.5 text-[#C1785A]" />
              <span>Instant Scan-To-Book</span>
            </div>
          </div>
        </div>

        {/* Main Scanner Card */}
        <div className="bg-[#F3ECE3] rounded-3xl border border-[#EAE3DA] p-6 sm:p-8 shadow-card space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center mx-auto shadow-warm">
              <QrCode className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">
              Scan & Instant Book
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6663] max-w-md mx-auto">
              Scanning the salon QR code instantly reserves your chair, assigns your stylist, and puts you into the live queue with real-time tracking.
            </p>
          </div>

          {/* Interactive Camera Viewfinder / Laser Scanner */}
          <div className="relative w-full max-w-sm mx-auto aspect-square bg-[#2C2725] rounded-3xl border-4 border-[#C1785A] overflow-hidden shadow-warm-lg flex flex-col items-center justify-center p-6 text-center text-white">
            {/* Real Camera Video Feed */}
            {cameraActive && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Camera Viewfinder Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#C1785A] rounded-tl-lg z-20" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#C1785A] rounded-tr-lg z-20" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#C1785A] rounded-bl-lg z-20" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#C1785A] rounded-br-lg z-20" />

            {/* Animated Laser Bar when Scanning */}
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
                      : isBooking
                      ? 'Booking Confirmed!...'
                      : 'Styliq QR Ready'}
                  </p>
                  <p className="text-[11px] text-[#DDD3C6] mt-0.5">
                    Point camera at TV Flight Board or tap below
                  </p>
                </div>
              </div>
            )}

            {/* Camera Switch Pill */}
            <div className="absolute bottom-3 z-20">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#FAF6F0] text-[11px] font-bold tracking-wider uppercase border border-white/20 flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-[#C1785A]" />
                  <span>Open Live Camera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#FAF6F0] text-[11px] font-bold tracking-wider uppercase border border-white/20 flex items-center gap-1.5 transition-colors"
                >
                  <CameraOff className="w-3.5 h-3.5 text-[#E8D8CE]" />
                  <span>Stop Camera</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Details Selector */}
          <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#EAE3DA] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAE3DA] pb-3">
              <h3 className="font-serif font-bold text-base text-[#2C2725]">
                Express Check-in Details
              </h3>
              <span className="text-xs text-[#8C462C] font-bold bg-[#F5E6DF] px-2.5 py-1 rounded-full border border-[#E8D0C5]">
                Fast-Track Pass
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-[#C1785A]" />
                  Client Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Radhika / Walk-in Guest"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] flex items-center justify-between gap-1.5 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C1785A]" />
                    WhatsApp Mobile Number
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">Auto-Pass via WhatsApp ✓</span>
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 96377 75648"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] flex items-center gap-1.5 mb-1">
                    <Scissors className="w-3.5 h-3.5 text-[#C1785A]" />
                    Selected Service
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                  >
                    {INITIAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.duration_minutes}m • {formatINR(s.price_inr)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-[#C1785A]" />
                    Stylist / Station
                  </label>
                  <select
                    value={selectedStylistId}
                    onChange={(e) => setSelectedStylistId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                  >
                    {INITIAL_STYLISTS.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} (Station #{st.chair_number} • {st.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Instant Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning || isBooking}
                className="w-full py-4 px-6 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-sm font-bold uppercase tracking-[0.18em] shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Scanning Salon Code...</span>
                  </>
                ) : isBooking ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Appointment Booked! Opening Live Tracker...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Scan & Book Appointment Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guarantee Footer */}
          <div className="flex items-center justify-between text-xs text-[#6E6663] pt-1 border-t border-[#EAE3DA]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#8C462C]" />
              Instant Live Queue Insertion
            </span>
            <span>Real-time Dynamic ETA</span>
          </div>
        </div>

        {/* Salon QR Standee Popup Modal */}
        {showSalonQrModal && (
          <div className="fixed inset-0 z-50 bg-[#2C2725]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FAF6F0] rounded-3xl border border-[#EAE3DA] max-w-md w-full p-8 shadow-2xl space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C462C] bg-[#F5E6DF] px-3 py-1 rounded-full border border-[#E8D0C5] inline-block">
                  Salon Standee Code
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2C2725]">
                  Scan With Your Phone Camera
                </h3>
                <p className="text-xs text-[#6E6663]">
                  Point any phone camera to instantly book and receive your Live Pizza Tracker queue number.
                </p>
              </div>

              {/* High Contrast QR Standee */}
              <div className="p-6 bg-white rounded-3xl border-2 border-[#C1785A] shadow-md max-w-[240px] mx-auto flex flex-col items-center justify-center">
                <QrCode className="w-40 h-40 text-[#2C2725]" />
                <span className="text-[11px] font-mono font-bold text-[#8C462C] mt-2">
                  STYLIQ-PARIS-01
                </span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSalonQrModal(false);
                    handleSimulateScan();
                  }}
                  className="w-full py-3 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-white text-xs font-bold uppercase tracking-wider shadow-warm"
                >
                  Simulate Camera Scan on this Device
                </button>
                <button
                  type="button"
                  onClick={() => setShowSalonQrModal(false)}
                  className="w-full py-2.5 rounded-full text-xs font-bold text-[#6E6663] hover:text-[#2C2725]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Digital Queue Token Modal */}
        <QueueTokenModal
          isOpen={isTokenModalOpen}
          onClose={() => {
            setIsTokenModalOpen(false);
            if (createdTokenApt) {
              router.push(`/queue/${createdTokenApt.id}`);
            }
          }}
          appointment={createdTokenApt}
          queuePosition={queueCount + 1}
          estimatedWaitMinutes={(queueCount + 1) * 15}
        />
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#6E6663] uppercase tracking-widest font-bold">
            <RefreshCw className="w-5 h-5 text-[#C1785A] animate-spin" />
            <span>Loading Styliq QR Scanner...</span>
          </div>
        </div>
      }
    >
      <GoogleSecurityGate
        targetRole="customer"
        title="QR Scanner & Walk-in Pass Security Gate"
        subtitle="Please authenticate with your Google account to scan salon station QR codes and generate instant priority tokens."
      >
        <ScanPageContent />
      </GoogleSecurityGate>
    </Suspense>
  );
}
