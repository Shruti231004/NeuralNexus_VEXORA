'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type FontMode = 'editorial' | 'modern' | 'geometric';

interface ThemeContextType {
  theme: ThemeMode;
  font: FontMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setFont: (font: FontMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'styliq_theme_preference';
const FONT_STORAGE_KEY = 'styliq_font_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [font, setFontState] = useState<FontMode>('editorial');
  const [mounted, setMounted] = useState(false);

  // Apply classes to document element
  const applyThemeAndFont = (t: ThemeMode, f: FontMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Apply Theme
    if (t === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // Apply Font
    root.classList.remove('font-editorial', 'font-modern', 'font-geometric');
    root.classList.add(`font-${f}`);
    root.setAttribute('data-font', f);
  };

  useEffect(() => {
    // Initial load from localStorage
    const savedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'light';
    const savedFont = (localStorage.getItem(FONT_STORAGE_KEY) as FontMode) || 'editorial';

    setThemeState(savedTheme);
    setFontState(savedFont);
    applyThemeAndFont(savedTheme, savedFont);
    setMounted(true);

    // Cross-tab broadcast channel listener
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('styliq_preferences_sync');
        channel.onmessage = (event) => {
          if (event.data?.theme) {
            setThemeState(event.data.theme);
            applyThemeAndFont(event.data.theme, font);
          }
          if (event.data?.font) {
            setFontState(event.data.font);
            applyThemeAndFont(theme, event.data.font);
          }
        };
      }
    } catch (e) {}

    // Storage event listener fallback
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue as ThemeMode;
        setThemeState(newTheme);
        applyThemeAndFont(newTheme, font);
      }
      if (e.key === FONT_STORAGE_KEY && e.newValue) {
        const newFont = e.newValue as FontMode;
        setFontState(newFont);
        applyThemeAndFont(theme, newFont);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyThemeAndFont(newTheme, font);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      const channel = new BroadcastChannel('styliq_preferences_sync');
      channel.postMessage({ theme: newTheme });
      channel.close();
    } catch (e) {}
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const setFont = (newFont: FontMode) => {
    setFontState(newFont);
    applyThemeAndFont(theme, newFont);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, newFont);
      const channel = new BroadcastChannel('styliq_preferences_sync');
      channel.postMessage({ font: newFont });
      channel.close();
    } catch (e) {}
  };

  return (
    <ThemeContext.Provider value={{ theme, font, toggleTheme, setTheme, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
