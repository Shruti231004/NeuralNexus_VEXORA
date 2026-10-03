import React, { useState } from 'react';

export default function GoogleAuthModal({ isOpen, onClose, onAuthenticated }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onAuthenticated) {
        onAuthenticated({
          name: 'Aarav Mehta',
          email: 'aarav.mehta@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: true
        });
      }
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B18]/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 max-w-md w-full text-[#2C2725] shadow-warm-lg space-y-6 relative overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-[#EAE3DA] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center font-bold text-lg shadow-sm">
              🛡️
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#C1785A] uppercase tracking-[0.08em]">Google Security Gate</div>
              <h3 className="font-serif font-extrabold text-xl text-[#2C2725]">Google OAuth Verification</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3EAE0] text-[#8A8078] hover:text-[#2C2725] flex items-center justify-center transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[#8A8078] leading-relaxed">
          Authenticate securely via Google OAuth 2.0 to sync your guest reward points, access live queue notifications, and save your AI hairstyle previews.
        </p>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 px-4 bg-[#F3EAE0] hover:bg-[#EFE6DA] border border-[#EAE3DA] rounded-full font-bold text-xs uppercase tracking-[0.08em] text-[#2C2725] shadow-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-[#C1785A] border-t-transparent animate-spin" />
              <span>Verifying Google Auth...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
              </svg>
              <span>Continue with Google OAuth</span>
            </>
          )}
        </button>

        <div className="pt-3 border-t border-[#EAE3DA] flex items-center justify-between text-[10px] text-[#8A8078] uppercase font-bold tracking-[0.08em]">
          <span>✓ 256-Bit SSL Encrypted</span>
          <span>Rose & Rogue Security Suite</span>
        </div>

      </div>
    </div>
  );
}
