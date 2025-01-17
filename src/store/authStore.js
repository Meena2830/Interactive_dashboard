import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../components/services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await api.login(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      logout: () => set({ user: null, isAuthenticated: false, error: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
