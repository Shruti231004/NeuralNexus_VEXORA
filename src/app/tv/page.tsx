'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scissors,
  Clock,
  Sparkles,
  QrCode,
  ArrowRight,
  Tv,
  Volume2,
  Calendar,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Appointment } from '@/lib/types';
import { subscribeToAppointments } from '@/lib/supabaseClient';
import {
  calculateDynamicWaitMinutes,
  formatEtaString,
  getQueuePosition,
  formatINR,
} from '@/lib/queueEngine';
import { ThemeFontToggle } from '@/components/ThemeFontToggle';

export default function SmartTvBoardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((list: Appointment[]) => {
      setAppointments(list);
    });
    return () => unsubscribe();
  }, []);

  const servingList = appointments
    .filter((a) => a.status === 'in_chair' || a.status === 'color_processing')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const waitingList = appointments
    .filter((a) => a.status === 'waiting')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C2725] flex flex-col justify-between select-none overflow-hidden font-sans">
      {/* 1. TOP AIRPORT-STYLE FLIGHT BOARD HEADER */}
      <header className="px-10 py-7 bg-[#F3ECE3] border-b-2 border-[#C1785A]/40 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-serif text-3xl font-extrabold shadow-warm">
            S
          </div>
          <div>
            <div className="flex items-center gap-4">
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2C2725]">
                STYLIQ SALON FLIGHT BOARD
              </h1>
              <span className="px-3.5 py-1.5 rounded-full bg-[#F5E6DF] text-[#8C462C] border border-[#E8D0C5] text-xs font-mono font-bold tracking-widest uppercase animate-pulse">
                ● Live Lounge Engine
              </span>
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#6E6663] mt-1 font-semibold">
              Live Realtime Queue Display • 15+ FT High Visibility
            </p>
          </div>
        </div>

        {/* Big Live Clock */}
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="font-mono text-4xl sm:text-5xl font-extrabold tracking-wider text-[#2C2725]">
              {currentTime || '11:45:00 AM'}
            </div>
            <div className="text-sm uppercase tracking-[0.2em] text-[#C1785A] font-bold mt-1">
              {currentDate || 'Tuesday, Sept 8'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeFontToggle />
            <Link
              href="/dashboard"
              className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#EAE3DA] dark:bg-[#26201D] dark:hover:bg-[#332A26] border border-[#EAE3DA] dark:border-[#3D332D] text-[#6E6663] hover:text-[#2C2725] dark:text-[#FAF6F0] transition-colors shadow-sm"
              title="Switch to Kiosk"
            >
              <Tv className="w-5 h-5 text-[#C1785A]" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. SPLIT MAIN TV STAGE (NOW SERVING vs UP NEXT) */}
      <main className="flex-grow p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* LEFT COLUMN: NOW SERVING (Terracotta & Peach) */}
        <div className="lg:col-span-6 bg-[#F3ECE3] rounded-3xl border-2 border-[#C1785A]/40 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#EAE3DA] mb-6">
              <div className="flex items-center gap-3.5">
                <span className="w-4 h-4 rounded-full bg-[#C1785A] animate-ping" />
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#C1785A]">
                  NOW SERVING
                </h2>
              </div>
              <span className="text-sm uppercase tracking-[0.2em] text-[#6E6663] font-bold">
                Active Stations
              </span>
            </div>

            <div className="space-y-5">
              {servingList.length === 0 ? (
                <div className="p-10 rounded-3xl bg-[#FAF6F0] text-center text-[#6E6663] border border-[#EAE3DA]">
                  <Scissors className="w-10 h-10 mx-auto mb-3 opacity-60 text-[#C1785A]" />
                  <p className="font-serif text-2xl text-[#2C2725] font-bold">Chairs being prepared</p>
                  <p className="text-sm mt-1">Next guest will be seated immediately</p>
                </div>
              ) : (
                servingList.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-6 rounded-3xl bg-[#FAF6F0] border-2 border-[#C1785A]/30 flex items-center justify-between shadow-md"
                  >
                    <div className="flex items-center gap-5">
                      {/* Station Badge */}
                      <div className="w-20 h-20 rounded-2xl bg-[#F5E6DF] border-2 border-[#C1785A] flex flex-col items-center justify-center text-[#8C462C] shrink-0 shadow-sm">
                        <span className="text-xs uppercase font-extrabold tracking-widest leading-none">
                          STATION
                        </span>
                        <span className="font-serif text-3xl font-black mt-0.5">
                          #{apt.stylist?.chair_number || 1}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-full bg-[#F5E6DF] text-[#8C462C] font-mono text-xs font-bold border border-[#E8D0C5]">
                            {apt.queue_number}
                          </span>
                          <span className="text-sm text-[#6E6663]">
                            Stylist: <strong className="text-[#2C2725] text-base">{apt.stylist?.name}</strong>
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725]">
                          {apt.customer_name}
                        </h3>
                        <p className="text-sm text-[#C1785A] font-bold flex items-center gap-2">
                          <Scissors className="w-4 h-4" />
                          <span>{apt.service?.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                          apt.status === 'color_processing'
                            ? 'bg-[#FDF2E2] text-[#946114] border border-[#F2DEBF]'
                            : 'bg-[#F5E6DF] text-[#8C462C] border border-[#E8D0C5]'
                        }`}
                      >
                        {apt.status === 'color_processing' ? 'Processing' : 'In-Chair'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[#EAE3DA] flex items-center justify-between text-sm text-[#6E6663] font-medium">
            <span>Complimentary espresso & French chamomile available at the concierge bar.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: UP NEXT IN LOUNGE (Sand & Brown) */}
        <div className="lg:col-span-6 bg-[#F3ECE3] rounded-3xl border-2 border-[#EAE3DA] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#EAE3DA] mb-6">
              <div className="flex items-center gap-3.5">
                <Clock className="w-8 h-8 text-[#C1785A]" />
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2C2725]">
                  UP NEXT IN LOUNGE
                </h2>
              </div>
              <span className="text-sm uppercase tracking-[0.2em] text-[#6E6663] font-bold">
                {waitingList.length} Waiting
              </span>
            </div>

            <div className="space-y-4">
              {waitingList.length === 0 ? (
                <div className="p-10 rounded-3xl bg-[#FAF6F0] text-center text-[#6E6663] border border-[#EAE3DA]">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-60 text-[#C1785A]" />
                  <p className="font-serif text-2xl text-[#2C2725] font-bold">No wait time currently</p>
                  <p className="text-sm mt-1">Walk-in guests can be seated instantly</p>
                </div>
              ) : (
                waitingList.slice(0, 4).map((apt, idx) => {
                  const waitMins = calculateDynamicWaitMinutes(apt, appointments);
                  return (
                    <div
                      key={apt.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#FAF6F0] border border-[#EAE3DA] flex items-center justify-between shadow-sm hover:border-[#C1785A] transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#EAE3DC] border border-[#D8CFC7] flex flex-col items-center justify-center text-[#4A423D] shrink-0 shadow-sm">
                          <span className="text-xs uppercase font-extrabold tracking-wider leading-none">
                            QUEUE
                          </span>
                          <span className="font-serif text-2xl font-black mt-0.5">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-mono font-bold text-[#C1785A]">
                              {apt.queue_number}
                            </span>
                            <span className="text-xs text-[#6E6663]">
                              Stylist: <strong className="text-[#2C2725]">{apt.stylist?.name}</strong>
                            </span>
                          </div>
                          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2725]">
                            {apt.customer_name}
                          </h4>
                          <p className="text-sm text-[#6E6663] line-clamp-1">{apt.service?.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C1785A] block">
                          ~{waitMins}m
                        </span>
                        <span className="text-xs uppercase tracking-wider text-[#6E6663] font-bold">
                          Est. Chair Time
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Instant QR Check-in Box - Scans to automatically book appointment */}
          <Link
            href="/scan?auto=true"
            className="pt-6 border-t border-[#EAE3DA] flex items-center justify-between gap-6 bg-[#FAF6F0] p-5 rounded-3xl border border-[#EAE3DA] shadow-sm hover:border-[#C1785A] hover:shadow-warm transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 border border-[#EAE3DA] shadow-sm group-hover:scale-105 transition-transform">
                <QrCode className="w-full h-full text-[#C1785A]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#8C462C] bg-[#F5E6DF] px-2 py-0.5 rounded-full border border-[#E8D0C5] inline-block mb-1">
                  1-Tap Auto Check-In
                </span>
                <h4 className="font-serif font-bold text-base text-[#2C2725]">
                  Scan QR to Book & Join Queue Instantly
                </h4>
                <p className="text-sm text-[#6E6663]">
                  Point phone camera to auto-book your spot & launch Live Tracker
                </p>
              </div>
            </div>

            <div className="px-6 py-3 rounded-full bg-[#C1785A] group-hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-warm flex items-center gap-2 shrink-0">
              <Zap className="w-4 h-4" />
              <span>Scan & Book</span>
            </div>
          </Link>
        </div>
      </main>

      {/* 3. DYNAMIC BOTTOM MARQUEE TICKER */}
      <footer className="bg-[#F3ECE3] border-t-2 border-[#C1785A]/30 py-4 px-8 overflow-hidden">
        <div className="flex items-center gap-5 text-sm tracking-wider uppercase font-semibold text-[#6E6663]">
          <span className="px-4 py-1.5 rounded-full bg-[#C1785A] text-white shrink-0 font-bold text-xs shadow-warm">
            STYLIQ LIVE
          </span>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-marquee space-x-12">
              <span className="text-[#2C2725] text-sm">
                ✨ Special Promo: Use code <strong className="text-[#C1785A] font-mono">PARISGLOW</strong> for 15% off Balayage & Restorative Spa appointments today.
              </span>
              <span>•</span>
              <span className="text-[#8C462C] font-semibold text-sm">
                🌿 Botanical Scalp Diagnostics included complimentary with all Hair Spa treatments.
              </span>
              <span>•</span>
              <span className="text-[#2C2725] text-sm">
                ⚡ Realtime Queue Active — Your mobile will alert when your styling chair is ready.
              </span>
              <span>•</span>
              <span className="text-[#C1785A] text-sm">
                ☕ Please enjoy artisan Nespresso or French Chamomile infusion in the waiting lounge.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
