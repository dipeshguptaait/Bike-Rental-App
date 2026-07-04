import { create } from 'zustand';
import { Bike, BikeType, Booking } from '../types/index';
import apiService from '../services/apiService';

interface BikeStore {
  bikes: Bike[];
  bikeTypes: BikeType[];
  selectedBike: Bike | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBikes: () => Promise<void>;
  fetchBikeTypes: () => Promise<void>;
  fetchAvailableBikes: () => Promise<void>;
  selectBike: (bike: Bike) => void;
  clearSelection: () => void;
}

export const useBikeStore = create<BikeStore>((set) => ({
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
