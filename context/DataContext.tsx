import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Turf, Booking, SupportTicket } from '../types';
import { INITIAL_TURFS, INITIAL_BOOKINGS } from '../services/mockData';

interface DataContextType {
  turfs: Turf[];
  bookings: Booking[];
  tickets: SupportTicket[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  addBooking: (booking: Booking) => boolean; 
  confirmBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  clearAllBookings: () => void;
  addTicket: (ticket: SupportTicket) => void;
  getTurfById: (id: string) => Turf | undefined;
  getBookingsByTurf: (turfId: string) => Booking[];
  getBookingsByUser: (userId: string) => Booking[];
  checkAvailability: (turfId: string, date: string, startTime: number) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [turfs] = useState<Turf[]>(INITIAL_TURFS);
  
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    // Default to 'light' if not found, unless system pref logic is desired later
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      // Enforce Midnight Pro Deep Slate background on Body to override any specific layout defaults
      document.body.style.backgroundColor = '#0F172A';
      document.body.style.color = '#cbd5e1'; // slate-300
    } else {
      html.classList.remove('dark');
      // Enforce Clean White background for Light Mode
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0f172a'; // slate-900
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Initialize bookings from localStorage or fallback to INITIAL_BOOKINGS
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem('all_bookings');
    return stored ? JSON.parse(stored) : INITIAL_BOOKINGS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Persist bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('all_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const checkAvailability = (turfId: string, date: string, startTime: number) => {
    const conflict = bookings.find(
      (b) =>
        b.turfId === turfId &&
        b.date === date &&
        b.startTime === startTime &&
        (b.status === 'confirmed' || b.status === 'pending')
    );
    return !conflict;
  };

  const addBooking = (booking: Booking): boolean => {
    if (!checkAvailability(booking.turfId, booking.date, booking.startTime)) {
      return false;
    }
    setBookings((prev) => [...prev, booking]);
    return true;
  };

  const confirmBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  const clearAllBookings = () => {
    // 1. Update State to refresh UI immediately
    setBookings([]);
    // 2. Clear from LocalStorage
    localStorage.removeItem('all_bookings');
  };

  const addTicket = (ticket: SupportTicket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  const getTurfById = (id: string) => turfs.find((t) => t.id === id);

  const getBookingsByTurf = (turfId: string) => bookings.filter((b) => b.turfId === turfId);
  const getBookingsByUser = (userId: string) => bookings.filter((b) => b.userId === userId);

  return (
    <DataContext.Provider
      value={{
        turfs,
        bookings,
        tickets,
        theme,
        toggleTheme,
        addBooking,
        confirmBooking,
        cancelBooking,
        clearAllBookings,
        addTicket,
        getTurfById,
        getBookingsByTurf,
        getBookingsByUser,
        checkAvailability,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};