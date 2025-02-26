import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  login: (user: User, isAdmin: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  login: (user, isAdmin) => set({ user, isAdmin }),
  logout: () => set({ user: null, isAdmin: false }),
}));