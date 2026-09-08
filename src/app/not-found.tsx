import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scissors } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6 text-[#2C2725]">
      <div className="max-w-md w-full bg-[#F3ECE3] p-8 sm:p-10 rounded-3xl border border-[#EAE3DA] shadow-card text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center mx-auto shadow-warm">
          <Scissors className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C462C] bg-[#F5E6DF] px-3 py-1 rounded-full border border-[#E8D0C5] inline-block">
            Page Not Found • 404
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2725]">
            Styling Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6663]">
            The salon reference you are looking for has been updated or moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-warm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
