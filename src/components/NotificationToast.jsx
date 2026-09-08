import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast({ toasts = [] }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = 'bg-[#1E242C] border-gray-700 text-gray-100';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          bgClass = 'bg-emerald-950/90 border-emerald-700/60 text-emerald-100 shadow-emerald-950/40';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bgClass = 'bg-amber-950/90 border-amber-700/60 text-amber-100 shadow-amber-950/40';
          icon = <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.type === 'info') {
          bgClass = 'bg-[#1E242C]/95 border-amber-600/40 text-gray-100 shadow-amber-950/20';
          icon = <Bell className="w-5 h-5 text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md animate-slide-up transition-all ${bgClass}`}
          >
            {icon}
            <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
              {toast.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
