"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  isPremium: boolean;
}

interface UserContextType {
  isAuthenticated: boolean;
  user: User | null;
  level: number;
  xp: number;
  isPremiumUnlocked: boolean;
  login: (userData: User) => void;
  logout: () => void;
  addXp: (amount: number) => Promise<void>;
  checkAuth: () => Promise<void>;
  unlockPremium: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        setXp(data.user.xp);
        setLevel(data.user.level);
        setIsPremiumUnlocked(data.user.isPremium);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setXp(0);
        setLevel(1);
        setIsPremiumUnlocked(false);
      }
    } catch (e) {
      console.error("Auth check failed", e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    setXp(userData.xp);
    setLevel(userData.level);
    setIsPremiumUnlocked(userData.isPremium);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUser(null);
      setXp(0);
      setLevel(1);
      setIsPremiumUnlocked(false);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const addXp = async (amount: number) => {
    if (!isAuthenticated) return;

    setXp((prev) => {
      const newXp = prev + amount;
      setLevel(Math.floor(newXp / 100) + 1);
      return newXp;
    });

    try {
      await fetch('/api/progress/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
    } catch (e) {
      console.error("Failed to update XP on server", e);
    }
  };

  const unlockPremium = () => {
    setIsPremiumUnlocked(true);
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, user, level, xp, isPremiumUnlocked, login, logout, addXp, checkAuth, unlockPremium }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
