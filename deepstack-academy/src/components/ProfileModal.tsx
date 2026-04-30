"use client";

import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { X, Trophy, Target, Zap, Shield, Star } from "lucide-react";

interface ProfileModalProps {
  onClose: () => void;
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { level, xp } = useUser();

  const rankNames = [
    "Novice Scripter", "Junior Dev", "Frontend Engineer", "Full-Stack Builder", "Senior Architect"
  ];
  const rankIndex = Math.min(Math.floor((level - 1) / 3), rankNames.length - 1);
  const currentRank = rankNames[rankIndex];

  const xpInCurrentLevel = xp % 100;
  const xpNeeded = 100 - xpInCurrentLevel;
  const progressPercentage = xpInCurrentLevel;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 h-32 relative">
           <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 p-2 rounded-full">
             <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-24 h-24 rounded-full flex items-center justify-center shadow-inner border-4 border-white dark:border-gray-900">
                <span className="text-white font-black text-4xl drop-shadow-md">{level}</span>
             </div>
           </div>
        </div>

        <div className="pt-16 pb-8 px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Developer Status</h3>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-6 flex items-center justify-center gap-2">
             <Shield className="w-4 h-4" /> {currentRank}
          </p>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 mb-6">
            <div className="flex justify-between text-sm mb-2 font-medium">
               <span className="text-gray-600 dark:text-gray-400">Total Experience</span>
               <span className="text-gray-900 dark:text-white font-bold">{xp} XP</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {xpNeeded} XP to Level {level + 1}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
               <Trophy className="w-6 h-6 text-amber-500 mb-2" />
               <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Modules Done</span>
               <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.floor(xp / 50)}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
               <Zap className="w-6 h-6 text-blue-500 mb-2" />
               <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Streak</span>
               <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">3 <Star className="w-4 h-4 fill-amber-400 text-amber-400"/></span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
