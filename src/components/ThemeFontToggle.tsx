'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Type, Check, ChevronDown } from 'lucide-react';
import { useTheme, FontMode } from './ThemeProvider';
import { playChime } from '@/lib/soundEffects';

interface ThemeFontToggleProps {
  showLabel?: boolean;
}

export const ThemeFontToggle: React.FC<ThemeFontToggleProps> = ({ showLabel = false }) => {
  const { theme, font, toggleTheme, setFont } = useTheme();
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fontOptions: { id: FontMode; label: string; sub: string }[] = [
    {
      id: 'editorial',
      label: 'Parisian Editorial',
      sub: 'Playfair & Garamond Serif',
    },
    {
      id: 'modern',
      label: 'Contemporary Sans',
      sub: 'Syne & Jakarta Sans',
    },
    {
      id: 'geometric',
      label: 'Haute Geometric',
      sub: 'Space Grotesk & Outfit',
    },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFontMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleTheme = () => {
    playChime('tap');
    toggleTheme();
  };

  const handleSelectFont = (f: FontMode) => {
    playChime('tap');
    setFont(f);
    setIsFontMenuOpen(false);
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0" ref={dropdownRef}>
      {/* THEME TOGGLE (SUN / MOON) */}
      <button
        onClick={handleToggleTheme}
        className="w-9 h-9 rounded-full bg-[#F3ECE3] hover:bg-[#EAE3DA] dark:bg-[#26201D] dark:hover:bg-[#332A26] border border-[#EAE3DA] dark:border-[#3D332D] text-[#2C2725] dark:text-[#FAF6F0] flex items-center justify-center transition-all shadow-sm transform hover:scale-105"
        title={theme === 'dark' ? 'Switch to Light Parisian Theme' : 'Switch to Noir Dark Theme'}
        aria-label="Toggle Dark Mode"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#F5C578] transition-transform duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-[#C1785A] transition-transform duration-300" />
        )}
      </button>

      {/* FONT SELECTOR */}
      <div className="relative">
        <button
          onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
          className={`h-9 rounded-full bg-[#F3ECE3] hover:bg-[#EAE3DA] dark:bg-[#26201D] dark:hover:bg-[#332A26] border border-[#EAE3DA] dark:border-[#3D332D] text-xs font-bold text-[#2C2725] dark:text-[#FAF6F0] transition-all flex items-center gap-1.5 shadow-sm ${
            showLabel ? 'px-3' : 'w-9 justify-center'
          }`}
          title="Change Typography Aesthetic"
          aria-label="Change Typography"
        >
          <span className="font-serif font-bold text-xs text-[#C1785A] dark:text-[#E29B7E]">Aa</span>
          {showLabel && (
            <span className="text-[10px] uppercase tracking-wider font-mono">
              {font === 'editorial' ? 'Serif' : font === 'modern' ? 'Sans' : 'Geom'}
            </span>
          )}
        </button>

        {/* FONT MENU POPUP */}
        {isFontMenuOpen && (
          <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#FAF6F0] dark:bg-[#1D1816] border border-[#EAE3DA] dark:border-[#3D332D] shadow-2xl p-2 z-50 animate-fadeIn">
            <div className="px-3 py-1.5 border-b border-[#EAE3DA] dark:border-[#332A26]">
              <span className="text-[10px] uppercase font-mono font-bold text-[#8C462C] dark:text-[#F2A585] tracking-[0.2em] block">
                Typography Style
              </span>
            </div>

            <div className="p-1 space-y-1 mt-1">
              {fontOptions.map((opt) => {
                const isSelected = font === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectFont(opt.id)}
                    className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-[#C1785A] text-[#FAF6F0] font-bold shadow-sm'
                        : 'hover:bg-[#F3ECE3] dark:hover:bg-[#26201D] text-[#2C2725] dark:text-[#FAF6F0]'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{opt.label}</p>
                      <p
                        className={`text-[10px] ${
                          isSelected ? 'text-[#F5E6DF]' : 'text-[#6E6663] dark:text-[#A89F91]'
                        }`}
                      >
                        {opt.sub}
                      </p>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
