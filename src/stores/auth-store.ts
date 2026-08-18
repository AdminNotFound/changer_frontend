import { create } from 'zustand';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  accessToken: string | null;
  status: AuthStatus;
  setSession: (accessToken: string) => void;
  clearSession: () => void;
  setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  status: 'idle',
  setSession: (accessToken) =>
    set({ accessToken, status: 'authenticated' }),
  clearSession: () =>
    set({ accessToken: null, status: 'unauthenticated' }),
  setStatus: (status) => set({ status }),
}));
