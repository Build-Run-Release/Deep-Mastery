"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  isAuthenticated: boolean;
  level: number;
  xp: number;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsAuthenticated(data.isAuthenticated);
            if (data.isAuthenticated) {
              setXp(data.xp);
              setLevel(data.level);
            }
          }
        } else {
            if (isMounted) {
                setIsAuthenticated(false);
            }
        }
      } catch (error) {
        console.error("Auth check failed", error);
      }
    };
    checkAuth();
    return () => {
        isMounted = false;
    }
  }, []);

  const login = async () => {
    try {
      const res = await fetch("/api/auth/login", { method: "POST" });
      if (res.ok) {
        setIsAuthenticated(true);
        // We can refetch /me or just set default
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
            const data = await meRes.json();
            setXp(data.xp);
            setLevel(data.level);
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setXp(0);
      setLevel(1);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const addXp = async (amount: number) => {
    try {
      const res = await fetch("/api/auth/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setXp(data.xp);
        setLevel(data.level);
      }
    } catch (error) {
      console.error("Failed to add XP", error);
    }
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, level, xp, login, logout, addXp }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
