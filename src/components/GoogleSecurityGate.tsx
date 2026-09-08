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
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { GoogleIcon } from './GoogleIcon';
import { GoogleAuthModal } from './GoogleAuthModal';

interface GoogleSecurityGateProps {
  title?: string;
  subtitle?: string;
  targetRole?: 'customer' | 'staff';
  children: React.ReactNode;
}

export const GoogleSecurityGate: React.FC<GoogleSecurityGateProps> = ({
  title = 'Google Authentication Required',
  subtitle = 'Please sign in with your Google account to access this secured salon workspace.',
  targetRole = 'customer',
  children,
}) => {
  const { user } = useAuth();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'staff'>(targetRole);

  // If user is signed in, render the protected content directly
  if (user) {
    return <>{children}</>;
  }

  // Otherwise, render the luxury Google Lock Screen
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
            Secured Salon Architecture • Paris
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725] dark:text-[#FAF6F0]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6663] dark:text-[#B5ABA2] max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex bg-[#F3ECE3] dark:bg-[#26201D] p-1.5 rounded-full border border-[#EAE3DA] dark:border-[#3A302A] max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'customer'
                ? 'bg-[#C1785A] text-[#FAF6F0] shadow-sm'
                : 'text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] dark:hover:text-[#FAF6F0]'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>VIP Guest</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('staff')}
            className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'staff'
                ? 'bg-[#C1785A] text-[#FAF6F0] shadow-sm'
                : 'text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] dark:hover:text-[#FAF6F0]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Stylist Staff</span>
          </button>
        </div>

        {/* PRIMARY GOOGLE SIGN-IN CTA */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-[#241E1C] hover:bg-[#F3ECE3] dark:hover:bg-[#2E2420] border-2 border-[#EAE3DA] dark:border-[#3A302A] text-xs sm:text-sm font-extrabold text-[#2C2725] dark:text-[#FAF6F0] shadow-md hover:shadow-warm transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>Sign In with Google to Unlock</span>
          </button>

          <div className="flex items-center justify-between text-xs pt-2">
            <Link
              href="/"
              className="text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] dark:hover:text-[#FAF6F0] font-medium"
            >
              ← Back to Home
            </Link>

            <Link
              href={selectedRole === 'staff' ? '/auth/staff-login' : '/auth/customer-login'}
              className="font-bold text-[#8C462C] dark:text-[#D48464] hover:underline"
            >
              Alternative Sign In Form →
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
        targetRole={selectedRole}
      />
    </div>
  );
};
