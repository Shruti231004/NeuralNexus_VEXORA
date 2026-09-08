'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6 text-[#2C2725]">
      <div className="max-w-md w-full bg-[#F3ECE3] p-8 sm:p-10 rounded-3xl border border-[#EAE3DA] shadow-card text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F5E6DF] border-2 border-[#C1785A] text-[#8C462C] flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-8 h-8 text-[#C1785A]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C462C] bg-[#F5E6DF] px-3 py-1 rounded-full border border-[#E8D0C5] inline-block">
            Styliq Notice
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2725]">
            Session Refresh Needed
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6663]">
            A momentary synchronization delay occurred. Click below to refresh your live queue view.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload View</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-[#6E6663] hover:text-[#2C2725] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Studio Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
