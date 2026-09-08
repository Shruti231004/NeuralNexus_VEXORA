'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Tv,
  LayoutDashboard,
  QrCode,
  TrendingUp,
  Menu,
  X,
  User,
  Crown,
  Scissors,
  LogOut,
  ChevronDown,
  Receipt,
  Ticket,
  Lock,
} from 'lucide-react';
import { subscribeToAppointments } from '@/lib/supabaseClient';
import { Appointment } from '@/lib/types';
import { ThemeFontToggle } from './ThemeFontToggle';
import { useAuth } from '@/lib/authContext';
import { GoogleIcon } from './GoogleIcon';
import { GoogleAuthModal } from './GoogleAuthModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isStaff, isCustomer, logout, switchDemoUser } = useAuth();

  const [waitingCount, setWaitingCount] = useState<number>(0);
  const [inChairCount, setInChairCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [googleTargetRole, setGoogleTargetRole] = useState<'customer' | 'staff'>('customer');
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns on route change or click outside
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/tv') {
    return null;
  }

  const navLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname.startsWith('/dashboard'),
    },
    {
      href: '/analytics',
      label: 'Predictions',
      icon: TrendingUp,
      active: pathname.startsWith('/analytics'),
    },
    {
      href: '/tv',
      label: 'TV Board',
      icon: Tv,
      active: pathname === '/tv',
      external: true,
    },
    {
      href: '/scan',
      label: 'Scan QR',
      icon: QrCode,
      active: pathname === '/scan',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 py-2.5 bg-[#FAF6F0]/85 dark:bg-[#141110]/85 backdrop-blur-md transition-all duration-300 border-b border-[#EAE3DA]/60 dark:border-[#382E28]/60 shadow-sm">
      {/* FLOATING LUXURY GLASSMORPHIC ISLAND */}
      <div className="max-w-7xl mx-auto rounded-full bg-[#FAF6F0] dark:bg-[#1C1715] border border-[#E0D7CC] dark:border-[#382E28] px-4 sm:px-6 py-2 shadow-md dark:shadow-2xl transition-all flex items-center justify-between gap-3">
        {/* 1. BRAND & LIVE ATMOSPHERE */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C1785A] to-[#8C462C] text-[#FAF6F0] flex items-center justify-center font-serif text-xl font-extrabold shadow-warm transition-transform duration-300 group-hover:scale-105">
              S
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-extrabold tracking-tight block leading-none text-[#2C2725] dark:text-[#FAF6F0]">
                STYLIQ
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C462C] dark:text-[#D48464] block font-bold mt-0.5">
                Paris • Haute Salon
              </span>
            </div>
          </Link>

          {/* Compact Live Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3ECE3] dark:bg-[#241E1C] border border-[#EAE3DA] dark:border-[#3A302A] text-[11px] font-bold text-[#2C2725] dark:text-[#FAF6F0] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#C1785A] animate-pulse" />
            <span className="text-[#8C462C] dark:text-[#F2A585]">{inChairCount} In Chair</span>
            <span className="text-[#DDD3C6] dark:text-[#4D413A]">·</span>
            <span className="text-[#6E6663] dark:text-[#B5ABA2]">{waitingCount} Waiting</span>
          </div>
        </div>

        {/* 2. CENTER EDITORIAL NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    setGoogleTargetRole(link.href.includes('dashboard') || link.href.includes('tv') ? 'staff' : 'customer');
                    setIsGoogleModalOpen(true);
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                  link.active
                    ? 'bg-[#C1785A] text-[#FAF6F0] shadow-warm'
                    : 'text-[#2C2725] dark:text-[#FAF6F0] hover:bg-[#F3ECE3] dark:hover:bg-[#241E1C]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    link.active ? 'text-white' : 'text-[#C1785A] dark:text-[#D48464]'
                  }`}
                />
                <span>{link.label}</span>
                {!user && (
                  <Lock className="w-2.5 h-2.5 text-[#A89F91] ml-0.5 opacity-75" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. RIGHT CONTROLS: PRIMARY CTA + AUTH MENU + THEME/FONT + MOBILE MENU */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Primary Action Button */}
          <Link
            href="/book"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                setGoogleTargetRole('customer');
                setIsGoogleModalOpen(true);
              }
            }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.15em] shadow-warm hover:shadow-warm-lg transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book Session</span>
            <span className="sm:hidden">Book</span>
            {!user && <Lock className="w-3 h-3 text-[#FAF6F0]/80" />}
          </Link>

          {/* User Auth Dropdown */}
          <div className="relative" ref={userMenuRef}>
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full bg-[#F3ECE3] dark:bg-[#241E1C] border border-[#EAE3DA] dark:border-[#382E28] hover:border-[#C1785A] transition-all"
                title={`${user.full_name} (${user.role})`}
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                  alt={user.full_name}
                  className="w-7 h-7 rounded-full object-cover border border-[#C1785A]"
                />
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setGoogleTargetRole('customer');
                    setIsGoogleModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#241E1C] hover:bg-[#F5E6DF] dark:hover:bg-[#2F2521] border-2 border-[#C1785A] text-xs font-extrabold text-[#8C462C] dark:text-[#F2A585] shadow-sm transition-all flex items-center gap-2 group"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In with Google</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              </div>
            )}

            {/* User Dropdown Menu */}
            {user && userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-[#FAF6F0] dark:bg-[#1D1816] border border-[#EAE3DA] dark:border-[#382E28] shadow-2xl p-2 z-50 animate-fadeIn">
                <div className="p-3 border-b border-[#EAE3DA] dark:border-[#332A26] flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#C1785A]"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-[#2C2725] dark:text-[#FAF6F0] truncate">
                      {user.full_name}
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-[9px] font-extrabold uppercase tracking-wider inline-block">
                      {user.role === 'staff' || user.role === 'manager'
                        ? 'Staff Artisan'
                        : 'VIP Client'}
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-1 mt-1 text-xs">
                  {isStaff && (
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center gap-2 p-2.5 rounded-2xl hover:bg-[#F3ECE3] dark:hover:bg-[#241E1C] text-[#2C2725] dark:text-[#FAF6F0] font-bold"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#C1785A]" />
                      <span>Manager Kiosk</span>
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="w-full flex items-center gap-2 p-2.5 rounded-2xl hover:bg-[#F3ECE3] dark:hover:bg-[#241E1C] text-[#2C2725] dark:text-[#FAF6F0] font-bold"
                  >
                    <Crown className="w-4 h-4 text-[#C98A2C]" />
                    <span>VIP Client Portal</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => switchDemoUser(isStaff ? 'customer' : 'staff')}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#F3ECE3]/60 dark:bg-[#241E1C]/60 hover:bg-[#F3ECE3] dark:hover:bg-[#241E1C] text-[#2C2725] dark:text-[#FAF6F0] font-semibold text-[11px]"
                  >
                    <span>Switch to {isStaff ? 'VIP Client' : 'Staff'} Mode</span>
                    <span className="text-[10px] font-mono text-[#C1785A]">Demo ⇄</span>
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-2 p-2.5 rounded-2xl text-[#8C462C] dark:text-[#F2A585] hover:bg-[#F5E6DF] dark:hover:bg-[#38251E] font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme & Font Toggle Controls */}
          <div className="pl-1 sm:pl-2 border-l border-[#EAE3DA] dark:border-[#382E28] flex items-center">
            <ThemeFontToggle />
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-[#F3ECE3] dark:bg-[#241E1C] border border-[#EAE3DA] dark:border-[#3A302A] text-[#2C2725] dark:text-[#FAF6F0] transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE LUXURY SLIDE-DOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl bg-[#FAF6F0]/95 dark:bg-[#161210]/95 backdrop-blur-2xl border border-[#EAE3DA] dark:border-[#382E28] p-5 shadow-2xl space-y-4 animate-fadeIn">
          {/* User Status Bar */}
          {user ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F3ECE3] dark:bg-[#241E1C] border border-[#EAE3DA] dark:border-[#382E28]">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-9 h-9 rounded-full object-cover border border-[#C1785A]"
                />
                <div>
                  <p className="font-bold text-xs text-[#2C2725] dark:text-[#FAF6F0]">
                    {user.full_name}
                  </p>
                  <span className="text-[9px] uppercase font-bold text-[#8C462C] dark:text-[#F2A585]">
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => switchDemoUser(isStaff ? 'customer' : 'staff')}
                className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-[#FAF6F0] dark:bg-[#1D1816] text-[#C1785A]"
              >
                Switch Role
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="w-full py-2.5 rounded-2xl bg-[#F3ECE3] dark:bg-[#241E1C] text-center text-xs font-bold block"
            >
              Sign In to Staff / Client Portal
            </Link>
          )}

          {/* Queue Atmosphere Strip */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F3ECE3] dark:bg-[#241E1C] border border-[#EAE3DA] dark:border-[#3A302A] text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A] animate-pulse" />
              <span className="text-[#8C462C] dark:text-[#F2A585]">{inChairCount} In Chair</span>
            </div>
            <span className="text-[#6E6663] dark:text-[#B5ABA2]">
              {waitingCount} Guests in Lounge
            </span>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                    link.active
                      ? 'bg-[#C1785A] text-[#FAF6F0] shadow-warm'
                      : 'bg-[#F3ECE3]/60 dark:bg-[#241E1C]/60 text-[#2C2725] dark:text-[#FAF6F0] hover:bg-[#F3ECE3] dark:hover:bg-[#241E1C]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#C1785A] dark:text-[#D48464]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <Link
            href="/book"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                setGoogleTargetRole('customer');
                setIsGoogleModalOpen(true);
              }
            }}
            className="w-full py-3.5 rounded-2xl bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Appointment (₹99 Deposit)</span>
            {!user && <Lock className="w-3.5 h-3.5 ml-1" />}
          </Link>
        </div>
      )}

      {/* GLOBAL GOOGLE AUTH SECURITY MODAL */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        targetRole={googleTargetRole}
      />
    </header>
  );
};
