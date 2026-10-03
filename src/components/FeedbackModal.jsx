import React, { useState } from 'react';
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
  const [tipAmount, setTipAmount] = useState(50);
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
    if (onSubmitFeedback) {
      onSubmitFeedback(booking.id, {
        rating,
        comment,
        tags: selectedTags,
        tip: tipAmount,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B18]/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-[#2C2725] shadow-warm-lg relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A8078] hover:text-[#2C2725] p-1.5 rounded-full bg-[#F3EAE0] font-bold transition-colors"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-[#F0DCCF] border border-[#C1785A] rounded-full flex items-center justify-center mx-auto text-[#C1785A] text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-serif text-2xl font-extrabold text-[#2C2725]">Thank You for Your Feedback!</h3>
            <p className="text-xs text-[#8A8078] max-w-sm mx-auto">
              Your rating and tip of ₹{tipAmount} have been shared with {stylist?.name || 'your stylist'}. We look forward to welcoming you back to Rose & Rogue!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Header */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#F0DCCF] border border-[#EAE3DA] rounded-full flex items-center justify-center mx-auto mb-3 text-[#C1785A] text-xl font-bold">
                ★
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-[#2C2725]">Rate Your Salon Experience</h3>
              <p className="text-xs text-[#8A8078] mt-1">
                How was your {service?.name || 'service'} with <span className="text-[#C1785A] font-bold">{stylist?.name}</span>?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Star Rating Interactive Selector */}
              <div className="text-center bg-[#F3EAE0] p-4 rounded-2xl border border-[#EAE3DA]">
                <label className="block text-[10px] font-bold text-[#8A8078] uppercase tracking-[0.08em] mb-2">
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
                      <span className={`text-2xl transition-colors ${
                        star <= (hoverRating || rating) ? 'text-[#C1785A]' : 'text-[#EAE3DA]'
                      }`}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Tags */}
              <div>
                <label className="block text-[10px] font-bold text-[#8A8078] uppercase tracking-[0.08em] mb-2">
                  Highlights & Compliments
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FEEDBACK_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#C1785A] text-[#FAF6F0] border-[#C1785A]'
                            : 'bg-[#F3EAE0] border-[#EAE3DA] text-[#8A8078] hover:text-[#2C2725]'
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
                <label className="block text-[10px] font-bold text-[#8A8078] uppercase tracking-[0.08em] mb-1">
                  Written Feedback / Note for {stylist?.name.split(' ')[0]}
                </label>
                <textarea
                  rows="2"
                  placeholder="Share details about your cut, facial, style, or floor ambiance..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#F3EAE0] border border-[#EAE3DA] rounded-2xl px-4 py-2.5 text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                />
              </div>

              {/* Stylist Tip Section */}
              <div>
                <label className="block text-[10px] font-bold text-[#8A8078] uppercase tracking-[0.08em] mb-1.5 flex items-center justify-between">
                  <span>Add Stylist Tip for {stylist?.name.split(' ')[0]}</span>
                  <span className="text-[#C1785A] font-serif font-bold text-sm">₹{tipAmount} Tip</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 50, 100, 150].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTipAmount(amt)}
                      className={`py-2 rounded-full border text-xs font-bold transition-all ${
                        tipAmount === amt
                          ? 'bg-[#C1785A] text-[#FAF6F0] border-[#C1785A]'
                          : 'bg-[#F3EAE0] border-[#EAE3DA] text-[#8A8078] hover:text-[#2C2725]'
                      }`}
                    >
                      {amt === 0 ? 'No Tip' : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] font-bold text-xs uppercase tracking-[0.08em] shadow-md transition-all mt-4"
              >
                <span>Submit Guest Review & Tip (₹{tipAmount})</span>
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
