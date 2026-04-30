"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";

export function TopBar() {
  const { isAuthenticated, level, xp, logout } = useUser();

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center h-16 shadow-md z-20 relative">
      <Link href="/" className="font-bold text-xl tracking-wider">DeepStack Academy</Link>

      {isAuthenticated ? (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-700 px-4 py-1 rounded-full">
            <span className="text-yellow-400 font-bold">Lvl {level}</span>
            <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${(xp % 100)}%` }}
              />
            </div>
            <span className="text-sm text-gray-300">{xp} XP</span>
          </div>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/signin" className="hover:text-blue-400 transition-colors">Sign In</Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded transition-colors">Sign Up</Link>
        </div>
      )}
    </div>
  );
}
