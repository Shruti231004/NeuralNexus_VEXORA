import { useState, useEffect, useCallback } from 'react';

// Aura Salon Curated Services
export const SERVICES = [
  {
    id: 'precision-haircut-detox',
    name: 'Precision Haircut & Scalp Detox',
    category: 'Precision Haircuts',
    badge: 'Custom Bone Architecture',
    badgeColor: 'text-amber-400',
    icon: 'content_cut',
    gender: 'all',
    duration: 60,
    price: 145,
    description: 'Tailored structure contouring for any hair texture, paired with active charcoal purifying wash and neck tension release.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0x1lSNWygKaEe000CzJar0oXK6i9kDNqbTWhJSeyBCcQnZpjeql_d7YZiRxNgHtvhK6YxNdRQrrbXd3GfZ9wtmA--RUH-7L0cPl5kIb4UkUJ8-dImASvkGRw7aJ_6k31-_eK8iVRIgoPexSc4gaKJfSsdjtifN5HPjOBIzQoePxMFGPrdwjedGdZ2ZbtS_pDwwOrOYP18fwJL7p4X4FBVFMUinW8EpN2IC4amRiAVsWJLeHBZsps'
  },
  {
    id: 'holistic-scalp-steam',
    name: 'Holistic Scalp Therapy & Steam Bath',
    category: 'Scalp & Head Spa',
    badge: 'Steam Halo Cascade',
    badgeColor: 'text-[#db2379]',
    icon: 'air',
    gender: 'all',
    duration: 60,
    price: 125,
    description: 'Acupressure meridian massage, deep botanical exfoliation, and soothing warm herbal water-halo cascade for total scalp restoration.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkrmdrXKi2VSrrisBTIkdpgPhuz-Oq2tOZWYji_qSZjMxdZ1f3cVb4frKpxpDMQwzMtbpBJO-7honRXqjsRXXUkY6ZJ67BuiuhJojBJoSUmfg4RZGmnkknXlLiu-DdLiKM9SMwg-nT1ZOrcU_Vk8uhZhz4k-wtJIjjhGiZUUTJ8N9U37cPm2i6zkhTlQ0ICcACKwXxVhnKzhWzs2OWluvELkcXQqwNiAJmVtFPIuPbpfe565vusIs'
  },
  {
    id: 'beard-texture-sculpt',
    name: 'Botanical Beard & Texture Sculpt',
    category: 'Beard & Texture Sculpt',
    badge: 'Aromatherapy Hot Towel',
    badgeColor: 'text-[#974ce9]',
    icon: 'face',
    gender: 'male',
    duration: 45,
    price: 95,
    description: 'Precision straight-razor detailing, cedarwood-infused hot towel compress, and deep organic oil conditioning.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCj6XGyYjuFv89rebjIDs265m_GTFERCC8FYqM6jXuBwZtMARuH_4os83s0OLYVdjNLRhU6xhmklMR2LtcqQF7efDdsfi08JUgl4OoYjDs49sf9G4P6yXR56kbvZlR9CMZYmC3faQc7w8rBcDM9FZYAfwnpMLO9m2gFNCA_EZlVwhRDkOl7mofJcQ9jd7tLjhY9iHIhbFB897tfYU1uoXLEV_QeX_rptC-UF-B4a5_2P4TsLczQ2k'
  },
  {
    id: 'color-glaze-tone',
    name: 'Color Glaze & Dimensional Tone',
    category: 'Color Glaze & Tone',
    badge: 'Ammonia-Free Alchemy',
    badgeColor: 'text-amber-400',
    icon: 'flare',
    gender: 'female',
    duration: 90,
    price: 190,
    description: 'Nutrient-rich gloss treatment enhancing natural depth, neutralizing brass, and locking in 12-week luminous cuticle vibrancy.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWBs1TgxYb67z1tLnV2WiuxXlulsHtx5fkNyRN1czTKWjjtlWV0FxTe51nK0OtHqlShfnVT-5uKaYAFGyR6hjpVM2hGYyNbt9RFYgW2hDWo57iLzmDcwXu3sgCqnwI2NgFySd-2lEiTXbgPn0bO33yIHtdQ9e9a8dPGSENE3XZWGcLF2PqnBhH95vUyByziqXVg7WwT8Z4T-RKj4LamwVildoEHGyO2qdvFDaweMeV-HKNx6VtiO4'
  }
];

