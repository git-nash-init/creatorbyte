import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/lib/types";

interface UiState {
  role: Role;
  sidebarOpen: boolean;
  setRole: (role: Role) => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      role: "admin",
      sidebarOpen: false,
      setRole: (role) => set({ role }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebar: (open) => set({ sidebarOpen: open }),
    }),
    { name: "cb-ui" }
  )
);
