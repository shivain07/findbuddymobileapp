import { create } from "zustand";

// Define the store state type
interface LoaderState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Create the store with proper types
export const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false, // Initial state is false (not loading)
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
