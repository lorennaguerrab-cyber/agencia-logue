'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  clientById, type ClientAccount,
  SEED_DEMANDAS, type Demanda,
} from './data'

interface ClientStore {
  clientId: string | null
  account: ClientAccount | null
  demandas: Demanda[]
  logIn: (id: string) => void
  logOut: () => void
  addDemanda: (d: Omit<Demanda, 'id' | 'status' | 'criadoEm'>) => void
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      clientId: null,
      account: null,
      demandas: SEED_DEMANDAS,
      logIn: (id) => set({ clientId: id, account: clientById(id) }),
      logOut: () => set({ clientId: null, account: null }),
      addDemanda: (d) =>
        set((s) => ({
          demandas: [
            {
              ...d,
              id: `d${Date.now()}`,
              status: 'pendente',
              criadoEm: new Date().toISOString().slice(0, 10),
            },
            ...s.demandas,
          ],
        })),
    }),
    {
      name: 'logue-client-session',
      partialize: (s) => ({ clientId: s.clientId, demandas: s.demandas }),
      onRehydrateStorage: () => (state) => {
        if (state?.clientId) state.account = clientById(state.clientId)
      },
    }
  )
)
