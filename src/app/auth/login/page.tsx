'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  User,
  Scissors,
  Sparkles,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  KeyRound,
  Crown,
  LayoutDashboard,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { GoogleIcon } from '@/components/GoogleIcon';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center">Loading portal...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'staff' ? 'staff' : 'customer';

  const { user, loginStaff, loginCustomer, logout, switchDemoUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'staff' | 'customer'>(initialRole);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleTargetRole, setGoogleTargetRole] = useState<'customer' | 'staff'>(initialRole);

  // Staff Form
  const [staffEmail, setStaffEmail] = useState('antoine@roseandrogue.com');
  const [staffPin, setStaffPin] = useState('1234');

  // Customer Form
  const [customerPhone, setCustomerPhone] = useState('+91 98200 88888');
  const [customerName, setCustomerName] = useState('Natasha Kapoor');

  const [isLoading, setIsLoading] = useState(false);

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginStaff(staffEmail, staffPin);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginCustomer(customerPhone, customerName);
    setIsLoading(false);
    router.push('/profile');
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF6F0] dark:bg-[#141110] text-[#2C2725] dark:text-[#FAF6F0] flex flex-col justify-center items-center py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-md w-full space-y-4">
        {/* Top Back Link */}
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#C1785A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Salon Home</span>
          </Link>

          <span className="text-[11px] font-mono text-[#8C462C] dark:text-[#D48464] font-bold">
            PARIS • LUXURY ACCESS
          </span>
        </div>

        {/* COMPACT LUXURY LOGIN CARD */}
        <div className="bg-white dark:bg-[#1C1816] rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] p-6 sm:p-7 shadow-xl shadow-[#C1785A]/5 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C1785A] to-[#8C462C] text-[#FAF6F0] flex items-center justify-center font-serif text-lg font-bold mx-auto shadow-warm">
              R
            </div>
            <h1 className="font-serif text-2xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
              Sign In to Rose & Rogue
            </h1>
            <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
              Choose your portal to continue
            </p>
          </div>

          {/* Compact Role Switcher */}
          <div className="flex bg-[#F3ECE3] dark:bg-[#26201D] p-1 rounded-full border border-[#EAE3DA] dark:border-[#3A302A]">
            <button
              type="button"
              onClick={() => setActiveTab('customer')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'customer'
                  ? 'bg-[#C1785A] text-[#FAF6F0] shadow-sm'
                  : 'text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] dark:hover:text-[#FAF6F0]'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>VIP Client</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'staff'
                  ? 'bg-[#C1785A] text-[#FAF6F0] shadow-sm'
                  : 'text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] dark:hover:text-[#FAF6F0]'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Staff Kiosk</span>
            </button>
          </div>

          {/* 1. GOOGLE ONE-TAP BUTTON */}
          <button
            type="button"
            onClick={() => {
              setGoogleTargetRole(activeTab);
              setIsGoogleModalOpen(true);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#241E1C] hover:bg-[#F3ECE3] dark:hover:bg-[#2D2420] border border-[#EAE3DA] dark:border-[#382E28] text-xs font-bold text-[#2C2725] dark:text-[#FAF6F0] transition-all flex items-center justify-center gap-2.5 shadow-sm transform hover:scale-[1.01]"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#EAE3DA] dark:border-[#332A26]" />
            <span className="bg-white dark:bg-[#1C1816] px-2.5 text-[10px] uppercase font-mono text-[#8F8178] dark:text-[#A89F91]">
              or with {activeTab === 'customer' ? 'mobile' : 'pin'}
            </span>
          </div>

          {/* TAB 1: CUSTOMER FORM */}
          {activeTab === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A423D] dark:text-[#C7BCB3] flex items-center gap-1">
                  <User className="w-3 h-3 text-[#C1785A]" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Natasha Kapoor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0]/60 dark:bg-[#241E1C] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A423D] dark:text-[#C7BCB3] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#C1785A]" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98200 88888"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0]/60 dark:bg-[#241E1C] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Entering...' : 'Enter VIP Client Lounge'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: STAFF FORM */}
          {activeTab === 'staff' && (
            <form onSubmit={handleStaffSubmit} className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A423D] dark:text-[#C7BCB3] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#C1785A]" />
                  Staff Email
                </label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="antoine@roseandrogue.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0]/60 dark:bg-[#241E1C] text-xs text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A423D] dark:text-[#C7BCB3] flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-[#C1785A]" />
                  PIN Code
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0]/60 dark:bg-[#241E1C] text-xs text-[#2C2725] dark:text-[#FAF6F0] tracking-widest focus:outline-none focus:border-[#C1785A]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Verifying...' : 'Sign In to Manager Kiosk'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Switch Strip */}
          <div className="pt-3 border-t border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-between text-[11px]">
            <span className="text-[#6E6663] dark:text-[#A89F91]">Demo Quick Access:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('customer');
                  router.push('/profile');
                }}
                className="px-2 py-1 rounded-md bg-[#F3ECE3] dark:bg-[#26201D] hover:bg-[#EAE3DA] text-[#8C462C] dark:text-[#F2A585] font-bold"
              >
                VIP Natasha
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('staff');
                  router.push('/dashboard');
                }}
                className="px-2 py-1 rounded-md bg-[#F3ECE3] dark:bg-[#26201D] hover:bg-[#EAE3DA] text-[#2C2725] dark:text-[#FAF6F0] font-bold"
              >
                Staff Antoine
              </button>
            </div>
          </div>
        </div>

        {/* Current Session Indicator if logged in */}
        {user && (
          <div className="p-3 rounded-2xl bg-[#F3ECE3]/80 dark:bg-[#1D1816] border border-[#EAE3DA] dark:border-[#382E28] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-7 h-7 rounded-full object-cover border border-[#C1785A]"
              />
              <div>
                <p className="font-bold text-[#2C2725] dark:text-[#FAF6F0] leading-none">
                  {user.full_name}
                </p>
                <span className="text-[10px] text-[#6E6663] dark:text-[#B5ABA2] uppercase font-mono">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="text-xs font-bold text-[#8C462C] dark:text-[#F2A585] hover:underline"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Google Authentication Modal */}
        <GoogleAuthModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          targetRole={googleTargetRole}
          onSuccess={() => {
            if (googleTargetRole === 'staff') {
              router.push('/dashboard');
            } else {
              router.push('/profile');
            }
          }}
        />
      </div>
    </div>
  );
}
