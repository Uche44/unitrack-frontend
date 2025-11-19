import { create } from "zustand";

interface LoadingState {
  loading: string;
  setLoading: (loading: string) => void;
}

export const useLoadingStore = create<LoadingState>()((set) => ({
  loading,
  setUser: (loading) => set({ loading }),
}));
