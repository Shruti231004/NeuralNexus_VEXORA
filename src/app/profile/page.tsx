'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Crown,
  Sparkles,
  Calendar,
  Clock,
  Ticket,
  Star,
  Receipt,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Scissors,
  ArrowRight,
  LogOut,
  ChevronRight,
  Award,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { subscribeToAppointments } from '@/lib/supabaseClient';
import { Appointment } from '@/lib/types';
import { formatINR } from '@/lib/queueEngine';
import { QueueTokenModal } from '@/components/QueueTokenModal';
import { StylistRatingModal } from '@/components/StylistRatingModal';
import { GoogleSecurityGate } from '@/components/GoogleSecurityGate';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isCustomer, isStaff, logout, switchDemoUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedTokenApt, setSelectedTokenApt] = useState<Appointment | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [ratingApt, setRatingApt] = useState<Appointment | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((list: Appointment[]) => {
      setAppointments(list);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <GoogleSecurityGate
        targetRole="customer"
        title="VIP Client Lounge Security Gate"
        subtitle="Google account authentication is required to view your live queue tokens, styling history, invoices, and loyalty reward stars."
      >
        <div />
      </GoogleSecurityGate>
    );
  }

  // Filter customer appointments
  const activeTokens = appointments.filter(
    (a) => a.status === 'waiting' || a.status === 'in_chair' || a.status === 'color_processing'
  );
  const pastAppointments = appointments.filter((a) => a.status === 'completed');

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-[#141110] text-[#2C2725] dark:text-[#FAF6F0] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* VIP PROFILE HEADER CARD */}
        <div className="bg-[#F3ECE3] dark:bg-[#1D1816] rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'}
                alt={user.full_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#C1785A] shadow-md"
              />
              <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#C1785A] text-white shadow-sm">
                <Crown className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-[10px] font-extrabold uppercase tracking-widest border border-[#E8D0C5] dark:border-[#52352A]">
                  {user.customer_profile?.vip_tier || (isStaff ? 'Staff Director' : 'VIP Client')}
                </span>
                <span className="text-xs text-[#6E6663] dark:text-[#B5ABA2] font-mono">
                  {isStaff ? 'Staff ID: STLQ-01' : 'Member ID: VIP-8829'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
                {user.full_name}
              </h1>
              <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                {user.phone || '+91 98200 88888'} • {user.email}
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
            {isStaff ? (
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-full bg-[#C1785A] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider shadow-warm flex items-center gap-1.5"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Open Staff Kiosk</span>
              </Link>
            ) : (
              <Link
                href="/book"
                className="px-4 py-2.5 rounded-full bg-[#C1785A] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider shadow-warm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book New Service</span>
              </Link>
            )}

            <button
              onClick={() => switchDemoUser(isStaff ? 'customer' : 'staff')}
              className="px-3.5 py-2.5 rounded-full bg-[#FAF6F0] dark:bg-[#26201D] border border-[#EAE3DA] dark:border-[#382E28] text-xs font-bold text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] dark:hover:text-[#FAF6F0] transition-colors"
              title="Toggle role between Staff and Client for testing"
            >
              Switch to {isStaff ? 'VIP Client' : 'Staff'}
            </button>

            <button
              onClick={logout}
              className="p-2.5 rounded-full bg-[#FAF6F0] dark:bg-[#26201D] border border-[#EAE3DA] dark:border-[#382E28] text-[#8C462C] dark:text-[#F2A585] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 VIP METRIC STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FAF6F0] dark:bg-[#1D1816] p-5 rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] shadow-sm space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C462C] dark:text-[#F2A585] block">
              VIP Loyalty Reward
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
                {user.customer_profile?.loyalty_points || 640} <span className="text-xs font-sans font-bold text-[#6E6663]">Pts</span>
              </span>
              <span className="text-[11px] font-bold text-[#C98A2C]">Free Spa Next</span>
            </div>
          </div>

          <div className="bg-[#FAF6F0] dark:bg-[#1D1816] p-5 rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] shadow-sm space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6E6663] dark:text-[#B5ABA2] block">
              Active Queue Tokens
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl font-extrabold text-[#C1785A]">
                {activeTokens.length}
              </span>
              <span className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">Live in Salon</span>
            </div>
          </div>

          <div className="bg-[#FAF6F0] dark:bg-[#1D1816] p-5 rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] shadow-sm space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6E6663] dark:text-[#B5ABA2] block">
              Completed Styling
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
                {user.customer_profile?.total_bookings_count || 8}
              </span>
              <span className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">Parisian Sessions</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: ACTIVE LIVE QUEUE TOKENS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#2C2725] dark:text-[#FAF6F0] flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#C1785A]" />
              <span>Active Queue Tokens & Priority Passes</span>
            </h2>
            <span className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
              Synced in Realtime
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTokens.slice(0, 4).map((apt, idx) => (
              <div
                key={apt.id}
                className="bg-[#FAF6F0] dark:bg-[#1D1816] p-6 rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] shadow-sm space-y-4 hover:border-[#C1785A] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-xs font-mono font-black border border-[#C1785A]/40 mb-1 shadow-sm">
                      <span className="text-[9px] uppercase font-bold tracking-wider">Token</span>
                      <span className="bg-white/70 dark:bg-black/40 px-1.5 py-0.5 rounded border border-[#E8D0C5] dark:border-[#523A30]">#{apt.queue_number}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#2C2725] dark:text-[#FAF6F0] mt-0.5">
                      {apt.service?.name}
                    </h3>
                    <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                      Stylist: <strong className="text-[#2C2725] dark:text-[#FAF6F0]">{apt.stylist?.name}</strong> • Chair #{apt.stylist?.chair_number}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-xs font-extrabold uppercase tracking-wider">
                    {apt.status === 'in_chair' ? 'In Chair' : apt.status === 'color_processing' ? 'Processing' : `Position #${idx + 1}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedTokenApt(apt);
                      setIsTokenModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#F2A585] hover:underline"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>View Digital Pass</span>
                  </button>

                  <Link
                    href={`/queue/${apt.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C1785A] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#8C462C] transition-all"
                  >
                    <span>Track Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: PAST APPOINTMENTS & REVIEWS */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#2C2725] dark:text-[#FAF6F0] flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#C1785A]" />
            <span>Past Styling Sessions & Reviews</span>
          </h2>

          <div className="bg-[#FAF6F0] dark:bg-[#1D1816] rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] divide-y divide-[#EAE3DA] dark:divide-[#332A26] overflow-hidden shadow-sm">
            {pastAppointments.slice(0, 6).map((apt) => (
              <div key={apt.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#6E6663] dark:text-[#B5ABA2]">
                      {apt.queue_number}
                    </span>
                    <span className="text-[#DDD3C6] dark:text-[#4D413A]">·</span>
                    <span className="text-xs font-bold text-[#C1785A]">
                      {formatINR(apt.service?.price_inr || 2400)} Settled
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#2C2725] dark:text-[#FAF6F0]">
                    {apt.service?.name}
                  </h4>
                  <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                    Master Stylist: {apt.stylist?.name} • Session Completed
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {apt.customer_rating ? (
                    <div className="flex items-center gap-1 text-[#C98A2C] bg-[#FDF2E2] dark:bg-[#332514] px-3 py-1.5 rounded-full border border-[#F2DEBF] dark:border-[#4A3720]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-extrabold">{apt.customer_rating}.0 Rated</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setRatingApt(apt);
                        setIsRatingModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-xs font-bold uppercase tracking-wider hover:bg-[#C1785A] hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Rate Stylist</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Pass Modal */}
        <QueueTokenModal
          isOpen={isTokenModalOpen}
          onClose={() => setIsTokenModalOpen(false)}
          appointment={selectedTokenApt}
          queuePosition={1}
          estimatedWaitMinutes={10}
        />

        {/* Rating Modal */}
        {ratingApt && (
          <StylistRatingModal
            isOpen={isRatingModalOpen}
            onClose={() => setIsRatingModalOpen(false)}
            appointment={ratingApt}
          />
        )}
      </div>
    </div>
  );
}
