import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_TOKEN_KEY } from '@/constants'
import { authService } from '@/services/api/authService'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const { token, user } = await authService.register(data)
          localStorage.setItem(AUTH_TOKEN_KEY, token)
          set({ token, user, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (err) {
          set({ isLoading: false, error: err.message })
          return { success: false, error: err.message }
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const { token, user } = await authService.login(credentials)
          localStorage.setItem(AUTH_TOKEN_KEY, token)
          set({ token, user, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (err) {
          set({ isLoading: false, error: err.message })
          return { success: false, error: err.message }
        }
      },

      logout: async () => {
        try { await authService.logout() } catch (_) {}
        localStorage.removeItem(AUTH_TOKEN_KEY)
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      clearError: () => set({ error: null }),
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'easylearn-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
