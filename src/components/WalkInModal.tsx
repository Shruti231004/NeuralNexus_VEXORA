'use client';

import React, { useState } from 'react';
import { X, UserPlus, Scissors, User, Phone, Sparkles } from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_STYLISTS, INITIAL_SALON } from '@/lib/mockData';
import { createAppointment } from '@/lib/supabaseClient';
import { formatINR } from '@/lib/queueEngine';
import { QueueTokenModal } from './QueueTokenModal';
import { Appointment } from '@/lib/types';
import { playChime } from '@/lib/soundEffects';
import { sendWhatsAppBookingConfirmation } from '@/lib/whatsappService';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customServiceName, setCustomServiceName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(INITIAL_SERVICES[0].id);
  const [selectedStylistId, setSelectedStylistId] = useState(INITIAL_STYLISTS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTokenApt, setCreatedTokenApt] = useState<Appointment | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  if (!isOpen && !isTokenModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);
    const selectedService = INITIAL_SERVICES.find((s) => s.id === selectedServiceId);
    const selectedStylist = INITIAL_STYLISTS.find((st) => st.id === selectedStylistId);

    const now = new Date();
    const customReqNote = customServiceName.trim() ? `[CUSTOM SERVICE: ${customServiceName.trim()}] ` : '';
    const newApt = await createAppointment({
      salon_id: INITIAL_SALON.id,
      service_id: selectedServiceId,
      stylist_id: selectedStylistId,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: '',
      queue_number: '',
      status: 'waiting',
      is_walk_in: true,
      deposit_paid: true,
      deposit_amount_inr: 0,
      estimated_start_time: new Date(now.getTime() + 10 * 60000).toISOString(),
      notes: `${customReqNote}[WALK-IN GUEST]`,
      service: selectedService,
      stylist: selectedStylist,
    });

    // Trigger Meta WhatsApp notification
    if (newApt && newApt.customer_phone) {
      sendWhatsAppBookingConfirmation(newApt, 1, 10);
    }

    playChime('bell');
    setIsSubmitting(false);
    setCreatedTokenApt(newApt);
    setIsTokenModalOpen(true);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2725]/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF6F0] rounded-3xl border border-[#EAE3DA] shadow-2xl overflow-hidden text-[#2C2725]">
        {/* Header */}
        <div className="bg-[#F3ECE3] p-6 flex items-center justify-between border-b border-[#EAE3DA]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C1785A] flex items-center justify-center text-white shadow-warm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C2725]">Walk-In Quick Add</h3>
              <p className="text-xs text-[#6E6663]">Inject offline guest directly into Live Queue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6E6663] hover:text-[#2C2725] hover:bg-[#EAE3DA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#4A423D] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C1785A]" />
              Guest Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Natasha Poonawalla"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#4A423D] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C1785A]" />
              Mobile Number
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98200 00000"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#4A423D] flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#C1785A]" />
              Desired Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
            >
              {INITIAL_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration_minutes} min • {formatINR(s.price_inr)})
                </option>
              ))}
            </select>

            {INITIAL_SERVICES.find((s) => s.id === selectedServiceId)?.name.includes('Other') && (
              <div className="pt-2 animate-fadeIn">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C462C] block mb-1">
                  Specify Custom Request:
                </label>
                <input
                  type="text"
                  required
                  value={customServiceName}
                  onChange={(e) => setCustomServiceName(e.target.value)}
                  placeholder="e.g. Balayage Correction, Texture Spa, Extensions..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#C1785A] bg-[#FAF6F0] text-xs font-bold text-[#2C2725] focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#4A423D] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C1785A]" />
              Assign Stylist
            </label>
            <select
              value={selectedStylistId}
              onChange={(e) => setSelectedStylistId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] bg-white text-xs text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
            >
              {INITIAL_STYLISTS.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} — Station #{st.chair_number} ({st.title})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Injecting into Queue...' : 'Add to Waiting Lounge & Generate Token'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Digital Queue Token Modal */}
      <QueueTokenModal
        isOpen={isTokenModalOpen}
        onClose={() => {
          setIsTokenModalOpen(false);
          onClose();
        }}
        appointment={createdTokenApt}
        queuePosition={1}
        estimatedWaitMinutes={10}
      />
    </div>
  );
};
