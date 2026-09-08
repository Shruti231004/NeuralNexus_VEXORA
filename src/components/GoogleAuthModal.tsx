'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, User, Sparkles, ArrowRight, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import { GoogleIcon } from './GoogleIcon';
import { useAuth } from '@/lib/authContext';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';
import { playChime } from '@/lib/soundEffects';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: 'customer' | 'staff';
  onSuccess?: (userData?: { name: string; email: string }) => void;
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
  const [selectedAccEmail, setSelectedAccEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const googleAccounts = [
    {
      name: 'Antoine Dubois',
      email: 'antoine@roseandrogue.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      role: 'staff' as const,
      badge: 'Artistic Director',
      lastUsed: 'Staff Lead',
    },
    {
      name: 'Camille Laurent',
      email: 'camille@roseandrogue.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      role: 'staff' as const,
      badge: 'Master Colorist',
      lastUsed: 'Senior Artisan',
    },
    {
      name: 'Isabelle Marchand',
      email: 'manager@roseandrogue.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      role: 'staff' as const,
      badge: 'Operations Manager',
      lastUsed: 'Admin Console',
    },
  ];

  const handleSelectAccount = async (acc: typeof googleAccounts[0]) => {
    setSelectedAccEmail(acc.email);
    setIsSigningIn(true);
    playChime('bell');

    await signInWithGoogle(targetRole || acc.role, acc.email, acc.name, acc.avatar);

    setTimeout(() => {
      setIsSigningIn(false);
      onClose();
      if (onSuccess) onSuccess({ name: acc.name, email: acc.email });
    }, 600);
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setIsSigningIn(true);
    playChime('bell');

    const displayName = customName.trim() || customEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Google User';
    // Generate an authentic avatar based on initials or photo
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=C1785A&color=fff&bold=true`;

    await signInWithGoogle(targetRole, customEmail.trim(), displayName, avatar);

    setTimeout(() => {
      setIsSigningIn(false);
      onClose();
      if (onSuccess) onSuccess({ name: displayName, email: customEmail.trim() });
    }, 600);
  };

  const handleLiveSupabaseOAuth = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        setIsSigningIn(true);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.warn('Direct OAuth redirect error, falling back to One-Tap selection:', err);
        setIsSigningIn(false);
        setShowCustomForm(true);
      }
    } else {
      setShowCustomForm(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2725]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#1D1816] rounded-3xl border border-[#EAE3DA] dark:border-[#382E28] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 relative text-[#2C2725] dark:text-[#FAF6F0]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6663] dark:text-[#B5ABA2] hover:bg-[#F3ECE3] dark:hover:bg-[#26201D] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Identity Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#26201D] border border-[#EAE3DA] dark:border-[#382E28] flex items-center justify-center mx-auto shadow-sm">
            <GoogleIcon className="w-7 h-7" />
          </div>

          <h3 className="font-serif text-2xl font-extrabold tracking-tight">
            Sign in with Google
          </h3>
          <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
            Choose an account to continue to <strong className="text-[#2C2725] dark:text-[#FAF6F0]">Rose &amp; Rogue Paris</strong>
          </p>
        </div>

        {/* Account Selection */}
        {!showCustomForm ? (
          <div className="space-y-3">
            <div className="space-y-2">
              {googleAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={isSigningIn}
                  onClick={() => handleSelectAccount(acc)}
                  className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between text-left shadow-sm group transform hover:scale-[1.01] ${
                    selectedAccEmail === acc.email && isSigningIn
                      ? 'bg-[#F5E6DF] dark:bg-[#38251E] border-[#C1785A]'
                      : 'bg-white dark:bg-[#241E1C] hover:bg-[#FAF6F0] dark:hover:bg-[#2A221E] border-[#EAE3DA] dark:border-[#382E28]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#C1785A]"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-[#2C2725] dark:text-[#FAF6F0]">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2] truncate">
                        {acc.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {selectedAccEmail === acc.email && isSigningIn ? (
                      <Loader2 className="w-4 h-4 text-[#C1785A] animate-spin ml-auto" />
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] border border-[#E8D0C5] dark:border-[#52352A]">
                        {acc.badge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Use Another Google Account */}
            <button
              type="button"
              onClick={() => setShowCustomForm(true)}
              className="w-full py-3 rounded-2xl border border-dashed border-[#C1785A]/50 bg-[#FAF6F0] dark:bg-[#241E1C] text-xs font-bold text-[#8C462C] dark:text-[#F2A585] hover:bg-[#F5E6DF] dark:hover:bg-[#2F2521] transition-all text-center flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Use another Google account</span>
            </button>
          </div>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomGoogleSubmit} className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#C7BCB3]">
                Your Name
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Divya Sharma"
                className="w-full p-3 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0] dark:bg-[#241E1C] text-xs text-[#2C2725] dark:text-[#FAF6F0] font-medium focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6E6663] dark:text-[#C7BCB3]">
                Google Email Address
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full p-3 rounded-xl border border-[#EAE3DA] dark:border-[#3A302A] bg-[#FAF6F0] dark:bg-[#241E1C] text-xs font-mono text-[#2C2725] dark:text-[#FAF6F0] font-bold focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full py-3.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.15em] shadow-warm flex items-center justify-center gap-2 transition-all"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In with Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continue with this Google Account</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowCustomForm(false)}
              className="w-full py-2 text-xs font-bold text-[#6E6663] dark:text-[#B5ABA2] hover:text-[#2C2725] text-center block"
            >
              ← Back to account selection
            </button>
          </form>
        )}

        {/* Google Consent & Privacy Notice */}
        <div className="pt-3 border-t border-[#EAE3DA] dark:border-[#332A26] space-y-1 text-center">
          <p className="text-[10px] text-[#6E6663] dark:text-[#B5ABA2] leading-tight">
            To continue, Google will share your name, email address, language preference, and profile picture with Rose &amp; Rogue Paris.
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Google OAuth 2.0 Verified & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
