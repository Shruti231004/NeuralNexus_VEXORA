'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Scissors,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Crown,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { GoogleIcon } from '@/components/GoogleIcon';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';

export default function StaffLoginPage() {
  const router = useRouter();
  const { user, loginStaff, switchDemoUser } = useAuth();

  const [staffEmail, setStaffEmail] = useState('antoine@roseandrogue.com');
  const [staffPin, setStaffPin] = useState('1234');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginStaff(staffEmail, staffPin);
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF6F0] dark:bg-[#141110] text-[#2C2725] dark:text-[#FAF6F0] flex flex-col justify-center items-center py-10 px-4 sm:px-6 transition-colors">
      <div className="max-w-md w-full space-y-5">
        {/* Top Navigation Links */}
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#C1785A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Salon Home</span>
          </Link>

          <Link
            href="/auth/customer-login"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C98A2C] dark:text-[#F2A585] hover:underline"
          >
            <Crown className="w-3 h-3" />
            <span>VIP Client Portal →</span>
          </Link>
        </div>

        {/* STAFF LOGIN CARD */}
        <div className="bg-white dark:bg-[#1C1816] rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] p-6 sm:p-8 shadow-xl shadow-[#C1785A]/5 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8C462C] to-[#2C2725] text-[#FAF6F0] flex items-center justify-center mx-auto shadow-warm">
              <Scissors className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
              Staff & Stylist Kiosk
            </h1>
            <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
              Manager queue controls, live chair rotation & walk-in injection
            </p>
          </div>

          {/* 1. GOOGLE ONE-TAP LOGIN */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-[#241E1C] hover:bg-[#F3ECE3] dark:hover:bg-[#2C2420] border-2 border-[#EAE3DA] dark:border-[#3A302A] text-xs font-bold text-[#2C2725] dark:text-[#FAF6F0] shadow-sm transition-all flex items-center justify-center gap-3 group"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Sign In with Stylist Google Account</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#EAE3DA] dark:border-[#332A26]" />
            <span className="absolute px-3 bg-white dark:bg-[#1C1816] text-[10px] uppercase font-bold text-[#A89F91] tracking-widest">
              Or PIN Authentication
            </span>
          </div>

          {/* STAFF FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C1785A]" />
                Staff Email
              </label>
              <input
                type="email"
                required
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                placeholder="antoine@roseandrogue.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0] dark:bg-[#241E1C] text-xs font-mono text-[#2C2725] dark:text-[#FAF6F0] font-bold focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C1785A]" />
                Artisan 4-Digit PIN
              </label>
              <input
                type="password"
                required
                maxLength={6}
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0] dark:bg-[#241E1C] text-xs font-mono text-[#2C2725] dark:text-[#FAF6F0] font-bold tracking-widest focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#8C462C] hover:bg-[#68331F] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Access Staff Kiosk'}</span>
              <LayoutDashboard className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Preset */}
          <div className="pt-2 border-t border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">Quick Demo:</span>
            <button
              type="button"
              onClick={() => {
                switchDemoUser('staff');
                router.push('/dashboard');
              }}
              className="text-[11px] font-bold text-[#8C462C] dark:text-[#F2A585] hover:underline"
            >
              Load Antoine Laurent (Lead) →
            </button>
          </div>
        </div>

        {/* Switch Card to Customer */}
        <div className="text-center p-4 bg-[#F3ECE3] dark:bg-[#1D1816] rounded-2xl border border-[#EAE3DA] dark:border-[#382E28]">
          <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
            Are you a salon client looking for your token?{' '}
            <Link
              href="/auth/customer-login"
              className="font-bold text-[#8C462C] dark:text-[#D48464] hover:underline ml-1"
            >
              Go to VIP Client Login →
            </Link>
          </p>
        </div>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        targetRole="staff"
        onSuccess={() => router.push('/dashboard')}
      />
    </div>
  );
}
