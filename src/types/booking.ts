export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  date: string;
  startTime: number;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  guestName?: string;
  guestContact?: string;
}
