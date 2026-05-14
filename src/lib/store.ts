'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { EnergyMode, Task, Idea, Client, Capture } from './types'

interface LorennStore {
  // Energy mode
  energyMode: EnergyMode
  setEnergyMode: (mode: EnergyMode) => void

  // Quick capture panel
  captureOpen: boolean
  setCaptureOpen: (open: boolean) => void

  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  addTask: (task: Task) => void

  // Ideas
  ideas: Idea[]
  setIdeas: (ideas: Idea[]) => void
  addIdea: (idea: Idea) => void

  // Clients
  clients: Client[]
  setClients: (clients: Client[]) => void

  // Captures
  captures: Capture[]
  addCapture: (capture: Capture) => void

  // Day focus
  dayFocus: string
  setDayFocus: (focus: string) => void

  // Sidebar
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useLorennStore = create<LorennStore>()(
  persist(
    (set) => ({
      energyMode: 'criativa',
      setEnergyMode: (mode) => set({ energyMode: mode }),

      captureOpen: false,
      setCaptureOpen: (open) => set({ captureOpen: open }),

      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),

      ideas: [],
      setIdeas: (ideas) => set({ ideas }),
      addIdea: (idea) => set((state) => ({ ideas: [idea, ...state.ideas] })),

      clients: [],
      setClients: (clients) => set({ clients }),

      captures: [],
      addCapture: (capture) =>
        set((state) => ({ captures: [capture, ...state.captures] })),

      dayFocus: '',
      setDayFocus: (focus) => set({ dayFocus: focus }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'lorenna-os',
      partialize: (state) => ({
        energyMode: state.energyMode,
        dayFocus: state.dayFocus,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
