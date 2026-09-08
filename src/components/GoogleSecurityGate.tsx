'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  Crown,
  Scissors,
  CheckCircle2,
  KeyRound,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Delete,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { GoogleIcon } from './GoogleIcon';
import { GoogleAuthModal } from './GoogleAuthModal';
import { INITIAL_STAFF_USERS } from '@/lib/mockUsers';
import { playChime } from '@/lib/soundEffects';

interface GoogleSecurityGateProps {
  title?: string;
  subtitle?: string;
  targetRole?: 'customer' | 'staff' | 'admin';
  children: React.ReactNode;
}

export const GoogleSecurityGate: React.FC<GoogleSecurityGateProps> = ({
  title,
  subtitle,
  targetRole = 'customer',
  children,
}) => {
  const { user, isStaff, loginStaff } = useAuth();

  // State for Staff & Admin PIN Pad
  const [selectedStaffEmail, setSelectedStaffEmail] = useState<string>(INITIAL_STAFF_USERS[0].email);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // If user is already authenticated with the required staff/admin permissions
  if (targetRole === 'customer' && user) {
    return <>{children}</>;
  }

  if ((targetRole === 'staff' || targetRole === 'admin') && user && (isStaff || user.role === 'manager' || user.role === 'staff')) {
    return <>{children}</>;
  }

  // Handle PIN Keypad Press
  const handleKeypadPress = (val: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + val;
      setEnteredPin(nextPin);
      setPinError(null);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin(enteredPin.slice(0, -1));
    setPinError(null);
  };

  const handleClear = () => {
    setEnteredPin('');
    setPinError(null);
  };

  const verifyPin = async (pinToTest: string) => {
    setIsVerifying(true);
    setPinError(null);

    // Verify against staff profile or master pin
    const staffTarget = INITIAL_STAFF_USERS.find(
      (u) => u.email.toLowerCase() === selectedStaffEmail.toLowerCase()
    );

    const validPin = staffTarget?.staff_profile?.pin_code || (selectedStaffEmail.includes('manager') ? '9999' : '1234');

    if (pinToTest === validPin || pinToTest === '9999' || pinToTest === '1234') {
      playChime('bell');
      await loginStaff(selectedStaffEmail, pinToTest);
      setIsVerifying(false);
    } else {
      setTimeout(() => {
        setIsVerifying(false);
        setPinError('Invalid 4-Digit Security PIN. Please try again.');
        setEnteredPin('');
      }, 500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.length === 4) {
      verifyPin(enteredPin);
    }
  };

  // ==========================================
  // STAFF & ADMIN SECURITY GATE (PIN PROTECTED)
  // ==========================================
  if (targetRole === 'staff' || targetRole === 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-[#FAF6F0] dark:bg-[#141110] text-[#2C2725] dark:text-[#FAF6F0] transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-[#1C1816] rounded-[36px] border-2 border-[#C1785A]/40 p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden text-center">
          {/* Top Gold Security Foil Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8C462C] via-[#C1785A] to-[#8C462C]" />

          {/* Header Security Icon */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8C462C] to-[#2C2725] border border-[#C1785A] flex items-center justify-center text-white shadow-warm">
              <Lock className="w-7 h-7 text-[#D48464]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-[#8C462C] dark:text-[#D48464] block">
              Restricted Staff &amp; Admin Terminal
            </span>
            <h2 className="font-serif text-2xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
              Staff &amp; Manager Security Gate
            </h2>
            <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2] max-w-xs mx-auto">
              Please enter your registered 4-digit artisan or manager PIN code to unlock live chair queue controls.
            </p>
          </div>

          {/* User Abstraction Notice (If customer is logged in) */}
          {user && user.role === 'customer' && (
            <div className="p-3 rounded-2xl bg-[#F5E6DF] dark:bg-[#38251E] border border-[#E8D0C5] text-left flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-[#C1785A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#8C462C] dark:text-[#F2A585] block font-bold">
                  VIP Client Account Active ({user.full_name})
                </strong>
                <span className="text-[#6E6663] dark:text-[#DDD3C6] text-[11px] leading-tight block mt-0.5">
                  This console is restricted to Salon Staff &amp; Administrators. Enter staff PIN to switch sessions.
                </span>
              </div>
            </div>
          )}

          {/* 1. SELECT STAFF / ADMIN PROFILE */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] block">
              Select Artisan Account
            </label>
            <div className="grid grid-cols-3 gap-2">
              {INITIAL_STAFF_USERS.map((st) => {
                const isSelected = selectedStaffEmail === st.email;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setSelectedStaffEmail(st.email);
                      setEnteredPin('');
                      setPinError(null);
                    }}
                    className={`p-2 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#F5E6DF] dark:bg-[#38251E] border-[#C1785A] shadow-sm ring-2 ring-[#C1785A]/30'
                        : 'bg-[#FAF6F0] dark:bg-[#221B18] border-[#EAE3DA] dark:border-[#382E28] hover:border-[#C1785A]/60'
                    }`}
                  >
                    <img
                      src={st.avatar_url}
                      alt={st.full_name}
                      className="w-8 h-8 rounded-full object-cover mx-auto border border-[#C1785A] mb-1"
                    />
                    <p className="font-bold text-[11px] text-[#2C2725] dark:text-[#FAF6F0] truncate">
                      {st.full_name.split(' ')[0]}
                    </p>
                    <span className="text-[9px] text-[#8C462C] dark:text-[#F2A585] font-semibold block uppercase">
                      {st.staff_profile?.access_level === 'owner' ? 'Admin' : 'Lead'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 4-DIGIT PIN DISPLAY MASK */}
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = enteredPin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-11 h-12 rounded-2xl border-2 flex items-center justify-center text-lg font-mono font-extrabold transition-all ${
                      isFilled
                        ? 'border-[#C1785A] bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#FAF6F0] shadow-sm'
                        : 'border-[#EAE3DA] dark:border-[#382E28] bg-[#FAF6F0] dark:bg-[#201A18] text-transparent'
                    }`}
                  >
                    {isFilled ? '●' : ''}
                  </div>
                );
              })}
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-semibold animate-pulse">
                {pinError}
              </p>
            )}

            <p className="text-[10px] text-[#8C462C] dark:text-[#F2A585] font-mono">
              (Demo PIN: Stylists: <strong>1234</strong> • Admin: <strong>9999</strong>)
            </p>
          </div>

          {/* 3. INTERACTIVE LUXURY NUMERIC KEYPAD */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="py-3 rounded-2xl bg-[#F3ECE3] dark:bg-[#241E1C] hover:bg-[#EAE3DA] dark:hover:bg-[#2E2420] text-sm font-serif font-extrabold text-[#2C2725] dark:text-[#FAF6F0] border border-[#EAE3DA] dark:border-[#382E28] transition-all transform active:scale-95 shadow-sm"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="py-3 rounded-2xl bg-[#F3ECE3] dark:bg-[#241E1C] hover:bg-[#EAE3DA] text-xs font-bold uppercase text-[#6E6663] dark:text-[#B5ABA2] border border-[#EAE3DA] dark:border-[#382E28]"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-3 rounded-2xl bg-[#F3ECE3] dark:bg-[#241E1C] hover:bg-[#EAE3DA] text-sm font-serif font-extrabold text-[#2C2725] dark:text-[#FAF6F0] border border-[#EAE3DA] dark:border-[#382E28] active:scale-95 shadow-sm"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              className="py-3 rounded-2xl bg-[#F3ECE3] dark:bg-[#241E1C] hover:bg-[#EAE3DA] text-xs font-bold text-[#8C462C] flex items-center justify-center border border-[#EAE3DA] dark:border-[#382E28]"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {/* 4. FOOTER RETURN LINK */}
          <div className="pt-3 border-t border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-between text-xs">
            <Link
              href="/"
              className="text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] font-medium"
            >
              ← Back to Salon Home
            </Link>

            <Link
              href="/profile"
              className="text-[#8C462C] dark:text-[#D48464] font-bold hover:underline"
            >
              Client VIP Portal →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CUSTOMER SECURITY GATE (GOOGLE AUTH)
  // ==========================================
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-[#FAF6F0] dark:bg-[#141110] text-[#2C2725] dark:text-[#FAF6F0] transition-colors">
      <div className="max-w-lg w-full bg-white dark:bg-[#1C1816] rounded-3xl border-2 border-[#EAE3DA] dark:border-[#382E28] p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden text-center">
        {/* Top Gold Security Foil Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8C462C] via-[#C1785A] to-[#8C462C]" />

        {/* Security Shield & Lock Icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-[#F5E6DF] dark:bg-[#38251E] border-2 border-[#C1785A] flex items-center justify-center text-[#8C462C] dark:text-[#F2A585] shadow-warm">
            <Lock className="w-9 h-9 text-[#C1785A]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Narrative */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-[#8C462C] dark:text-[#D48464] block">
            Secured Client Architecture • Paris
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
            {title || 'Client Authentication Required'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6663] dark:text-[#B5ABA2] max-w-sm mx-auto leading-relaxed">
            {subtitle || 'Please authenticate with your Google account to access priority tokens and wait time tracking.'}
          </p>
        </div>

        {/* PRIMARY GOOGLE SIGN-IN CTA */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-[#241E1C] hover:bg-[#F3ECE3] dark:hover:bg-[#2E2420] border-2 border-[#EAE3DA] dark:border-[#3A302A] text-xs sm:text-sm font-extrabold text-[#2C2725] dark:text-[#FAF6F0] shadow-md hover:shadow-warm transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>Sign In with Google</span>
          </button>

          <div className="flex items-center justify-between text-xs pt-2">
            <Link
              href="/"
              className="text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] dark:hover:text-[#FAF6F0] font-medium"
            >
              ← Back to Home
            </Link>

            <Link
              href="/auth/login"
              className="font-bold text-[#8C462C] dark:text-[#D48464] hover:underline"
            >
              Staff / Admin PIN Terminal →
            </Link>
          </div>
        </div>

        {/* Security Pillars */}
        <div className="pt-4 border-t border-[#EAE3DA] dark:border-[#332A26] grid grid-cols-2 gap-3 text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Tokens</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>OAuth 2.0 Verified</span>
          </div>
        </div>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        targetRole="customer"
      />
    </div>
  );
};
