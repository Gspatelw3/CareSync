"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "doctor" | "nurse" | "receptionist";
  department?: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;

  // Actions
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
};

// TODO: Replace with real authentication API
// TODO: Connect to /api/auth/login endpoint
// TODO: Implement JWT token management
// TODO: Add OAuth integration (Google, Microsoft)
// TODO: Implement password reset flow with email

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: false,

      login: async (email, password, rememberMe) => {
        set({ isLoading: true });

        // TODO: Replace with actual API call
        // Mock authentication - accept any email/password for demo
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        // Mock user data
        const mockUser: User = {
          id: "USR-001",
          email: email,
          name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          role: "admin",
          department: "Administration",
        };

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          rememberMe,
        });

        return true;
      },

      logout: () => {
        // TODO: Call /api/auth/logout endpoint
        set({
          user: null,
          isAuthenticated: false,
          rememberMe: false,
        });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "care-sync-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock user for demo
export function initializeMockAuth() {
  const store = useAuthStore.getState();
  // Auto-login for demo purposes
  // In production, this would check for existing session
  if (!store.user) {
    store.login("admin@caresync.com", "admin123", true);
  }
}