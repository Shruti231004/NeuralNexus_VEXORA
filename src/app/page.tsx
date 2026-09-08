'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Tv,
  LayoutDashboard,
  CheckCircle2,
  Scissors,
  Flame,
  QrCode,
  Award,
  Crown,
  Ticket,
  LogIn,
  KeyRound,
  UserCheck,
  Lock,
  TrendingUp,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_STYLISTS } from '@/lib/mockData';
import { formatINR } from '@/lib/queueEngine';
import { subscribeToAppointments } from '@/lib/supabaseClient';
import { Appointment } from '@/lib/types';

export default function LandingPage() {
  const [inChairCount, setInChairCount] = useState(2);
  const [waitingCount, setWaitingCount] = useState(2);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('All');

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((appointments: Appointment[]) => {
      const waiting = appointments.filter((a) => a.status === 'waiting').length;
      const inChair = appointments.filter(
        (a) => a.status === 'in_chair' || a.status === 'color_processing'
      ).length;
      setWaitingCount(waiting);
      setInChairCount(inChair);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-24 pb-20 bg-[#FAF6F0] text-[#2C2725]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5E6DF] border border-[#E8D8CE] text-[#8C462C]">
              <Sparkles className="w-4 h-4 text-[#C1785A]" />
              <span className="text-xs uppercase font-extrabold tracking-[0.25em]">
                Smart Real-Time Salon Engine
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-[#2C2725] leading-[1.1]">
              Effortless Styling.{' '}
              <span className="italic font-normal text-[#C1785A]">Zero Waiting Anxiety.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E6663] leading-relaxed max-w-xl">
              Immerse yourself in precision hair artistry. Reserve your priority entry for ₹99, track your live chair queue in real-time, and arrive precisely when your stylist is ready.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/book"
                className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-sm font-bold uppercase tracking-[0.18em] shadow-warm hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Join Queue (₹99 Deposit)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/scan"
                className="flex items-center gap-2 px-5 py-4 rounded-full bg-[#F5E6DF] hover:bg-[#E8D8CE] text-[#8C462C] border border-[#E8D0C5] text-sm font-bold uppercase tracking-[0.15em] transition-colors shadow-sm"
              >
                <QrCode className="w-4 h-4 text-[#C1785A]" />
                <span>Scan to Book</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-4 rounded-full bg-[#F3ECE3] hover:bg-[#EAE3DA] text-[#2C2725] border border-[#EAE3DA] text-sm font-bold uppercase tracking-[0.15em] transition-colors shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-[#C1785A]" />
                <span>Staff Kiosk</span>
              </Link>

              <Link
                href="/tv"
                className="flex items-center gap-2 px-5 py-4 rounded-full text-[#6E6663] hover:text-[#2C2725] text-sm font-bold uppercase tracking-[0.15em] transition-colors"
              >
                <Tv className="w-4 h-4 text-[#C1785A]" />
                <span>TV Board</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#EAE3DA]">
              <div>
                <span className="font-serif text-3xl font-extrabold text-[#2C2725]">100%</span>
                <p className="text-xs text-[#6E6663] uppercase tracking-wider mt-1 font-semibold">
                  Deposit Credited on Bill
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl font-extrabold text-[#C1785A]">0 min</span>
                <p className="text-xs text-[#6E6663] uppercase tracking-wider mt-1 font-semibold">
                  Lounge Idle Delay
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl font-extrabold text-[#2C2725]">4.98 ★</span>
                <p className="text-xs text-[#6E6663] uppercase tracking-wider mt-1 font-semibold">
                  Client Satisfaction
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Frame */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Arched Frame */}
              <div className="w-full h-[520px] rounded-t-[160px] rounded-b-3xl overflow-hidden border-2 border-[#EAE3DA] shadow-2xl relative bg-[#F3ECE3]">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000"
                  alt="Rose & Rogue Salon Interior"
                  className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2725]/60 via-transparent to-transparent" />
                
                {/* Overlay Quote */}
                <div className="absolute bottom-6 left-6 right-6 text-[#FAF6F0]">
                  <p className="font-serif italic text-lg leading-snug">
                    "Haute coiffure meets mathematical precision in timing."
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#DDD3C6] mt-1 font-bold">
                    Studio Rue de la Paix • Paris
                  </p>
                </div>
              </div>

              {/* Circular Floating "Live Queue Active" Badge */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-36 h-36 rounded-full bg-[#FAF6F0] border-2 border-[#C1785A] p-2 shadow-2xl flex flex-col items-center justify-center text-center animate-float">
                <span className="w-3 h-3 rounded-full bg-[#C1785A] animate-ping mb-1" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-extrabold text-[#C1785A]">
                  LIVE QUEUE
                </span>
                <span className="text-sm font-serif font-extrabold text-[#2C2725] mt-0.5">
                  {waitingCount} in Lounge
                </span>
                <span className="text-[10px] text-[#6E6663] font-semibold">{inChairCount} In-Chair</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED MENU & SPA PACKAGES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#C1785A]">
            Haute Menu &amp; Spa Packages
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">
            Signature Hair, Spa &amp; Grooming Experiences
          </h2>
          <p className="text-sm text-[#6E6663]">
            Every service is tailored with botanical treatments, scalp diagnostics, and master stylists.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {[
            'All',
            'Cut & Style',
            'Color Services',
            'Spa & Scalp Rituals',
            'Hair Treatments',
            'Grooming',
            'Deluxe & Bridal Packages',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedServiceCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                selectedServiceCategory === cat
                  ? 'bg-[#C1785A] text-white shadow-warm scale-105'
                  : 'bg-[#F3ECE3] hover:bg-[#EAE3DA] text-[#6E6663] border border-[#EAE3DA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Organized Service Cards with Luxury Imagery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {INITIAL_SERVICES.filter(
            (s) => selectedServiceCategory === 'All' || s.category === selectedServiceCategory
          ).map((service) => (
            <div
              key={service.id}
              className="group bg-[#FAF6F0] rounded-3xl border border-[#EAE3DA] hover:border-[#C1785A] shadow-card hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              {/* Image Header with Category Badge */}
              <div className="relative h-48 w-full overflow-hidden bg-[#2C2725]">
                <img
                  src={service.image_url || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B19]/80 via-transparent to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#1F1B19]/80 backdrop-blur-md text-[#FAF6F0] text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-sm">
                    {service.category}
                  </span>
                  {service.tag && (
                    <span className="px-2.5 py-1 rounded-full bg-[#C1785A] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-warm">
                      {service.tag}
                    </span>
                  )}
                </div>

                {/* Bottom Duration Overlay */}
                <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-white/90 text-xs font-semibold backdrop-blur-sm bg-black/40 px-2.5 py-0.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-[#E5A88E]" />
                  <span>{service.duration_minutes} mins duration</span>
                </div>
              </div>

              {/* Service Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#2C2725] line-clamp-2 leading-snug group-hover:text-[#8C462C] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#6E6663] line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Pricing & Booking CTA */}
                <div className="pt-3 border-t border-[#EAE3DA] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C462C] tracking-wider block">
                        Full Service
                      </span>
                      <span className="font-serif font-extrabold text-xl text-[#2C2725]">
                        {formatINR(service.price_inr)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                        Advance Lock-in
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        ₹99 Token
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/book?service=${service.id}`}
                    className="w-full py-2.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-white text-xs font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <span>Reserve &amp; Get Token</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SPLIT BRAND STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-[#EAE3DA] shadow-xl">
          {/* Terracotta Side */}
          <div className="bg-[#C1785A] text-[#FAF6F0] p-8 sm:p-14 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#FAF6F0]/80">
                The Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold leading-tight">
                "It's Your Time. It's Your Glow."
              </h2>
              <p className="text-sm sm:text-base text-[#FAF6F0]/90 leading-relaxed font-light">
                We believe exceptional beauty shouldn't come with hours spent idle in a crowded lobby. Rose &amp; Rogue couples haute couture craftsmanship with a real-time queue algorithm that honors your precious calendar.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FAF6F0] shrink-0" />
                <span className="text-sm font-semibold">
                  Live Dynamic ETA with automated chair-ready alerts
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FAF6F0] shrink-0" />
                <span className="text-sm font-semibold">
                  Smart Overlap Chair Optimization for 35% faster turnarounds
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FAF6F0] shrink-0" />
                <span className="text-sm font-semibold">
                  100% Secure ₹99 token deposit via Razorpay
                </span>
              </div>
            </div>
          </div>

          {/* Sand Surface Side */}
          <div className="bg-[#F3ECE3] p-8 sm:p-14 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#C1785A]">
                Artisan Collective
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725]">
                Master Stylists from Paris & Milan
              </h3>
              <p className="text-sm text-[#6E6663] leading-relaxed">
                Our resident artists specialize in dimensional French balayage, sculptural bobs, and molecular scalp therapies.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {INITIAL_STYLISTS.slice(0, 2).map((stylist) => (
                <div key={stylist.id} className="flex items-center gap-3.5 bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#EAE3DA]">
                  <img
                    src={stylist.avatar_url}
                    alt={stylist.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#C1785A] shadow-sm"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2C2725]">{stylist.name}</h4>
                    <p className="text-xs text-[#C1785A] font-bold">{stylist.title}</p>
                    <p className="text-[11px] text-[#6E6663] font-medium">Station #{stylist.chair_number}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-[0.18em] transition-all shadow-md"
            >
              <span>Explore All Artists & Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. STAFF & ADMIN ACCESS GATEWAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E6DF] border border-[#E8D8CE] text-[#8C462C]">
            <Lock className="w-3.5 h-3.5 text-[#C1785A]" />
            <span className="text-[11px] uppercase font-extrabold tracking-[0.2em]">
              PIN-Protected Operations Terminals
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">
            Staff &amp; Administrator Management Portals
          </h2>
          <p className="text-sm text-[#6E6663]">
            Direct hardware terminals for floor artisans and salon operations managers with 4-digit PIN authentication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* A. STAFF STYLIST KIOSK */}
          <div className="bg-[#F3ECE3] rounded-3xl p-8 sm:p-10 border-2 border-[#EAE3DA] hover:border-[#C1785A] shadow-card hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C1785A] to-[#E09D80]" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] flex items-center justify-center text-[#C1785A] shadow-sm group-hover:scale-105 transition-transform">
                  <Scissors className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FAF6F0] text-[#8C462C] border border-[#E8D0C5] text-[10px] font-mono font-extrabold uppercase tracking-wider">
                  PIN: 1234
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725]">
                  Artisan Stylist Floor Kiosk
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6663] mt-2 leading-relaxed">
                  Real-time salon queue engine, station chair rotation, instant walk-in guest injection, and live delay synchronization.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#4A423D] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C1785A]" />
                  <span>Instant walk-in customer addition &amp; digital token pass</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#4A423D] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C1785A]" />
                  <span>Smart Overlap calculation for color processing cycles</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#4A423D] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C1785A]" />
                  <span>Live TV queue board synchronization &amp; chair chimes</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE3DA] flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard"
                className="flex-1 py-3.5 px-6 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2 text-center"
              >
                <Lock className="w-4 h-4" />
                <span>Open Staff Terminal</span>
              </Link>
            </div>
          </div>

          {/* B. OPERATIONS MANAGER & ADMIN CONSOLE */}
          <div className="bg-[#2C2725] text-[#FAF6F0] rounded-3xl p-8 sm:p-10 border-2 border-[#3D3532] hover:border-[#C1785A] shadow-xl hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8C462C] to-[#C1785A]" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#3D3532] border border-[#4A403C] flex items-center justify-center text-[#FAF6F0] shadow-sm group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-7 h-7 text-[#C1785A]" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#3D3532] text-[#F5E6DF] border border-[#4D423D] text-[10px] font-mono font-extrabold uppercase tracking-wider">
                  Admin PIN: 9999
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF6F0]">
                  Operations Manager &amp; Admin Console
                </h3>
                <p className="text-xs sm:text-sm text-[#DDD3C6] mt-2 leading-relaxed">
                  Predictive AI footfall forecasting, revenue metrics, hourly client distribution curves, and chair load analytics.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#DDD3C6] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C1785A]" />
                  <span>Real-time hourly footfall &amp; AI prediction curves</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#DDD3C6] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C1785A]" />
                  <span>Stylist chair utilization percentages &amp; load tracking</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#DDD3C6] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C1785A]" />
                  <span>Doorstep at-home concierge logistics dispatch</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3D3532] flex flex-col sm:flex-row gap-3">
              <Link
                href="/analytics"
                className="flex-1 py-3.5 px-6 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2 text-center"
              >
                <Lock className="w-4 h-4" />
                <span>Open Admin Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
