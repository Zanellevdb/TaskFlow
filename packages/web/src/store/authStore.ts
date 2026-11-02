import { create } from 'zustand';
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  getCurrentUser,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from '../api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (data) => {
    set({ isLoading: true });

    try {
      const response = await loginRequest(data);

      localStorage.setItem(
        'accessToken',
        response.accessToken
      );

      localStorage.setItem(
        'refreshToken',
        response.refreshToken
      );

      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });

    try {
      const response = await registerRequest(data);

      localStorage.setItem(
        'accessToken',
        response.accessToken
      );

      localStorage.setItem(
        'refreshToken',
        response.refreshToken
      );

      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });

    try {
      const user = await getCurrentUser();

      set({
        user,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));