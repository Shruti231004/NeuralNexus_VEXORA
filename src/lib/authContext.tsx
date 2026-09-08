'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from './types';
import { INITIAL_STAFF_USERS, INITIAL_CUSTOMER_USERS } from './mockUsers';
import { playChime } from './soundEffects';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isStaff: boolean;
  isCustomer: boolean;
  isManager: boolean;
  loginStaff: (email: string, pinCode?: string) => Promise<boolean>;
  loginCustomer: (phoneOrEmail: string, name?: string) => Promise<boolean>;
  signInWithGoogle: (role?: 'customer' | 'staff', email?: string, name?: string, avatar?: string) => Promise<boolean>;
  registerCustomer: (name: string, phone: string, email?: string) => Promise<UserProfile>;
  logout: () => void;
  switchDemoUser: (type: 'staff' | 'customer' | 'manager') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'styliq_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to staff manager for instant access during evaluation, or load from storage
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
    setMounted(true);

    // Cross-tab broadcast sync
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('styliq_auth_sync');
        channel.onmessage = (event) => {
          if (event.data?.user !== undefined) {
            setUser(event.data.user);
          }
        };
      }
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY) {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, []);

  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      const channel = new BroadcastChannel('styliq_auth_sync');
      channel.postMessage({ user: newUser });
      channel.close();
    } catch (e) {}
  };

  const loginStaff = async (email: string, pinCode: string = '1234'): Promise<boolean> => {
    const found = INITIAL_STAFF_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() ||
        (u.staff_profile?.pin_code === pinCode && u.full_name.toLowerCase().includes(email.toLowerCase()))
    );

    if (found) {
      saveUserSession(found);
      playChime('bell');
      return true;
    }

    // Dynamic staff creation if demo email entered
    const newStaff: UserProfile = {
      id: `staff-${Date.now()}`,
      email,
      role: 'staff',
      full_name: email.split('@')[0].toUpperCase(),
      phone: '+91 98200 00000',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      created_at: new Date().toISOString(),
      staff_profile: {
        id: `sp-${Date.now()}`,
        profile_id: `staff-${Date.now()}`,
        salon_id: 'a0000000-0000-0000-0000-000000000001',
        role_title: 'Senior Artisan Stylist',
        pin_code: pinCode || '1234',
        access_level: 'stylist',
        shift_status: 'on_duty',
      },
    };

    saveUserSession(newStaff);
    playChime('bell');
    return true;
  };

  const loginCustomer = async (phoneOrEmail: string, name?: string): Promise<boolean> => {
    const found = INITIAL_CUSTOMER_USERS.find(
      (u) =>
        u.email.toLowerCase() === phoneOrEmail.toLowerCase() ||
        u.phone?.replace(/\s+/g, '') === phoneOrEmail.replace(/\s+/g, '')
    );

    if (found) {
      saveUserSession(found);
      playChime('bell');
      return true;
    }

    // Auto-create customer profile
    const newCustomer: UserProfile = {
      id: `cust-${Date.now()}`,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail.replace(/\D/g, '')}@styliqguest.com`,
      role: 'customer',
      full_name: name || 'VIP Salon Guest',
      phone: phoneOrEmail.includes('@') ? '+91 98200 00000' : phoneOrEmail,
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      created_at: new Date().toISOString(),
      customer_profile: {
        id: `cp-${Date.now()}`,
        profile_id: `cust-${Date.now()}`,
        phone: phoneOrEmail,
        vip_tier: 'Gold VIP',
        loyalty_points: 300,
        hair_type: 'Bespoke Parisian Layering',
        total_bookings_count: 1,
      },
    };

    saveUserSession(newCustomer);
    playChime('bell');
    return true;
  };

  const signInWithGoogle = async (
    targetRole: 'customer' | 'staff' = 'customer',
    email?: string,
    name?: string,
    avatar?: string
  ): Promise<boolean> => {
    const userEmail = email || (targetRole === 'staff' ? 'antoine@styliqparis.com' : 'vip.natasha@gmail.com');
    const userName = name || (targetRole === 'staff' ? 'Antoine Dubois' : 'Natasha Kapoor');
    const userAvatar =
      avatar ||
      (targetRole === 'staff'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400');

    // Check if matched in presets
    const list = targetRole === 'staff' ? INITIAL_STAFF_USERS : INITIAL_CUSTOMER_USERS;
    const existing = list.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());

    if (existing) {
      const updated = {
        ...existing,
        auth_provider: 'google' as const,
        avatar_url: existing.avatar_url || userAvatar,
      };
      saveUserSession(updated);
      playChime('bell');
      return true;
    }

    // Otherwise create Google Profile
    const googleProfile: UserProfile = {
      id: `google-${Date.now()}`,
      email: userEmail,
      role: targetRole,
      full_name: userName,
      phone: '+91 98200 99999',
      avatar_url: userAvatar,
      auth_provider: 'google',
      created_at: new Date().toISOString(),
      ...(targetRole === 'staff'
        ? {
            staff_profile: {
              id: `sp-g-${Date.now()}`,
              profile_id: `google-${Date.now()}`,
              salon_id: 'a0000000-0000-0000-0000-000000000001',
              role_title: 'Senior Artisan Stylist (Google Auth)',
              pin_code: '1234',
              access_level: 'stylist',
              shift_status: 'on_duty',
            },
          }
        : {
            customer_profile: {
              id: `cp-g-${Date.now()}`,
              profile_id: `google-${Date.now()}`,
              phone: '+91 98200 99999',
              vip_tier: 'Platinum VIP',
              loyalty_points: 500,
              hair_type: 'Custom Consulted (Google Account)',
              total_bookings_count: 1,
            },
          }),
    };

    saveUserSession(googleProfile);
    playChime('bell');
    return true;
  };

  const registerCustomer = async (name: string, phone: string, email?: string): Promise<UserProfile> => {
    const newCust: UserProfile = {
      id: `cust-${Date.now()}`,
      email: email || `${phone.replace(/\D/g, '')}@styliqvip.com`,
      role: 'customer',
      full_name: name,
      phone,
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      created_at: new Date().toISOString(),
      customer_profile: {
        id: `cp-${Date.now()}`,
        profile_id: `cust-${Date.now()}`,
        phone,
        vip_tier: 'Platinum VIP',
        loyalty_points: 500,
        hair_type: 'Custom Consulted',
        total_bookings_count: 1,
      },
    };

    saveUserSession(newCust);
    playChime('bell');
    return newCust;
  };

  const logout = () => {
    saveUserSession(null);
    playChime('tap');
  };

  const switchDemoUser = (type: 'staff' | 'customer' | 'manager') => {
    if (type === 'staff') {
      saveUserSession(INITIAL_STAFF_USERS[0]);
    } else if (type === 'manager') {
      saveUserSession(INITIAL_STAFF_USERS[2]);
    } else {
      saveUserSession(INITIAL_CUSTOMER_USERS[0]);
    }
    playChime('tap');
  };

  const isStaff = user?.role === 'staff' || user?.role === 'manager' || user?.role === 'admin';
  const isCustomer = user?.role === 'customer';
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isStaff,
        isCustomer,
        isManager,
        loginStaff,
        loginCustomer,
        signInWithGoogle,
        registerCustomer,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
