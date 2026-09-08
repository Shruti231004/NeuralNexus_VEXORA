import React from 'react';
import { AppointmentStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/queueEngine';

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  theme?: 'dark' | 'light';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  theme = 'light',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.waiting;

  const sizeClasses = {
    sm: 'text-xs px-3 py-1 tracking-[0.12em] font-semibold',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 tracking-[0.15em] font-bold',
    lg: 'text-sm sm:text-base px-4 py-2 tracking-[0.18em] font-bold',
  };

  const bgStyle = theme === 'dark' ? config.badgeBg : config.lightBadgeBg;

  return (
    <span
      className={`inline-flex items-center gap-2 uppercase rounded-full border shadow-sm ${bgStyle} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            status === 'in_chair'
              ? 'bg-[#C1785A] animate-pulse'
              : status === 'color_processing'
              ? 'bg-[#C98A2C] animate-pulse'
              : status === 'waiting'
              ? 'bg-[#8F8178]'
              : status === 'delayed'
              ? 'bg-[#8C462C]'
              : 'bg-[#78716A]'
          }`}
        />
      )}
      {config.label}
    </span>
  );
};