// Aura Artisans / Stylists
export const STYLISTS = [
  { 
    id: 'elena', 
    name: 'Elena Vance', 
    role: 'Master Color & Cut', 
    rating: 4.98, 
    reviewsCount: 340, 
    nextSlot: 'Today 2:30 PM', 
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD_9xdARYVZEnnMnvLAzBYD6styFIEEzkgd449o517riApX0om5EKSO1SLOXsdKKAPdMepI2T0vCeRyb2B5keExLfrd4dv4JWZm6Ab0oxfHAWDfuLvqMxgeCebdKzh8XUOJGzxOb9fXUtNwkAmYjr9tGfkgqTgDM64W_uTQM5Mt6WnBEqFdH_HdH5HjiebPETkZoVYOnITPQBaOoDs9D4xa-fHMp5SQiMvmtAcZ0NSKntgsKM5uRo',
    active: true 
  },
  { 
    id: 'marcus', 
    name: 'Marcus Chen', 
    role: 'Precision Barber & Stylist', 
    rating: 4.95, 
    reviewsCount: 210, 
    nextSlot: 'Today 4:00 PM', 
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCj6XGyYjuFv89rebjIDs265m_GTFERCC8FYqM6jXuBwZtMARuH_4os83s0OLYVdjNLRhU6xhmklMR2LtcqQF7efDdsfi08JUgl4OoYjDs49sf9G4P6yXR56kbvZlR9CMZYmC3faQc7w8rBcDM9FZYAfwnpMLO9m2gFNCA_EZlVwhRDkOl7mofJcQ9jd7tLjhY9iHIhbFB897tfYU1uoXLEV_QeX_rptC-UF-B4a5_2P4TsLczQ2k',
    active: true 
  },
  { 
    id: 'chloe', 
    name: 'Chloe Rey', 
    role: 'Trichology & Scalp Specialist', 
    rating: 4.99, 
    reviewsCount: 185, 
    nextSlot: 'Tomorrow 11:30 AM', 
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLEwXwbp5exv_fIhuBpmCshV0j783RUDLNpJfuZXmuwigfU0m30vyMw82ctjQfFHrn5uJNbFq-E9WbQr4QAR-wjPV9jzh3W_cjM2NAAw5UfdZLI2VsFOdMz_KyMZ3wKV15sP6hrNtvO193JdnNCNkO9QABkfsneAnBX_Dm1XK3bIBYPz82tNMks0mD1ZzUfIV1XdRWiQdff5n_LD6N2fbvuR7sI2bIj88dJXhxDdRpYUoVVO0cby4',
    active: true 
  }
];

// Time Slots
export const TIME_SLOTS = [
  '10:00 AM', '11:30 AM', '1:15 PM', '2:45 PM', '4:00 PM', '5:30 PM', '6:45 PM'
];

// Known Customer No-Show History (phone -> count)
const NO_SHOW_DATABASE = {
  '+1 555-0199': 2,
  '+1 555-0442': 3
};

