import { AuthState } from "@/types/AuthState"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ExtendedAuthState extends AuthState {
  hydrated: boolean
  setHydrated: (state: boolean) => void
}

export const useAuthStore = create<ExtendedAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false
        }),

      setHydrated: (state) =>
        set({
          hydrated: state
        }),
    }),

    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      }
    }
  )
)