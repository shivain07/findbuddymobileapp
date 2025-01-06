import { IUserState } from '@/interfaces/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Custom storage adapter for expo-secure-store
const secureStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") {
      const value = localStorage.getItem(key);
      return value || null;
    } else {
      const value = await SecureStore.getItemAsync(key);
      return value || null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value)
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    }
    await SecureStore.deleteItemAsync(key);
  },
};

interface UserStore {
  user: IUserState | null;
  setUser: (user: IUserState) => void;
  clearUser: () => void;
  isLoggedin: boolean;
  accessToken: string;
  setAccessToken: (val: string) => void
  refreshToken: string;
  setRefreshToken: (val: string) => void
  setIsLoggedin: (val: boolean) => void;
  //In this case, Partial<IUserState> means the parameter can be an object containing any subset of the IUserState properties. For example:
  updateUser: (updates: Partial<IUserState>) => void; //Using Partial ensures that you don't need to pass the entire IUserState object, making it more convenient and flexible to use.
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null, // Initial state
      setUser: (user) => set({ user }),
      isLoggedin: false, // Track login status
      setIsLoggedin: (val) => set({ isLoggedin: val }),
      accessToken: "", // Track login status
      setAccessToken: (val) => set({ accessToken: val }),
      refreshToken: "", // Track login status
      setRefreshToken: (val) => set({ refreshToken: val }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearUser: () =>
        set(() => ({
          user: null,
          isLoggedin: false,
          accessToken:"",
          refreshToken:"",
        })),
    }),
    {
      name: 'user-storage', // Key for secure storage
      storage: {
        getItem: async (name) => {
          const value = await secureStorage.getItem(name);
          return value ? JSON.parse(value) : null; // Deserialize JSON
        },
        setItem: async (name, value) => {
          await secureStorage.setItem(name, JSON.stringify(value)); // Serialize JSON
        },
        removeItem: async (name) => {
          await secureStorage.removeItem(name);
        },
      },
    }
  )
);

export const userVerificationPopupStore = create<{
  showUserVerificationModal: boolean;
  setShowUserVerificationModal: (value: boolean) => void;
}>((set) => ({
  showUserVerificationModal: false,
  setShowUserVerificationModal: (value) => set({ showUserVerificationModal: value })
}));

export const userLoginPopupStore = create<{
  showLoginPopup: boolean;
  setShowLoginPopup: (value: boolean) => void;
}>((set) => ({
  showLoginPopup: false,
  setShowLoginPopup: (value) => set({ showLoginPopup: value })
}));

