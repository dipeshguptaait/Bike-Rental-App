import { create } from 'zustand';
import apiService from '../services/apiService';
export const useBookingStore = create((set) => ({
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
                    bookings: state.bookings.map((b) => b.id === id ? response.data : b),
                    isLoading: false,
                }));
            }
        }
        catch (error) {
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
