import React, { useState, useEffect } from 'react';

export default function ThemeFontToggle() {
  const [fontTheme, setFontTheme] = useState('editorial'); // 'editorial' | 'modern' | 'geometric'
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-font', fontTheme);
  }, [fontTheme]);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-full bg-[#f8f1ff] border border-[#e8ddff] text-[#594047] hover:text-[#1e1831] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        title="Toggle Font & Design Theme"
      >
        <span className="material-symbols-outlined text-base text-[#b50060]">style</span>
        <span className="capitalize hidden sm:inline">{fontTheme} Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e8ddff] rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-fade-in-scale">
          <div className="text-[10px] font-extrabold text-[#b50060] uppercase px-3 py-1 tracking-wider">
            Design & Font System
          </div>
          
          <button
            onClick={() => { setFontTheme('editorial'); setIsOpen(false); }}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
              fontTheme === 'editorial' ? 'bg-[#f8f1ff] text-[#b50060] font-bold' : 'text-[#594047] hover:bg-[#ede4ff]'
            }`}
          >
            <span>📖 Editorial Serif</span>
            {fontTheme === 'editorial' && <span>✓</span>}
          </button>

          <button
            onClick={() => { setFontTheme('modern'); setIsOpen(false); }}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
              fontTheme === 'modern' ? 'bg-[#f8f1ff] text-[#b50060] font-bold' : 'text-[#594047] hover:bg-[#ede4ff]'
            }`}
          >
            <span>✨ Modern Syne</span>
            {fontTheme === 'modern' && <span>✓</span>}
          </button>

          <button
            onClick={() => { setFontTheme('geometric'); setIsOpen(false); }}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
              fontTheme === 'geometric' ? 'bg-[#f8f1ff] text-[#b50060] font-bold' : 'text-[#594047] hover:bg-[#ede4ff]'
            }`}
          >
            <span>📐 Space Geometric</span>
            {fontTheme === 'geometric' && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
