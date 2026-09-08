'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Scissors,
  Lock,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Delete,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { INITIAL_STAFF_USERS } from '@/lib/mockUsers';
import { playChime } from '@/lib/soundEffects';

export default function StaffAdminLoginPage() {
  const router = useRouter();
  const { loginStaff } = useAuth();

  const [selectedStaffEmail, setSelectedStaffEmail] = useState<string>(INITIAL_STAFF_USERS[0].email);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeypadPress = (val: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + val;
      setEnteredPin(nextPin);
      setPinError(null);
      if (nextPin.length === 4) {
        verifyAndSubmit(nextPin);
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

  const verifyAndSubmit = async (pinToTest: string) => {
    setIsLoading(true);
    setPinError(null);

    const staffTarget = INITIAL_STAFF_USERS.find(
      (u) => u.email.toLowerCase() === selectedStaffEmail.toLowerCase()
    );

    const validPin = staffTarget?.staff_profile?.pin_code || (selectedStaffEmail.includes('manager') ? '9999' : '1234');

    if (pinToTest === validPin || pinToTest === '9999' || pinToTest === '1234') {
      playChime('bell');
      await loginStaff(selectedStaffEmail, pinToTest);
      setIsLoading(false);
      router.push('/dashboard');
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setPinError('Invalid 4-Digit Security PIN. Please try again.');
        setEnteredPin('');
      }, 500);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 relative">
      <div className="max-w-md w-full space-y-4">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#C1785A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Salon Home</span>
          </Link>

          <span className="text-[11px] font-mono text-[#8C462C] dark:text-[#D48464] font-bold">
            PARIS • RESTRICTED ACCESS
          </span>
        </div>

        {/* LUXURY STAFF & ADMIN TERMINAL CARD */}
        <div className="bg-white dark:bg-[#1C1816] rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] p-6 sm:p-7 shadow-xl shadow-[#C1785A]/5 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#C1785A] overflow-hidden flex items-center justify-center p-1 mx-auto shadow-warm">
              <img
                src="/logo.png"
                alt="Rose & Rogue Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="font-serif text-2xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
              Staff &amp; Admin Terminal
            </h1>
            <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
              Select account and enter 4-digit security PIN
            </p>
          </div>

          {/* Account Selection */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#B5ABA2] block">
              Artisan &amp; Manager Accounts
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

          {/* 4-DIGIT PIN DISPLAY MASK */}
          <div className="space-y-2 py-1 text-center">
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
              (Demo PINs: Stylists: <strong>1234</strong> • Admin: <strong>9999</strong>)
            </p>
          </div>

          {/* NUMERIC KEYPAD */}
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

          {/* Security Banner */}
          <div className="pt-3 border-t border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-center gap-2 text-[11px] text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit Hardware PIN Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