// Initial Seed Bookings for Demo
const SEED_BOOKINGS = [
  {
    id: 'bk-101',
    customerName: 'Aarav Mehta',
    customerPhone: '+1 555-0101',
    customerGender: 'male',
    serviceId: 'beard-texture-sculpt',
    stylistId: 'marcus',
    slot: '1:15 PM',
    status: 'in-service',
    queueOrder: 1,
    checkedIn: true,
    checkedInAt: '1:10 PM',
    startedAt: '1:15 PM',
    paymentStatus: 'pending',
    paymentMethod: null,
    amount: 95,
    refundStatus: null,
    refundAmount: 0,
    refundReason: null,
    bookedAt: '11:15 AM'
  },
  {
    id: 'bk-102',
    customerName: 'Neha Kapoor',
    customerPhone: '+1 555-0199',
    customerGender: 'female',
    serviceId: 'holistic-scalp-steam',
    stylistId: 'chloe',
    slot: '2:45 PM',
    status: 'waiting',
    queueOrder: 2,
    checkedIn: true,
    checkedInAt: '2:30 PM',
    paymentStatus: 'pending',
    paymentMethod: null,
    amount: 125,
    refundStatus: null,
    refundAmount: 0,
    refundReason: null,
    bookedAt: '10:45 AM'
  },
  {
    id: 'bk-103',
    customerName: 'Vikram Singh',
    customerPhone: '+1 555-0322',
    customerGender: 'male',
    serviceId: 'precision-haircut-detox',
    stylistId: 'marcus',
    slot: '4:00 PM',
    status: 'booked',
    queueOrder: 3,
    checkedIn: false,
    checkedInAt: null,
    paymentStatus: 'pending',
    paymentMethod: null,
    amount: 145,
    refundStatus: null,
    refundAmount: 0,
    refundReason: null,
    bookedAt: '12:30 PM'
  },
  {
    id: 'bk-104',
    customerName: 'Riya Sen',
    customerPhone: '+1 555-0588',
    customerGender: 'female',
    serviceId: 'color-glaze-tone',
    stylistId: 'elena',
    slot: '10:00 AM',
    status: 'completed',
    queueOrder: 0,
    checkedIn: true,
    checkedInAt: '09:55 AM',
    startedAt: '10:00 AM',
    completedAt: '11:30 AM',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    amount: 190,
    refundStatus: null,
    refundAmount: 0,
    refundReason: null,
    bookedAt: '09:00 AM'
  }
];

const LOCAL_STORAGE_KEY = 'aura_salon_state_v2';
const SYNC_EVENT_KEY = 'aura_salon_sync_event';

