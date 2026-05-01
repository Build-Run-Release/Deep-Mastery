"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function CompleteButton() {
  const { addXp, isAuthenticated } = useUser();
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    if (!isAuthenticated) {
      alert("Please sign in to earn XP.");
      return;
    }
    if (!completed) {
      addXp(50);
      setCompleted(true);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleComplete}
      disabled={completed}
      className={`mt-8 font-bold py-3 px-6 rounded-xl transition-colors shadow-lg flex items-center gap-2 ${
        completed
          ? "bg-emerald-100 text-emerald-700 shadow-emerald-500/20 cursor-default"
          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
      }`}
    >
      <CheckCircle2 className={`w-5 h-5 ${completed ? "text-emerald-600" : "text-white"}`} />
      {completed ? "Lesson Completed" : "Complete Lesson (+50 XP)"}
    </motion.button>
  );
}
