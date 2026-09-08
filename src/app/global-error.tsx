'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF6F0] text-[#2C2725] min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#F3ECE3] p-8 rounded-3xl border border-[#EAE3DA] text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#2C2725]">Styliq Refresh</h2>
          <p className="text-xs text-[#6E6663]">Please reload to continue your session.</p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-full bg-[#C1785A] text-white text-xs font-bold uppercase tracking-wider"
          >
            Reload Styliq
          </button>
        </div>
      </body>
    </html>
  );
}