export function useSalonStore() {
  const [currentStaffId, setCurrentStaffId] = useState('elena');
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load salon state:', e);
    }
    return SEED_BOOKINGS;
  });

  const [toasts, setToasts] = useState([]);

  // Save to localStorage & Broadcast to other tabs/windows
  const updateStateAndBroadcast = useCallback((newBookings, toastMessage = null) => {
    setBookings(newBookings);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBookings));
      localStorage.setItem(SYNC_EVENT_KEY, JSON.stringify({ timestamp: Date.now(), toast: toastMessage }));
    } catch (e) {
      console.error('Error persisting state:', e);
    }

    if (toastMessage) {
      addToast(toastMessage.text, toastMessage.type || 'info');
    }
  }, []);

  const addToast = (text, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Real-time synchronization across browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          setBookings(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error parsing sync storage:', err);
        }
      }
      if (e.key === SYNC_EVENT_KEY && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload.toast) {
            addToast(`⚡ Sync: ${payload.toast.text}`, payload.toast.type || 'info');
          }
        } catch (err) {
          console.error('Error parsing toast payload:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getNoShowCount = (phone) => {
    if (!phone) return 0;
    const historical = NO_SHOW_DATABASE[phone] || 0;
    const currentNoShows = bookings.filter(b => b.customerPhone === phone && b.status === 'no-show').length;
    return historical + currentNoShows;
  };

  const getQueueInfo = (bookingId) => {
    const waitingBookings = bookings
      .filter(b => b.status === 'waiting')
      .sort((a, b) => (a.queueOrder || 0) - (b.queueOrder || 0));

    const position = waitingBookings.findIndex(b => b.id === bookingId) + 1;
    const totalWaiting = waitingBookings.length;

    if (position === 0) return { position: null, totalWaiting, estimatedWaitMins: 0, text: 'Not in waiting queue' };

    const activeStylistCount = STYLISTS.filter(s => s.active).length || 1;
    let minsAhead = 0;

    for (let i = 0; i < position - 1; i++) {
      const b = waitingBookings[i];
      const s = SERVICES.find(srv => srv.id === b.serviceId);
      minsAhead += (s ? s.duration : 30);
    }

    const estimatedMins = Math.max(5, Math.round(minsAhead / activeStylistCount));

    let text = `About ${estimatedMins} mins wait`;
    if (position === 1) {
      text = "You're next! Please stay nearby for chair calling.";
    } else if (position === 2) {
      text = `About ${estimatedMins} mins — sanctuary preparing soon`;
    } else {
      const firstInService = bookings.find(b => b.status === 'in-service');
      if (firstInService) {
        text = `About ${estimatedMins} mins — ${firstInService.customerName}'s ritual wrapping up`;
      }
    }

    return { position, totalWaiting, estimatedWaitMins: estimatedMins, text };
  };

  const bookAppointment = ({ customerName, customerPhone, customerGender = 'all', serviceId, stylistId, slot }) => {
    const service = SERVICES.find(s => s.id === serviceId);
    const newBooking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      customerName,
      customerPhone,
      customerGender,
      serviceId,
      stylistId: stylistId || 'elena',
      slot,
      status: 'booked',
      queueOrder: bookings.length + 1,
      checkedIn: false,
      checkedInAt: null,
      paymentStatus: 'pending',
      paymentMethod: null,
      amount: service ? service.price : 145,
      refundStatus: null,
      refundAmount: 0,
      refundReason: null,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextBookings = [...bookings, newBooking];
    updateStateAndBroadcast(nextBookings, {
      text: `Ritual confirmed for ${customerName} (${slot})`,
      type: 'success'
    });
    return newBooking;
  };

  const checkIn = (bookingId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const maxQueueOrder = Math.max(...bookings.map(b => b.queueOrder || 0), 0);

    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'waiting',
          checkedIn: true,
          checkedInAt: nowTime,
          queueOrder: maxQueueOrder + 1
        };
      }
      return b;
    });

    const target = bookings.find(b => b.id === bookingId);
    updateStateAndBroadcast(nextBookings, {
      text: `${target?.customerName || 'Customer'} checked in & entered Aura sanctuary queue!`,
      type: 'info'
    });
  };

  const startService = (bookingId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'in-service',
          startedAt: nowTime
        };
      }
      return b;
    });

    const target = bookings.find(b => b.id === bookingId);
    updateStateAndBroadcast(nextBookings, {
      text: `Ritual started for ${target?.customerName}`,
      type: 'info'
    });
  };

  const completeService = (bookingId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'completed',
          completedAt: nowTime
        };
      }
      return b;
    });

    const target = bookings.find(b => b.id === bookingId);
    updateStateAndBroadcast(nextBookings, {
      text: `Ritual completed for ${target?.customerName}`,
      type: 'success'
    });
  };

  const processPayment = (bookingId, paymentMethod) => {
    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'paid',
          paymentMethod: paymentMethod,
          status: b.status === 'completed' ? 'completed' : b.status
        };
      }
      return b;
    });

    const target = bookings.find(b => b.id === bookingId);
    updateStateAndBroadcast(nextBookings, {
      text: `Payment of ₹${target?.amount} recorded via ${paymentMethod} for ${target?.customerName}`,
      type: 'success'
    });
  };

  const cancelBooking = (bookingId, reason = 'Customer requested cancellation') => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    const isFullRefundEligible = (target.status === 'booked' && !target.checkedIn);
    const refundAmount = isFullRefundEligible ? target.amount : 0;
    const refundStatus = isFullRefundEligible ? 'full-refund' : 'no-refund';

    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'cancelled',
          refundStatus: refundStatus,
          refundAmount: refundAmount,
          refundReason: reason
        };
      }
      return b;
    });

    const refundMsg = isFullRefundEligible 
      ? `Full 100% deposit refund (₹${target.amount}) processed.`
      : `No refund applicable (cancelled after check-in).`;

    updateStateAndBroadcast(nextBookings, {
      text: `Booking cancelled for ${target.customerName}. ${refundMsg}`,
      type: 'warning'
    });
  };

  const processRefund = (bookingId, customAmount = null, reason = 'Staff manual refund') => {
    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        const refundAmt = customAmount !== null ? Number(customAmount) : b.amount;
        return {
          ...b,
          refundStatus: 'refunded',
          refundAmount: refundAmt,
          refundReason: reason,
          paymentStatus: 'refunded'
        };
      }
      return b;
    });

    const target = bookings.find(b => b.id === bookingId);
    updateStateAndBroadcast(nextBookings, {
      text: `Refund of ₹${customAmount || target?.amount} issued to ${target?.customerName}`,
      type: 'warning'
    });
  };

  const submitFeedback = (bookingId, feedbackData) => {
    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          feedback: feedbackData
        };
      }
      return b;
    });

    const target = bookings.find(b => b.id === bookingId);
    updateStateAndBroadcast(nextBookings, {
      text: `🌟 ${feedbackData.rating}-Star Feedback & ₹${feedbackData.tip} tip received from ${target?.customerName}!`,
      type: 'success'
    });
  };

  const markNoShow = (bookingId) => {
    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'no-show',
          refundStatus: 'no-refund',
          refundReason: 'Customer marked as no-show'
        };
      }
      return b;
    });

    const target = bookings.find(b => b.id === bookingId);
    updateStateAndBroadcast(nextBookings, {
      text: `${target?.customerName} marked as No-Show`,
      type: 'warning'
    });
  };

  const bumpQueueUp = (bookingId) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    const nextBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, queueOrder: Math.max(1, (b.queueOrder || 1) - 1.5) };
      }
      return b;
    });

    const sorted = [...nextBookings].sort((a, b) => (a.queueOrder || 0) - (b.queueOrder || 0));
    sorted.forEach((item, index) => {
      item.queueOrder = index + 1;
    });

    updateStateAndBroadcast(sorted, {
      text: `Bumped ${target.customerName} ahead in waiting queue`,
      type: 'info'
    });
  };

  const resetToSeedData = () => {
    updateStateAndBroadcast(SEED_BOOKINGS, {
      text: 'Demo data reset to default state',
      type: 'info'
    });
  };

  const metrics = {
    totalBookingsToday: bookings.length,
    waitingCount: bookings.filter(b => b.status === 'waiting').length,
    inServiceCount: bookings.filter(b => b.status === 'in-service').length,
    completedCount: bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid').length,
    totalRevenue: bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.amount || 0) - (b.refundAmount || 0), 0)
  };

  return {
    bookings,
    toasts,
    metrics,
    currentStaffId,
    setCurrentStaffId,
    getNoShowCount,
    getQueueInfo,
    bookAppointment,
    checkIn,
    startService,
    completeService,
    processPayment,
    cancelBooking,
    processRefund,
    submitFeedback,
    markNoShow,
    bumpQueueUp,
    resetToSeedData,
    addToast
  };
}

