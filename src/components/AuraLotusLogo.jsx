import React from 'react';

export default function AuraLotusLogo({ size = "w-6 h-6", colorClass = "text-[#C5A059] dark:text-[#E2C792]", className = "" }) {
  return (
    <svg
      className={`${size} ${colorClass} transition-colors duration-300 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center Petal */}
      <path d="M12 3c-2.5 3.5-3.5 7.5-3.5 11 0 3 1.5 5 3.5 7 2-2 3.5-4 3.5-7 0-3.5-1-7.5-3.5-11z" fill="currentColor" fillOpacity="0.22" />
      
      {/* Left Petal */}
      <path d="M12 21C8 19.5 4.5 16 4.5 12c0-2.5 1.5-5 3.5-7 .5 3.5 2 6 4 8" />
      
      {/* Right Petal */}
      <path d="M12 21c4-1.5 7.5-5 7.5-9 0-2.5-1.5-5-3.5-7-.5 3.5-2 6-4 8" />
      
      {/* Base Accent */}
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}
