import React, { useState } from 'react';
import { X, Star, QrCode, Heart, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { SERVICES, STYLISTS } from '../services/store';

const FEEDBACK_TAGS = [
  '✨ Exceptional Skill',
  '⏱️ On-Time Queue',
  '🧼 Clean & Hygienic',
  '💬 Friendly Stylist',
  '💆 Relaxing Experience',
  '💎 Premium Products'
];

export default function FeedbackModal({ booking, onClose, onSubmitFeedback }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(['✨ Exceptional Skill', '⏱️ On-Time Queue']);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  if (!booking) return null;

  const service = SERVICES.find(s => s.id === booking.serviceId);
  const stylist = STYLISTS.find(s => s.id === booking.stylistId);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback(booking.id, {
      rating,
      comment,
      tags: selectedTags,
      tip: tipAmount,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1E242C] border border-amber-600/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-gray-300 max-w-sm mx-auto">
              Your 5-star rating and tip of ${tipAmount} have been shared with {stylist?.name || 'your stylist'}. We look forward to welcoming you back to Amaya Salon!
            </p>
          </div>
        ) : (
          <div>
            
            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-amber-950/80 border border-amber-600/40 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-400">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">Rate Your Salon Experience</h3>
              <p className="text-xs text-gray-400 mt-1">
                How was your {service?.name || 'service'} with <span className="text-amber-300 font-semibold">{stylist?.name}</span>?
              </p>
            </div>

            {/* Generated Feedback QR Code Display */}
            <div className="bg-[#161A20] p-4 rounded-2xl border border-gray-800 mb-5 text-center flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-2.5 rounded-xl shrink-0 shadow-md border border-amber-500/30">
                <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                  <rect x="5" y="5" width="28" height="28" fill="#161A20" rx="3" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="1.5" />
                  <rect x="13" y="13" width="12" height="12" fill="#D97706" rx="1" />

                  <rect x="67" y="5" width="28" height="28" fill="#161A20" rx="3" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="1.5" />
                  <rect x="75" y="13" width="12" height="12" fill="#D97706" rx="1" />

                  <rect x="5" y="67" width="28" height="28" fill="#161A20" rx="3" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="1.5" />
                  <rect x="13" y="75" width="12" height="12" fill="#D97706" rx="1" />

                  <rect x="40" y="10" width="8" height="18" fill="#161A20" />
                  <rect x="52" y="10" width="10" height="8" fill="#161A20" />
                  <rect x="40" y="35" width="18" height="10" fill="#D97706" />
                  <rect x="65" y="35" width="25" height="10" fill="#161A20" />
                  <rect x="40" y="55" width="12" height="18" fill="#161A20" />
                  <rect x="60" y="55" width="25" height="18" fill="#161A20" />
                </svg>
              </div>

              <div className="text-left text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <QrCode className="w-4 h-4" />
                  <span>Scan QR Code to Review</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Scan this QR code on your phone camera or fill out the rating below to publish your review to Amaya Salon's live guest wall.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Star Rating Interactive Selector */}
              <div className="text-center bg-[#161A20] p-3.5 rounded-2xl border border-gray-800">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Tap Stars to Rate
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs text-amber-300 font-semibold mt-1">
                  {rating === 5 && '🌟 Exceptional! 5 Out of 5'}
                  {rating === 4 && '✨ Great Service! 4 Stars'}
                  {rating === 3 && '👍 Good Experience 3 Stars'}
                  {rating <= 2 && '💬 Needs Improvement'}
                </div>
              </div>

              {/* Feedback Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Highlights / Compliments
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FEEDBACK_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-950/90 border-amber-500 text-amber-200 font-semibold shadow'
                            : 'bg-[#161A20] border-gray-800 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Written Review */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Written Feedback / Note for {stylist?.name.split(' ')[0]}
                </label>
                <textarea
                  rows="2"
                  placeholder="Share details about your cut, facial, style, or floor ambiance..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#161A20] border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* Stylist Tip Section */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Add Stylist Tip for {stylist?.name.split(' ')[0]}</span>
                  <span className="text-amber-400 font-serif font-bold text-sm">${tipAmount} Tip</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 15].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTipAmount(amt)}
                      className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                        tipAmount === amt
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow'
                          : 'bg-[#161A20] border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {amt === 0 ? 'No Tip' : `$${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all mt-4"
              >
                <Send className="w-4 h-4" />
                <span>Submit Guest Review & Tip (${tipAmount})</span>
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
