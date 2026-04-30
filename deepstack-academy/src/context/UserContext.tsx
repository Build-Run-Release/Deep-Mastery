"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  isAuthenticated: boolean;
  level: number;
  xp: number;
  login: () => void;
  logout: () => void;
  addXp: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("auth");
      if (auth) {
        setIsAuthenticated(true);
        const savedXp = parseInt(localStorage.getItem("xp") || "0", 10);
        setXp(savedXp);
        setLevel(Math.floor(savedXp / 100) + 1);
      }
    };
    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("auth", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  const addXp = (amount: number) => {
    setXp((prev) => {
      const newXp = prev + amount;
      localStorage.setItem("xp", newXp.toString());
      setLevel(Math.floor(newXp / 100) + 1);
      return newXp;
    });
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
