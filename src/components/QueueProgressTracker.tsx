'use client';

import React from 'react';
import { CheckCircle2, Clock, Scissors, Sparkles, User, Sparkle } from 'lucide-react';
import { Appointment } from '@/lib/types';
import { STATUS_CONFIG, calculateDynamicWaitMinutes, getQueuePosition } from '@/lib/queueEngine';

interface QueueProgressTrackerProps {
  appointment: Appointment;
  allAppointments: Appointment[];
}

export const QueueProgressTracker: React.FC<QueueProgressTrackerProps> = ({
  appointment,
  allAppointments,
}) => {
  const position = getQueuePosition(appointment.id, allAppointments);
  const waitMinutes = calculateDynamicWaitMinutes(appointment, allAppointments);

  const steps = [
    {
      id: 'confirmed',
      title: 'Slot Confirmed',
      subtitle: '₹99 Deposit Verified',
      icon: CheckCircle2,
      isDone: true,
      isActive: false,
    },
    {
      id: 'waiting',
      title: 'Lounge Queue',
      subtitle: appointment.status === 'waiting' ? `#${position} in line` : 'Turn Reached',
      icon: Clock,
      isDone: appointment.status !== 'waiting',
      isActive: appointment.status === 'waiting',
    },
    {
      id: 'in_chair',
      title: 'In Chair & Styling',
      subtitle: appointment.status === 'color_processing' ? 'Color Processing' : 'Active Service',
      icon: Scissors,
      isDone: appointment.status === 'completed',
      isActive: appointment.status === 'in_chair' || appointment.status === 'color_processing',
    },
    {
      id: 'completed',
      title: 'Glow Finished',
      subtitle: 'Ready to Conquer',
      icon: Sparkles,
      isDone: appointment.status === 'completed',
      isActive: appointment.status === 'completed',
    },
  ];

  let progressPercent = 25;
  if (appointment.status === 'waiting') {
    progressPercent = position === 1 ? 45 : 35;
  } else if (appointment.status === 'in_chair') {
    progressPercent = 75;
  } else if (appointment.status === 'color_processing') {
    progressPercent = 85;
  } else if (appointment.status === 'completed') {
    progressPercent = 100;
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar Header */}
      <div className="relative">
        <div className="h-3 w-full bg-[#EAE3DA] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C1785A] via-[#A86347] to-[#8C462C] transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Pizza Tracker Milestones - Enlarged Fonts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-5 rounded-3xl border transition-all duration-300 ${
                step.isActive
                  ? 'bg-[#FAF6F0] border-[#C1785A] shadow-md ring-2 ring-[#C1785A]/20 scale-[1.02]'
                  : step.isDone
                  ? 'bg-[#F3ECE3] border-[#EAE3DA] text-[#6E6663]'
                  : 'bg-white/40 border-[#EAE3DA]/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    step.isActive
                      ? 'bg-[#C1785A] text-white'
                      : step.isDone
                      ? 'bg-[#F5E6DF] text-[#8C462C]'
                      : 'bg-[#EAE3DA] text-[#6E6663]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-[#2C2725] leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#6E6663] mt-1 font-semibold">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
