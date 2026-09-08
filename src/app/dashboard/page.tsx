'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  UserPlus,
  Tv,
  Scissors,
  Clock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Zap,
  ArrowRight,
  Phone,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sliders,
  TrendingUp,
  QrCode,
  UserCheck,
  ChevronDown,
  Star,
} from 'lucide-react';
import { Appointment, AppointmentStatus, Stylist } from '@/lib/types';
import {
  subscribeToAppointments,
  updateAppointment,
  resetQueueToDefault,
} from '@/lib/supabaseClient';
import { WalkInModal } from '@/components/WalkInModal';
import { StatusBadge } from '@/components/StatusBadge';
import {
  detectOverlapOpportunities,
  formatINR,
  calculateDynamicWaitMinutes,
  getQueuePosition,
  STATUS_CONFIG,
} from '@/lib/queueEngine';
import { playChime } from '@/lib/soundEffects';
import { INITIAL_STYLISTS } from '@/lib/mockData';
import { GoogleSecurityGate } from '@/components/GoogleSecurityGate';
import { VirtualStyleMirrorModal } from '@/components/VirtualStyleMirrorModal';
import { AtHomeServiceModal } from '@/components/AtHomeServiceModal';
import { Camera, Home } from 'lucide-react';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isVirtualMirrorOpen, setIsVirtualMirrorOpen] = useState(false);
  const [isAtHomeModalOpen, setIsAtHomeModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((list: Appointment[]) => {
      setAppointments(list);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: AppointmentStatus,
    optionalStylist?: Stylist
  ) => {
    playChime(newStatus === 'in_chair' ? 'bell' : 'notification');
    const updates: Partial<Appointment> = { status: newStatus };
    if (optionalStylist) {
      updates.stylist_id = optionalStylist.id;
      updates.stylist = optionalStylist;
    }
    await updateAppointment(id, updates);
  };

  const handleReassignStylist = async (appointmentId: string, stylistId: string) => {
    const stylist = INITIAL_STYLISTS.find((s) => s.id === stylistId);
    if (stylist) {
      await updateAppointment(appointmentId, {
        stylist_id: stylist.id,
        stylist,
      });
      playChime('notification');
    }
  };

  const handleResetDemo = () => {
    if (confirm('Reset queue data to initial demonstration default?')) {
      setIsResetting(true);
      resetQueueToDefault();
      setTimeout(() => setIsResetting(false), 500);
    }
  };

  const overlapAlerts = detectOverlapOpportunities(appointments);

  // DYNAMIC FILTERING & FIFO SORTING:
  // 1. Waiting list sorted by created_at ASC (FIFO: earliest guest is Pos #1)
  const waitingList = appointments
    .filter((a) => a.status === 'waiting')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // 2. In-chair active sorted by start time
  const inChairList = appointments
    .filter((a) => a.status === 'in_chair')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // 3. Color processing active
  const processingList = appointments
    .filter((a) => a.status === 'color_processing')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // 4. Completed
  const completedList = appointments
    .filter((a) => a.status === 'completed')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // Total Realized & Booked Revenue
  const totalRevenue = appointments.reduce(
    (acc, curr) => acc + (curr.service?.price_inr || 0),
    0
  );

  return (
    <GoogleSecurityGate
      targetRole="staff"
      title="Staff Kiosk & Manager Security Gate"
      subtitle="Google account authentication is required to access live chair rotation, walk-in token injectors, and queue controls."
    >
      <div className="min-h-screen bg-[#FAF6F0] text-[#2C2725] p-4 sm:p-8 lg:p-10 space-y-8">
      {/* Top Header & Fast Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#EAE3DA] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C1785A] flex items-center justify-center text-[#FAF6F0] shadow-warm shrink-0">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C462C] block">
                  Manager & Staff Kiosk
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5E6DF] text-[#8C462C] border border-[#E8D0C5] text-[10px] font-mono font-bold uppercase animate-pulse">
                  ● Realtime Connected
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2C2725] mt-0.5">
                Rose &amp; Rogue Live Floor &amp; Queue Engine
              </h1>
            </div>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsWalkInModalOpen(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-[0.15em] shadow-warm hover:shadow-warm-lg transition-all transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Walk-in Quick Add</span>
          </button>

          <button
            onClick={() => setIsVirtualMirrorOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#F5E6DF] border-2 border-[#C1785A] text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] text-[#8C462C] transition-all shadow-sm group"
          >
            <Camera className="w-4 h-4 text-[#C1785A] group-hover:scale-110 transition-transform" />
            <span>Virtual Style Try-On</span>
            <span className="w-2 h-2 rounded-full bg-[#C1785A] animate-ping ml-0.5" />
          </button>

          <button
            onClick={() => setIsAtHomeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2C2725] hover:bg-[#3D3532] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-[0.15em] shadow-warm transition-all"
          >
            <Home className="w-4 h-4 text-[#D48464]" />
            <span>Haute At-Home</span>
          </button>

          <Link
            href="/scan"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#F5E6DF] hover:bg-[#E8D8CE] border border-[#E8D0C5] text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#8C462C] transition-colors shadow-sm"
            title="Scan-to-Book QR Engine"
          >
            <QrCode className="w-4 h-4 text-[#C1785A]" />
            <span className="hidden xl:inline">Scan QR</span>
          </Link>

          <Link
            href="/analytics"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#F3ECE3] hover:bg-[#EAE3DA] border border-[#EAE3DA] text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#2C2725] transition-colors shadow-sm"
            title="Customer Predictions & Statistics"
          >
            <TrendingUp className="w-4 h-4 text-[#C1785A]" />
            <span className="hidden xl:inline">Predictions</span>
          </Link>

          <Link
            href="/tv"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#F3ECE3] hover:bg-[#EAE3DA] border border-[#EAE3DA] text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#2C2725] transition-colors shadow-sm"
          >
            <Tv className="w-4 h-4 text-[#C1785A]" />
            <span className="hidden sm:inline">TV Board</span>
          </Link>

          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            title="Reset Queue to initial seed state"
            className="p-2.5 rounded-full bg-[#F3ECE3] hover:bg-[#EAE3DA] border border-[#EAE3DA] text-[#6E6663] hover:text-[#2C2725] transition-colors shadow-sm"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* LUXURY INNOVATION STRIP: AR TRY-ON & DOORSTEP CONCIERGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Virtual AR Style Mirror */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#F5E6DF] via-[#FAF6F0] to-[#EAE3DA] dark:from-[#2A1F1B] dark:via-[#1D1715] dark:to-[#181413] border-2 border-[#C1785A]/30 shadow-md flex flex-col justify-between gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1785A]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#8C462C] dark:text-[#F2A585] bg-white/80 dark:bg-[#2C201C] px-3 py-1 rounded-full border border-[#E8D0C5] dark:border-[#3D2E27] inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#C1785A]" />
                Live Camera Face Filter
              </span>
              <span className="text-[11px] font-mono font-bold text-[#6E6663] dark:text-[#B5ABA2]">
                98% Face Geometry Match
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
              Virtual Style &amp; Balayage Mirror
            </h3>
            <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2] leading-relaxed">
              Use live camera feed to simulate French balayage shades, curtain bangs, caviar glow filters, and receive instant AI artisan recommendations.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EAE3DA] dark:border-[#332A26]">
            <span className="text-xs font-semibold text-[#8C462C] dark:text-[#F2A585]">
              Real-time WebRTC • No app required
            </span>
            <button
              type="button"
              onClick={() => setIsVirtualMirrorOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-white text-xs font-bold uppercase tracking-wider shadow-warm transition-all flex items-center gap-1.5 transform group-hover:scale-105"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Launch AR Try-On</span>
            </button>
          </div>
        </div>

        {/* Card 2: Haute At-Home Doorstep Concierge */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#241E1C] via-[#1C1715] to-[#141110] text-[#FAF6F0] border-2 border-[#C1785A]/40 shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1785A]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#F2A585] bg-[#38251E] px-3 py-1 rounded-full border border-[#523A30] inline-flex items-center gap-1.5">
                <Home className="w-3 h-3 text-[#D48464]" />
                Doorstep VIP Service
              </span>
              <span className="text-[11px] font-mono font-bold text-[#C7BCB3]">
                Dyson Vanity Kit Included
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#FAF6F0]">
              Haute At-Home Salon Concierge
            </h3>
            <p className="text-xs text-[#B5ABA2] leading-relaxed">
              Book certified Rose &amp; Rogue master stylists to your residence with portable hydraulic chairs, Dyson Airwrap stations, and automated WhatsApp tracking.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#382E28]">
            <span className="text-xs font-semibold text-[#D48464]">
              Mumbai Residence Delivery • ₹299 Kit Fee
            </span>
            <button
              type="button"
              onClick={() => setIsAtHomeModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-white text-xs font-bold uppercase tracking-wider shadow-warm transition-all flex items-center gap-1.5 transform group-hover:scale-105"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Book At-Home Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATS STRIP - DYNAMICALLY UPDATING */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-[#F3ECE3] p-5 rounded-3xl border border-[#EAE3DA] shadow-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A423D] font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8F8178]" />
            Waiting Lounge
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">
              {waitingList.length}
            </span>
            <span className="text-xs text-[#6E6663] font-medium">Guests In Queue</span>
          </div>
        </div>

        <div className="bg-[#F3ECE3] p-5 rounded-3xl border border-[#EAE3DA] shadow-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8C462C] font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A] animate-pulse" />
            Active In-Chair
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C1785A]">
              {inChairList.length}
            </span>
            <span className="text-xs text-[#6E6663] font-medium">Stations Active</span>
          </div>
        </div>

        <div className="bg-[#F3ECE3] p-5 rounded-3xl border border-[#EAE3DA] shadow-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-[#9E6517] font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C98A2C] animate-pulse" />
            Color Processing
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#9E6517]">
              {processingList.length}
            </span>
            <span className="text-xs text-[#9E6517] font-semibold">Overlap Open</span>
          </div>
        </div>

        <div className="bg-[#F3ECE3] p-5 rounded-3xl border border-[#EAE3DA] shadow-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-[#6E6663] font-bold flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#C1785A]" />
            Revenue Today
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">
              {formatINR(totalRevenue)}
            </span>
            <span className="text-xs text-[#6E6663] font-medium">Booked & Realized</span>
          </div>
        </div>
      </div>

      {/* 4 KANBAN COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {/* COLUMN 1: Waiting Lounge */}
        <div className="bg-[#F3ECE3] rounded-3xl border border-[#EAE3DA] p-5 sm:p-6 flex flex-col min-h-[620px] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA] mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#8F8178]" />
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C2725]">
                Waiting Lounge
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EAE3DC] text-[#4A423D] font-mono text-sm font-bold border border-[#D8CFC7]">
              {waitingList.length}
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto flex-grow pr-1 max-h-[750px]">
            {waitingList.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-sm text-[#6E6663] border-2 border-dashed border-[#EAE3DA] rounded-3xl p-6 bg-[#FAF6F0]/60">
                <Clock className="w-8 h-8 mb-3 text-[#C1785A] opacity-60" />
                <p className="font-serif text-base font-bold text-[#2C2725]">Lounge is clear</p>
                <button
                  onClick={() => setIsWalkInModalOpen(true)}
                  className="mt-3 text-sm font-bold text-[#C1785A] hover:underline"
                >
                  + Add Walk-In Guest
                </button>
              </div>
            ) : (
              waitingList.map((apt, idx) => {
                const waitMins = calculateDynamicWaitMinutes(apt, appointments);
                const currentStylistId = apt.stylist?.id || INITIAL_STYLISTS[0].id;
                return (
                  <div
                    key={apt.id}
                    className="bg-[#FAF6F0] p-5 rounded-3xl border border-[#EAE3DA] hover:border-[#C1785A] transition-all shadow-sm space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold">
                            {apt.queue_number}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#EAE3DC] text-[#4A423D] text-[11px] font-bold">
                            Pos #{idx + 1}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-lg sm:text-xl text-[#2C2725]">
                          {apt.customer_name}
                        </h4>
                      </div>
                      {apt.is_walk_in ? (
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-[#EAE3DC] text-[#4A423D] border border-[#D8CFC7]">
                          Walk-In
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-[#F5E6DF] text-[#8C462C] border border-[#E8D0C5]">
                          ₹99 Deposit
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#6E6663] space-y-1.5 bg-[#F3ECE3] p-3.5 rounded-2xl border border-[#EAE3DA]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#2C2725] line-clamp-1">
                          {apt.service?.name}
                        </span>
                        <span className="font-mono text-[#8C462C] font-bold">
                          ~{waitMins}m est.
                        </span>
                      </div>

                      {/* Reassign Stylist Picker */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#EAE3DA]">
                        <span className="text-[11px] text-[#6E6663]">Stylist:</span>
                        <select
                          value={currentStylistId}
                          onChange={(e) => handleReassignStylist(apt.id, e.target.value)}
                          className="text-[11px] font-bold bg-white px-2 py-1 rounded-lg border border-[#EAE3DA] text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                        >
                          {INITIAL_STYLISTS.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.name} (Chair #{st.chair_number})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Seat in Chair Action */}
                    <div className="pt-1">
                      <button
                        onClick={() => handleStatusChange(apt.id, 'in_chair')}
                        className="w-full py-3 px-4 rounded-2xl bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm transform hover:-translate-y-0.5"
                      >
                        <Scissors className="w-4 h-4" />
                        <span>Seat in Chair #{apt.stylist?.chair_number || 1}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: In Chair */}
        <div className="bg-[#F3ECE3] rounded-3xl border border-[#EAE3DA] p-5 sm:p-6 flex flex-col min-h-[620px] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA] mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#C1785A] animate-pulse" />
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C2725]">In Chair</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F5E6DF] text-[#8C462C] font-mono text-sm font-bold border border-[#E8D0C5]">
              {inChairList.length}
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto flex-grow pr-1 max-h-[750px]">
            {inChairList.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-sm text-[#6E6663] border-2 border-dashed border-[#EAE3DA] rounded-3xl p-6 bg-[#FAF6F0]/60">
                <Scissors className="w-8 h-8 mb-3 text-[#C1785A] opacity-60" />
                <p className="font-serif text-base font-bold text-[#2C2725]">
                  No active chair sessions
                </p>
                <p className="text-xs text-[#6E6663] mt-1">
                  Seat next guest from Waiting Lounge
                </p>
              </div>
            ) : (
              inChairList.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-[#FAF6F0] p-5 rounded-3xl border-2 border-[#C1785A]/40 hover:border-[#C1785A] transition-all shadow-sm space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold block">
                        {apt.queue_number} • Station #{apt.stylist?.chair_number || 1}
                      </span>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-[#2C2725]">
                        {apt.customer_name}
                      </h4>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-[#F5E6DF] text-[#8C462C] border border-[#E8D0C5]">
                      In Chair
                    </span>
                  </div>

                  <div className="text-xs text-[#6E6663] space-y-1 bg-[#F3ECE3] p-3.5 rounded-2xl border border-[#EAE3DA]">
                    <p className="line-clamp-1 font-semibold text-[#2C2725]">
                      {apt.service?.name}
                    </p>
                    <p className="text-xs text-[#6E6663]">
                      Stylist: <strong className="text-[#2C2725]">{apt.stylist?.name}</strong>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 space-y-2">
                    <button
                      onClick={() => handleStatusChange(apt.id, 'color_processing')}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#E3A857] hover:bg-[#D49842] text-[#3D2607] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Start Color Processing</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(apt.id, 'completed')}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#2C2725] hover:bg-[#3D3532] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Settle Bill</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: Color Processing */}
        <div className="bg-[#F3ECE3] rounded-3xl border border-[#EAE3DA] p-5 sm:p-6 flex flex-col min-h-[620px] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA] mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#C98A2C] animate-pulse" />
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C2725]">
                Color Processing
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FDF2E2] text-[#946114] font-mono text-sm font-bold border border-[#F2DEBF]">
              {processingList.length}
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto flex-grow pr-1 max-h-[750px]">
            {processingList.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-sm text-[#6E6663] border-2 border-dashed border-[#EAE3DA] rounded-3xl p-6 bg-[#FAF6F0]/60">
                <Zap className="w-8 h-8 mb-3 text-[#C98A2C] opacity-60" />
                <p className="font-serif text-base font-bold text-[#2C2725]">
                  No color processing active
                </p>
                <p className="text-xs text-[#6E6663] mt-1">
                  Chairs in active use
                </p>
              </div>
            ) : (
              processingList.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-[#FAF6F0] p-5 rounded-3xl border-2 border-[#C98A2C]/50 hover:border-[#C98A2C] transition-all shadow-sm space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#9E6517] font-bold block">
                        {apt.queue_number} • Developer Window
                      </span>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-[#2C2725]">
                        {apt.customer_name}
                      </h4>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-[#FDF2E2] text-[#946114] border border-[#F2DEBF]">
                      Processing
                    </span>
                  </div>

                  <div className="text-xs text-[#6E6663] space-y-1.5 bg-[#FDF2E2] p-3 rounded-2xl border border-[#F2DEBF]">
                    <p className="line-clamp-1 font-semibold text-[#2C2725]">{apt.service?.name}</p>
                    <p className="text-xs text-[#9E6517] font-bold">
                      Chair #{apt.stylist?.chair_number} is FREE for Overlap Quick Cut
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 space-y-2">
                    <button
                      onClick={() => handleStatusChange(apt.id, 'in_chair')}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>Return to Chair for Rinse</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(apt.id, 'completed')}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#2C2725] hover:bg-[#3D3532] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Service</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 4: Completed */}
        <div className="bg-[#F3ECE3] rounded-3xl border border-[#EAE3DA] p-5 sm:p-6 flex flex-col min-h-[620px] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA] mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#78716A]" />
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C2725]">Completed</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EBE7E2] text-[#5C5550] font-mono text-sm font-bold border border-[#DBD5CE]">
              {completedList.length}
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto flex-grow pr-1 max-h-[750px]">
            {completedList.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-sm text-[#6E6663] border-2 border-dashed border-[#EAE3DA] rounded-3xl p-6 bg-[#FAF6F0]/60">
                <CheckCircle2 className="w-8 h-8 mb-3 text-[#78716A] opacity-60" />
                <p className="font-serif text-base font-bold text-[#2C2725]">
                  Completed tickets arrive here
                </p>
              </div>
            ) : (
              completedList.slice(0, 12).map((apt) => (
                <div
                  key={apt.id}
                  className="bg-[#FAF6F0] p-4 rounded-3xl border border-[#EAE3DA] shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#6E6663] font-bold">
                        {apt.queue_number}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#2C2725]">
                        {apt.customer_name}
                      </h4>
                    </div>
                    <span className="text-sm text-[#C1785A] font-bold font-mono">
                      {formatINR(apt.service?.price_inr || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6E6663]">
                    <span className="line-clamp-1">{apt.service?.name}</span>
                    <span className="text-[10px] text-[#78716A] font-semibold">Settled</span>
                  </div>

                  {apt.customer_rating ? (
                    <div className="pt-1.5 border-t border-[#EAE3DA]/80 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#C1785A]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= (apt.customer_rating || 0)
                                ? 'fill-[#C1785A] text-[#C1785A]'
                                : 'text-[#DBD5CE]'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-[#2C2725] ml-1">
                          {apt.customer_rating}.0
                        </span>
                      </div>
                      {apt.customer_tags && apt.customer_tags.length > 0 && (
                        <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#F5E6DF] text-[#8C462C]">
                          {apt.customer_tags[0]}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Walk In Modal */}
      <WalkInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onSuccess={() => {}}
      />

      {/* AR Virtual Style & Balayage Face Mirror */}
      <VirtualStyleMirrorModal
        isOpen={isVirtualMirrorOpen}
        onClose={() => setIsVirtualMirrorOpen(false)}
      />

      {/* Haute At-Home Doorstep Concierge Modal */}
      <AtHomeServiceModal
        isOpen={isAtHomeModalOpen}
        onClose={() => setIsAtHomeModalOpen(false)}
      />
      </div>
    </GoogleSecurityGate>
  );
}
