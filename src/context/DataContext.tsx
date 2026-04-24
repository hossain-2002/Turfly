import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Turf, Booking, SupportTicket } from '@/types/index';
import { INITIAL_TURFS, INITIAL_BOOKINGS } from '@/services/mockData';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { applyTheme, AppTheme, getInitialTheme } from '@/features/theme/services/themeService';
import {
  filterBookingsByTurf,
  filterBookingsByUser,
  isBookingAvailable,
  updateBookingStatus,
} from '@/features/bookings/services/bookingRules';

interface DataContextType {
  turfs: Turf[];
  bookings: Booking[];
  tickets: SupportTicket[];
  theme: AppTheme;
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
  const [theme, setTheme] = useState<AppTheme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
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

  // Sync with Firestore on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const fbBookings: Booking[] = [];
        querySnapshot.forEach((docSnapshot) => {
          fbBookings.push(docSnapshot.data() as Booking);
        });
        if (fbBookings.length > 0) {
          setBookings(fbBookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  // Persist bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('all_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const checkAvailability = (turfId: string, date: string, startTime: number) => {
    return isBookingAvailable(bookings, turfId, date, startTime);
  };

  const addBooking = (booking: Booking): boolean => {
    if (!checkAvailability(booking.turfId, booking.date, booking.startTime)) {
      return false;
    }
    setBookings((prev) => [...prev, booking]);
    return true;
  };

  const confirmBooking = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'confirmed' });
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
    setBookings((prev) => updateBookingStatus(prev, bookingId, 'confirmed'));
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
    setBookings((prev) => updateBookingStatus(prev, bookingId, 'cancelled'));
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

  const getBookingsByTurf = (turfId: string) => filterBookingsByTurf(bookings, turfId);
  const getBookingsByUser = (userId: string) => filterBookingsByUser(bookings, userId);

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