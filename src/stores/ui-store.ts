import { create } from 'zustand';

type UIState = {
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (toast: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }) => void;
  removeToast: (id: string) => void;
};

export type ToastMessage = UIState['toasts'][number];

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSidebarOpen: false,
  toasts: [],
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
