'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  Bell,
  ArrowLeft,
  Volume2,
  ShieldCheck,
  Phone,
  QrCode,
  MapPin,
  RefreshCw,
  Star,
  Award,
  Heart,
  Ticket,
} from 'lucide-react';
import { Appointment } from '@/lib/types';
import { subscribeToAppointments } from '@/lib/supabaseClient';
import { QueueProgressTracker } from '@/components/QueueProgressTracker';
import { StatusBadge } from '@/components/StatusBadge';
import { StylistRatingModal } from '@/components/StylistRatingModal';
import { QueueTokenModal } from '@/components/QueueTokenModal';
import {
  formatINR,
  getQueuePosition,
  calculateDynamicWaitMinutes,
  formatEtaString,
  STATUS_CONFIG,
} from '@/lib/queueEngine';
import { playChime } from '@/lib/soundEffects';

export default function QueueTrackerPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [hasNotifiedChair, setHasNotifiedChair] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((list: Appointment[]) => {
      setAppointments(list);
      const found = list.find((a) => a.id === id || a.queue_number === id);
      if (found) {
        setAppointment(found);
        if (found.status === 'in_chair' && !hasNotifiedChair) {
          playChime('bell');
          setHasNotifiedChair(true);
        }
      }
    });

    return () => unsubscribe();
  }, [id, hasNotifiedChair]);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6">
        <div className="text-center space-y-5 max-w-md bg-[#F3ECE3] p-10 rounded-3xl border border-[#EAE3DA] shadow-card">
          <RefreshCw className="w-10 h-10 text-[#C1785A] animate-spin mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#2C2725]">Locating Your Reservation...</h2>
          <p className="text-sm text-[#6E6663]">
            Retrieving live Supabase Realtime queue status for reference <strong>{id}</strong>.
          </p>
          <div className="pt-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C1785A] text-[#FAF6F0] text-sm font-bold uppercase tracking-wider shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const position = getQueuePosition(appointment.id, appointments);
  const waitMinutes = calculateDynamicWaitMinutes(appointment, appointments);
  const stylist = appointment.stylist;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C2725] py-10 sm:py-14 px-5 sm:px-8 lg:px-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Top Breadcrumb & Live Ping */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#6E6663] hover:text-[#2C2725] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio</span>
          </Link>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F3ECE3] border border-[#EAE3DA] shadow-sm text-xs font-bold text-[#2C2725]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A] animate-pulse" />
            <span className="font-mono text-[#8C462C]">Live Queue Active</span>
          </div>
        </div>

        {/* CHAIR READY HERO ALERT (Warm Terracotta Banner) */}
        {appointment.status === 'in_chair' && (
          <div className="p-8 rounded-3xl bg-[#C1785A] text-[#FAF6F0] shadow-warm-lg flex items-center justify-between gap-6 animate-bounce">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#FAF6F0]/90">
                  Your Styling Station is Ready
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold mt-1">
                  Please proceed to Station #{appointment.stylist?.chair_number || 1}
                </h3>
                <p className="text-sm text-[#FAF6F0]/90 mt-0.5">
                  Stylist <strong>{appointment.stylist?.name}</strong> is welcoming you now.
                </p>
              </div>
            </div>
            <button
              onClick={() => playChime('bell')}
              className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0"
              title="Replay Chime"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* POST-SERVICE CELEBRATION & RATING CALLOUT (When Completed) */}
        {appointment.status === 'completed' && (
          <div className="p-8 rounded-3xl bg-[#FFF9F2] border-2 border-[#C98A2C] shadow-warm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#F5E6DF] border-2 border-[#C1785A] text-[#8C462C] flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-8 h-8 text-[#C1785A]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C462C] bg-[#F5E6DF] px-3 py-1 rounded-full border border-[#E8D0C5] inline-block">
                  Service Completed • Glow Active
                </span>
                <h3 className="font-serif text-2xl font-extrabold text-[#2C2725]">
                  How was your session with {stylist?.name}?
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6663]">
                  {appointment.customer_rating
                    ? `You rated this session ${appointment.customer_rating}★. Thank you for your review!`
                    : `Leave a star rating and compliment for ${stylist?.name}.`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="px-6 py-3.5 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-warm transition-all flex items-center gap-2 shrink-0 transform hover:scale-105"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>{appointment.customer_rating ? 'Edit Rating' : 'Rate Stylist'}</span>
            </button>
          </div>
        )}

        {/* MAIN TICKET CARD: Warm Sand & Cream */}
        <div className="bg-[#F3ECE3] rounded-3xl border border-[#EAE3DA] shadow-card overflow-hidden">
          {/* Header Strip */}
          <div className="bg-[#FAF6F0] text-[#2C2725] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#EAE3DA]">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C1785A] font-extrabold">
                  Official Queue Ticket
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5E6DF] text-[#8C462C] font-mono text-xs font-black border border-[#C1785A]/40 shadow-sm">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#8C462C]">Token</span>
                  <span className="bg-white/70 px-1.5 py-0.5 rounded border border-[#E8D0C5]">#{appointment.queue_number}</span>
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">
                {appointment.customer_name}
              </h1>
              <p className="text-base text-[#6E6663]">
                Service: <strong className="text-[#2C2725]">{appointment.service?.name}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2.5">
              <div className="flex items-center gap-2">
                <StatusBadge status={appointment.status} size="lg" />
                <button
                  onClick={() => setIsTokenModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#F5E6DF] border border-[#E8D0C5] text-[#8C462C] text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                  title="View Official Digital Queue Token"
                >
                  <Ticket className="w-4 h-4 text-[#C1785A]" />
                  <span>View Pass</span>
                </button>
              </div>
              <span className="text-xs text-[#6E6663] font-mono font-medium">
                Advance Deposit: ₹99 Paid ({appointment.razorpay_payment_id || 'Rzp_Verified'})
              </span>
            </div>
          </div>

          {/* Dynamic Position & Estimated Arrival Counter */}
          <div className="p-8 sm:p-10 border-b border-[#EAE3DA] bg-[#FAF6F0]/60">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              {/* Position in line */}
              <div className="p-6 rounded-3xl bg-[#F3ECE3] border border-[#EAE3DA] shadow-sm">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#6E6663] block">
                  Lounge Position
                </span>
                <div className="mt-2 flex items-baseline justify-center sm:justify-start gap-1.5">
                  <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#C1785A]">
                    {appointment.status === 'in_chair'
                      ? 'In Chair'
                      : appointment.status === 'color_processing'
                      ? 'Processing'
                      : appointment.status === 'completed'
                      ? 'Done'
                      : `#${position}`}
                  </span>
                  {appointment.status === 'waiting' && (
                    <span className="text-sm text-[#6E6663] font-bold">in line</span>
                  )}
                </div>
                <p className="text-xs text-[#6E6663] mt-1 font-medium">
                  {appointment.status === 'waiting'
                    ? `${appointments.filter((a) => a.status === 'waiting').length} total guests in lounge`
                    : 'Active with master stylist'}
                </p>
              </div>

              {/* Estimated wait */}
              <div className="p-6 rounded-3xl bg-[#F3ECE3] border border-[#EAE3DA] shadow-sm">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#6E6663] block">
                  Estimated Chair Time
                </span>
                <div className="mt-2 flex items-baseline justify-center sm:justify-start gap-1.5">
                  <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#2C2725]">
                    {appointment.status === 'in_chair'
                      ? '0 min'
                      : appointment.status === 'completed'
                      ? 'Complete'
                      : `~${waitMinutes}m`}
                  </span>
                  {appointment.status === 'waiting' && (
                    <span className="text-sm text-[#6E6663] font-bold">est.</span>
                  )}
                </div>
                <p className="text-xs text-[#6E6663] mt-1 font-medium">
                  {appointment.status === 'waiting'
                    ? 'Dynamic calculation based on station speed'
                    : 'Currently in progress'}
                </p>
              </div>

              {/* Assigned Stylist Card with Verified Rating */}
              <div className="p-6 rounded-3xl bg-[#F3ECE3] border border-[#EAE3DA] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      stylist?.avatar_url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                    }
                    alt="Stylist"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#C1785A] shadow-sm"
                  />
                  <div>
                    <span className="text-xs uppercase tracking-[0.15em] font-extrabold text-[#C1785A] block">
                      Station #{stylist?.chair_number || 1}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#2C2725]">
                      {stylist?.name || 'Master Stylist'}
                    </h4>
                    
                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex items-center text-[#C98A2C]">
                        <Star className="w-3.5 h-3.5 fill-[#C98A2C]" />
                        <span className="text-xs font-extrabold ml-1 text-[#2C2725]">
                          {stylist?.rating || 4.96}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6E6663]">
                        ({stylist?.reviews_count || 120} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="p-2.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#F5E6DF] border border-[#EAE3DA] text-[#8C462C] transition-colors shadow-sm"
                  title="Rate this Stylist"
                >
                  <Star className="w-5 h-5 text-[#C1785A]" />
                </button>
              </div>
            </div>
          </div>

          {/* PIZZA TRACKER ENGINE COMPONENT */}
          <div className="p-8 sm:p-10 space-y-8 bg-[#FAF6F0]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#C1785A]">
                  Live Progression
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2C2725] mt-0.5">
                  Live Service Journey
                </h3>
              </div>
              <button
                onClick={() => playChime('notification')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3ECE3] hover:bg-[#EAE3DA] border border-[#EAE3DA] text-xs uppercase tracking-wider font-bold text-[#6E6663] hover:text-[#2C2725] transition-colors shadow-sm"
              >
                <Bell className="w-4 h-4 text-[#C1785A]" />
                <span>Test Audio Chime</span>
              </button>
            </div>

            <QueueProgressTracker
              appointment={appointment}
              allAppointments={appointments}
            />

            {/* Post-Service Rating Callout Card */}
            {appointment.status === 'completed' && (
              <div className="mt-8 p-6 rounded-3xl bg-[#F5E6DF] border border-[#E8C9BD] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center shadow-sm shrink-0">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#2C2725]">
                      {appointment.customer_rating
                        ? `You rated ${stylist?.name || 'Stylist'} ${appointment.customer_rating} Stars!`
                        : `How was your session with ${stylist?.name || 'your stylist'}?`}
                    </h4>
                    <p className="text-xs text-[#6E6663]">
                      {appointment.customer_rating
                        ? `Thank you for reviewing! "${appointment.customer_review || 'Exceptional service'}"`
                        : 'Share your feedback to support our master artisan stylists.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="px-6 py-3 rounded-full bg-[#8C462C] hover:bg-[#733823] text-[#FAF6F0] text-xs uppercase tracking-[0.15em] font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>{appointment.customer_rating ? 'Edit Rating' : 'Leave Rating & Review'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Salon Coordinates */}
          <div className="p-6 bg-[#F3ECE3] border-t border-[#EAE3DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#6E6663]">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#C1785A] shrink-0" />
              <span>34 Rue de la Paix / Bandra West Luxury Arcade • Espresso bar open for guests</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-[#2C2725]">
              <ShieldCheck className="w-5 h-5 text-[#C1785A]" />
              <span>Realtime Connected</span>
            </div>
          </div>
        </div>

        {/* Bottom Fast Navigation Links */}
        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="text-sm text-[#6E6663] hover:text-[#C1785A] uppercase tracking-[0.2em] font-bold transition-colors"
          >
            Switch to Staff Kiosk View →
          </Link>
        </div>

        {/* Rating Modal Component */}
        <StylistRatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          appointment={appointment}
        />

        {/* Digital Queue Token Modal */}
        <QueueTokenModal
          isOpen={isTokenModalOpen}
          onClose={() => setIsTokenModalOpen(false)}
          appointment={appointment}
          queuePosition={position}
          estimatedWaitMinutes={waitMinutes}
        />
      </div>
    </div>
  );
}