// Clean Domain Abstraction Wrappers
export function useCustomerDomain(store) {
  return {
    bookings: store.bookings,
    toasts: store.toasts,
    getQueueInfo: store.getQueueInfo,
    bookAppointment: store.bookAppointment,
    checkIn: store.checkIn,
    cancelBooking: store.cancelBooking,
    submitFeedback: store.submitFeedback,
    addToast: store.addToast
  };
}

export function useStylistDomain(store, stylistId) {
  return {
    myBookings: store.bookings.filter(b => b.stylistId === stylistId),
    toasts: store.toasts,
    getNoShowCount: store.getNoShowCount,
    checkIn: store.checkIn,
    startService: store.startService,
    completeService: store.completeService,
    processPayment: store.processPayment,
    cancelBooking: store.cancelBooking,
    submitFeedback: store.submitFeedback
  };
}

export function useAdminDomain(store) {
  return {
    bookings: store.bookings,
    toasts: store.toasts,
    metrics: store.metrics,
    getNoShowCount: store.getNoShowCount,
    checkIn: store.checkIn,
    startService: store.startService,
    completeService: store.completeService,
    processPayment: store.processPayment,
    cancelBooking: store.cancelBooking,
    processRefund: store.processRefund,
    markNoShow: store.markNoShow,
    bumpQueueUp: store.bumpQueueUp,
    resetToSeedData: store.resetToSeedData
  };
}
