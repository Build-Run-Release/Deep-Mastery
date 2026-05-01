"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, UserCircle2, Zap, LogOut } from "lucide-react";
import { ProfileModal } from "./ProfileModal";

export function TopBar() {
  const { isAuthenticated, level, xp, logout } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 text-gray-900 dark:text-white px-6 py-4 flex justify-between items-center h-[72px] shadow-sm z-50 sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-600/30">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            DeepStack
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="group flex items-center gap-3 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700/80 px-2 py-1.5 pr-4 rounded-full transition-all duration-300 border border-gray-200 dark:border-gray-700/50 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center shadow-inner">
                <span className="text-white font-bold text-sm leading-none drop-shadow-md">{level}</span>
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 leading-none mb-1">Rank Level</span>
                <div className="w-24 h-1.5 bg-gray-300 dark:bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
                    style={{ width: `${(xp % 100)}%` }}
                  />
                </div>
              </div>
            </button>
            <button
              onClick={async () => await logout()}
              className="text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/40 hover:-translate-y-0.5">
              Start Learning Free
            </Link>
          </div>
        )}
      </nav>

      <AnimatePresence>
        {isProfileOpen && (
          <ProfileModal onClose={() => setIsProfileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
