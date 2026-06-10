'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { users, type OsUser, type UserId } from './db'

interface OsStore {
  userId: UserId | null
  user: OsUser | null
  logIn: (userId: UserId) => void
  logOut: () => void
}

export const useOsStore = create<OsStore>()(
  persist(
    (set) => ({
      userId: null,
      user: null,
      logIn: (userId) => set({ userId, user: users[userId] }),
      logOut: () => set({ userId: null, user: null }),
    }),
    {
      name: 'logue-os-session',
      partialize: (state) => ({ userId: state.userId }),
      onRehydrateStorage: () => (state) => {
        if (state?.userId) {
          state.user = users[state.userId] ?? null
        }
      },
    }
  )
)
