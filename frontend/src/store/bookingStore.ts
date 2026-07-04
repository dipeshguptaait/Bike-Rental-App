import { create } from 'zustand';
import { Booking } from '../types/index';
import apiService from '../services/apiService';

interface BookingStore {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createBooking: (data: any) => Promise<Booking>;
  fetchMyBookings: (status?: string) => Promise<void>;
  fetchUserBookings: (status?: string) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  selectBooking: (booking: Booking) => void;
  addBooking: (booking: Booking) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  createBooking: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createBooking(data);
      if (response.success) {
        set({ isLoading: false });
        return response.data;
      }
      throw new Error(response.message);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create booking',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchMyBookings: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getMyBookings(status);
      if (response.success) {
        set({
          bookings: response.data,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },

  fetchUserBookings: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getMyBookings(status);
      if (response.success) {
        set({
          bookings: response.data,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },

  cancelBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.cancelBooking(id);
      if (response.success) {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? response.data : b
          ),
          isLoading: false,
        }));
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to cancel booking',
        isLoading: false,
      });
      throw error;
    }
  },

  selectBooking: (booking) => {
    set({ selectedBooking: booking });
  },

  addBooking: (booking) => {
    set((state) => ({
      bookings: [booking, ...state.bookings],
    }));
  },
}));
