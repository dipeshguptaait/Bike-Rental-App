import { create } from 'zustand';
import apiService from '../services/apiService';
export const useBikeStore = create((set) => ({
    bikes: [],
    bikeTypes: [],
    selectedBike: null,
    isLoading: false,
    error: null,
    fetchBikes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiService.getBikes();
            if (response.success) {
                set({
                    bikes: response.data,
                    isLoading: false,
                });
            }
        }
        catch (error) {
            set({
                error: error.message || 'Failed to fetch bikes',
                isLoading: false,
            });
        }
    },
    fetchBikeTypes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiService.getBikeTypes();
            if (response.success) {
                set({
                    bikeTypes: response.data,
                    isLoading: false,
                });
            }
        }
        catch (error) {
            set({
                error: error.message || 'Failed to fetch bike types',
                isLoading: false,
            });
        }
    },
    fetchAvailableBikes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiService.getAvailableBikes();
            if (response.success) {
                set({
                    bikes: response.data,
                    isLoading: false,
                });
            }
        }
        catch (error) {
            set({
                error: error.message || 'Failed to fetch available bikes',
                isLoading: false,
            });
        }
    },
    selectBike: (bike) => {
        set({ selectedBike: bike });
    },
    clearSelection: () => {
        set({ selectedBike: null });
    },
}));
