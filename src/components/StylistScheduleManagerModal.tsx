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
  Coffee,
  Sliders,
} from 'lucide-react';
import { INITIAL_STYLISTS } from '@/lib/mockData';
import { Stylist } from '@/lib/types';
import {
  getStylistSchedule,
  updateStylistShift,
  setStylistDutyStatus,
  getTodayDateString,
  StylistScheduleRecord,
  timeToMinutes,
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

  const handleUpdateShift = (updates: Partial<StylistScheduleRecord>) => {
    const updated = updateStylistShift(selectedStylistId, selectedDate, updates);
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

  const applyShiftPreset = (start: string, end: string, breakStart?: string, breakEnd?: string) => {
    handleUpdateShift({
      shiftStart: start,
      shiftEnd: end,
      hasBreak: Boolean(breakStart && breakEnd),
      breakStart: breakStart || '01:30 PM',
      breakEnd: breakEnd || '02:15 PM',
      isOffDuty: false,
    });
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

  // Dynamic timeline span calculation for visual representation
  const startM = currentSchedule ? timeToMinutes(currentSchedule.shiftStart) : 600;
  const endM = currentSchedule ? timeToMinutes(currentSchedule.shiftEnd) : 1200;
  const totalDayMinutes = 14 * 60; // 08:00 AM (480) to 10:00 PM (1320) = 840 mins
  const dayBaseM = 8 * 60;

  const leftPercent = Math.max(0, Math.min(100, ((startM - dayBaseM) / totalDayMinutes) * 100));
  const widthPercent = Math.max(5, Math.min(100 - leftPercent, ((endM - startM) / totalDayMinutes) * 100));

  let breakLeftPercent = 0;
  let breakWidthPercent = 0;
  if (currentSchedule?.hasBreak && currentSchedule.breakStart && currentSchedule.breakEnd) {
    const bStartM = timeToMinutes(currentSchedule.breakStart);
    const bEndM = timeToMinutes(currentSchedule.breakEnd);
    breakLeftPercent = Math.max(0, Math.min(100, ((bStartM - dayBaseM) / totalDayMinutes) * 100));
    breakWidthPercent = Math.max(2, Math.min(100 - breakLeftPercent, ((bEndM - bStartM) / totalDayMinutes) * 100));
  }

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
                  Dynamic Schedule
                </span>
              </div>
              <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                Configure flexible working hours and break windows. Clients will dynamically match based on their chosen time.
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
                        {sched.isOffDuty ? 'Off Duty' : `${sched.shiftStart} - ${sched.shiftEnd}`}
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
                    {currentSchedule?.isOffDuty ? '● Off Duty' : '● On Duty'}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2]">
                  {currentSchedule?.isOffDuty
                    ? 'Stylist will not appear in the client booking list for this date.'
                    : `Active duty from ${currentSchedule?.shiftStart} to ${currentSchedule?.shiftEnd}.`}
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

          {/* 4. DYNAMIC WORKING HOURS & BREAK CONFIGURATION */}
          {!currentSchedule?.isOffDuty ? (
            <div className="bg-white dark:bg-[#201A18] p-5 rounded-3xl border border-[#EAE3DA] dark:border-[#332A26] space-y-6 shadow-sm">
              
              {/* Shift Presets */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#F2A585] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Quick Shift Presets:</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyShiftPreset('10:00 AM', '08:00 PM', '01:30 PM', '02:30 PM')}
                    className="px-3.5 py-1.5 rounded-full bg-[#F3ECE3] dark:bg-[#2C2420] hover:bg-[#C1785A] hover:text-white text-xs font-bold transition-colors text-[#2C2725] dark:text-[#FAF6F0]"
                  >
                    Full Day (10:00 AM - 08:00 PM)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyShiftPreset('10:00 AM', '04:30 PM', '01:00 PM', '01:45 PM')}
                    className="px-3.5 py-1.5 rounded-full bg-[#F3ECE3] dark:bg-[#2C2420] hover:bg-[#C1785A] hover:text-white text-xs font-bold transition-colors text-[#2C2725] dark:text-[#FAF6F0]"
                  >
                    Morning Shift (10:00 AM - 04:30 PM)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyShiftPreset('01:00 PM', '08:30 PM', '04:30 PM', '05:00 PM')}
                    className="px-3.5 py-1.5 rounded-full bg-[#F3ECE3] dark:bg-[#2C2420] hover:bg-[#C1785A] hover:text-white text-xs font-bold transition-colors text-[#2C2725] dark:text-[#FAF6F0]"
                  >
                    Evening Shift (01:00 PM - 08:30 PM)
                  </button>
                </div>
              </div>

              {/* Working Hours Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#161211] border border-[#EAE3DA] dark:border-[#382E28] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#F2A585] block">
                    Shift Start Time
                  </span>
                  <input
                    type="text"
                    value={currentSchedule?.shiftStart || '10:00 AM'}
                    onChange={(e) => handleUpdateShift({ shiftStart: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#382E28] bg-white dark:bg-[#201A18] text-sm font-mono font-bold text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                  />
                  <p className="text-[10px] text-[#6E6663] dark:text-[#B5ABA2]">
                    Artisan starts taking client bookings from this time.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#161211] border border-[#EAE3DA] dark:border-[#382E28] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C462C] dark:text-[#F2A585] block">
                    Shift End Time
                  </span>
                  <input
                    type="text"
                    value={currentSchedule?.shiftEnd || '08:00 PM'}
                    onChange={(e) => handleUpdateShift({ shiftEnd: e.target.value })}
                    placeholder="e.g. 08:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DA] dark:border-[#382E28] bg-white dark:bg-[#201A18] text-sm font-mono font-bold text-[#2C2725] dark:text-[#FAF6F0] focus:outline-none focus:border-[#C1785A]"
                  />
                  <p className="text-[10px] text-[#6E6663] dark:text-[#B5ABA2]">
                    Artisan shift concludes at this time.
                  </p>
                </div>
              </div>

              {/* Break Window */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#161211] border border-[#EAE3DA] dark:border-[#382E28] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-[#C1785A]" />
                    <span className="text-xs font-bold text-[#2C2725] dark:text-[#FAF6F0]">
                      Midday Break / Lunch Interval
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateShift({ hasBreak: !currentSchedule?.hasBreak })}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      currentSchedule?.hasBreak
                        ? 'bg-[#C1785A] text-white shadow-sm'
                        : 'bg-[#EAE3DA] dark:bg-[#2C2420] text-[#6E6663] dark:text-[#B5ABA2]'
                    }`}
                  >
                    {currentSchedule?.hasBreak ? 'Break Enabled' : 'No Break'}
                  </button>
                </div>

                {currentSchedule?.hasBreak && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#6E6663] dark:text-[#B5ABA2] block mb-1">
                        Break Starts
                      </label>
                      <input
                        type="text"
                        value={currentSchedule?.breakStart || '01:30 PM'}
                        onChange={(e) => handleUpdateShift({ breakStart: e.target.value })}
                        placeholder="01:30 PM"
                        className="w-full px-3 py-2 rounded-xl border border-[#EAE3DA] dark:border-[#382E28] bg-white dark:bg-[#201A18] text-xs font-mono font-bold focus:outline-none focus:border-[#C1785A]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#6E6663] dark:text-[#B5ABA2] block mb-1">
                        Break Concludes
                      </label>
                      <input
                        type="text"
                        value={currentSchedule?.breakEnd || '02:15 PM'}
                        onChange={(e) => handleUpdateShift({ breakEnd: e.target.value })}
                        placeholder="02:15 PM"
                        className="w-full px-3 py-2 rounded-xl border border-[#EAE3DA] dark:border-[#382E28] bg-white dark:bg-[#201A18] text-xs font-mono font-bold focus:outline-none focus:border-[#C1785A]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Shift Timeline Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[10px] text-[#6E6663] dark:text-[#B5ABA2] font-mono">
                  <span>08:00 AM</span>
                  <span>12:00 PM</span>
                  <span>04:00 PM</span>
                  <span>08:00 PM</span>
                  <span>10:00 PM</span>
                </div>
                <div className="h-6 w-full rounded-xl bg-[#EAE3DA] dark:bg-[#2C2420] relative overflow-hidden">
                  <div
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-[#C1785A] to-[#8C462C] rounded-lg shadow-sm flex items-center justify-center text-[9px] text-white font-bold tracking-wider uppercase truncate px-2"
                  >
                    Active Shift ({currentSchedule?.shiftStart} - {currentSchedule?.shiftEnd})
                  </div>
                  {currentSchedule?.hasBreak && breakWidthPercent > 0 && (
                    <div
                      style={{ left: `${breakLeftPercent}%`, width: `${breakWidthPercent}%` }}
                      className="absolute top-0 bottom-0 bg-rose-500/80 rounded-md border border-white/50 z-10 flex items-center justify-center text-[8px] text-white font-bold uppercase"
                      title={`Break: ${currentSchedule.breakStart} - ${currentSchedule.breakEnd}`}
                    >
                      Break
                    </div>
                  )}
                </div>
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
