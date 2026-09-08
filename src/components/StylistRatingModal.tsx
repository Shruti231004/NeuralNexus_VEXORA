'use client';

import React, { useState } from 'react';
import { Star, Sparkles, CheckCircle2, X, MessageSquare, Award, Heart } from 'lucide-react';
import { Appointment, Stylist } from '@/lib/types';
import { updateAppointment } from '@/lib/supabaseClient';
import { playChime } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

interface StylistRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onRatingSubmitted?: (rating: number, review: string) => void;
}

export const StylistRatingModal: React.FC<StylistRatingModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState<number>(appointment.customer_rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>(appointment.customer_review || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    appointment.customer_tags || ['Sculptural Precision', 'Gentle Scalp Care']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const stylist = appointment.stylist;

  const compliments = [
    'Sculptural Precision',
    'Gentle Scalp Care',
    'Luminous Color Blend',
    'Master Blow-Dry',
    'Punctual & Polite',
    'Haute Couture Styling',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    playChime('bell');

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#C1785A', '#E8D8CE', '#8C462C', '#C98A2C'],
      });
    } catch (e) {}

    await updateAppointment(appointment.id, {
      customer_rating: rating,
      customer_review: review.trim() || undefined,
      customer_tags: selectedTags,
      rated_at: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setIsSuccess(true);

    if (onRatingSubmitted) {
      onRatingSubmitted(rating, review);
    }

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2725]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF6F0] rounded-3xl border border-[#EAE3DA] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6663] hover:text-[#2C2725] hover:bg-[#F3ECE3] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F5E6DF] border-2 border-[#C1785A] text-[#8C462C] flex items-center justify-center mx-auto shadow-warm">
              <CheckCircle2 className="w-8 h-8 text-[#C1785A]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C2725]">
              Thank You For Your Review!
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6663] max-w-xs mx-auto">
              Your {rating}★ rating has been shared with {stylist?.name || 'your stylist'}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stylist Profile Header */}
            <div className="text-center space-y-2">
              <div className="relative inline-block">
                <img
                  src={
                    stylist?.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                  }
                  alt={stylist?.name || 'Stylist'}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#C1785A] mx-auto shadow-md"
                />
                <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#C1785A] text-white shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="font-serif text-2xl font-extrabold text-[#2C2725]">
                Rate Your Stylist: {stylist?.name}
              </h3>
              <p className="text-xs text-[#6E6663]">
                Station #{stylist?.chair_number || 1} • {appointment.service?.name}
              </p>
            </div>

            {/* Interactive 5-Star Rating Selector */}
            <div className="bg-[#F3ECE3] p-5 rounded-3xl border border-[#EAE3DA] text-center space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#8C462C] block">
                Tap to Rate Performance
              </span>

              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(starVal)}
                      className="p-1 transform hover:scale-125 transition-transform duration-200 focus:outline-none"
                    >
                      <Star
                        className={`w-9 h-9 ${
                          isFilled
                            ? 'text-[#C98A2C] fill-[#C98A2C] drop-shadow-[0_2px_8px_rgba(201,138,44,0.4)]'
                            : 'text-[#DDD3C6]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-bold text-[#2C2725] pt-1">
                {rating === 5 && '🌟 Exceptional Haute Artistry (5.0)'}
                {rating === 4 && '✨ Wonderful Styling Experience (4.0)'}
                {rating === 3 && '👍 Satisfactory Cut & Service (3.0)'}
                {rating === 2 && '⚠️ Room for Improvement (2.0)'}
                {rating === 1 && '❌ Disappointing Experience (1.0)'}
              </div>
            </div>

            {/* Compliment Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C1785A]" />
                What Made It Special?
              </label>
              <div className="flex flex-wrap gap-2">
                {compliments.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#C1785A] text-white shadow-sm'
                          : 'bg-[#FAF6F0] text-[#6E6663] border border-[#EAE3DA] hover:border-[#C1785A]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Review Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A423D] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#C1785A]" />
                Leave a Note or Stylist Compliment (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={2}
                placeholder="e.g. Antoine gave me the exact Parisian fringe layers I dreamed of!"
                className="w-full p-3.5 rounded-2xl border border-[#EAE3DA] bg-white text-xs sm:text-sm text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-[0.18em] shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit {rating}★ Stylist Review</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
