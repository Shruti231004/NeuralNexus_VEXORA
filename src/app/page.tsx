'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  Scissors,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Calendar,
  Layers,
  Flame,
  QrCode,
  Award,
  Crown,
  Ticket,
  LogIn,
  KeyRound,
  UserCheck,
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
              Experience France’s most refined balayage, cuts, and restorative hair spas with real-time chair prediction, zero dead-time waiting, and seamless ₹99 priority booking.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/book"
                className="px-8 py-4 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-sm font-bold uppercase tracking-[0.2em] shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center gap-3"
              >
                <span>Book Service &amp; Priority Token</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/scan"
                className="px-8 py-4 rounded-full bg-[#FAF6F0] hover:bg-[#F3ECE3] text-[#2C2725] border-2 border-[#EAE3DA] hover:border-[#C1785A] text-sm font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <QrCode className="w-4 h-4 text-[#C1785A]" />
                <span>Scan-to-Book</span>
              </Link>
            </div>

            {/* PORTAL ACCESS STRIP (Customer & Staff Login) */}
            <div className="pt-4 border-t border-[#EAE3DA] flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-[#8C462C] uppercase tracking-wider">
                Portal Access:
              </span>
              <Link
                href="/auth/customer-login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#C1785A]/40 text-xs font-bold text-[#2C2725] hover:bg-[#F3ECE3] transition-colors shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C1785A]" />
                <span>Customer Login</span>
              </Link>
              <Link
                href="/auth/staff-login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C2725] text-[#FAF6F0] text-xs font-bold hover:bg-[#3D3532] transition-colors shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#C1785A]" />
                <span>Staff &amp; Admin Kiosk</span>
              </Link>
            </div>

            {/* Live Trust Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EAE3DA]">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2725]">4.98 ★</span>
                <p className="text-xs text-[#6E6663] uppercase tracking-wider font-semibold">
                  Google &amp; Vogue
                </p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C1785A]">~12 min</span>
                <p className="text-xs text-[#6E6663] uppercase tracking-wider font-semibold">
                  Average Wait
                </p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2725]">100%</span>
                <p className="text-xs text-[#6E6663] uppercase tracking-wider font-semibold">
                  Real-time Sync
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Feature */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Luxury Frame Image */}
              <div className="rounded-[40px] overflow-hidden border-2 border-[#C1785A]/30 shadow-2xl relative aspect-[4/5] bg-[#2C2725]">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000"
                  alt="Styliq Parisian Haute Salon"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2725] via-transparent to-black/20" />

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-[#2C2725]/85 backdrop-blur-md border border-[#E8D8CE]/20 text-[#FAF6F0]">
                  <div className="flex items-center gap-2 text-[#C1785A] text-xs font-bold uppercase tracking-widest mb-1">
                    <Crown className="w-4 h-4" />
                    <span>Haute Coiffure Paris</span>
                  </div>
                  <p className="font-serif text-lg font-bold">
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
                We believe exceptional beauty shouldn't come with hours spent idle in a crowded lobby. Styliq couples haute couture craftsmanship with a real-time queue algorithm that honors your precious calendar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#FAF6F0]/20">
              <div>
                <h4 className="font-serif text-xl font-bold">Real-Time Sync</h4>
                <p className="text-xs text-[#FAF6F0]/80 mt-1">Live queue status with instant WhatsApp push updates.</p>
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold">Smart Overlap</h4>
                <p className="text-xs text-[#FAF6F0]/80 mt-1">Chair slot optimization during color processing windows.</p>
              </div>
            </div>
          </div>

          {/* Neutral Cream Side */}
          <div className="bg-[#F3ECE3] p-8 sm:p-14 flex flex-col justify-between space-y-8 text-[#2C2725]">
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#8C462C]">
                Artisanal Excellence
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#2C2725]">
                Master Stylists Trained on Rue Saint-Honoré
              </h3>
              <p className="text-sm text-[#6E6663] leading-relaxed">
                From organic Japanese silk infusions to precision dry cuts and multidimensional balayage, each master artisan at Styliq is dedicated to a singular client experience.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EAE3DA] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-serif font-bold text-lg shadow-sm">
                4.98
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#8C462C] block">
                  Top Rated in Mumbai &amp; Paris
                </span>
                <p className="text-xs text-[#6E6663]">
                  Over 540+ five-star reviews on Vogue Editorial and Google.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MASTER ARTISANS / STYLIST ROSTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#C1785A]">
              Les Artisans
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725] mt-1">
              Meet Our Master Stylists
            </h2>
          </div>
          <Link
            href="/book"
            className="text-xs uppercase font-bold tracking-[0.2em] text-[#C1785A] hover:text-[#8C462C] flex items-center gap-1.5"
          >
            <span>Book with Preferred Lead</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_STYLISTS.map((stylist) => (
            <div
              key={stylist.id}
              className="bg-[#F3ECE3] rounded-3xl p-5 border border-[#EAE3DA] hover:border-[#C1785A] transition-all shadow-card hover:shadow-warm text-center space-y-4 group"
            >
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#C1785A] shadow-md group-hover:scale-105 transition-transform">
                <img
                  src={stylist.avatar_url}
                  alt={stylist.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C462C] block">
                  Chair #{stylist.chair_number} • {stylist.title}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#2C2725] mt-0.5">
                  {stylist.name}
                </h3>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5">
                {stylist.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[10px] text-[#6E6663] border border-[#EAE3DA]"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-[#EAE3DA] flex items-center justify-between text-xs">
                <span className="text-[#8C462C] font-bold">★ {stylist.rating}</span>
                <span className="text-[#6E6663]">{stylist.reviews_count} Client Reviews</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS / 3-STEP PIPELINE */}
      <section className="bg-[#F3ECE3] py-16 border-y border-[#EAE3DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#C1785A]">
              The Flow
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2C2725]">
              Seamless Queue Architecture in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="bg-[#FAF6F0] p-8 rounded-3xl border border-[#EAE3DA] space-y-4 shadow-sm relative">
              <div className="w-12 h-12 rounded-full bg-[#C1785A] text-[#FAF6F0] font-serif text-xl font-bold flex items-center justify-center mx-auto shadow-warm">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2725]">Book &amp; Lock-In Slot</h3>
              <p className="text-xs text-[#6E6663] leading-relaxed">
                Choose your haircut, color, or spa ritual. Pay a nominal ₹99 token deposit to reserve your chair priority.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF6F0] p-8 rounded-3xl border border-[#EAE3DA] space-y-4 shadow-sm relative">
              <div className="w-12 h-12 rounded-full bg-[#8C462C] text-[#FAF6F0] font-serif text-xl font-bold flex items-center justify-center mx-auto shadow-warm">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2725]">Live WhatsApp &amp; Token</h3>
              <p className="text-xs text-[#6E6663] leading-relaxed">
                Receive your digital token pass, live wait ETA, and real-time status notifications sent directly to your phone.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF6F0] p-8 rounded-3xl border border-[#EAE3DA] space-y-4 shadow-sm relative">
              <div className="w-12 h-12 rounded-full bg-[#C1785A] text-[#FAF6F0] font-serif text-xl font-bold flex items-center justify-center mx-auto shadow-warm">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2725]">Direct Chair Entry</h3>
              <p className="text-xs text-[#6E6663] leading-relaxed">
                Arrive as your chair is prepared. Enjoy zero waiting anxiety with our smart overlap chair scheduler.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
