import { create } from 'zustand';
import { User } from '../types/index';
import apiService from '../services/apiService';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  register: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserFromToken: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register(data);
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUserFromToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.updateProfile(data);
      if (response.success) {
        set({
          user: response.data,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Update failed',
        isLoading: false,
      });
      throw error;
    }
  },

  initializeAuth: async () => {
    const { loadUserFromToken } = useAuthStore.getState();
    await loadUserFromToken();
  },
}));
