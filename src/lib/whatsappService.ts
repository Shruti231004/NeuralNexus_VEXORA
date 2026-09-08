import { Appointment } from './types';

export interface WhatsAppNotificationResult {
  success: boolean;
  message?: string;
  messageId?: string;
  directWaLink?: string;
  method: 'meta_cloud_api' | 'wa_link_fallback' | 'simulated';
}

/**
 * Format the official luxury salon WhatsApp booking confirmation text with Allotted Time Slot
 */
export function formatWhatsAppMessage(
  appointment: Appointment,
  queuePosition: number = 1,
  estimatedWaitMinutes: number = 15,
  originUrl?: string
): string {
  const baseUrl = originUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://styliq.paris');
  const trackingUrl = `${baseUrl}/queue/${appointment.id}`;
  const stylistName = appointment.stylist?.name || 'Artisan Lead';
  const chairNumber = appointment.stylist?.chair_number || 1;
  const tokenCode = appointment.queue_number || 'SQ-101';
  const serviceDuration = appointment.service?.duration_minutes || 30;

  // Calculate Allotted Start & End Time Slot
  const startTime = appointment.estimated_start_time
    ? new Date(appointment.estimated_start_time)
    : new Date(Date.now() + estimatedWaitMinutes * 60000);
  
  const endTime = new Date(startTime.getTime() + serviceDuration * 60000);

  const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeSlot = `${formattedStartTime} – ${formattedEndTime}`;

  const dateStr = startTime.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return `✨ *STYLIQ HAUTE COIFFURE • PARIS* ✨
━━━━━━━━━━━━━━━━━━━━━
🎉 *Appointment Booked for Allotted Time Slot!*

Bonjour *${appointment.customer_name}*,
Your salon appointment is confirmed for your reserved slot:

⏰ *ALLOTTED TIME SLOT:* *${timeSlot}*
📅 *Date:* ${dateStr}
🎟️ *Token Number:* *#${tokenCode}*
✂️ *Service:* ${appointment.service?.name || 'Hair Artistry'} (${serviceDuration} mins)
💈 *Assigned Stylist:* ${stylistName} (Station #${chairNumber})
📍 *Queue Position:* #${queuePosition} (Est. wait ~${estimatedWaitMinutes} mins)
💳 *Advance Deposit:* ₹99 Paid ✓

━━━━━━━━━━━━━━━━━━━━━
📲 *TRACK YOUR LIVE QUEUE & DIGITAL PASS:*
${trackingUrl}

_Please arrive at your allotted time slot. You will receive a live chime alert when Station #${chairNumber} is ready._
*STYLIQ PARIS • Haute Coiffure Salon*`;
}

/**
 * Generate a direct WhatsApp deep link with encoded message for fallback / 1-tap open
 */
export function getWhatsAppDirectLink(
  appointment: Appointment,
  queuePosition: number = 1,
  estimatedWaitMinutes: number = 15
): string {
  const cleanPhone = appointment.customer_phone.replace(/\D/g, '');
  const message = formatWhatsAppMessage(appointment, queuePosition, estimatedWaitMinutes);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Send WhatsApp confirmation via Meta Cloud API backend route
 */
export async function sendWhatsAppBookingConfirmation(
  appointment: Appointment,
  queuePosition: number = 1,
  estimatedWaitMinutes: number = 15
): Promise<WhatsAppNotificationResult> {
  const cleanPhone = appointment.customer_phone.replace(/\D/g, '');
  const directWaLink = getWhatsAppDirectLink(appointment, queuePosition, estimatedWaitMinutes);

  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const response = await fetch('/api/whatsapp/send-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointment,
        queuePosition,
        estimatedWaitMinutes,
        origin,
        recipientPhone: cleanPhone,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        messageId: data.messageId || `wam-${Date.now()}`,
        message: 'WhatsApp confirmation sent via Meta Cloud API',
        directWaLink,
        method: 'meta_cloud_api',
      };
    }
  } catch (error) {
    console.warn('Backend WhatsApp API trigger failed, fallback to direct deep link:', error);
  }

  return {
    success: true,
    message: 'Generated direct WhatsApp pass link',
    directWaLink,
    method: 'wa_link_fallback',
  };
}
