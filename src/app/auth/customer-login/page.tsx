'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Crown,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Scissors,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { GoogleIcon } from '@/components/GoogleIcon';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { user, loginCustomer, switchDemoUser } = useAuth();

  const [customerPhone, setCustomerPhone] = useState('+91 98200 88888');
  const [customerName, setCustomerName] = useState('Natasha Kapoor');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginCustomer(customerPhone, customerName);
    setIsLoading(false);
    router.push('/profile');
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
            href="/auth/staff-login"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#D48464] hover:underline"
          >
            <Scissors className="w-3 h-3" />
            <span>Staff Portal →</span>
          </Link>
        </div>

        {/* VIP CUSTOMER CARD */}
        <div className="bg-white dark:bg-[#1C1816] rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] p-6 sm:p-8 shadow-xl shadow-[#C1785A]/5 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C1785A] to-[#8C462C] text-[#FAF6F0] flex items-center justify-center mx-auto shadow-warm">
              <Crown className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
              VIP Client Portal
            </h1>
            <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
              Access your digital tokens, booking history & loyalty rewards
            </p>
          </div>

          {/* 1. GOOGLE ONE-TAP LOGIN */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-[#241E1C] hover:bg-[#F3ECE3] dark:hover:bg-[#2C2420] border-2 border-[#EAE3DA] dark:border-[#3A302A] text-xs font-bold text-[#2C2725] dark:text-[#FAF6F0] shadow-sm transition-all flex items-center justify-center gap-3 group"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Continue with Google (VIP Client)</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#EAE3DA] dark:border-[#332A26]" />
            <span className="absolute px-3 bg-white dark:bg-[#1C1816] text-[10px] uppercase font-bold text-[#A89F91] tracking-widest">
              Or phone access
            </span>
          </div>

          {/* CUSTOMER FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C1785A]" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Natasha Kapoor"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0] dark:bg-[#241E1C] text-xs text-[#2C2725] dark:text-[#FAF6F0] font-medium focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C1785A]" />
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98200 88888"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0] dark:bg-[#241E1C] text-xs font-mono text-[#2C2725] dark:text-[#FAF6F0] font-bold focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying...' : 'Sign In as VIP Client'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Preset */}
          <div className="pt-2 border-t border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">Instant Demo:</span>
            <button
              type="button"
              onClick={() => {
                switchDemoUser('customer');
                router.push('/profile');
              }}
              className="text-[11px] font-bold text-[#8C462C] dark:text-[#F2A585] hover:underline"
            >
              Load Natasha Kapoor (VIP) →
            </button>
          </div>
        </div>

        {/* Switch Card to Staff */}
        <div className="text-center p-4 bg-[#F3ECE3] dark:bg-[#1D1816] rounded-2xl border border-[#EAE3DA] dark:border-[#382E28]">
          <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
            Are you a salon stylist or manager?{' '}
            <Link
              href="/auth/staff-login"
              className="font-bold text-[#8C462C] dark:text-[#D48464] hover:underline ml-1"
            >
              Go to Staff Kiosk Login →
            </Link>
          </p>
        </div>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        targetRole="customer"
        onSuccess={() => router.push('/profile')}
      />
    </div>
  );
}
