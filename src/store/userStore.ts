import type { User } from "@/types/auth";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  clearAuth: () => void;
}

const SESSION_STORAGE_KEYS = {
  user: "auth_user",
  token: "auth_token",
} as const; // as const makes it read only

function setSessionStorageKey(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  if (value !== null) {
    window.sessionStorage.setItem(key, value);
  } else {
    window.sessionStorage.removeItem(key);
  }
}

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  // get the user
  const storedUser = window.sessionStorage.getItem(SESSION_STORAGE_KEYS.user);
  if (storedUser == null) return null;

  try {
    return JSON.parse(storedUser) as User; // parsing could fail
  } catch {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEYS.user);
    return null;
  }
};

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SESSION_STORAGE_KEYS.token);
};

export const useUserStore = create<UserStore>((set) => ({
  user: getStoredUser(), // set the user from session storage
  token: getStoredToken(), // set the token from session storage
  isAuthLoading: false,

  setUser: (user) => {
    // if user is not null, stringify it, otherwise pass null itself
    setSessionStorageKey(
      SESSION_STORAGE_KEYS.user,
      user ? JSON.stringify(user) : null,
    );
    set({ user });
  },

  setToken: (token) => {
    setSessionStorageKey(SESSION_STORAGE_KEYS.token, token);
    set({ token });
  },

  setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

  clearAuth: () => {
    setSessionStorageKey(SESSION_STORAGE_KEYS.user, null);
    setSessionStorageKey(SESSION_STORAGE_KEYS.token, null);
    set({ user: null, token: null });
  },
}));
