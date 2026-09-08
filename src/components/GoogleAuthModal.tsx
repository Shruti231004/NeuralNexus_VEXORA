'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { GoogleIcon } from './GoogleIcon';
import { useAuth } from '@/lib/authContext';
import { playChime } from '@/lib/soundEffects';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: 'customer' | 'staff';
  onSuccess?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  targetRole = 'customer',
  onSuccess,
}) => {
  const { signInWithGoogle } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const googleAccounts = [
    {
      name: 'Natasha Kapoor',
      email: 'vip.natasha@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      role: 'customer' as const,
      badge: 'Platinum VIP',
    },
    {
      name: 'Antoine Dubois',
      email: 'antoine@styliqparis.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      role: 'staff' as const,
      badge: 'Artistic Director',
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan.mehta@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      role: 'customer' as const,
      badge: 'Gold VIP',
    },
  ];

  const handleSelectAccount = async (acc: typeof googleAccounts[0]) => {
    setIsSigningIn(true);
    playChime('bell');

    await signInWithGoogle(targetRole || acc.role, acc.email, acc.name, acc.avatar);

    setTimeout(() => {
      setIsSigningIn(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 500);
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setIsSigningIn(true);
    playChime('bell');

    const displayName = customName.trim() || customEmail.split('@')[0];
    await signInWithGoogle(targetRole, customEmail, displayName);

    setTimeout(() => {
      setIsSigningIn(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2725]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF6F0] dark:bg-[#1D1816] rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-[#2C2725] dark:text-[#FAF6F0]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6663] dark:text-[#B5ABA2] hover:bg-[#F3ECE3] dark:hover:bg-[#26201D] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#26201D] border border-[#EAE3DA] dark:border-[#382E28] flex items-center justify-center mx-auto shadow-sm">
            <GoogleIcon className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-2xl font-bold">Sign in with Google</h3>
          <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
            to continue to <strong className="text-[#2C2725] dark:text-[#FAF6F0]">STYLIQ Haute Coiffure Paris</strong>
          </p>
        </div>

        {/* Google Account List */}
        {!showCustomForm ? (
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#8C462C] dark:text-[#F2A585] block">
              Choose a Google Account:
            </span>

            {googleAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={isSigningIn}
                onClick={() => handleSelectAccount(acc)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-[#241E1C] hover:bg-[#F3ECE3] dark:hover:bg-[#2A221E] border border-[#EAE3DA] dark:border-[#382E28] transition-all flex items-center justify-between text-left shadow-sm group transform hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#C1785A]"
                  />
                  <div>
                    <p className="font-bold text-xs text-[#2C2725] dark:text-[#FAF6F0]">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">{acc.email}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] border border-[#E8D0C5] dark:border-[#52352A]">
                  {acc.badge}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowCustomForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#DDD3C6] dark:border-[#4A3D34] text-xs font-bold text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] dark:hover:text-[#FAF6F0] transition-colors text-center block mt-2"
            >
              + Use another Google account
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomGoogleSubmit} className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] dark:text-[#C7BCB3]">
                Your Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full p-3 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#241E1C] text-xs focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] dark:text-[#C7BCB3]">
                Google Email Address
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full p-3 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-white dark:bg-[#241E1C] text-xs focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full py-3.5 rounded-full bg-[#C1785A] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider shadow-warm flex items-center justify-center gap-2"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>{isSigningIn ? 'Signing In...' : 'Continue with this Google Account'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCustomForm(false)}
              className="w-full py-2 text-xs font-bold text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] text-center block"
            >
              ← Back to account list
            </button>
          </form>
        )}

        {/* Security Note */}
        <div className="pt-2 border-t border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-center gap-2 text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Google OAuth 2.0 Secure Authentication</span>
        </div>
      </div>
    </div>
  );
};
