'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Check,
  Power,
  RefreshCw,
  Sun,
  Sunset,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { INITIAL_STYLISTS } from '@/lib/mockData';
import { Stylist } from '@/lib/types';
import {
  ALL_TIME_SLOTS,
  getStylistSchedule,
  toggleStylistSlotAvailability,
  setStylistDutyStatus,
  getTodayDateString,
  StylistScheduleRecord,
} from '@/lib/stylistAvailability';
import { playChime } from '@/lib/soundEffects';

interface StylistScheduleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStylistId?: string;
}

export const StylistScheduleManagerModal: React.FC<StylistScheduleManagerModalProps> = ({
  isOpen,
  onClose,
  defaultStylistId,
}) => {
  const [selectedStylistId, setSelectedStylistId] = useState<string>(
    defaultStylistId || INITIAL_STYLISTS[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [currentSchedule, setCurrentSchedule] = useState<StylistScheduleRecord | null>(null);

  // Load schedule whenever stylist or date changes
  const loadSchedule = () => {
    const sched = getStylistSchedule(selectedStylistId, selectedDate);
    setCurrentSchedule(sched);
  };

  useEffect(() => {
    if (isOpen) {
      loadSchedule();
    }
  }, [isOpen, selectedStylistId, selectedDate]);

  if (!isOpen) return null;

  const currentStylist =
    INITIAL_STYLISTS.find((s) => s.id === selectedStylistId) || INITIAL_STYLISTS[0];

  const handleToggleSlot = (timeSlot: string) => {
    const updated = toggleStylistSlotAvailability(selectedStylistId, selectedDate, timeSlot);
    setCurrentSchedule(updated);
    playChime('tap');
  };

  const handleToggleOffDuty = () => {
    if (!currentSchedule) return;
    const newStatus = !currentSchedule.isOffDuty;
    const updated = setStylistDutyStatus(selectedStylistId, selectedDate, newStatus);
    setCurrentSchedule(updated);
    playChime('bell');
  };

  // Generate next 5 dates for quick date switching
  const dateOptions = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, formattedDate };
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0E0C0B]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF6F0] dark:bg-[#181413] rounded-[36px] border-2 border-[#C1785A]/40 shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden text-[#2C2725] dark:text-[#FAF6F0]">
        
        {/* HEADER */}
        <div className="bg-[#F3ECE3] dark:bg-[#201A18] px-6 py-4 border-b border-[#EAE3DA] dark:border-[#382E28] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C1785A] to-[#8C462C] text-white flex items-center justify-center shadow-warm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#2C2725] dark:text-[#FAF6F0]">
                  Artisan Shift &amp; Availability Manager
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-[10px] font-mono font-bold uppercase tracking-wider">
                  Live Client Sync
                </span>
              </div>
              <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                Configure real-time booking availability. Clients booking a time slot will only see available artisans.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6E6663] dark:text-[#B5ABA2] hover:bg-[#EAE3DA] dark:hover:bg-[#2C2420] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. SELECT ARTISAN STYLIST */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#F2A585] flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" />
              <span>Select Artisan Stylist:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INITIAL_STYLISTS.map((stylist) => {
                const isSelected = selectedStylistId === stylist.id;
                const sched = getStylistSchedule(stylist.id, selectedDate);

                return (
                  <button
                    key={stylist.id}
                    onClick={() => {
                      setSelectedStylistId(stylist.id);
                      playChime('tap');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#F5E6DF] dark:bg-[#38251E] border-[#C1785A] shadow-warm ring-1 ring-[#C1785A]'
                        : 'bg-white dark:bg-[#201A18] border-[#EAE3DA] dark:border-[#332A26] hover:border-[#C1785A]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={stylist.avatar_url}
                        alt={stylist.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#C1785A]/40"
                      />
                      <div>
                        <strong className="text-xs font-bold text-[#2C2725] dark:text-[#FAF6F0] block leading-tight">
                          {stylist.name}
                        </strong>
                        <span className="text-[10px] text-[#6E6663] dark:text-[#B5ABA2]">
                          Chair #{stylist.chair_number}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#8C462C] dark:text-[#F2A585] font-bold">
                        {sched.isOffDuty ? 'Off Duty' : `${sched.availableSlots.length} Slots`}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C1785A]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SELECT DATE */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#F2A585] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Date:</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {dateOptions.map((opt) => {
                const isSelected = selectedDate === opt.dateStr;
                return (
                  <button
                    key={opt.dateStr}
                    onClick={() => {
                      setSelectedDate(opt.dateStr);
                      playChime('tap');
                    }}
                    className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#C1785A] text-white shadow-warm border-[#C1785A]'
                        : 'bg-white dark:bg-[#201A18] text-[#6E6663] dark:text-[#B5ABA2] border-[#EAE3DA] dark:border-[#332A26] hover:bg-[#F3ECE3]'
                    }`}
                  >
                    <span>{opt.dayName}</span>
                    <span className="text-[10px] opacity-80">({opt.formattedDate})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. ARTISAN DUTY STATUS BAR */}
          <div className="bg-white dark:bg-[#201A18] p-4 rounded-3xl border border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={currentStylist.avatar_url}
                alt={currentStylist.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#C1785A]/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#2C2725] dark:text-[#FAF6F0]">
                    {currentStylist.name} &bull; {currentStylist.title}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    currentSchedule?.isOffDuty
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}>
                    {currentSchedule?.isOffDuty ? '● Off Duty' : '● On Duty (Accepting Slots)'}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">
                  {currentSchedule?.isOffDuty
                    ? 'Stylist will not appear in the client booking list for this date.'
                    : `Active in ${currentSchedule?.availableSlots.length || 0} booking time slots.`}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleOffDuty}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                currentSchedule?.isOffDuty
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{currentSchedule?.isOffDuty ? 'Mark On Duty' : 'Mark Off Duty'}</span>
            </button>
          </div>

          {/* 4. HOURLY TIME SLOT TOGGLE GRID */}
          {!currentSchedule?.isOffDuty ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#F2A585] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Click slots to toggle Availability vs Breaks:</span>
                </label>
                <div className="flex items-center gap-3 text-[10px] text-[#6E6663] dark:text-[#B5ABA2]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A]" /> Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAE3DA] dark:bg-[#332A26]" /> Break / Off
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {ALL_TIME_SLOTS.map((slotObj) => {
                  const isAvailable = currentSchedule?.availableSlots.includes(slotObj.time);

                  return (
                    <button
                      key={slotObj.time}
                      onClick={() => handleToggleSlot(slotObj.time)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 text-center ${
                        isAvailable
                          ? 'bg-[#F5E6DF] dark:bg-[#38251E] border-[#C1785A] text-[#8C462C] dark:text-[#FAF6F0] shadow-sm'
                          : 'bg-white dark:bg-[#201A18] border-[#EAE3DA] dark:border-[#332A26] text-[#A89C94] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <span className="font-mono">{slotObj.time}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isAvailable
                          ? 'bg-[#C1785A] text-white'
                          : 'bg-[#EAE3DA] dark:bg-[#2C2420] text-[#6E6663]'
                      }`}>
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#F5E6DF]/50 dark:bg-[#291F1B] border border-[#E8D0C5] dark:border-[#3D2E27] text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-[#C1785A] mx-auto" />
              <strong className="text-sm font-bold text-[#2C2725] dark:text-[#FAF6F0] block">
                {currentStylist.name} is Off Duty on {selectedDate}
              </strong>
              <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2] max-w-md mx-auto">
                Clients booking appointments on this date will see other available master artisans automatically.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-[#F3ECE3] dark:bg-[#201A18] px-6 py-4 border-t border-[#EAE3DA] dark:border-[#382E28] flex items-center justify-between">
          <span className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
            Changes synchronize in real-time with customer booking pages.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-white text-xs font-bold uppercase tracking-wider shadow-warm transition-all"
          >
            Done &bull; Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
