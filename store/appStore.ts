import { create } from 'zustand';

interface User {
  id: string;
  email?: string;
}

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  user: null,
  setUser: (user) => set({ user }),
  
  pageTitle: 'Dashboard',
  setPageTitle: (title) => set({ pageTitle: title }),
}));

export default useAppStore;