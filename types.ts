export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // For mock auth
}

export interface Turf {
  id: string;
  name: string;
  location: string;
  sport: string;
  pricePerHour: number;
  description: string;
  images: string[];
  managerId: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  date: string; // YYYY-MM-DD
  startTime: number; // 24h format, e.g., 14 for 2 PM
  duration: number; // in hours
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  guestName?: string;
  guestContact?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface SearchFilters {
  location: string;
  sport: string;
  date: string;
}