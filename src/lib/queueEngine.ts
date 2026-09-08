import { Appointment, OverlapAlert, Stylist, Service } from './types';
import { INITIAL_STYLISTS } from './mockData';

/**
 * Format currency to Indian Rupee (INR)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate dynamic queue position for a specific appointment.
 * Sorts by creation time ASC (FIFO) so earlier arrivals are POS #1, POS #2, etc.
 */
export function getQueuePosition(appointmentId: string, appointments: Appointment[]): number {
  const waitingList = appointments
    .filter((a) => a.status === 'waiting')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const index = waitingList.findIndex(
    (a) => a.id === appointmentId || a.queue_number === appointmentId
  );
  return index >= 0 ? index + 1 : 0;
}

/**
 * Calculate estimated wait time in minutes based on active chairs and queue length.
 */
export function calculateWaitMinutes(
  appointment: Appointment,
  allAppointments: Appointment[]
): number {
  if (appointment.status === 'in_chair') return 0;
  if (appointment.status === 'completed') return 0;

  const position = getQueuePosition(appointment.id, allAppointments);
  if (position === 0) return 0;

  // Active stylists currently working on someone in-chair
  const busyStylists = allAppointments.filter(
    (a) => a.status === 'in_chair'
  );

  // If position is 1 and at least one chair is opening soon or free
  const totalChairs = INITIAL_STYLISTS.length;
  const availableChairs = Math.max(1, totalChairs - busyStylists.length);

  // Dynamic wait: approximate 15-20 minutes divided by available chair capacity
  const waitPerTurn = 20 / availableChairs;
  const estimatedWait = Math.round((position - 1) * waitPerTurn + 8);

  return Math.max(5, estimatedWait);
}

export const calculateDynamicWaitMinutes = calculateWaitMinutes;

/**
 * Detect Smart Quick Cut Overlap opportunities.
 * If a stylist has a client in 'color_processing' (chair free for 30-45 mins),
 * check if someone in the waiting lounge needs a quick cut!
 */
export function detectOverlapOpportunities(appointments: Appointment[]): OverlapAlert[] {
  const alerts: OverlapAlert[] = [];
  const processingAppointments = appointments.filter((a) => a.status === 'color_processing');
  const waitingAppointments = appointments
    .filter((a) => a.status === 'waiting')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  for (const proc of processingAppointments) {
    const stylistName = proc.stylist?.name || 'Lead Stylist';
    const chairNumber = proc.stylist?.chair_number || 1;
    const windowMinutes = proc.service?.processing_time_minutes || 35;

    // Find candidate in waiting list whose service duration fits within the processing window
    const candidate = waitingAppointments.find(
      (wait) => (wait.service?.duration_minutes || 30) <= windowMinutes + 15
    );

    alerts.push({
      stylistId: proc.stylist_id,
      stylistName,
      chairNumber,
      processingAppointmentId: proc.id,
      processingCustomerName: proc.customer_name,
      windowMinutes,
      overlapCandidateAppointmentId: candidate?.id,
      overlapCandidateCustomerName: candidate?.customer_name,
      overlapCandidateService: candidate?.service?.name,
    });
  }

  return alerts;
}

/**
 * Format relative time display
 */
export function formatEtaString(minutes: number): string {
  if (minutes <= 0) return 'Immediate / Ready';
  if (minutes === 1) return 'in ~1 min';
  return `in ~${minutes} mins`;
}

/**
 * Status configurations with high-contrast warm color palette
 */
export const STATUS_CONFIG = {
  waiting: {
    label: 'Waiting Lounge',
    color: 'text-[#4A423D] bg-[#EAE3DC] border-[#D8CFC7]',
    dotColor: 'bg-[#8F8178]',
    badgeBg: 'bg-[#EAE3DC] text-[#4A423D] border-[#D8CFC7]',
    lightBadgeBg: 'bg-[#EAE3DC] text-[#4A423D] border-[#D8CFC7]',
    description: 'Relaxing in the luxury waiting lounge',
  },
  in_chair: {
    label: 'In-Chair Active',
    color: 'text-[#8C462C] bg-[#F5E6DF] border-[#E8D0C5]',
    dotColor: 'bg-[#C1785A] animate-pulse',
    badgeBg: 'bg-[#F5E6DF] text-[#8C462C] border-[#E8D0C5]',
    lightBadgeBg: 'bg-[#F5E6DF] text-[#8C462C] border-[#E8D0C5]',
    description: 'Styling and hair architecture in progress',
  },
  color_processing: {
    label: 'Color Processing',
    color: 'text-[#946114] bg-[#FDF2E2] border-[#F2DEBF]',
    dotColor: 'bg-[#C98A2C] animate-pulse',
    badgeBg: 'bg-[#FDF2E2] text-[#946114] border-[#F2DEBF]',
    lightBadgeBg: 'bg-[#FDF2E2] text-[#946114] border-[#F2DEBF]',
    description: 'Color developer working • Chair overlap open',
  },
  completed: {
    label: 'Completed',
    color: 'text-[#5C5550] bg-[#EBE7E2] border-[#DBD5CE]',
    dotColor: 'bg-[#78716A]',
    badgeBg: 'bg-[#EBE7E2] text-[#5C5550] border-[#DBD5CE]',
    lightBadgeBg: 'bg-[#EBE7E2] text-[#5C5550] border-[#DBD5CE]',
    description: 'Finished & verified by Lead Stylist',
  },
  delayed: {
    label: 'Delayed Notice',
    color: 'text-[#8C462C] bg-[#F5E6DF] border-[#E8D0C5]',
    dotColor: 'bg-[#C1785A]',
    badgeBg: 'bg-[#F5E6DF] text-[#8C462C] border-[#E8D0C5]',
    lightBadgeBg: 'bg-[#F5E6DF] text-[#8C462C] border-[#E8D0C5]',
    description: 'Running ~10 minutes past scheduled window',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-[#6E6663] bg-[#FAF6F0] border-[#EAE3DA]',
    dotColor: 'bg-[#6E6663]',
    badgeBg: 'bg-[#FAF6F0] text-[#6E6663] border-[#EAE3DA]',
    lightBadgeBg: 'bg-[#FAF6F0] text-[#6E6663] border-[#EAE3DA]',
    description: 'Appointment cancelled',
  },
};
