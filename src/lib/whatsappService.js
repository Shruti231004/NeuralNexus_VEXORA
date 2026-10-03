/**
 * Format official Rose & Rogue WhatsApp booking confirmation text
 */
export function formatWhatsAppMessage(
  appointment,
  queuePosition = 1,
  estimatedWaitMinutes = 15,
  originUrl
) {
  const baseUrl = originUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
  const trackingUrl = `${baseUrl}?queueId=${appointment.id || 'SQ-101'}`;
  const stylistName = appointment.stylistName || appointment.stylist?.name || 'Artisan Lead';
  const chairNumber = appointment.chairNumber || appointment.stylist?.chair_number || 1;
  const tokenCode = appointment.queueNumber || appointment.queue_number || 'SQ-101';
  const serviceDuration = appointment.durationMinutes || appointment.service?.duration_minutes || 30;

  const startTime = appointment.estimatedStartTime
    ? new Date(appointment.estimatedStartTime)
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

  return `✨ *ROSE & ROGUE HAUTE COIFFURE • PARIS* ✨
━━━━━━━━━━━━━━━━━━━━━
🎉 *Appointment Booked for Allotted Time Slot!*

Bonjour *${appointment.customerName || appointment.customer_name || 'Guest'}*,
Your salon appointment is confirmed for your reserved slot:

⏰ *ALLOTTED TIME SLOT:* *${timeSlot}*
📅 *Date:* ${dateStr}
🎟️ *Token Number:* *#${tokenCode}*
✂️ *Service:* ${appointment.serviceName || appointment.service?.name || 'Hair Artistry'} (${serviceDuration} mins)
💈 *Assigned Stylist:* ${stylistName} (Station #${chairNumber})
📍 *Queue Position:* #${queuePosition} (Est. wait ~${estimatedWaitMinutes} mins)
💳 *Advance Deposit:* ₹99 Paid ✓

━━━━━━━━━━━━━━━━━━━━━
📲 *TRACK YOUR LIVE QUEUE & DIGITAL PASS:*
${trackingUrl}

_Please arrive at your allotted time slot. You will receive a live chime alert when Station #${chairNumber} is ready._
*ROSE & ROGUE PARIS • Haute Coiffure Salon*`;
}

/**
 * Generate a direct WhatsApp deep link with encoded message for fallback / 1-tap open
 */
export function getWhatsAppDirectLink(
  appointment,
  queuePosition = 1,
  estimatedWaitMinutes = 15
) {
  const cleanPhone = (appointment.customerPhone || appointment.customer_phone || '').replace(/\D/g, '');
  const message = formatWhatsAppMessage(appointment, queuePosition, estimatedWaitMinutes);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Send WhatsApp confirmation via Meta Cloud API backend route or deep link fallback
 */
export async function sendWhatsAppBookingConfirmation(
  appointment,
  queuePosition = 1,
  estimatedWaitMinutes = 15
) {
  const cleanPhone = (appointment.customerPhone || appointment.customer_phone || '').replace(/\D/g, '');
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
