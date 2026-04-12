import { Booking } from '@/types';

export const isBookingAvailable = (
  bookings: Booking[],
  turfId: string,
  date: string,
  startTime: number
): boolean => {
  const conflict = bookings.find(
    (booking) =>
      booking.turfId === turfId &&
      booking.date === date &&
      booking.startTime === startTime &&
      (booking.status === 'confirmed' || booking.status === 'pending')
  );

  return !conflict;
};

export const updateBookingStatus = (
  bookings: Booking[],
  bookingId: string,
  status: Booking['status']
): Booking[] => {
  return bookings.map((booking) =>
    booking.id === bookingId ? { ...booking, status } : booking
  );
};

export const filterBookingsByTurf = (bookings: Booking[], turfId: string): Booking[] => {
  return bookings.filter((booking) => booking.turfId === turfId);
};

export const filterBookingsByUser = (bookings: Booking[], userId: string): Booking[] => {
  return bookings.filter((booking) => booking.userId === userId);
};
